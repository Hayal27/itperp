const jwt = require("jsonwebtoken");
const con = require("../models/db");

const addReport = (req, res) => {
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
        console.error('JWT Error:', err); // Log JWT errors
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
  
      const user_id = decoded.user_id; // Assuming the user_id is in the token payload
      console.log('user_id from token:', user_id);
  
      // Query the plans table to find an approved plan for the current user
      const planQuery = `
        SELECT plan_id, department_id 
        FROM plans 
        WHERE user_id = ? AND status = 'Approved'
      `;
      
      con.query(planQuery, [user_id], (err, planResults) => {
        if (err) {
          console.error('Database Error during plan lookup:', err); // Log DB errors
          return res.status(500).json({ message: 'Error finding plans for the user' });
        }
  
        if (planResults.length === 0) {
          return res.status(404).json({ message: 'No approved plans found for this user' });
        }
  
        // Use the first approved plan (or you can let the user specify if multiple plans exist)
        const { plan_id, department_id } = planResults[0];
        console.log('Selected Plan ID:', plan_id);
        console.log('Department ID from Plan:', department_id);
  
        // Insert the report into the database
        const reportQuery = `
          INSERT INTO reports (
            plan_id, user_id, department_id, objective, goal, row_no, details, measurement, baseline,
            plan, outcome, execution_percentage, description, status, comment, created_at, updated_at, year, quarter
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?)
        `;
  
        const reportValues = [
          plan_id, // Automatically fetched plan_id
          user_id, // user_id from JWT
          department_id, // department_id from the plan
          objective, // from req.body
          goal, // from req.body
          row_no, // from req.body
          details, // from req.body
          measurement, // from req.body
          baseline, // from req.body
          plan, // from req.body
          outcome, // from req.body
          execution_percentage, // from req.body
          description, // from req.body
          'Pending', // status (you can change this as needed)
          null, // comment (optional, set to null if not provided)
          year, // from req.body
          quarter // from req.body
        ];
  
        console.log("Final Query to be executed: ", reportQuery); // Log the final query
        console.log("Values to be inserted: ", reportValues); // Log the values array
  
        con.query(reportQuery, reportValues, (err, result) => {
          if (err) {
            console.error('Error adding report:', err); // Log errors when inserting the report
            return res.status(500).json({ message: 'Error adding report' });
          }
  
          console.log('Report added successfully:', result); // Log the success message
          const report_id = result.insertId; // Get the inserted report's ID
  
          res.status(201).json({ message: 'Report added successfully', report_id });
        });
      });
    });
  };

  // Fetch approved plans for the logged-in user
const getApprovedPlans = (req, res) => {
    // Extract the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is required' });
    }
  
    // Verify the token
    jwt.verify(token, 'hayaltamrat@27', (err, decoded) => {
      if (err) {
        console.error('JWT Error:', err);
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
  
      const user_id = decoded.user_id; // Assuming user_id is in the JWT payload
      console.log('User ID from token:', user_id);
  
      // Fetch approved plans for the user
      const query = `
        SELECT plan_id, objective, year, quarter
        FROM plans
        WHERE user_id = ? AND status = 'Approved'
      `;
  
      con.query(query, [user_id], (err, results) => {
        if (err) {
          console.error('Database Error:', err);
          return res.status(500).json({ message: 'Error fetching approved plans' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'No approved plans found' });
        }
  
        res.status(200).json({ plans: results });
      });
    });
  };
  
  module.exports = {
    addReport,
    getApprovedPlans
  };
  