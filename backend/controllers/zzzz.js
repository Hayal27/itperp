const getPlanDetail = async (req, res) => {
  try {
    const { id } = req.params;

   const getPlanQuery = `
        SELECT 
          p.plan_id AS Plan_ID,
          p.user_id AS User_ID,
          p.department_id AS Department_ID,
          sod.plan AS Plan,
          -- Fields from specific_objective_details with consistent aliasing
          sod.details AS Details,
          sod.measurement AS Measurement,
          sod.baseline AS Baseline,
          sod.deadline AS Deadline,
          sod.priority AS Priority,
          sod.progress AS Progress,
          sod.specific_objective_detailname AS specObjectiveDetail,
          sod.plan_type,
          sod.income_exchange AS income_exchange,
          sod.cost_type,
          sod.employment_type,
          sod.incomeName,
          sod.costName,
          sod.attribute,
          -- Reorder the CI fields so that CIbaseline is selected first,
          -- then CIplan, then CIoutcome. Use exact aliases.
          sod.CIbaseline AS CIBaseline,
          sod.CIplan AS CIplan,
          sod.CIoutcome AS CIoutcome,
          -- Other related fields
          o.description AS Description,
          aw.comment AS Comment,
          p.created_at AS Created_At,
          p.updated_at AS Updated_At,
          g.year AS year,
          g.quarter AS Quarter,
          sod.created_by AS Created_By,
          p.status AS Status,
          d.name AS Department,
          o.name AS Objective_Name,
          g.name AS Goal_Name,
          so.specific_objective_name AS Specific_Objective_Name,
          so.specific_objective_name AS Specific_Objective_NameDetail,
          /* Calculated type name field */
          CASE 
            WHEN sod.plan_type = 'cost' THEN sod.costName
            WHEN sod.plan_type = 'income' THEN sod.incomeName
            ELSE NULL 
          END AS type_name
        FROM plans p
        LEFT JOIN departments d ON p.department_id = d.department_id 
        LEFT JOIN objectives o ON p.objective_id = o.objective_id 
        LEFT JOIN goals g ON p.goal_id = g.goal_id
        LEFT JOIN approvalworkflow aw ON p.plan_id = aw.plan_id
        LEFT JOIN specific_objectives so ON p.specific_objective_id = so.specific_objective_id
        LEFT JOIN specific_objective_details sod ON p.specific_objective_detail_id = sod.specific_objective_detail_id
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

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Plan not found.",
        });
      }

      // Retrieve plan details and parse numerical values if needed
      const plan = results[0];
      
      if (plan.CIbaseline) plan.CIbaseline = parseFloat(plan.CIbaseline);
      if (plan.CIplan) plan.CIplan = parseFloat(plan.CIplan);
      if (plan.CIoutcome) plan.CIoutcome = parseFloat(plan.CIoutcome);

      res.status(200).json({
        success: true,
        plan
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





