const con = require("../models/db");

// Add Objective
const jwt = require("jsonwebtoken");

const addGoals= (req, res) => {
  const { name, description, year, quarter } = req.body;

  if (!name || !description || !year || !quarter) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  jwt.verify(token, "hayaltamrat@27", (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user_id = decoded.user_id;
    console.log("user_id from token:", user_id);

    con.query(
      "SELECT employee_id FROM users WHERE user_id = ?",
      [user_id],
      (err, result) => {
        if (err) {
          console.error("Database Error during user lookup:", err);
          return res
            .status(500)
            .json({ message: "Error finding employee_id for the user" });
        }

        if (result.length === 0) {
          return res.status(400).json({ message: "User not found" });
        }

        const employee_id = result[0].employee_id;
        console.log("Employee ID:", employee_id);

        const query = `
          INSERT INTO goals (
            user_id, name, description, year, quarter, created_at, updated_at, employee_id
          ) 
          VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
        `;

        const values = [user_id, name, description, year, quarter, employee_id];

        con.query(query, values, (err, result) => {
          if (err) {
            console.error("Error adding goal:", err);
            return res.status(500).json({ message: "Error adding goals" });
          }

          const goal_id = result.insertId;
          console.log("Goal adde d successfully:", goal_id);

          res.status(201).json({
            message: "goal added successfully",
            goal_id: goal_id,
          });
        });
      }
    );
  });
};





// Add Objective
const addObjectives = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  jwt.verify(token, "hayaltamrat@27", (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user_id = decoded.user_id;
    const { goal, name, description } = req.body;

    if (!goal || !name || !description) {
      return res.status(400).json({ message: "Goal ID, objective name, and description are required" });
    }

    const query = `
      INSERT INTO objectives (user_id, goal_id, name, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    con.query(query, [user_id, goal, name, description], (err, result) => {
      if (err) {
        console.error("Database Error:", err.message);
        if (err.code === 'ER_NO_REFERENCED_ROW') {
          return res.status(400).json({ message: "Invalid goal ID provided" });
        }
        return res.status(500).json({ message: "Error adding goal" });
      }

      res.status(201).json({ message: "Objective created successfully", goal_id: result.insertId });
    });
  });
};





// Add specific objectives
const addSpecificObjectives = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  jwt.verify(token, "hayaltamrat@27", (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user_id = decoded.user_id;
    const { objective_id, specific_objective_name, view} = req.body;

    if (!objective_id || !specific_objective_name || !view) {
      return res.status(400).json({
        message: "Objective ID and specific_objective_name are required fields.",
      });
    }

    const query = `
  INSERT INTO specific_objectives (user_id, objective_id, specific_objective_name, created_at, updated_at, view)
  VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
`;
const values = [user_id, objective_id, specific_objective_name, view];

    
    // Perform the query only once
    con.query(query, values, (err, result) => {
      if (err) {
        console.error("Database Error:", err.message, err);

        if (err.code === "ER_NO_REFERENCED_ROW") {
          return res.status(400).json({
            message: "Invalid objective ID provided.",
          });
        }

        return res.status(500).json({
          message: "An error occurred while adding the specific objective. Please try again.",
        });
      }

      res.status(201).json({
        message: "Specific Objective created successfully.",
        specific_objective_id: result.insertId,
      });
    });
  });
};


// Add Specific specific_objective_detail
const addspecificObjectiveDetails = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  jwt.verify(token, "hayaltamrat@27", (err, decoded) => {
    if (err) {
      console.error("JWT Error:", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user_id = decoded.user_id;
    console.log("user_id from token:", user_id);

    let { specific_objective } = req.body;

    if (!Array.isArray(specific_objective)) {
      if (req.body.specific_objective_id) {
        specific_objective = [req.body];
      } else {
        return res.status(400).json({ message: "specific_objective array or single specific_objective is required." });
      }
    }

    if (specific_objective.length === 0) {
      return res.status(400).json({ message: "specific_objective array cannot be empty." });
    }

    const getEmployeeNameQuery = `
      SELECT e.fname 
      FROM employees e
      JOIN users u ON e.employee_id = u.employee_id
      WHERE u.user_id = ?
    `;

    con.query(getEmployeeNameQuery, [user_id], (err, employeeResults) => {
      if (err) {
        console.error("Error fetching employee name:", err.message);
        return res.status(500).json({ message: "Error fetching employee name from the database.", error: err.message });
      }

      if (employeeResults.length === 0) {
        return res.status(404).json({ message: "Employee not found for the given user." });
      }

      const employeeName = employeeResults[0].fname;

      // Validate required fields
      const validationErrors = specific_objective
        .map((item) => {
          const requiredFields = [
            'specific_objective_id',
            'specific_objective_detailname',
            'details',
            'baseline',
            'plan',
            'measurement',
            'year',
            'month',
            'day'
          ];
          
          const missingFields = requiredFields.filter(field => !item[field]);
          return missingFields.length ? `Missing required fields: ${missingFields.join(', ')}` : null;
        })
        .filter(error => error !== null);

      if (validationErrors.length > 0) {
        return res.status(400).json({ message: "Validation failed.", errors: validationErrors });
      }

      // Process each specific objective
      const processObjectives = specific_objective.map((item) => {
        return new Promise((resolve, reject) => {
          // Query to get goal_id through the relationship chain
          const getGoalIdQuery = `
            SELECT o.goal_id
            FROM specific_objectives so
            JOIN objectives o ON so.objective_id = o.objective_id
            WHERE so.specific_objective_id = ?
          `;

          con.query(getGoalIdQuery, [item.specific_objective_id], (err, goalResults) => {
            if (err) {
              console.error("Error fetching goal_id:", err.message);
              reject(`Error fetching goal_id for specific objective: ${item.specific_objective_id}`);
              return;
            }

            if (goalResults.length === 0) {
              reject(`No goal found for specific objective: ${item.specific_objective_id}`);
              return;
            }

            const goal_id = goalResults[0].goal_id;

            const insertQuery = `
              INSERT INTO specific_objective_details (
                user_id, goal_id, specific_objective_id, specific_objective_detailname, 
                details, baseline, plan, measurement, created_by, year, month, day, 
                deadline, status, plan_type, cost_type, income_exchange, employment_type, 
                incomeName, costName, CIbaseline, CIplan
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const sqlParameters = [
              user_id,
              goal_id,
              item.specific_objective_id,
              item.specific_objective_detailname,
              item.details,
              item.baseline,
              item.plan,
              item.measurement,
              employeeName,
              item.year,
              item.month,
              item.day,
              item.deadline || null,
              item.status || "Pending",
              item.plan_type || null,
              item.cost_type || null,
              item.income_exchange || null,
              item.employment_type || null,
              item.incomeName || null,
              item.costName || null,
              item.CIbaseline || null,
              item.CIplan || null
            ];

            con.query(insertQuery, sqlParameters, (err, result) => {
              if (err) {
                console.error("Database Error:", err.message);
                reject(`Database error for specific objective detail: ${item.specific_objective_detailname}`);
              } else {
                resolve(result.insertId);
              }
            });
          });
        });
      });

      Promise.all(processObjectives)
        .then((insertIds) => {
          res.status(201).json({ 
            message: "Specific objective details added successfully.", 
            insertIds 
          });
        })
        .catch((err) => {
          res.status(500).json({ 
            message: "Error processing specific objective details.", 
            error: err 
          });
        });
    });
  });
};``








module.exports = {
  addGoals,
  addObjectives,
  addspecificObjectiveDetails,
  addSpecificObjectives
};




















