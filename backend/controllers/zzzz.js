const getSubmittedReports = async (req, res) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(403).json({ 
        success: false, 
        message: "No token provided. Authorization token is required to access the plans.", 
        error_code: "TOKEN_MISSING" 
      });
    }
  
    try {
      const user_id = await verifyToken(token); // Get user_id from token
  
      // Get employee_id from the users table using user_id
      const getEmployeeQuery = "SELECT employee_id FROM users WHERE user_id = ?";
      con.query(getEmployeeQuery, [user_id], async (err, results) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error fetching employee_id from users table.",
            error_code: "DB_ERROR",
            error: err.message
          });
        }
  
        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Employee not found. Unable to fetch employee details based on the provided user_id.",
            error_code: "EMPLOYEE_NOT_FOUND"
          });
        }
  
        const supervisor_id = results[0].employee_id;
  
        // Query to get reports awaiting approval
        const query = `
        SELECT r.report_id, r.objective, r.goal, r.details, aw.status
        FROM reports r
        JOIN ApprovalWorkflow aw ON r.report_id = aw.report_id
        WHERE r.supervisor_id = ? AND aw.approver_id = ? AND aw.status = 'Pending'
      `;
        
        con.query(query, [supervisor_id, supervisor_id], (err, results) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error fetching reports from database.",
              error_code: "DB_ERROR",
              error: err.message
            });
          }
  
          if (results.length === 0) {
            return res.status(404).json({
              success: false,
              message: "No reports found awaiting approval for this supervisor.",
              error_code: "NO_PLANS_FOUND"
            });
          }
  
          res.json({ success: true, reports: results });
        });
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Unknown error occurred while fetching submitted reports. Error: ${error.message}',
        error_code: "UNKNOWN_ERROR"
      });
    }
  };