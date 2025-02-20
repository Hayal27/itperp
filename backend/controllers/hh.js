// const updatePlanStatus = async (req, res) => {
//   try {
//     const token = req.headers["authorization"]?.split(" ")[1];
//     if (!token) {
//       return res.status(403).json({
//         success: false,
//         message: "Authorization token is required to update the plan status.",
//         error_code: "TOKEN_MISSING"
//       });
//     }

//     // Verify token and get user_id
//     const user_id = await verifyToken(token);

//     // Get employee_id from the users table using user_id
//     const getEmployeeQuery = `
//       SELECT employee_id FROM users WHERE user_id = ?
//     `;
//     con.query(getEmployeeQuery, [user_id], async (err, results) => {
//       if (err) {
//         return res.status(500).json({
//           success: false,
//           message: "Error fetching employee_id from users table.",
//           error_code: "DB_ERROR",
//           error: err.message
//         });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "Employee not found. No supervisor data available.",
//           error_code: "EMPLOYEE_NOT_FOUND"
//         });
//       }

//       const supervisor_id = results[0].employee_id;
//       const { plan_id, status, comment } = req.body;

//       // Validate the input fields for approval
//       try {
//         validateApprovalInput(status, comment);
//       } catch (validationError) {
//         return res.status(400).json({
//           success: false,
//           message: validationError.message,
//           error_code: "VALIDATION_ERROR"
//         });
//       }

//       // Query to check if the plan exists and is pending approval for the supervisor
//       const planCheckQuery = `
//         SELECT p.plan_id, aw.status
//         FROM plans p
//         JOIN ApprovalWorkflow aw ON p.plan_id = aw.plan_id
//         WHERE p.plan_id = ? AND p.employee_id = ? AND aw.approver_id = ? AND aw.status = 'Pending'
//       `;

//       con.query(planCheckQuery, [plan_id, supervisor_id, supervisor_id], async (err, results) => {
//         if (err) {
//           return res.status(500).json({
//             success: false,
//             message: "Error checking plan existence.",
//             error_code: "DB_ERROR",
//             error: err.message
//           });
//         }

//         if (results.length === 0) {
//           return res.status(404).json({
//             success: false,
//             message: "Plan not found or not pending approval.",
//             error_code: "PLAN_NOT_FOUND"
//           });
//         }

//         // Update the approval status in the ApprovalWorkflow table
//         const updateApprovalQuery = `
//           UPDATE ApprovalWorkflow
//           SET status = ?, comment = ?, approval_date = NOW()
//           WHERE plan_id = ? AND approver_id = ?
//         `;

//         con.query(updateApprovalQuery, [status, comment, plan_id, supervisor_id], (err, result) => {
//           if (err) {
//             return res.status(500).json({
//               success: false,
//               message: "Error updating approval status.",
//               error_code: "DB_ERROR",
//               error: err.message
//             });
//           }

//           if (status === 'Approved') {
//             // Query to get next supervisor details
//             const getSupervisorQuery = `
//               SELECT supervisor_id
//               FROM employees
//               WHERE employee_id = ?
//             `;

//             con.query(getSupervisorQuery, [supervisor_id], (err, supervisorResults) => {
//               if (err) {
//                 return res.status(500).json({
//                   success: false,
//                   message: "Error fetching next supervisor details.",
//                   error_code: "DB_ERROR",
//                   error: err.message
//                 });
//               }

//               if (supervisorResults.length > 0) {
//                 const nextSupervisorId = supervisorResults[0].supervisor_id;

//                 // Insert new row in ApprovalWorkflow for the next supervisor
//                 const insertWorkflowQuery = `
//                   INSERT INTO ApprovalWorkflow (plan_id, approver_id, status)
//                   VALUES (?, ?, 'Pending');
//                 `;
//                 con.query(insertWorkflowQuery, [plan_id, nextSupervisorId], (err, insertResult) => {
//                   if (err) {
//                     return res.status(500).json({
//                       success: false,
//                       message: "Error assigning plan to next supervisor.",
//                       error_code: "DB_ERROR",
//                       error: err.message
//                     });
//                   }

//                   return res.status(200).json({
//                     success: true,
//                     message: "Plan approved and assigned to the next supervisor.",
//                     error_code: null
//                   });
//                 });
//               } else {
//                 // No further supervisors, finalize the plan
//                 const finalizePlanQuery = `
//                   UPDATE plans
//                   SET status = 'Approved'
//                   WHERE plan_id = ?
//                 `;
//                 con.query(finalizePlanQuery, [plan_id], (err, result) => {
//                   if (err) {
//                     return res.status(500).json({
//                       success: false,
//                       message: "Error finalizing plan approval.",
//                       error_code: "DB_ERROR",
//                       error: err.message
//                     });
//                   }

//                   return res.status(200).json({
//                     success: true,
//                     message: "Plan fully approved. No further supervisors required.",
//                     error_code: null
//                   });
//                 });
//               }
//             });
//           } else {
//             return res.status(200).json({
//               success: true,
//               message: `Plan ${status.toLowerCase()} successfully.`,
//               error_code: null
//             });
//           }
//         });
//       });
//     });
//   } catch (error) {
//     console.error("Error in updatePlanStatus:", error.message);
//     res.status(500).json({
//       success: false,
//       message: `Unknown error occurred while updating plan status. Error: ${error.message}`,
//       error_code: "UNKNOWN_ERROR"
//     });
//   }
// };



const getApprovedOrgPlans = async (req, res) => {
  try {
    // Removed user_id filter to get plans for all users
    const { year, quarter, department, objective, goal, row_no, progress } = req.query;

    let filterConditions = [];
    let filterValues = [];

    // Apply filter conditions dynamically based on the query parameters
    if (year) {
      filterConditions.push("p.year = ?");
      filterValues.push(year);
    }

    if (quarter) {
      filterConditions.push("p.quarter = ?");
      filterValues.push(quarter);
    }

    if (department) {
      filterConditions.push("d.name = ?");
      filterValues.push(department);
    }

    if (objective) {
      filterConditions.push("p.objective LIKE ?");
      filterValues.push(`%${objective}%`);
    }

    if (goal) {
      filterConditions.push("p.goal LIKE ?");
      filterValues.push(`%${goal}%`);
    }

    if (row_no) {
      filterConditions.push("p.row_no = ?");
      filterValues.push(row_no);
    }

    if (progress) {
      filterConditions.push("p.progress LIKE ?");
      filterValues.push(`%${progress}%`);
    }

    // Always add condition for approved plans
    filterConditions.push("p.status = 'approved'");

    // Construct the WHERE clause based on the filter conditions
    const whereClause = filterConditions.length
      ? `WHERE ${filterConditions.join(" AND ")}`
      : "WHERE p.status = 'approved'";

    const getPlansQuery = `
      SELECT 
        p.plan_id AS ID,          
        p.objective AS Objective, 
        p.goal AS Goal, 
        p.row_no AS 'Row No', 
        p.details AS Details, 
        p.measurement AS Measurement, 
        p.baseline AS Baseline, 
        p.plan AS Plan, 
        p.outcome AS Outcome,
        p.execution_percentage AS Execution,  
        p.description AS Description, 
        p.status AS Status, 
        p.comment AS Comment,
        p.created_at AS Created, 
        p.updated_at AS Updated,
        p.year AS Year, 
        p.quarter AS Quarter,
        p.created_by AS 'Created by',
        p.progress AS Progress, 
        d.name AS Department
      FROM plans p
      LEFT JOIN departments d ON p.department_id = d.department_id 
      ${whereClause}
    `;

    con.query(getPlansQuery, filterValues, (err, results) => {
      if (err) {
        console.error("Error fetching plans:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error fetching plans from the database.",
          error_code: "DB_ERROR",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No approved plans found.",
          error_code: "NO_PLANS_FOUND",
        });
      }

      res.status(200).json({
        success: true,
        plans: results,
      });
    });
  } catch (error) {
    console.error("Error in getAllPlans:", error.message);
    res.status(500).json({
      success: false,
      message: `Unknown error occurred. ${error.message}`,
      error_code: "UNKNOWN_ERROR",
    });
  }
};
