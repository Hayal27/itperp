const con = require("../models/db");
// Handles database errors by responding with HTTP 500 and logging the error
const handleDatabaseError = (err, res, operation) => {
  console.error(`Error during ${operation}:`, err);
  return res.status(500).json({
    message: `Error during ${operation}`,
    error: err.message,
    code: err.code
  });
};

// Handles cases when the query returns empty results, respond with a 404
//Middleware to handle empty results
const handleEmptyResults = (results, res, defaultValues) => {
  if (!results || results.length === 0) {
    res.json(defaultValues);
    return true;
  }
  return false;
};
// Builds the join clause based on the request parameters
const getJoinClause = (req) => {
  let joinClause = BASE_JOIN;
  if (req.query.department) {
    joinClause += "\nJOIN plans p ON g.goal_id = p.goal_id";
  }
  return joinClause;
};




// Validate period parameters from the query
const validatePeriodParams = (req, res) => {
  const { year, quarter } = req.query;
  if (!year || !quarter) {
    res.status(400).json({
      message: "Year and quarter are required parameters"
    });
    return false;
  }
  return true;
};

// const handleEmptyResults = (results, res, defaultValue = null) => {
//   if (!results || results.length === 0) {
//     return res.status(404).json({
//       message: "No data found for the specified criteria",
//       data: defaultValue
//     });
//   }
//   return false;
// };

// Base JOIN clause for proper table relationships (always included joins)
const BASE_JOIN = `
  FROM specific_objective_details sod
  JOIN specific_objectives so ON sod.specific_objective_id = so.specific_objective_id
  JOIN objectives o ON so.objective_id = o.objective_id
  JOIN goals g ON o.goal_id = g.goal_id`;

  const getFilterConditions = (req) => {
    const conditions = [];
  
    if (req.query.year) {
      conditions.push(`g.year = '${req.query.year}'`);
    }
  
    // Fix: Check for specific_objective_name to make it consistent with the query value sent by the client.
    if (req.query.specific_objective_name) {
      conditions.push(`so.specific_objective_name = '${req.query.specific_objective_name}'`);
    }
  
    // Check for a valid year_range format (e.g., "2020-2023")
    if (req.query.year_range) {
      const years = req.query.year_range.split('-');
      if (years.length === 2) {
        conditions.push(`g.year BETWEEN '${years[0]}' AND '${years[1]}'`);
      }
    }
  
    if (req.query.quarter) {
      conditions.push(`g.quarter = '${req.query.quarter}'`);
    }
  
    // Modify the department filter to use sod.department_id rather than a column from the departments table.
    if (req.query.department) {
      conditions.push(`sod.department_id = '${req.query.department}'`);
    }
  
    if (req.query.created_by) {
      conditions.push(`sod.created_by = '${req.query.created_by}'`);
    }
  
    if (req.query.view) {
      conditions.push(`so.view = '${req.query.view}'`);
    }
  
    return conditions.length > 0 ? " AND " + conditions.join(" AND ") : "";
  };

// Display Total Cost (summing CIoutcome) with additional filters
const displayTotalCost = async (req, res) => {
  try {
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    const query = `
      SELECT COALESCE(SUM(sod.CIoutcome), 0) as total_cost
      ${joinClause}
      WHERE sod.plan_type = 'cost' ${extraFilters}
    `;
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'fetching total cost');
      if (handleEmptyResults(results, res, { total_cost: 0 })) return;
      res.json(results[0].total_cost);
    });
  } catch (error) {
    console.error('Unexpected error in displayTotalCost:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Updated function: Display Total Cost Plan (summing CIplan) with additional filters
const displayTotalCostPlan = async (req, res) => {
  try {
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    const query = `
      SELECT COALESCE(SUM(sod.CIplan), 0) as total_cost_plan
      ${joinClause}
      WHERE sod.plan_type = 'cost' ${extraFilters}
    `;
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'fetching total cost plan');
      if (handleEmptyResults(results, res, { total_cost_plan: 0 })) return;
      res.json(results[0].total_cost_plan);
    });
  } catch (error) {
    console.error('Unexpected error in displayTotalCostPlan:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Updated function: Compare Total Cost Plan (CIplan) and CI Outcome (CIoutcome) with additional filters

const compareCostPlanOutcome = async (req, res) => {
  try {
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    const query = `
      SELECT 
        sod.department_id,
        sod.description,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIplan END), 0) as total_cost_plan,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIoutcome END), 0) as total_cost_outcome,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIplan END), 0) - COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIoutcome END), 0) as difference,
        CASE 
          WHEN COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIplan END), 0) = 0 THEN 0
          ELSE (COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIoutcome END), 0) / COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIplan END), 0)) * 100
        END as excution_persentage
      ${joinClause}
      WHERE sod.plan_type = 'cost' ${extraFilters}
      GROUP BY sod.department_id, sod.description
    `;
    
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'comparing cost plan and outcome');
      
      if (handleEmptyResults(results, res, {
          total_cost_plan: 0, 
          total_cost_outcome: 0,
          difference: 0,
          excution_persentage: 0
      })) return;
      
      res.json(results);
    });
  } catch (error) {
    console.error('Unexpected error in compareCostPlanOutcome:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};






// costPlan_Outcome_difference_regular_budget
const costPlanOutcomeDifferenceRegularBudget = async (req, res) => {
  try {
    // Retrieve joinClause and extraFilters from the request.
    // Using getJoinClause which returns the BASE_JOIN already.
    let joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req) || "";

    // If joinClause is missing a FROM clause, fallback to the BASE_JOIN.
    if (!joinClause || !/FROM\s+/i.test(joinClause)) {
      joinClause = BASE_JOIN;
      console.warn("joinClause not provided or missing FROM clause; using default BASE_JOIN");
    }

    // Build the SQL query string. This groups rows by costName.
    // No extra join is appended here.
    const query = `
      SELECT 
        sod.costName,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIplan END), 0) AS plan,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIoutcome END), 0) AS outcome,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIplan END), 0) - COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIoutcome END), 0) AS difference
      ${joinClause}
      WHERE 
        sod.plan_type = 'cost' AND 
        sod.cost_type = 'regular_budget' ${extraFilters}
      GROUP BY sod.costName
    `;
    
    console.log("Constructed Query:", query);

    con.query(query, (err, results) => {
      if (err) {
        console.error("Database error occurred:", err);
        return handleDatabaseError(err, res, "comparing cost plan and outcome total_regular");
      }
      
      // Check if the results are empty. If so, return default structured response.
      if (handleEmptyResults(results, res, { data: [], totals: { plan: 0, outcome: 0, difference: 0 } })) {
        return;
      }
      
      // Log the raw SQL results for debugging purposes.
      console.log("SQL Query Results:", results);
      
      // Compute overall totals by iterating over the grouped results.
      let totalPlan = 0;
      let totalOutcome = 0;
      results.forEach(row => {
        totalPlan += Number(row.plan);
        totalOutcome += Number(row.outcome);
      });
      const totalDifference = totalPlan - totalOutcome;
      
      // Build the final response object.
      const responseData = {
        data: results, // array of { costName, plan, outcome, difference }
        totals: {
          plan: totalPlan,
          outcome: totalOutcome,
          difference: totalDifference
        }
      };
      
      // Log computed totals.
      console.log("Computed Totals - Total Plan:", totalPlan, "Total Outcome:", totalOutcome, "Total Difference:", totalDifference);
      
      // Send the computed data to the frontend.
      res.json(responseData);
    });
    
  } catch (error) {
    console.error("Unexpected error in costPlanOutcomeDifferenceRegularBudget:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const costPlanOutcomeDifferenceCapitalBudget = async (req, res) => {
  try {
    // Retrieve joinClause and extraFilters from the request.
    // Using getJoinClause which returns the BASE_JOIN already.
    let joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req) || "";

    // If joinClause is missing a FROM clause, fallback to the BASE_JOIN.
    if (!joinClause || !/FROM\s+/i.test(joinClause)) {
      joinClause = BASE_JOIN;
      console.warn("joinClause not provided or missing FROM clause; using default BASE_JOIN");
    }

    // Build the SQL query string. This groups rows by costName.
    // No extra join is appended here.
    const query = `
      SELECT 
        sod.costName,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIplan END), 0) AS plan,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIoutcome END), 0) AS outcome,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIplan END), 0) - COALESCE(SUM(CASE WHEN sod.plan_type = 'cost' THEN sod.CIoutcome END), 0) AS difference
      ${joinClause}
      WHERE 
        sod.plan_type = 'cost' AND 
        sod.cost_type = 'capital_project_budget' ${extraFilters}
      GROUP BY sod.costName
    `;
    
    console.log("Constructed Query:", query);

    con.query(query, (err, results) => {
      if (err) {
        console.error("Database error occurred:", err);
        return handleDatabaseError(err, res, "comparing cost plan and outcome total_capital");
      }
      
      // Check if the results are empty. If so, return default structured response.
      if (handleEmptyResults(results, res, { data: [], totals: { plan: 0, outcome: 0, difference: 0 } })) {
        return;
      }
      
      // Log the raw SQL results for debugging purposes.
      console.log("SQL Query Results:", results);
      
      // Compute overall totals by iterating over the grouped results.
      let totalPlan = 0;
      let totalOutcome = 0;
      results.forEach(row => {
        totalPlan += Number(row.plan);
        totalOutcome += Number(row.outcome);
      });
      const totalDifference = totalPlan - totalOutcome;
      
      // Build the final response object.
      const responseData = {
        data: results, // array of { costName, plan, outcome, difference }
        totals: {
          plan: totalPlan,
          outcome: totalOutcome,
          difference: totalDifference
        }
      };
      
      // Log computed totals.
      console.log("Computed Totals - Total Plan:", totalPlan, "Total Outcome:", totalOutcome, "Total Difference:", totalDifference);
      
      // Send the computed data to the frontend.
      res.json(responseData);
    });
    
  } catch (error) {
    console.error("Unexpected error in costPlanOutcomeDifferenceCapitalBudget:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};





// Display execution_percentage of Cost
const displayTotalCostExcutionPercentage = async (req, res) => {
  try {
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    const query = `
      SELECT COALESCE(AVG(sod.CIexecution_percentage), 0) AS average_cost_CIexecution_percentage
      ${joinClause}
      WHERE sod.plan_type = 'cost' ${extraFilters}
    `;
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'fetching average CIexecution_percentage');
      if (handleEmptyResults(results, res, { average_cost_CIexecution_percentage: 0 })) return;
      console.log('Fetched average cost execution percentage:', results[0].average_cost_CIexecution_percentage);
      res.json({ averageCostCIExecutionPercentage: results[0].average_cost_CIexecution_percentage });
    });
  } catch (error) {
    console.error('Unexpected error in displayTotalCostExcutionPercentage:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Display Total Income Plan USD (summing CIplan) with additional filters
const displayTotalIncomePlanUSD = async (req, res) => {
  try {
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    const query = `
      SELECT COALESCE(SUM(sod.CIplan), 0) as total_income_plan_USD
      ${joinClause}
      WHERE sod.plan_type = 'income' AND sod.income_exchange = 'USD' ${extraFilters}
    `;
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'fetching total_income_plan_USD');
      if (handleEmptyResults(results, res, { total_income_plan_USD: 0 })) return;
      res.json(results[0].total_income_plan_USD);
    });
  } catch (error) {
    console.error('Unexpected error in displayTotalIncomePlanUSD:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Display Total Income Plan ETB (summing CIplan) with additional filters
const displayTotalIncomeplanETB = async (req, res) => {
  try {
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    const query = `
      SELECT COALESCE(SUM(sod.CIplan), 0) as total_income_plan_ETB
      ${joinClause}
      WHERE sod.plan_type = 'income' AND sod.income_exchange = 'ETB' ${extraFilters}
    `;
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'fetching total_income_plan_ETB');
      if (handleEmptyResults(results, res, { total_income_plan_ETB: 0 })) return;
      res.json(results[0].total_income_plan_ETB);
    });
  } catch (error) {
    console.error('Unexpected error in displayTotalIncomeplanETB:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Display Total Income Outcome USD (summing CIoutcome) with additional filters
const displayTotalIncomeOutcomeUSD = async (req, res) => {
  try {
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    const query = `
      SELECT COALESCE(SUM(sod.CIoutcome), 0) as total_income_outcome_USD
      ${joinClause}
      WHERE sod.plan_type = 'income' AND sod.income_exchange = 'USD' ${extraFilters}
    `;
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'fetching total_income_outcome_USD');
      if (handleEmptyResults(results, res, { total_income_outcome_USD: 0 })) return;
      res.json(results[0].total_income_outcome_USD);
    });
  } catch (error) {
    console.error('Unexpected error in displayTotalIncomeOutcomeUSD:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Display Total Income Outcome ETB (summing CIoutcome) with additional filters
const displayTotalIncomeOutcomeETB = async (req, res) => {
  try {
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    const query = `
      SELECT COALESCE(SUM(sod.CIoutcome), 0) as total_income_outcome_ETB
      ${joinClause}
      WHERE sod.plan_type = 'income' AND sod.income_exchange = 'ETB' ${extraFilters}
    `;
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'fetching total_income_outcome_ETB');
      if (handleEmptyResults(results, res, { total_income_outcome_ETB: 0 })) return;
      res.json(results[0].total_income_outcome_ETB);
    });
  } catch (error) {
    console.error('Unexpected error in displayTotalIncomeOutcomeETB:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Compare Total Income Plan ETB with Total Income Outcome ETB using table, pie chart and bar chart
const compareIncomePlanOutcomeETB = async (req, res) => {
  try {
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    const query = `
      SELECT 
        COALESCE(SUM(sod.CIplan), 0) as total_income_plan_ETB,
        COALESCE(SUM(sod.CIoutcome), 0) as total_income_outcome_ETB
      ${joinClause}
      WHERE sod.plan_type = 'income' AND sod.income_exchange = 'ETB' ${extraFilters}
    `;
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'comparing income plan and outcome (ETB)');
      if (handleEmptyResults(results, res, { total_income_plan_ETB: 0, total_income_outcome_ETB: 0 })) return;
      const { total_income_plan_ETB, total_income_outcome_ETB } = results[0];
      const difference = total_income_plan_ETB - total_income_outcome_ETB;
      res.json({ total_income_plan_ETB, total_income_outcome_ETB, difference });
    });
  } catch (error) {
    console.error('Unexpected error in compareIncomePlanOutcomeETB:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Compare Total Income Plan USD with Total Income Outcome USD using table, pie chart and bar chart
const compareIncomePlanOutcomeUSD = async (req, res) => {
  try {
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    const query = `
      SELECT 
        COALESCE(SUM(sod.CIplan), 0) as total_income_plan_USD,
        COALESCE(SUM(sod.CIoutcome), 0) as total_income_outcome_USD
      ${joinClause}
      WHERE sod.plan_type = 'income' AND sod.income_exchange = 'USD' ${extraFilters}
    `;
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'comparing income plan and outcome (USD)');
      if (handleEmptyResults(results, res, { total_income_plan_USD: 0, total_income_outcome_USD: 0 })) return;
      const { total_income_plan_USD, total_income_outcome_USD } = results[0];
      const difference = total_income_plan_USD - total_income_outcome_USD;
      res.json({ total_income_plan_USD, total_income_outcome_USD, difference });
    });
  } catch (error) {
    console.error('Unexpected error in compareIncomePlanOutcomeUSD:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Compare Total Income (Plan vs Outcome) combining both ETB and USD (converted to ETB)
const compareIncomePlanOutcomeTotal = async (req, res) => {
  try {
    const USD_TO_ETB_RATE = 120; // Exchange rate: 1 USD = 120 ETB
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    
    console.log('Starting income comparison with filters:', { joinClause, extraFilters });
    
    const query = `
      SELECT 
        COALESCE(SUM(CASE 
          WHEN sod.income_exchange = 'ETB' THEN CIplan
          WHEN sod.income_exchange = 'USD' THEN CIplan * ${USD_TO_ETB_RATE}
          ELSE 0 
        END), 0) as total_income_plan_combined_ETB,
        COALESCE(SUM(CASE 
          WHEN sod.income_exchange = 'ETB' THEN CIoutcome
          WHEN sod.income_exchange = 'USD' THEN CIoutcome * ${USD_TO_ETB_RATE}
          ELSE 0 
        END), 0) as total_income_outcome_combined_ETB,
        COALESCE(SUM(CASE WHEN sod.income_exchange = 'ETB' THEN CIplan ELSE 0 END), 0) as total_income_plan_ETB,
        COALESCE(SUM(CASE WHEN sod.income_exchange = 'ETB' THEN CIoutcome ELSE 0 END), 0) as total_income_outcome_ETB,
        COALESCE(SUM(CASE WHEN sod.income_exchange = 'USD' THEN CIplan ELSE 0 END), 0) as total_income_plan_USD,
        COALESCE(SUM(CASE WHEN sod.income_exchange = 'USD' THEN CIoutcome ELSE 0 END), 0) as total_income_outcome_USD
      ${joinClause}
      WHERE sod.plan_type = 'income' ${extraFilters}
    `;

    console.log('Executing query:', query);

    con.query(query, (err, results) => {
      if (err) {
        console.error('Database Error:', {
          message: err.message,
          code: err.code,
          state: err.sqlState,
          stack: err.stack
        });
        return handleDatabaseError(err, res, 'comparing total income plan and outcome');
      }

      console.log('Query results:', JSON.stringify(results, null, 2));

      if (handleEmptyResults(results, res, {
        total_income_plan_combined_ETB: 0,
        total_income_outcome_combined_ETB: 0,
        breakdown: {
          ETB: { plan: 0, outcome: 0 },
          USD: { plan: 0, outcome: 0 }
        }
      })) {
        console.log('No results found for the query');
        return;
      }

      const {
        total_income_plan_combined_ETB,
        total_income_outcome_combined_ETB,
        total_income_plan_ETB,
        total_income_outcome_ETB,
        total_income_plan_USD,
        total_income_outcome_USD
      } = results[0];

      console.log('Extracted values:', {
        total_income_plan_combined_ETB,
        total_income_outcome_combined_ETB,
        total_income_plan_ETB,
        total_income_outcome_ETB,
        total_income_plan_USD,
        total_income_outcome_USD
      });

      const difference_combined_ETB = total_income_plan_combined_ETB - total_income_outcome_combined_ETB;

      const response = {
        combined_ETB: {
          plan: total_income_plan_combined_ETB,
          outcome: total_income_outcome_combined_ETB,
          difference: difference_combined_ETB
        },
        breakdown: {
          ETB: {
            plan: total_income_plan_ETB,
            outcome: total_income_outcome_ETB,
            difference: total_income_plan_ETB - total_income_outcome_ETB
          },
          USD: {
            plan: total_income_plan_USD,
            outcome: total_income_outcome_USD,
            difference: total_income_plan_USD - total_income_outcome_USD,
            plan_in_ETB: total_income_plan_USD * USD_TO_ETB_RATE,
            outcome_in_ETB: total_income_outcome_USD * USD_TO_ETB_RATE
          }
        },
        exchange_rate: {
          USD_TO_ETB: USD_TO_ETB_RATE
        }
      };

      console.log('Final response:', JSON.stringify(response, null, 2));
      res.json(response);
    });
  } catch (error) {
    console.error('Unexpected error in compareIncomePlanOutcomeTotal:', {
      message: error.message,
      stack: error.stack,
      details: error
    });
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const displayTotalHR = async (req, res) => {
  try {
    const query = `
      SELECT COALESCE(SUM(sod.hr_count), 0) as total_hr 
      ${BASE_JOIN}`;
    
    con.query(query, (err, results) => {
      if (err) return handleDatabaseError(err, res, 'fetching total HR');
      if (handleEmptyResults(results, res, { total_hr: 0 })) return;
      res.json(results[0].total_hr);
    });
  } catch (error) {
    console.error('Unexpected error in displayTotalHR:', error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};







const HRPlanOutcomeDifferenceFulltime = async (req, res) => {
  try {
    // Retrieve joinClause and extraFilters from the request.
    // Using getJoinClause which returns the BASE_JOIN already.
    let joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req) || "";

    // If joinClause is missing a FROM clause, fallback to the BASE_JOIN.
    if (!joinClause || !/FROM\s+/i.test(joinClause)) {
      joinClause = BASE_JOIN;
      console.warn("joinClause not provided or missing FROM clause; using default BASE_JOIN");
    }

    // Build the SQL query string. This groups rows by specific_objective_detailname.
    // No extra join is appended here.
    const query = `
      SELECT 
        sod.specific_objective_detailname,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'hr' THEN sod.CIplan END), 0) AS plan,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'hr' THEN sod.CIoutcome END), 0) AS outcome,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'hr' THEN sod.CIplan END), 0) - COALESCE(SUM(CASE WHEN sod.plan_type = 'hr' THEN sod.CIoutcome END), 0) AS difference
      ${joinClause}
      WHERE 
        sod.plan_type = 'hr' AND 
        sod.employment_type = 'full_time' ${extraFilters}
      GROUP BY sod.specific_objective_detailname
    `;
    
    console.log("Constructed Query:", query);

    con.query(query, (err, results) => {
      if (err) {
        console.error("Database error occurred:", err);
        return handleDatabaseError(err, res, "comparing cost plan and outcome total_regular");
      }
      
      // Check if the results are empty. If so, return default structured response.
      if (handleEmptyResults(results, res, { data: [], totals: { plan: 0, outcome: 0, difference: 0 } })) {
        return;
      }
      
      // Log the raw SQL results for debugging purposes.
      console.log("SQL Query Results:", results);
      
      // Compute overall totals by iterating over the grouped results.
      let totalPlan = 0;
      let totalOutcome = 0;
      results.forEach(row => {
        totalPlan += Number(row.plan);
        totalOutcome += Number(row.outcome);
      });
      const totalDifference = totalPlan - totalOutcome;
      
      // Build the final response object.
      const responseData = {
        data: results, // array of { costName, plan, outcome, difference }
        totals: {
          plan: totalPlan,
          outcome: totalOutcome,
          difference: totalDifference
        }
      };
      
      // Log computed totals.
      console.log("Computed Totals - Total Plan:", totalPlan, "Total Outcome:", totalOutcome, "Total Difference:", totalDifference);
      
      // Send the computed data to the frontend.
      res.json(responseData);
    });
    
  } catch (error) {
    console.error("Unexpected error in hrPlanOutcomeDifferenceFulltime:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


const DefaultPlanOutcomeDifferenceFulltime = async (req, res) => {
  try {
    // Retrieve joinClause and extraFilters from the request.
    let joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req) || "";

    // Fallback to BASE_JOIN if joinClause is missing the FROM clause.
    if (!joinClause || !/FROM\s+/i.test(joinClause)) {
      joinClause = BASE_JOIN;
      console.warn("joinClause not provided or missing FROM clause; using default BASE_JOIN");
    }
    
    // Append a LEFT JOIN to fetch department name from the departments table
    const joinDepartment = " LEFT JOIN departments d ON sod.department_id = d.department_id";

    // Build the SQL query string.
    // Fetching department name (d.name), and calculating difference (plan - outcome) along with execution_percentage.
    const query = `
      SELECT 
        sod.specific_objective_detailname,
        sod.department_id,
        d.name AS department,
        sod.details,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'default_plan' THEN sod.plan END), 0) AS plan,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'default_plan' THEN sod.outcome END), 0) AS outcome,
        COALESCE(SUM(CASE WHEN sod.plan_type = 'default_plan' THEN sod.plan END), 0) - COALESCE(SUM(CASE WHEN sod.plan_type = 'default_plan' THEN sod.outcome END), 0) AS difference,
        CASE 
          WHEN COALESCE(SUM(CASE WHEN sod.plan_type = 'default_plan' THEN sod.plan END), 0) = 0 THEN 0
          ELSE (COALESCE(SUM(CASE WHEN sod.plan_type = 'default_plan' THEN sod.outcome END), 0) / COALESCE(SUM(CASE WHEN sod.plan_type = 'default_plan' THEN sod.plan END), 0)) * 100
        END AS execution_percentage
      ${joinClause}
      ${joinDepartment}
      WHERE 
        sod.plan_type = 'default_plan' ${extraFilters}
      GROUP BY sod.specific_objective_detailname, sod.department_id, d.name, sod.details
    `;

    console.log("Constructed Query:", query);

    con.query(query, (err, results) => {
      if (err) {
        console.error("Database error occurred:", err);
        return handleDatabaseError(err, res, " plan and outcome ");
      }

      // Check for empty results; if so, return a default response.
      if (handleEmptyResults(results, res, { data: [], totals: { plan: 0, outcome: 0, difference: 0, execution_percentage: 0 } })) {
        return;
      }

      console.log("SQL Query Results:", results);

      // Compute overall totals.
      let totalPlan = 0;
      let totalOutcome = 0;
      results.forEach(row => {
        totalPlan += Number(row.plan);
        totalOutcome += Number(row.outcome);
      });
      const overallDifference = totalPlan - totalOutcome;
      const overallExecutionPercentage = totalPlan === 0 ? 0 : (totalOutcome / totalPlan) * 100;

      console.log("Computed Totals - Total Plan:", totalPlan, "Total Outcome:", totalOutcome, "Overall Difference:", overallDifference, "Overall Execution Percentage:", overallExecutionPercentage);

      // Build the final response object.
      const responseData = {
        data: results, // Each row includes specific_objective_detailname, department_id, department name, details, plan, outcome, difference, and execution_percentage.
        totals: {
          plan: totalPlan,
          outcome: totalOutcome,
          difference: overallDifference,
          execution_percentage: overallExecutionPercentage
        }
      };

      res.json(responseData);
    });
    
  } catch (error) {
    console.error("Unexpected error in DefaultPlanOutcomeDifferenceFulltime:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};








module.exports = {

  //Human Resource analitics
  
  displayTotalCost,

  displayTotalCostPlan,
  compareCostPlanOutcome,
  displayTotalCostExcutionPercentage,
  displayTotalIncomeOutcomeETB,  
  displayTotalIncomeOutcomeUSD,
  displayTotalIncomeplanETB,
  displayTotalIncomePlanUSD,
  compareIncomePlanOutcomeETB,
  compareIncomePlanOutcomeUSD,
  compareIncomePlanOutcomeTotal,
  costPlanOutcomeDifferenceRegularBudget,
  costPlanOutcomeDifferenceCapitalBudget,

  HRPlanOutcomeDifferenceFulltime,
  DefaultPlanOutcomeDifferenceFulltime
//   compareCostCIplanAndCIoutcome,
//   compareCostCIexecutionPercentage,
//   displayTotalIncome,
//   compareTotalIncomeCIplanAndCIoutcome,
//   compareIncomeCIplanAndCIoutcomeByPeriod,
//   compareCostAndIncome,
//   displayTotalHR,
//   compareTotalHRCIplanAndCIoutcome
};