const con = require("../models/db");

// Get all plans from user_id
// Helper function for foreign key validation
const validateForeignKeys = (goal_id, objective_id, specific_objective_id, specific_objective_detail_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM goals WHERE goal_id = ?) AS goal_exists,
        (SELECT COUNT(*) FROM objectives WHERE objective_id = ?) AS objective_exists,
        (SELECT COUNT(*) FROM specific_objectives WHERE specific_objective_id = ?) AS specific_objective_exists,
        (SELECT COUNT(*) FROM specific_objective_details WHERE specific_objective_detail_id = ?) AS specific_objective_detail_exists
    `;
    con.query(query, [goal_id, objective_id, specific_objective_id, specific_objective_detail_id], (err, results) => {
      if (err) {
        reject("Error validating foreign keys");
      }
      resolve(results[0]);
    });
  });
};

// addPlan function with improvements
const addPlan = (req, res) => {
  const { goal_id, objective_id, specific_objective_id, specific_objective_detail_id } = req.body;
  if (!goal_id || !objective_id || !specific_objective_id || !specific_objective_detail_id) {
    return res.status(400).json({ message: "Missing required fields: goal_id, objective_id, specific_objective_id, or specific_objective_detail_id" });
  }

  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  jwt.verify(token, "hayaltamrat@27", async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user_id = decoded.user_id;

    try {
      const { goal_exists, objective_exists, specific_objective_exists, specific_objective_detail_exists } = await validateForeignKeys(goal_id, objective_id, specific_objective_id, specific_objective_detail_id);
      
      if (!goal_exists || !objective_exists || !specific_objective_exists || !specific_objective_detail_exists) {
        return res.status(400).json({
          message: "Invalid foreign key references. Ensure all referenced data exists.",
          details: {
            goal_id: !!goal_exists,
            objective_id: !!objective_exists,
            specific_objective_id: !!specific_objective_exists,
            specific_objective_detail_id: !!specific_objective_detail_exists,
          },
        });
      }

      const userResult = await new Promise((resolve, reject) => {
        con.query("SELECT employee_id FROM users WHERE user_id = ?", [user_id], (err, userResult) => {
          if (err) reject("Error retrieving employee ID");
          if (userResult.length === 0) reject("User not found");
          resolve(userResult);
        });
      });

      const employee_id = userResult[0].employee_id;

      const employeeResult = await new Promise((resolve, reject) => {
        con.query("SELECT supervisor_id, department_id FROM employees WHERE employee_id = ?", [employee_id], (err, employeeResult) => {
          if (err) reject("Error retrieving employee details");
          if (employeeResult.length === 0) reject("Employee details not found");
          resolve(employeeResult);
        });
      });

      const { supervisor_id, department_id } = employeeResult[0];

      // Transaction for plan and approval workflow insertion
      await new Promise((resolve, reject) => {
        con.beginTransaction((err) => {
          if (err) reject("Error starting transaction");

          const insertPlanQuery = `
            INSERT INTO plans (
              user_id, department_id, supervisor_id, employee_id, goal_id, objective_id, specific_objective_id, specific_objective_detail_id, 
              status, created_at, updated_at
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `;
          con.query(insertPlanQuery, [user_id, department_id, supervisor_id, employee_id, goal_id, objective_id, specific_objective_id, specific_objective_detail_id], (err, result) => {
            if (err) return con.rollback(() => reject("Error adding plan"));

            const plan_id = result.insertId;

            const approvalQuery = `
              INSERT INTO approvalworkflow (plan_id, approver_id, status, approval_date, approved_at) 
              VALUES (?, ?, 'Pending', NOW(), NULL)
            `;
            con.query(approvalQuery, [plan_id, supervisor_id], (err, result) => {
              if (err) return con.rollback(() => reject("Error adding approval workflow"));

              con.commit((err) => {
                if (err) return con.rollback(() => reject("Error committing transaction"));
                resolve();
              });
            });
          });
        });
      });

      res.status(201).json({ message: "Plan and associated entries created successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Error: ${error}` });
    }
  });
};

// getAllPlans function with dynamic query updates

  // getAllPlans function with dynamic query updates

  const getAllPlans = async (req, res) => {
    try {
      const user_id = req.user_id; // Access the user_id added by verifyToken
      const {
        year,
        quarter,
        department,
        objective_id,
        goal_id,
        specific_objective_id,
        specific_objective_detail_id,
        page = 1,
        limit = 10,
      } = req.query;
  
      let filterConditions = ["p.user_id = ?"];
      let filterValues = [user_id];
  
      // Dynamically add filters based on query parameters
      if (year) {
        filterConditions.push("g.year = ?");
        filterValues.push(year);
      }
  
      if (quarter) {
        filterConditions.push("g.quarter = ?");
        filterValues.push(quarter);
      }
  
      if (department) {
        filterConditions.push("d.name = ?");
        filterValues.push(department);
      }
  
      if (objective_id) {
        filterConditions.push("p.objective_id = ?");
        filterValues.push(objective_id);
      }
  
      if (goal_id) {
        filterConditions.push("p.goal_id = ?");
        filterValues.push(goal_id);
      }
  
      if (specific_objective_id) {
        filterConditions.push("p.specific_objective_id = ?");
        filterValues.push(specific_objective_id);
      }
  
      if (specific_objective_detail_id) {
        filterConditions.push("p.specific_objective_detail_id = ?");
        filterValues.push(specific_objective_detail_id);
      }
  
      // Adding the reporting column filter to show only active reporting plans
      filterConditions.push("p.reporting = ?");
      filterValues.push("active");
  
      const whereClause = filterConditions.length ? `WHERE ${filterConditions.join(" AND ")}` : "";
  
      const offset = (page - 1) * limit;
  
      const getPlansQuery = `
        SELECT 
          p.plan_id AS Plan_ID,
          p.user_id AS User_ID,
          g.goal_id AS SpecificObjectiveDetail_ID,
          g.name AS Goal,
          g.year AS Year,
          g.quarter AS Quarter,
          o.objective_id AS Objective_ID,
          o.name AS Objective,
          so.specific_objective_id AS Specific_Objective_ID,
          so.specific_objective_name AS SpecificObjective,
          sod.specific_objective_detail_id AS Specific_Objective_Detail_ID,
          sod.details AS Specific_Objective_Detail,
          p.status AS Status,
          p.created_at AS Created_At,
          p.updated_at AS Updated_At,
          d.name AS Department,
          aw.comment AS Comment
        FROM plans p
        LEFT JOIN departments d ON p.department_id = d.department_id
        LEFT JOIN approvalworkflow aw ON p.plan_id = aw.plan_id
        LEFT JOIN goals g ON p.goal_id = g.goal_id
        LEFT JOIN objectives o ON p.objective_id = o.objective_id
        LEFT JOIN specific_objectives so ON p.specific_objective_id = so.specific_objective_id
        LEFT JOIN specific_objective_details sod ON p.specific_objective_detail_id = sod.specific_objective_detail_id
        ${whereClause}
        GROUP BY p.plan_id
        LIMIT ? OFFSET ?
      `;
  
      filterValues.push(parseInt(limit), parseInt(offset));
  
      con.query(getPlansQuery, filterValues, (err, results) => {
        if (err) {
          console.error("Error fetching plans:", err);
          return res.status(500).json({ message: "Error fetching plans", error: err });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: "No plans found" });
        }
  
        res.status(200).json({ success: true, plans: results });
      });
    } catch (error) {
      console.error("Error in getAllPlans:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  module.exports = { getAllPlans };
  



const getAllPlansDeclined = async (req, res) => {
  try {
    const user_id = req.user_id; // Access the user_id added by verifyToken
    const {
      year,
      quarter,
      department,
      objective_id,
      goal_id,
      specific_objective_id,
      specific_objective_detail_id,
      page = 1,
      limit = 10,
    } = req.query;

    // Filter conditions to include only plans with a declined status
    let filterConditions = ["aw.status = 'declined'", "p.user_id = ?"];
    let filterValues = [user_id];

    // Dynamically add filters based on query parameters
    if (year) {
      filterConditions.push("g.year = ?");
      filterValues.push(year);
    }

    if (quarter) {
      filterConditions.push("g.quarter = ?");
      filterValues.push(quarter);
    }

    if (department) {
      filterConditions.push("d.name = ?");
      filterValues.push(department);
    }

    if (objective_id) {
      filterConditions.push("p.objective_id = ?");
      filterValues.push(objective_id);
    }

    if (goal_id) {
      filterConditions.push("p.goal_id = ?");
      filterValues.push(goal_id);
    }

    if (specific_objective_id) {
      filterConditions.push("p.specific_objective_id = ?");
      filterValues.push(specific_objective_id);
    }

    if (specific_objective_detail_id) {
      filterConditions.push("p.specific_objective_detail_id = ?");
      filterValues.push(specific_objective_detail_id);
    }

    // Build the WHERE clause dynamically
    const whereClause = filterConditions.length ? `WHERE ${filterConditions.join(" AND ")}` : "";

    // Pagination
    const offset = (page - 1) * limit;

    // SQL Query to fetch declined plans
    const getPlansQuery = `
      SELECT 
        p.plan_id AS Plan_ID,
        p.user_id AS User_ID,
        g.goal_id AS SpecificObjectiveDetail_ID,
        g.name AS Goal,
        g.year AS Year,
        g.quarter AS Quarter,
        o.objective_id AS Objective_ID,
        o.name AS Objective,
        so.specific_objective_id AS Specific_Objective_ID,
        so.specific_objective_name AS SpecificObjective,
        sod.specific_objective_detail_id AS Specific_Objective_Detail_ID,
        sod.details AS Specific_Objective_Detail,
        aw.status AS Status,
        p.created_at AS Created_At,
        p.updated_at AS Updated_At,
        d.name AS Department,
        aw.comment AS Comment
      FROM plans p
      LEFT JOIN departments d ON p.department_id = d.department_id
      LEFT JOIN approvalworkflow aw ON p.plan_id = aw.plan_id
      LEFT JOIN goals g ON p.goal_id = g.goal_id
      LEFT JOIN objectives o ON p.objective_id = o.objective_id
      LEFT JOIN specific_objectives so ON p.specific_objective_id = so.specific_objective_id
      LEFT JOIN specific_objective_details sod ON p.specific_objective_detail_id = sod.specific_objective_detail_id
      ${whereClause}
      LIMIT ? OFFSET ?
    `;

    // Add pagination values to the filter array
    filterValues.push(parseInt(limit), parseInt(offset));

    // Execute the query
    con.query(getPlansQuery, filterValues, (err, results) => {
      if (err) {
        console.error("Error fetching declined plans:", err);
        return res.status(500).json({ success: false, message: "Error fetching declined plans", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "No declined plans found for the specified user" });
      }

      // Return results
      res.status(200).json({ success: true, plans: results });
    });
  } catch (error) {
    console.error("Error in getAllPlansDeclined:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};





// Get all approved plans
const getAllOrgPlans = async (req, res) => {
  try {
    const {
      year,
      quarter,
      department,
      objective_id,
      goal_id,
      specific_objective_id,
      specific_objective_detail_id,
      page = 1,
      limit = 10,
    } = req.query;

    // Array to store dynamic filter conditions and values
    let filterConditions = ["p.status = 'approved'"]; // Ensures only approved plans are fetched
    let filterValues = [];

    // Dynamically add filters based on query parameters
    if (year) {
      filterConditions.push("g.year = ?");
      filterValues.push(year);
    }

    if (quarter) {
      filterConditions.push("g.quarter = ?");
      filterValues.push(quarter);
    }

    if (department) {
      filterConditions.push("d.name = ?");
      filterValues.push(department);
    }

    if (objective_id) {
      filterConditions.push("p.objective_id = ?");
      filterValues.push(objective_id);
    }

    if (goal_id) {
      filterConditions.push("p.goal_id = ?");
      filterValues.push(goal_id);
    }

    if (specific_objective_id) {
      filterConditions.push("p.specific_objective_id = ?");
      filterValues.push(specific_objective_id);
    }

    if (specific_objective_detail_id) {
      filterConditions.push("p.specific_objective_detail_id = ?");
      filterValues.push(specific_objective_detail_id);
    }

    // Build the WHERE clause dynamically
    const whereClause = filterConditions.length ? `WHERE ${filterConditions.join(" AND ")}` : "";

    // Calculate pagination values
    const offset = (page - 1) * limit;

    // SQL query to fetch approved plans with dynamic filters
    const getPlansQuery = `
      SELECT 
        p.plan_id AS Plan_ID,
        p.user_id AS User_ID,
        g.goal_id AS SpecificObjectiveDetail_ID,
        g.name AS Goal,
        g.year AS Year,
        g.quarter AS Quarter,
        o.objective_id AS Objective_ID,
        o.name AS Objective,
        so.specific_objective_id AS Specific_Objective_ID,
        so.specific_objective_name AS SpecificObjective,
        sod.specific_objective_detail_id AS Specific_Objective_Detail_ID,
        sod.details AS Specific_Objective_Detail,
        p.status AS Status,
        p.created_at AS Created_At,
        p.updated_at AS Updated_At,
        d.name AS Department,
        aw.comment AS Comment
      FROM plans p
      LEFT JOIN departments d ON p.department_id = d.department_id
      LEFT JOIN approvalworkflow aw ON p.plan_id = aw.plan_id
      LEFT JOIN goals g ON p.goal_id = g.goal_id
      LEFT JOIN objectives o ON p.objective_id = o.objective_id
      LEFT JOIN specific_objectives so ON p.specific_objective_id = so.specific_objective_id
      LEFT JOIN specific_objective_details sod ON p.specific_objective_detail_id = sod.specific_objective_detail_id
      ${whereClause}
      LIMIT ? OFFSET ?
    `;

    // Add pagination values to the filter array
    filterValues.push(parseInt(limit), parseInt(offset));

    // Execute the query
    con.query(getPlansQuery, filterValues, (err, results) => {
      if (err) {
        console.error("Error fetching plans:", err);
        return res.status(500).json({ success: false, message: "Error fetching plans", error: err });
      }

      if (results.length === 0) {
        return res.status(404).json({ success: false, message: "No approved plans found" });
      }

      // Return results
      res.status(200).json({ success: true, plans: results });
    });
  } catch (error) {
    console.error("Error in getAllOrgPlans:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};









// Get all approved organization plans
const getApprovedOrgPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const getPlansQuery = `
      SELECT 
        p.plan_id AS Plan_ID,
        p.user_id AS User_ID,
        p.department_id AS Department_ID,
        p.objective AS Objective,
        p.goal AS SpecificObjectiveDetail,
        p.details AS Details,
        p.measurement AS Measurement,
        p.baseline AS Baseline,
        p.plan AS Plan,
        p.outcome AS Outcome,
        p.execution_percentage AS Execution_Percentage,
        p.description AS Description,
        p.status AS Status,
        p.comment AS Comment,
        p.created_at AS Created_At,
        p.updated_at AS Updated_At,
        p.year AS Year,
        p.quarter AS Quarter,
        p.created_by AS Created_By,
        p.Progress AS Progress,
        d.name AS Department
      FROM plans p
      LEFT JOIN departments d ON p.department_id = d.department_id
      WHERE p.status = 'approved'
      LIMIT ? OFFSET ?
    `;

    con.query(getPlansQuery, [parseInt(limit, 10), parseInt(offset, 10)], (err, results) => {
      if (err) {
        console.error("Error fetching approved plans:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error fetching approved plans from the database.",
          error_code: "DB_ERROR",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No approved plans found.",
        });
      }

      res.status(200).json({
        success: true,
        plans: results,
      });
    });
  } catch (error) {
    console.error("Error in getApprovedOrgPlans:", error.message);
    res.status(500).json({
      success: false,
      message: `Unknown error occurred. ${error.message}`,
    });
  }
};




// Get plan detail (with Specifc Objective Detail, Objective, and SpecificObjectiveDetail details)

const getPlanDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const getPlanQuery = `
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
      JOIN goals g ON p.goal_id = g.goal_id
      JOIN specific_objectives so ON p.specific_objective_id = so.specific_objective_id
      JOIN specific_objective_details sod ON p.specific_objective_detail_id = sod.specific_objective_detail_id
      WHERE p.plan_id = ?;
    `;

    // Execute query with provided id
    con.query(getPlanQuery, [id], (err, results) => {
      if (err) {
        console.error("Error fetching plan details:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error fetching plan details from the database.",
          error: err.message,
        });
      }

      if (!results || results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Plan not found.",
        });
      }

      // Retrieve plan details and filter out keys with null values
      const plan = results[0];
      const filteredPlan = {};
      Object.keys(plan).forEach(key => {
        if (plan[key] !== null) {
          filteredPlan[key] = plan[key];
        }
      });

      // Convert CI fields to floats if they are present
      if (filteredPlan.CIbaseline) filteredPlan.CIbaseline = parseFloat(filteredPlan.CIbaseline);
      if (filteredPlan.CIplan) filteredPlan.CIplan = parseFloat(filteredPlan.CIplan);
      if (filteredPlan.CIoutcome) filteredPlan.CIoutcome = parseFloat(filteredPlan.CIoutcome);

      res.status(200).json({
        success: true,
        plan: filteredPlan,
      });
    });
  } catch (error) {
    console.error("Error in getPlanDetail:", error.message);
    res.status(500).json({
      success: false,
      message: `Unknown error occurred. ${error.message}`,
    });
  }
};

module.exports = { getPlanDetail };






// Delete plan
const deletePlan = async (req, res) => {
  try {
    const user_id = req.user_id; // Get the user_id from the request, added by verifyToken middleware
    const { planId } = req.params; // Get the planId from the URL parameters

    // SQL query to delete the plan only if it belongs to the current user
    const deleteQuery = `
      DELETE FROM plans
      WHERE plan_id = ? AND user_id = ?
    `;

    // Execute the delete query
    con.query(deleteQuery, [planId, user_id], (err, result) => {
      if (err) {
        console.error("Error deleting plan:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error deleting the plan.",
          error_code: "DB_ERROR",
          error: err.message,
        });
      }

      // If no rows are affected, it means the plan was not found or doesn't belong to the user
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Plan not found or you don't have permission to delete it.",
          error_code: "PLAN_NOT_FOUND",
        });
      }

      // Successfully deleted the plan
      res.status(200).json({
        success: true,
        message: "Plan deleted successfully.",
      });
    });
  } catch (error) {
    // Catch any unexpected errors
    console.error("Error in deletePlan:", error.message);
    res.status(500).json({
      success: false,
      message: `Unknown error occurred. ${error.message}`,
      error_code: "UNKNOWN_ERROR",
    });
  }
};



// Get plan by ID with detailed information from Specifc Objective Details, Objectives, and SpecificObjectiveDetails tables
const getPlanById = async (req, res) => {
  try {
    const user_id = req.user_id; // Access the user_id added by verifyToken
    const { planId } = req.params; // Get the planId from route parameters

    const query = `
      SELECT 
        p.plan_id AS Plan_ID,
        p.user_id AS User_ID,
        p.department_id AS Department_ID,
        
        so.details AS Details,
        so.measurement AS Measurement,
        so.baseline AS Baseline,
        p.plan AS Plan,
        o.description AS Description,
        p.status AS Status,
        p.comment AS Comment,
        p.created_at AS Created_At,
        p.updated_at AS Updated_At,
        o.year AS Year,
        o.quarter AS Quarter,
        p.created_by AS Created_By,
        so.Plan AS Plan,
        d.name AS Department,
        o.name AS Objective,
        g.name AS SpecificObjectiveDetail,
        so.name AS Specific_SpecificObjectiveDetail
      FROM plans p
      LEFT JOIN departments d ON p.department_id = d.department_id
      LEFT JOIN objectives o ON p.objective_id = o.objective_id 
      LEFT JOIN goals g ON p.goal_id = g.id
      LEFT JOIN specific_objective_details so ON p.specific_objective_detail_id = so.id
      WHERE p.user_id = ? AND p.plan_id = ?;
    `;

    con.query(query, [user_id, planId], (err, results) => {
      if (err) {
        console.error("Error fetching plan details:", err.message);
        return res.status(500).json({
          success: false,
          message: "Error fetching plan details from the database.",
          error_code: "DB_ERROR",
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Plan not found.",
          error_code: "PLAN_NOT_FOUND",
        });
      }

      res.status(200).json({
        success: true,
        plan: results[0], // Return the first result since plan_id is unique
      });
    });
  } catch (error) {
    console.error("Error in getPlanById:", error.message);
    res.status(500).json({
      success: false,
      message: `Unknown error occurred. ${error.message}`,
      error_code: "UNKNOWN_ERROR",
    });
  }
};




// Update plan
const updatePlan = async (req, res) => {
  try {
    const user_id = req.user_id; // Get user_id from the request (assumed to be set previously)
    const { planId } = req.params; // Get planId from URL params
    const updates = req.body; // Get the updates from the request body

    // Input validation for year (ensure year is a number if provided)
    if (updates.year && isNaN(updates.year)) {
      console.error("Invalid year format:", updates.year);
      return res.status(400).json({
        success: false,
        message: "Invalid year format. Please provide a valid number.",
        error_code: "INVALID_YEAR_FORMAT",
      });
    }

    // Extended allowed fields to cover additional fields sent by the frontend.
    const allowedUpdates = [
      "details",
      "measurement",
      "baseline",
      "plan",
      "description",
      "deadline",
      "quarter",
      "የ እቅዱ ሂደት",
      "specific_objective_detailname",
      "plan_type",
      "cost_type",
      "costName",
      "incomeName",
      "income_exchange",
      "CIplan",
      "CIbaseline",
      "employment_type",
      "year",
      "outcome",
      "execution_percentage",
      "CIoutcome",
      "CIexecution_percentage"
    ];

    // Filter out invalid fields from the incoming update request.
    const updateFields = Object.keys(updates).filter(field => allowedUpdates.includes(field));
    if (updateFields.length === 0) {
      console.error("No valid fields to update.");
      return res.status(400).json({
        success: false,
        message: "No valid fields to update. Ensure you're updating only allowed fields.",
        error_code: "NO_VALID_FIELDS",
      });
    }

    // Step 1: Fetch specific_objective_detail_id from the plans table using planId and user_id.
    const fetchSpecificObjectiveDetailIDQuery = 
      `SELECT specific_objective_detail_id FROM plans WHERE plan_id = ? AND user_id = ?`;
    con.query(fetchSpecificObjectiveDetailIDQuery, [planId, user_id], (err, planResults) => {
      if (err) {
        console.error("Error fetching plan:", err.stack);
        return res.status(500).json({
          success: false,
          message: "Database error while fetching the plan.",
          error_code: "DB_ERROR_PLAN_FETCH",
          error: err.message,
        });
      }
      if (planResults.length === 0) {
        console.error("Plan not found or unauthorized access. Plan ID:", planId);
        return res.status(404).json({
          success: false,
          message: "Plan not found or you don't have permission to update this plan.",
          error_code: "PLAN_NOT_FOUND_OR_UNAUTHORIZED",
        });
      }
      const specific_objective_detail_id = planResults[0].specific_objective_detail_id;

      // Step 2: Check if the specific objective detail exists and belongs to the user.
      const checkSpecificObjectiveDetailQuery = 
        `SELECT * FROM specific_objective_details WHERE specific_objective_detail_id = ? AND user_id = ?`;
      con.query(checkSpecificObjectiveDetailQuery, [specific_objective_detail_id, user_id], (err, specificObjDetailResults) => {
        if (err) {
          console.error("Error checking specific objective detail existence:", err.stack);
          return res.status(500).json({
            success: false,
            message: "Error while checking specific objective detail existence in the database.",
            error_code: "DB_ERROR_CHECK",
            error: err.message,
          });
        }
        if (specificObjDetailResults.length === 0) {
          console.error("Specific objective detail not found or unauthorized for update. ID:", specific_objective_detail_id);
          return res.status(404).json({
            success: false,
            message: "Specific objective detail not found or you don't have permission to update it.",
            error_code: "SPECIFIC_OBJECTIVE_DETAIL_NOT_FOUND_OR_UNAUTHORIZED",
          });
        }

        // Step 3: Prepare and execute the update query dynamically using the fields from updateFields.
        // Using concatenation instead of nested template literals.
        const updateQuery = 
          `UPDATE specific_objective_details SET ${updateFields.map(field => field + ' = ?').join(", ")} WHERE specific_objective_detail_id = ? AND user_id = ?`;
        const updateValues = [...updateFields.map(field => updates[field]), specific_objective_detail_id, user_id];
        con.query(updateQuery, updateValues, (err, result) => {
          if (err) {
            console.error("Error during update:", err.stack);
            return res.status(500).json({
              success: false,
              message: "Database error while updating the specific objective detail.",
              error_code: "DB_ERROR_UPDATE",
              error: err.message,
            });
          }
          if (result.affectedRows === 0) {
            console.warn("No updates applied. Either the record does not exist or no changes were made.");
            return res.status(404).json({
              success: false,
              message: "No updates were applied. The specific objective detail may not exist or no changes were made.",
              error_code: "NO_UPDATES_APPLIED",
            });
          }
          console.log("Specific objective detail updated successfully. ID:", specific_objective_detail_id);

          // Step 4: Update the approval workflow status to 'pending'.
          const updateApprovalWorkflowQuery = 
            `UPDATE approvalworkflow SET status = 'pending' WHERE plan_id = ?`;
          con.query(updateApprovalWorkflowQuery, [planId], (err, approvalResult) => {
            if (err) {
              console.error("Error updating approval workflow:", err.stack);
              return res.status(500).json({
                success: false,
                message: "Database error while updating approval workflow status.",
                error_code: "DB_ERROR_APPROVAL_UPDATE",
                error: err.message,
              });
            }
            console.log("Approval workflow updated to 'pending'. Plan ID:", planId);

            // Step 5: Fetch the updated specific objective detail and return it.
            const fetchUpdatedSpecificObjectiveDetailQuery = 
              `SELECT * FROM specific_objective_details WHERE specific_objective_detail_id = ? AND user_id = ?`;
            con.query(fetchUpdatedSpecificObjectiveDetailQuery, [specific_objective_detail_id, user_id], (err, updatedResults) => {
              if (err) {
                console.error("Error fetching updated specific objective detail:", err.stack);
                return res.status(500).json({
                  success: false,
                  message: "Error fetching updated specific objective detail from the database.",
                  error_code: "DB_ERROR_FETCH_UPDATED",
                  error: err.message,
                });
              }
              if (updatedResults.length === 0) {
                console.error("Updated specific objective detail not found. ID:", specific_objective_detail_id);
                return res.status(404).json({
                  success: false,
                  message: "Updated specific objective detail not found. Please try again.",
                  error_code: "UPDATED_SPECIFIC_OBJECTIVE_DETAIL_NOT_FOUND",
                });
              }
              const updatedSpecificObjectiveDetail = updatedResults[0];
              console.log("Fetched updated specific objective detail:", updatedSpecificObjectiveDetail);
              return res.status(200).json({
                success: true,
                message: "Specific objective detail and approval workflow updated successfully.",
                data: updatedSpecificObjectiveDetail,
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error in updatePlan function:", error.stack);
    return res.status(500).json({
      success: false,
      message: `An unexpected error occurred. ${error.message}`,
      error_code: "UNKNOWN_ERROR",
    });
  }
};
  


const addReport = async (req, res) => {
  try {
    const user_id = req.user_id; // Get user_id from the request
    const { planId } = req.params; // Get planId from URL parameters
    const updates = req.body; // Get update values from the request body

    // Allowed fields: outcome, execution_percentage, CIoutcome, CIexecution_percentage.
    const allowedUpdates = [
      "outcome",
      "execution_percentage",
      "CIoutcome",
      "CIexecution_percentage"
    ];

    // Filter out invalid fields not present in allowedUpdates.
    const updateFields = Object.keys(updates).filter(field => allowedUpdates.includes(field));

    if (updateFields.length === 0) {
      console.error("No valid fields to update. Only Outcome, Execution Percentage, CIoutcome, and CIexecution_percentage can be updated.");
      return res.status(400).json({
        success: false,
        message: "No valid fields to update. Ensure you're updating only outcome fields.",
        error_code: "NO_VALID_FIELDS"
      });
    }

    // Step 1: Fetch specific_objective_detail_id from the plans table for the current plan and user.
    const fetchSpecificObjectiveDetailIDQuery = `
      SELECT specific_objective_detail_id 
      FROM plans 
      WHERE plan_id = ? AND user_id = ?
    `;
    con.query(fetchSpecificObjectiveDetailIDQuery, [planId, user_id], (err, planResults) => {
      if (err) {
        console.error("Error fetching plan:", err.stack);
        return res.status(500).json({
          success: false,
          message: "Database error while fetching the plan.",
          error_code: "DB_ERROR_PLAN_FETCH",
          error: err.message
        });
      }

      if (planResults.length === 0) {
        console.error("Plan not found or unauthorized access. Plan ID:", planId);
        return res.status(404).json({
          success: false,
          message: "Plan not found or you don't have permission to update this plan.",
          error_code: "PLAN_NOT_FOUND_OR_UNAUTHORIZED"
        });
      }

      const specific_objective_detail_id = planResults[0].specific_objective_detail_id;

      // Step 2: Check if the specific objective detail exists and belongs to the user.
      const checkSpecificObjectiveDetailQuery = `
        SELECT * FROM specific_objective_details 
        WHERE specific_objective_detail_id = ? AND user_id = ?
      `;
      con.query(checkSpecificObjectiveDetailQuery, [specific_objective_detail_id, user_id], (err, specificObjectiveDetailResults) => {
        if (err) {
          console.error("Error checking specific objective detail existence:", err.stack);
          return res.status(500).json({
            success: false,
            message: "Error while checking specific objective detail existence in the database.",
            error_code: "DB_ERROR_CHECK",
            error: err.message
          });
        }

        if (specificObjectiveDetailResults.length === 0) {
          console.error("Specific objective detail not found or unauthorized. Specific Objective Detail ID:", specific_objective_detail_id);
          return res.status(404).json({
            success: false,
            message: "Specific objective detail not found or you don't have permission to update this detail.",
            error_code: "SPECIFIC_OBJECTIVE_DETAIL_NOT_FOUND_OR_UNAUTHORIZED"
          });
        }

        // Step 3: Update the specific objective details using only the allowed outcome fields.
        const updateQuery = `
          UPDATE specific_objective_details 
          SET ${updateFields.map(field => `${field} = ?`).join(", ")}
          WHERE specific_objective_detail_id = ? AND user_id = ?
        `;
        const updateValues = [
          ...updateFields.map(field => updates[field]),
          specific_objective_detail_id,
          user_id
        ];

        con.query(updateQuery, updateValues, (err, result) => {
          if (err) {
            console.error("Error during update:", err.stack);
            return res.status(500).json({
              success: false,
              message: "Database error while updating the specific objective detail.",
              error_code: "DB_ERROR_UPDATE",
              error: err.message
            });
          }

          if (result.affectedRows === 0) {
            console.warn("No updates applied. Either the specific objective detail does not exist or no changes were made.");
            return res.status(404).json({
              success: false,
              message: "No updates were applied. The specific objective detail may not exist or no changes were made.",
              error_code: "NO_UPDATES_APPLIED"
            });
          }

          console.log("Specific objective detail updated successfully. Specific Objective Detail ID:", specific_objective_detail_id);

          // Step 4: Automatically update the plan's reporting column to 'active' and report_progress column to 'on_progress'
          const updatePlanQuery = `
            UPDATE plans
            SET reporting = 'active', report_progress = 'on_progress'
            WHERE plan_id = ? AND user_id = ?
          `;
          con.query(updatePlanQuery, [planId, user_id], (err, planUpdateResult) => {
            if (err) {
              console.error("Error updating reporting status in plans table:", err.stack);
              return res.status(500).json({
                success: false,
                message: "Error while updating reporting status in the plans table.",
                error_code: "DB_ERROR_PLAN_UPDATE",
                error: err.message
              });
            }

            console.log("Reporting status updated to 'active' and report_progress set to 'on_progress'. Plan ID:", planId);

            // New Step: Update supervisor_id in plans table with the supervisor id of the employee associated with the user.
            const getSupervisorQuery = `
              SELECT e.supervisor_id FROM employees e
              JOIN users u ON e.employee_id = u.employee_id
              WHERE u.user_id = ?
            `;
            con.query(getSupervisorQuery, [user_id], (err, supervisorResults) => {
              if (err) {
                console.error("Error fetching supervisor id:", err.stack);
                return res.status(500).json({
                  success: false,
                  message: "Database error while fetching supervisor id.",
                  error_code: "DB_ERROR_SUPERVISOR_FETCH",
                  error: err.message
                });
              }

              if (supervisorResults.length === 0) {
                console.error("Supervisor id not found for user, user_id:", user_id);
                return res.status(404).json({
                  success: false,
                  message: "Supervisor id not found for user.",
                  error_code: "SUPERVISOR_NOT_FOUND"
                });
              }

              const supervisor_id = supervisorResults[0].supervisor_id;
              const updateSupervisorQuery = `
                UPDATE plans
                SET supervisor_id = ?
                WHERE plan_id = ? AND user_id = ?
              `;
              con.query(updateSupervisorQuery, [supervisor_id, planId, user_id], (err, supervisorUpdateResult) => {
                if (err) {
                  console.error("Error updating supervisor id in plans table:", err.stack);
                  return res.status(500).json({
                    success: false,
                    message: "Database error while updating supervisor id in plans.",
                    error_code: "DB_ERROR_SUPERVISOR_UPDATE",
                    error: err.message
                  });
                }

                console.log("Supervisor id updated in plans table:", supervisor_id);

                // Step 5: Update the related approval workflow status to 'pending'
                const updateApprovalWorkflowQuery = `
                  UPDATE approvalworkflow
                  SET status = 'pending'
                  WHERE plan_id = ?
                `;
                con.query(updateApprovalWorkflowQuery, [planId], (err, approvalResult) => {
                  if (err) {
                    console.error("Error updating approval workflow:", err.stack);
                    return res.status(500).json({
                      success: false,
                      message: "Database error while updating approval workflow status.",
                      error_code: "DB_ERROR_APPROVAL_UPDATE",
                      error: err.message
                    });
                  }

                  console.log("Approval workflow status updated to 'pending'. Plan ID:", planId);

                  // Step 6: Fetch the updated specific objective detail for confirmation.
                  const fetchUpdatedDetailQuery = `
                    SELECT * FROM specific_objective_details 
                    WHERE specific_objective_detail_id = ? AND user_id = ?
                  `;
                  con.query(fetchUpdatedDetailQuery, [specific_objective_detail_id, user_id], (err, updatedDetailResults) => {
                    if (err) {
                      console.error("Error fetching updated specific objective detail:", err.stack);
                      return res.status(500).json({
                        success: false,
                        message: "Error fetching updated specific objective detail from the database.",
                        error_code: "DB_ERROR_FETCH_UPDATED",
                        error: err.message
                      });
                    }

                    if (updatedDetailResults.length === 0) {
                      console.error("Updated specific objective detail not found. Specific Objective Detail ID:", specific_objective_detail_id);
                      return res.status(404).json({
                        success: false,
                        message: "Updated specific objective detail not found. Please try again.",
                        error_code: "UPDATED_SPECIFIC_OBJECTIVE_DETAIL_NOT_FOUND"
                      });
                    }

                    const updatedSpecificObjectiveDetail = updatedDetailResults[0];
                    console.log("Fetched updated specific objective detail:", updatedSpecificObjectiveDetail);

                    return res.status(200).json({
                      success: true,
                      message: "Specific objective detail updated and report submitted successfully. Reporting status set to 'active', report_progress updated to 'on_progress', supervisor updated, and approval workflow updated.",
                      data: updatedSpecificObjectiveDetail
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error in addReport function:", error.stack);
    return res.status(500).json({
      success: false,
      message: `An unexpected error occurred. ${error.message}`,
      error_code: "UNKNOWN_ERROR"
    });
  }
};










module.exports = {getAllPlansDeclined,getApprovedOrgPlans,getPlanDetail, getAllOrgPlans,getAllPlans, deletePlan, updatePlan,getPlanById,addReport };
