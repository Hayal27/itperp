const jwt = require("jsonwebtoken");
const con = require("../models/db");
const approvalWorkflowModel = require("../models/approvalWorkflowModel");

// Helper function to verify JWT token and extract user_id
const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'hayaltamrat@27', (err, decoded) => {
      if (err) {
        return reject(new Error('Invalid or expired token'));
      }
      resolve(decoded.user_id); // Returns the user_id from the decoded token
    });
  });
};

// Function to validate input for updating the approval status
const validateApprovalInput = (status, comment) => {
  const validStatuses = ['Approved', 'Declined'];
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status. Only "Approved" or "Declined" are allowed.');
  }

  if (!comment || comment.trim().length === 0) {
    throw new Error('Comment is required and cannot be empty.');
  }
};






const getSubmittedPlans = async (req, res) => {
  // Extract token from Authorization header
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    console.error("Error: No token provided in the request headers.");
    return res.status(403).json({
      success: false,
      message: "No token provided. Authorization token is required to access the plans.",
      error_code: "TOKEN_MISSING",
    });
  }

  try {
    const user_id = await verifyToken(token); // Get user_id from token
    console.log(`Decoded user_id from token: ${user_id}`);

    // Query to fetch employee_id for the given user_id from the users table
    const getEmployeeQuery = "SELECT employee_id FROM users WHERE user_id = ?";
    con.query(getEmployeeQuery, [user_id], async (err, results) => {
      if (err) {
        console.error("Database Error (fetching employee_id):", err.message);
        return res.status(500).json({
          success: false,
          message: "Error fetching employee_id from users table.",
          error_code: "DB_ERROR",
          error: err.message,
        });
      }

      if (results.length === 0) {
        console.error(`No employee found for user_id: ${user_id}`);
        return res.status(404).json({
          success: false,
          message: "Employee not found. Unable to fetch employee details based on the provided user_id.",
          error_code: "EMPLOYEE_NOT_FOUND",
        });
      }

      const supervisor_id = results[0].employee_id;
      console.log(`Supervisor ID fetched: ${supervisor_id}`);

      // SQL query to fetch detailed plans, including the filter for reporting set to 'deactivate'.
      // This filter ensures that if a plan's reporting is 'active', it will not be fetched.
      const query = `
        SELECT 
          p.plan_id,
          p.user_id,
          sod.specific_objective_detail_id,
          sod.specific_objective_detailname,
          sod.details,
          sod.baseline,
          sod.plan,
          sod.measurement,
          sod.execution_percentage,
          sod.created_at,
          sod.updated_at,
          sod.year,
          sod.month,
          sod.day,
          sod.deadline,
          sod.status,
          sod.priority,
          p.department_id,
          d.name AS department_name,
          sod.count,
          sod.outcome,
          sod.progress,
          sod.created_by,
          sod.specific_objective_id,
          sod.plan_type,
          sod.income_exchange,
          sod.cost_type,
          sod.employment_type,
          sod.incomeName,
          sod.costName,
          sod.CIbaseline,
          sod.CIplan,
          sod.CIoutcome,
          sod.editing_status,
          sod.reporting,
          p.goal_id,
          o.name AS objective_name,
          g.name AS goal_name,
          so.specific_objective_name
        FROM plans p
        JOIN ApprovalWorkflow aw ON p.plan_id = aw.plan_id
        JOIN departments d ON p.department_id = d.department_id
        JOIN objectives o ON p.objective_id = o.objective_id
        JOIN specific_objectives so ON p.specific_objective_id = so.specific_objective_id
        JOIN goals g ON p.goal_id = g.goal_id
        JOIN specific_objective_details sod ON p.specific_objective_detail_id = sod.specific_objective_detail_id
        WHERE p.supervisor_id = ? 
          AND aw.approver_id = ? 
          AND aw.status = 'Pending'
          AND p.reporting = 'deactivate';  -- Only fetch rows where reporting is 'deactivate'
      `;

      con.query(query, [supervisor_id, supervisor_id], (err, results) => {
        if (err) {
          console.error("Database Error (fetching plans):", err.message);
          return res.status(500).json({
            success: false,
            message: "Error fetching plans from database.",
            error_code: "DB_ERROR",
            error: err.message,
          });
        }

        if (!results || results.length === 0) {
          console.warn(`No plans found awaiting approval for supervisor_id: ${supervisor_id}`);
          return res.status(404).json({
            success: false,
            message: "No plans found awaiting approval for this supervisor.",
            error_code: "NO_PLANS_FOUND",
          });
        }

        // Filter out any columns with null values from each row
        const filteredResults = results.map(row =>
          Object.fromEntries(Object.entries(row).filter(([key, value]) => value !== null))
        );

        console.log(`Plans fetched successfully: ${JSON.stringify(filteredResults, null, 2)}`);
        res.json({ success: true, plans: filteredResults });
      });
    });
  } catch (error) {
    console.error("Unknown Error:", error.message);
    res.status(500).json({
      success: false,
      message: `Unknown error occurred while fetching submitted plans. Error: ${error.message}`,
      error_code: "UNKNOWN_ERROR",
    });
  }
};




const getSubmittedreports = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "No token provided. Authorization token is required to access the plans.",
      error_code: "TOKEN_MISSING",
    });
  }

  try {
    const user_id = await verifyToken(token);

    const getEmployeeQuery = "SELECT employee_id FROM users WHERE user_id = ?";
    con.query(getEmployeeQuery, [user_id], (err, results) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error fetching employee_id from users table.",
          error_code: "DB_ERROR",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Employee not found. Unable to fetch employee details based on the provided user_id.",
          error_code: "EMPLOYEE_NOT_FOUND",
        });
      }

      const supervisor_id = results[0].employee_id;

      const query = `
        SELECT 
          p.plan_id,
          p.user_id,
          sod.specific_objective_detail_id,
          sod.specific_objective_detailname,
          sod.details,
          sod.baseline,
          sod.plan,
          sod.measurement,
          sod.execution_percentage,
          sod.created_at,
          sod.updated_at,
          sod.year,
          sod.month,
          sod.day,
          sod.deadline,
          sod.status,
          sod.priority,
          p.department_id,
          d.name AS department_name,
          sod.count,
          sod.outcome,
          sod.progress,
          sod.created_by,
          sod.specific_objective_id,
          sod.plan_type,
          sod.income_exchange,
          sod.cost_type,
          sod.employment_type,
          sod.incomeName,
          sod.costName,
          sod.CIbaseline,
          sod.CIplan,
          sod.CIoutcome,
          sod.editing_status,
          sod.reporting,
          p.goal_id,
          o.name AS objective_name,
          g.name AS goal_name,
          so.specific_objective_name,
          rf.file_name,
          rf.file_path
        FROM plans p
        JOIN ApprovalWorkflow aw ON p.plan_id = aw.plan_id
        JOIN departments d ON p.department_id = d.department_id
        JOIN objectives o ON p.objective_id = o.objective_id
        JOIN specific_objectives so ON p.specific_objective_id = so.specific_objective_id
        JOIN goals g ON p.goal_id = g.goal_id
        JOIN specific_objective_details sod ON p.specific_objective_detail_id = sod.specific_objective_detail_id
        LEFT JOIN reportfile rf ON sod.specific_objective_detail_id = rf.specific_objective_id
        WHERE p.supervisor_id = ? 
          AND aw.approver_id = ? 
          AND aw.status = 'Pending'
          AND aw.report_status = 'pending'
      `;

      con.query(query, [supervisor_id, supervisor_id], (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error fetching plans from database.",
            error_code: "DB_ERROR",
            error: err.message,
          });
        }

        if (!results || results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "No plans found awaiting approval for this supervisor.",
            error_code: "NO_PLANS_FOUND",
          });
        }

        const groupedPlans = {};
        results.forEach(row => {
          const planId = row.plan_id;
          const fullFilePath = row.file_path ? `${req.protocol}://${req.get("host")}${row.file_path}` : null;

          if (!groupedPlans[planId]) {
            const { file_name, file_path, ...planData } = row;
            groupedPlans[planId] = {
              ...planData,
              files: []
            };
            if (file_name && fullFilePath) {
              groupedPlans[planId].files.push({
                file_name,
                file_path: fullFilePath
              });
            }
          } else {
            if (row.file_name && fullFilePath) {
              groupedPlans[planId].files.push({
                file_name: row.file_name,
                file_path: fullFilePath
              });
            }
          }
        });

        const finalResults = Object.values(groupedPlans);
        res.json({ success: true, plans: finalResults });
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Unknown error occurred while fetching submitted plans. Error: ${error.message}`,
      error_code: "UNKNOWN_ERROR",
    });
  }
};






// Update the status of a plan (Approve or Decline)
const updatePlanStatus = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Authorization token is required to update the plan status.",
        error_code: "TOKEN_MISSING",
      });
    }

    // Verify token and get user_id
    const user_id = await verifyToken(token);

    // Fetch supervisor_id (employee_id from users table)
    const getEmployeeQuery = `SELECT employee_id FROM users WHERE user_id = ?`;
    con.query(getEmployeeQuery, [user_id], async (err, results) => {
      if (err) {
        console.error("Error fetching supervisor_id from users table:", err.message);
        return res.status(500).json({
          success: false,
          message: "Database error while fetching supervisor ID.",
          error_code: "DB_ERROR",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Supervisor not found.",
          error_code: "SUPERVISOR_NOT_FOUND",
        });
      }

      const supervisor_id = results[0].employee_id;
      const { plan_id, status, comment } = req.body;


    

      // Check if the plan exists and is pending approval
      const planCheckQuery = `
        SELECT p.plan_id, aw.status, p.employee_id, p.supervisor_id
        FROM plans p
        JOIN ApprovalWorkflow aw ON p.plan_id = aw.plan_id
        WHERE p.plan_id = ? AND aw.approver_id = ? AND aw.status = 'Pending'
      `;

      con.query(planCheckQuery, [plan_id, supervisor_id], (err, results) => {
        if (err) {
          console.error("Error checking plan existence:", err.message);
          return res.status(500).json({
            success: false,
            message: "Database error while checking plan status.",
            error_code: "DB_ERROR",
          });
        }

        if (results.length === 0) {
          console.error("Plan not found or not pending approval:", { plan_id, supervisor_id });
          return res.status(404).json({
            success: false,
            message: "Plan not found or not pending approval.",
            error_code: "PLAN_NOT_FOUND",
          });
        }

        const planDetails = results[0];

        // Update the approval status in ApprovalWorkflow
        const updateApprovalQuery = `
          UPDATE ApprovalWorkflow
          SET status = ?, comment = ?, approval_date = NOW()
          WHERE plan_id = ? AND approver_id = ?
        `;

        con.query(updateApprovalQuery, [status, comment, plan_id, supervisor_id], (err) => {
          if (err) {
            console.error("Error updating approval status:", err.message);
            return res.status(500).json({
              success: false,
              message: "Database error while updating approval status.",
              error_code: "DB_ERROR",
            });
          }

          if (status === "Approved") {
            // Fetch next supervisor for approval
            const getNextSupervisorQuery = `
              SELECT supervisor_id FROM employees WHERE employee_id = ?
            `;
            con.query(getNextSupervisorQuery, [planDetails.supervisor_id], (err, supervisorResults) => {
              if (err) {
                console.error("Error fetching next supervisor:", err.message);
                return res.status(500).json({
                  success: false,
                  message: "Database error while fetching next supervisor.",
                  error_code: "DB_ERROR",
                });
              }

              if (supervisorResults.length > 0) {
                const nextSupervisorId = supervisorResults[0].supervisor_id;

                // Add next supervisor to ApprovalWorkflow
                const insertApprovalWorkflowQuery = `
                  INSERT INTO ApprovalWorkflow (plan_id, approver_id, status)
                  VALUES (?, ?, 'Pending')
                `;

                con.query(insertApprovalWorkflowQuery, [plan_id, nextSupervisorId], (err) => {
                  if (err) {
                    console.error("Error creating next approval workflow:", err.message);
                    return res.status(500).json({
                      success: false,
                      message: "Database error while creating next approval workflow.",
                      error_code: "DB_ERROR",
                    });
                  }

                  // Update plan with next supervisor
                  const updatePlanQuery = `
                    UPDATE plans
                    SET employee_id = ?, supervisor_id = ?
                    WHERE plan_id = ?
                  `;
                  con.query(updatePlanQuery, [nextSupervisorId, nextSupervisorId, plan_id], (err) => {
                    if (err) {
                      console.error("Error updating plan with next supervisor:", err.message);
                      return res.status(500).json({
                        success: false,
                        message: "Database error while updating plan with next supervisor.",
                        error_code: "DB_ERROR",
                      });
                    }

                    return res.status(200).json({
                      success: true,
                      message: "approved",
                    });
                  });
                });
              } else {
                // Finalize the plan
                const finalizePlanQuery = `
                  UPDATE plans
                  SET status = 'Approved'
                  WHERE plan_id = ?
                `;
                con.query(finalizePlanQuery, [plan_id], (err) => {
                  if (err) {
                    console.error("Error finalizing plan approval:", err.message);
                    return res.status(500).json({
                      success: false,
                      message: "Database error while finalizing plan approval.",
                      error_code: "DB_ERROR",
                    });
                  }

                  return res.status(200).json({
                    success: true,
                    message: "Plan fully approved. No further supervisors required.",
                  });
                });
              }
            });
          } else if (status === "Declined") {
            // Decline the plan and restore original supervisor
            const restorePlanQuery = `
              UPDATE plans
              SET employee_id = ?, supervisor_id = ?
              WHERE plan_id = ?
            `;
            con.query(restorePlanQuery, [planDetails.employee_id, planDetails.supervisor_id, plan_id], (err, result) => {
              if (err) {
                console.error("Error restoring plan details:", err.message);
                return res.status(500).json({
                  success: false,
                  message: "Database error while restoring plan details.",
                  error_code: "DB_ERROR",
                });
              }

              if (result.affectedRows === 0) {
                console.error("No rows were updated, plan might not exist.");
                return res.status(404).json({
                  success: false,
                  message: "Plan not found or could not be declined.",
                  error_code: "PLAN_NOT_FOUND",
                });
              }

              // Successfully declined and reverted the supervisor
              return res.status(200).json({
                success: true,
                message: "Plan declined and reverted to original supervisor.",
              });
            });
          }
        });
      });
    });
  } catch (error) {
    console.error("Error in updatePlanStatus:", error.message);
    res.status(500).json({
      success: false,
      message: `An unexpected error occurred: ${error.message}`,
      error_code: "UNKNOWN_ERROR",
    });
  }
};



const updateReportStatus = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Authorization token is required to update the plan status.",
        error_code: "TOKEN_MISSING",
      });
    }

    // Verify token and get user_id
    const user_id = await verifyToken(token);

    // Fetch supervisor_id (employee_id from users table)
    const getEmployeeQuery = `SELECT employee_id FROM users WHERE user_id = ?`;
    con.query(getEmployeeQuery, [user_id], async (err, results) => {
      if (err) {
        console.error("Error fetching supervisor_id from users table:", err.message);
        return res.status(500).json({
          success: false,
          message: "Database error while fetching supervisor ID.",
          error_code: "DB_ERROR",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Supervisor not found.",
          error_code: "SUPERVISOR_NOT_FOUND",
        });
      }

      const supervisor_id = results[0].employee_id;
      const { plan_id, status, comment } = req.body;

      // Input validation
      try {
        validateApprovalInput(status, comment);
      } catch (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError.message,
          error_code: "VALIDATION_ERROR",
        });
      }

      // Check if the plan exists and is pending approval
      const planCheckQuery = `
        SELECT p.plan_id, aw.status, p.employee_id, p.supervisor_id
        FROM plans p
        JOIN ApprovalWorkflow aw ON p.plan_id = aw.plan_id
        WHERE p.plan_id = ? AND aw.approver_id = ? AND aw.status = 'Pending'
      `;

      con.query(planCheckQuery, [plan_id, supervisor_id], (err, results) => {
        if (err) {
          console.error("Error checking plan existence:", err.message);
          return res.status(500).json({
            success: false,
            message: "Database error while checking plan status.",
            error_code: "DB_ERROR",
          });
        }

        if (results.length === 0) {
          console.error("Plan not found or not pending approval:", {
            plan_id,
            supervisor_id,
          });
          return res.status(404).json({
            success: false,
            message: "Plan not found or not pending approval.",
            error_code: "PLAN_NOT_FOUND",
          });
        }

        const planDetails = results[0];

        // Update the approval status in ApprovalWorkflow
        const updateApprovalQuery = `
          UPDATE ApprovalWorkflow
          SET status = ?, comment = ?, approval_date = NOW()
          WHERE plan_id = ? AND approver_id = ?
        `;

        con.query(updateApprovalQuery, [status, comment, plan_id, supervisor_id], (err) => {
          if (err) {
            console.error("Error updating approval status:", err.message);
            return res.status(500).json({
              success: false,
              message: "Database error while updating approval status.",
              error_code: "DB_ERROR",
            });
          }

          if (status === "Approved") {
            // Fetch next supervisor for approval
            const getNextSupervisorQuery = `
              SELECT supervisor_id FROM employees WHERE employee_id = ?
            `;
            con.query(getNextSupervisorQuery, [planDetails.supervisor_id], (err, supervisorResults) => {
              if (err) {
                console.error("Error fetching next supervisor:", err.message);
                return res.status(500).json({
                  success: false,
                  message: "Database error while fetching next supervisor.",
                  error_code: "DB_ERROR",
                });
              }

              if (supervisorResults.length > 0) {
                const nextSupervisorId = supervisorResults[0].supervisor_id;

                // Add next supervisor to ApprovalWorkflow
                const insertApprovalWorkflowQuery = `
                  INSERT INTO ApprovalWorkflow (plan_id, approver_id, status)
                  VALUES (?, ?, 'Pending')
                `;

                con.query(insertApprovalWorkflowQuery, [plan_id, nextSupervisorId], (err) => {
                  if (err) {
                    console.error("Error creating next approval workflow:", err.message);
                    return res.status(500).json({
                      success: false,
                      message: "Database error while creating next approval workflow.",
                      error_code: "DB_ERROR",
                    });
                  }

                  // Update plan with next supervisor
                  const updatePlanQuery = `
                    UPDATE plans
                    SET employee_id = ?, supervisor_id = ?
                    WHERE plan_id = ?
                  `;
                  con.query(updatePlanQuery, [nextSupervisorId, nextSupervisorId, plan_id], (err) => {
                    if (err) {
                      console.error("Error updating plan with next supervisor:", err.message);
                      return res.status(500).json({
                        success: false,
                        message: "Database error while updating plan with next supervisor.",
                        error_code: "DB_ERROR",
                      });
                    }

                    return res.status(200).json({
                      success: true,
                      message: "approved",
                    });
                  });
                });
              } else {
                // Finalize the plan
                const finalizePlanQuery = `
                  UPDATE plans
                  SET status = 'Approved'
                  WHERE plan_id = ?
                `;
                con.query(finalizePlanQuery, [plan_id], (err) => {
                  if (err) {
                    console.error("Error finalizing plan approval:", err.message);
                    return res.status(500).json({
                      success: false,
                      message: "Database error while finalizing plan approval.",
                      error_code: "DB_ERROR",
                    });
                  }

                  return res.status(200).json({
                    success: true,
                    message: "Plan fully approved. No further supervisors required.",
                  });
                });
              }
            });
          } else if (status === "Declined") {
            // Decline the plan and restore original supervisor
            const restorePlanQuery = `
              UPDATE plans
              SET employee_id = ?, supervisor_id = ?
              WHERE plan_id = ?
            `;
            con.query(restorePlanQuery, [planDetails.employee_id, planDetails.supervisor_id, plan_id], (err) => {
              if (err) {
                console.error("Error restoring plan details:", err.message);
                return res.status(500).json({
                  success: false,
                  message: "Database error while restoring plan details.",
                  error_code: "DB_ERROR",
                });
              }

              return res.status(200).json({
                success: true,
                message: "Plan declined and reverted to original supervisor.",
              });
            });
          }
        });
      });
    });
  } catch (error) {
    console.error("Error in updatePlanStatus:", error.message);
    res.status(500).json({
      success: false,
      message: `An unexpected error occurred: ${error.message}`,
      error_code: "UNKNOWN_ERROR",
    });
  }
};








// Fetch detailed plan for the next supervisor
const getDetailedPlanForSupervisor = async (req, res) => {
  const { plan_id } = req.params; // Get the plan_id from the URL params
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from the Authorization header

  // Check if the token is missing
  if (!token) {
    console.error("Token is missing in the request header.");
    return res.status(403).json({
      success: false,
      message: "Authorization token is required.",
      error_code: "TOKEN_MISSING"
    });
  }

  try {
    // Verify the token and extract the user_id (assuming user_id is embedded in the token)
    const user_id = await verifyToken(token); // Extract user_id from JWT token

    if (!user_id) {
      console.error("Failed to verify token. No user_id returned.");
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
        error_code: "TOKEN_INVALID"
      });
    }
    console.log(`Successfully verified user_id: ${user_id}`);

    // Query to get the employee_id from the users table using the user_id
    const getEmployeeQuery = "SELECT employee_id FROM users WHERE user_id = ?";
    console.log(`Executing query: ${getEmployeeQuery} with user_id: ${user_id}`);

    con.query(getEmployeeQuery, [user_id], (err, results) => {
      if (err) {
        console.error("Error fetching employee_id from users table:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error fetching employee_id from users table.",
          error_code: "DB_ERROR",
          error: err.message
        });
      }

      if (results.length === 0) {
        console.warn("No employee record found for user_id:", user_id);
        return res.status(404).json({
          success: false,
          message: "Employee not found. Unable to fetch details based on the provided user_id.",
          error_code: "EMPLOYEE_NOT_FOUND"
        });
      }

      const supervisor_id = results[0].employee_id; // Get the employee_id of the supervisor
      console.log(`Fetched supervisor_id: ${supervisor_id}`);

      // Query to get the detailed plan and approval workflow for the supervisor
      const detailedPlanQuery = `
        SELECT p.plan_id, p.objective, p.goal, p.details, aw.status, aw.comment
        FROM plans p
        JOIN ApprovalWorkflow aw ON p.plan_id = aw.plan_id
        WHERE p.plan_id = ? AND aw.approver_id = ?;
      `;

      console.log(`Executing query: ${detailedPlanQuery} with plan_id: ${plan_id} and supervisor_id: ${supervisor_id}`);
      con.query(detailedPlanQuery, [plan_id, supervisor_id], (err, planResults) => {
        if (err) {
          console.error("Error fetching detailed plan from database:", err.message);
          return res.status(500).json({
            success: false,
            message: "Error fetching detailed plan from database.",
            error_code: "DB_ERROR",
            error: err.message
          });
        }

        if (planResults.length === 0) {
          console.warn(`No plan found for plan_id: ${plan_id} assigned to supervisor_id: ${supervisor_id}`);
          return res.status(404).json({
            success: false,
            message: "Plan not found or not assigned to you for approval.",
            error_code: "PLAN_NOT_FOUND"
          });
        }

        // Log the fetched plan details for debugging
        console.log("Fetched Plan Details:", planResults[0]);

        // Return the detailed plan for the supervisor
        res.json({ success: true, plan: planResults[0] });
      });
    });
  } catch (error) {
    // General error (e.g., invalid token, unknown errors)
    console.error("Unexpected error while fetching detailed plan:", error.message);
    res.status(500).json({
      success: false,
      message: `Unknown error occurred while fetching detailed plan. Error: ${error.message}`,
      error_code: "UNKNOWN_ERROR"
    });
  }
};




const getSubmittedPlanssp = async (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "No token provided. Authorization token is required to access the plans.",
      error_code: "TOKEN_MISSING",
    });
  }

  try {
    const user_id = await verifyToken(token);
    console.log(`Verified token. user_id: ${user_id}`);

    const getEmployeeQuery = "SELECT employee_id FROM users WHERE user_id = ?";
    console.log(`Executing query: ${getEmployeeQuery} with user_id: ${user_id}`);
    
    con.query(getEmployeeQuery, [user_id], (err, results) => {
      if (err) {
        console.error("Error fetching employee_id:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error fetching employee_id from users table.",
          error_code: "DB_ERROR",
          error: err.message,
        });
      }

      if (results.length === 0) {
        console.warn(`No employee record found for user_id: ${user_id}`);
        return res.status(404).json({
          success: false,
          message: "Employee not found. Unable to fetch employee details based on the provided user_id.",
          error_code: "EMPLOYEE_NOT_FOUND",
        });
      }

      const supervisor_id = results[0].employee_id;
      console.log(`Found supervisor_id: ${supervisor_id}`);

      const query = `
      SELECT p.plan_id, p.objective, p.goal, p.details, aw.status
      FROM plans p
      JOIN ApprovalWorkflow aw ON p.plan_id = aw.plan_id
      WHERE aw.approver_id = ? AND aw.status = 'Pending'
    `;
    
    con.query(query, [supervisor_id], (err, results) => {
      if (err) {
        console.error("Error fetching plans from database:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error fetching plans from database.",
          error_code: "DB_ERROR",
          error: err.message
        });
      }
    
      if (results.length === 0) {
        console.warn(`No plans found for approver_id: ${supervisor_id} with Pending status.`);
        return res.status(404).json({
          success: false,
          message: "No plans found awaiting approval for this supervisor.",
          error_code: "NO_PLANS_FOUND"
        });
      }
    
      console.log("Fetched plans awaiting approval:", results);
    
      res.json({ success: true, plans: results });
    });
    
    });
  } catch (error) {
    console.error("Error in getSubmittedPlanssp:", error.message);
    res.status(500).json({
      success: false,
      message: `Unknown error occurred while fetching submitted plans. Error: ${error.message}`,
      error_code: "UNKNOWN_ERROR",
    });
  }
};








const updatePlanApprovalStatus = async (req, res) => { 
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Authorization token is required to update the plan status.",
        error_code: "TOKEN_MISSING",
      });
    }

    // Verify token and get user_id
    const user_id = await verifyToken(token);

    // Fetch supervisor_id (employee_id from users table)
    const getEmployeeQuery = `SELECT employee_id FROM users WHERE user_id = ?`;
    con.query(getEmployeeQuery, [user_id], async (err, results) => {
      if (err) {
        console.error("Error fetching supervisor_id from users table:", err.message);
        return res.status(500).json({
          success: false,
          message: "Database error while fetching supervisor ID.",
          error_code: "DB_ERROR",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Supervisor not found.",
          error_code: "SUPERVISOR_NOT_FOUND",
        });
      }

      const supervisor_id = results[0].employee_id;
      const { plan_id, status, comment } = req.body;

      // Check if the plan exists and is pending approval
      const planCheckQuery = `
        SELECT p.plan_id, aw.status, p.employee_id, p.supervisor_id
        FROM plans p
        JOIN ApprovalWorkflow aw ON p.plan_id = aw.plan_id
        WHERE p.plan_id = ? AND aw.approver_id = ? AND aw.status = 'Pending'
      `;

      con.query(planCheckQuery, [plan_id, supervisor_id], (err, results) => {
        if (err) {
          console.error("Error checking plan existence:", err.message);
          return res.status(500).json({
            success: false,
            message: "Database error while checking plan status.",
            error_code: "DB_ERROR",
          });
        }

        if (results.length === 0) {
          console.error("Plan not found or not pending approval:", { plan_id, supervisor_id });
          return res.status(404).json({
            success: false,
            message: "Plan not found or not pending approval.",
            error_code: "PLAN_NOT_FOUND",
          });
        }

        const planDetails = results[0];

        // Update the approval status in ApprovalWorkflow
        const updateApprovalQuery = `
          UPDATE ApprovalWorkflow
          SET status = ?, comment = ?, approval_date = NOW()
          WHERE plan_id = ? AND approver_id = ?
        `;

        con.query(updateApprovalQuery, [status, comment, plan_id, supervisor_id], (err) => {
          if (err) {
            console.error("Error updating approval status:", err.message);
            return res.status(500).json({
              success: false,
              message: "Database error while updating approval status.",
              error_code: "DB_ERROR",
            });
          }

          if (status === "Approved") {
            // Instead of fetching a next supervisor, update the plans table so that
            // supervisor_id is set to the supervisor of the user (based on users and employees join)
            const updatePlanQuery = `
              UPDATE plans p
              JOIN users u ON p.user_id = u.user_id
              JOIN employees e ON u.employee_id = e.employee_id
              SET p.reporting = 'active', 
                  p.employee_id = e.employee_id,
                  p.supervisor_id = e.supervisor_id
              WHERE p.plan_id = ?
            `;
            con.query(updatePlanQuery, [plan_id], (err) => {
              if (err) {
                console.error("Error updating plan supervisor details:", err.message);
                return res.status(500).json({
                  success: false,
                  message: "Database error while updating plan details.",
                  error_code: "DB_ERROR",
                });
              }
              return res.status(200).json({
                success: true,
                message: "approved"
              });
            });
          } else if (status === "Declined") {
            // Decline the plan and restore original supervisor details
            const restorePlanQuery = `
              UPDATE plans
              SET employee_id = ?, supervisor_id = ?
              WHERE plan_id = ?
            `;
            con.query(restorePlanQuery, [planDetails.employee_id, planDetails.supervisor_id, plan_id], (err) => {
              if (err) {
                console.error("Error restoring plan details:", err.message);
                return res.status(500).json({
                  success: false,
                  message: "Database error while restoring plan details.",
                  error_code: "DB_ERROR",
                });
              }
              return res.status(200).json({
                success: true,
                message: "Plan declined and reverted to original supervisor."
              });
            });
          }
        });
      });
    });
  } catch (error) {
    console.error("Error in updatePlanStatus:", error.message);
    res.status(500).json({
      success: false,
      message: `An unexpected error occurred: ${error.message}`,
      error_code: "UNKNOWN_ERROR",
    });
  }
};









module.exports = {  
  getSubmittedreports,
  getSubmittedPlans,
  getSubmittedPlanssp,
  updatePlanStatus,
  updateReportStatus,
  getDetailedPlanForSupervisor,
  updatePlanApprovalStatus
};








