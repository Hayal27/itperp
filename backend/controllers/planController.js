const jwt = require("jsonwebtoken");
const con = require("../models/db");

const addPlan = (req, res) => {
  // Destructure necessary fields from request body
  const { objective, goal, row_no, details, measurement, baseline, plan, outcome, execution_percentage, description, year, quarter } = req.body;

  // Check if all required fields are provided in the request body
  if (!objective || !goal || !row_no || !details || !measurement || !baseline || !plan || !outcome || !execution_percentage || !description || !year || !quarter) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the token is provided in the Authorization header
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  // Verify the token and extract the user_id
  jwt.verify(token, 'hayaltamrat@27', (err, decoded) => {
    if (err) {
      console.error('JWT Error:', err);  // Log JWT errors
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user_id = decoded.user_id;  // Assuming the user_id is in the token payload
    console.log('user_id from token:', user_id);

    // Query the users table to get the employee_id based on the user_id
    con.query('SELECT employee_id FROM users WHERE user_id = ?', [user_id], (err, result) => {
      if (err) {
        console.error('Database Error during user lookup:', err);  // Log DB errors
        return res.status(500).json({ message: 'Error finding employee_id for the user' });
      }

      if (result.length === 0) {
        return res.status(400).json({ message: 'User not found' });
      }

      const current_employee_id = result[0].employee_id;  // Retrieve the employee_id of the current user
      console.log('Current Employee ID:', current_employee_id);

      // Query the employee table to get the employee's first name (fname)
      con.query('SELECT fname FROM employees WHERE employee_id = ?', [current_employee_id], (err, result) => {
        if (err) {
          console.error('Database Error during employee lookup:', err);  // Log DB errors
          return res.status(500).json({ message: 'Error fetching employee details' });
        }

        if (result.length === 0) {
          return res.status(400).json({ message: 'Employee not found' });
        }

        const employee_first_name = result[0].fname;  // Retrieve the first name (fname)
        console.log('Employee First Name:', employee_first_name);

        // Query the employee table to get the supervisor_id and department_id based on the current user's employee_id
        con.query(
          'SELECT supervisor_id, department_id FROM employees WHERE employee_id = ?',
          [current_employee_id],
          (err, result) => {
            if (err) {
              console.error('Database Error during supervisor lookup:', err);  // Log DB errors
              return res.status(500).json({ message: 'Error finding supervisor and department for the employee' });
            }

            if (result.length === 0) {
              return res.status(400).json({ message: 'Employee does not have a supervisor or department' });
            }

            const { supervisor_id, department_id } = result[0];  // Retrieve supervisor_id and department_id
            console.log('Supervisor ID:', supervisor_id);
            console.log('Department ID:', department_id);

            // Query the employees table again to get the employee_id of the supervisor
            con.query(
              'SELECT employee_id FROM employees WHERE employee_id = ?',
              [supervisor_id],
              (err, result) => {
                if (err) {
                  console.error('Database Error during supervisor employee lookup:', err);  // Log DB errors
                  return res.status(500).json({ message: 'Error finding supervisor\'s employee_id' });
                }

                if (result.length === 0) {
                  return res.status(400).json({ message: 'Supervisor not found' });
                }

                const supervisor_employee_id = result[0].employee_id;  // Retrieve the supervisor's employee_id
                console.log('Supervisor Employee ID:', supervisor_employee_id);

                // Now, let's insert the plan into the database
                const query = `
                  INSERT INTO plans (
                    user_id, department_id, objective, goal, row_no, details, measurement, baseline,
                    plan, outcome, execution_percentage, description, status, comment, created_at,
                    updated_at, year, quarter, supervisor_id, employee_id,  created_by
                  ) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?)
                `;

                const values = [
                  user_id,                // user_id from JWT
                  department_id,          // department_id from employees table
                  objective,              // from req.body
                  goal,                   // from req.body
                  row_no,                 // from req.body
                  details,                // from req.body
                  measurement,            // from req.body
                  baseline,               // from req.body
                  plan,                   // from req.body
                  outcome,                // from req.body
                  execution_percentage,   // from req.body
                  description,            // from req.body
                  'Pending',              // status (you can change this as needed)
                  null,                   // comment (optional, set to null if not provided)
                  year,                   // from req.body
                  quarter,                // from req.body
                  supervisor_id,          // supervisor_id from employees table
                  supervisor_employee_id, // supervisor's employee_id
                                    // parent_plan_id (set to null if not relevant)
                  employee_first_name     // created_by (insert employee's first name instead of employee_id)
                ];

                console.log("Final Query to be executed: ", query);   // Log the final query
                console.log("Values to be inserted: ", values);       // Log the values array

                // Insert the plan into the database
                con.query(query, values, (err, result) => {
                  if (err) {
                    console.error('Error adding plan:', err);  // Log errors when inserting the plan
                    return res.status(500).json({ message: 'Error adding plan' });
                  }

                  console.log('Plan added successfully:', result);  // Log the success message
                  const plan_id = result.insertId;  // Get the inserted plan's ID

                  // After the plan is inserted, insert a corresponding entry into the ApprovalWorkflow table
                  const approvalWorkflowQuery = `
                    INSERT INTO ApprovalWorkflow (plan_id, approver_id, status)
                    VALUES (?, ?, 'Pending')
                  `;

                  // Insert the approval workflow for the plan
                  con.query(approvalWorkflowQuery, [plan_id, supervisor_id], (err, result) => {
                    if (err) {
                      console.error('Error inserting approval workflow:', err);
                      return res.status(500).json({ message: 'Error creating approval workflow' });
                    }

                    console.log('Approval workflow created successfully for plan:', plan_id);
                    res.status(201).json({ message: 'Plan and approval workflow added successfully', plan_id });
                  });
                });
              }
            );
          }
        );
      });
    });
  });
};

module.exports = {
  addPlan,
};
