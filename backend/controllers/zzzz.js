const compareIncomePlanOutcomeTotal = async (req, res) => {
  try {
    const USD_TO_ETB_RATE = 120; // Exchange rate: 1 USD = 120 ETB
    const joinClause = getJoinClause(req);
    const extraFilters = getFilterConditions(req);
    
    console.log('Starting income comparison with filters:', { joinClause, extraFilters });
    
    // Query that handles both currencies and combines them
    const query = `
      SELECT 
        /* Plan Calculations */
        COALESCE(SUM(CASE 
          WHEN income_exchange = 'ETB' THEN CIplan
          WHEN income_exchange = 'USD' THEN CIplan * ${USD_TO_ETB_RATE}
          ELSE 0 
        END), 0) as total_income_plan_combined_ETB,
        
        /* Outcome Calculations */
        COALESCE(SUM(CASE 
          WHEN income_exchange = 'ETB' THEN CIoutcome
          WHEN income_exchange = 'USD' THEN CIoutcome * ${USD_TO_ETB_RATE}
          ELSE 0 
        END), 0) as total_income_outcome_combined_ETB,
        
        /* Original currency totals for reference */
        COALESCE(SUM(CASE WHEN income_exchange = 'ETB' THEN CIplan ELSE 0 END), 0) as total_income_plan_ETB_comb,
        COALESCE(SUM(CASE WHEN income_exchange = 'ETB' THEN CIoutcome ELSE 0 END), 0) as total_income_outcome_ETB,
        COALESCE(SUM(CASE WHEN income_exchange = 'USD' THEN CIplan ELSE 0 END), 0) as total_income_plan_USD,
        COALESCE(SUM(CASE WHEN income_exchange = 'USD' THEN CIoutcome ELSE 0 END), 0) as total_income_outcome_USD
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
        total_income_plan_ETB_comb,
        total_income_outcome_ETB,
        total_income_plan_USD,
        total_income_outcome_USD
      } = results[0];

      // Log the extracted values
      console.log('Extracted values:', {
        total_income_plan_combined_ETB,
        total_income_outcome_combined_ETB,
        total_income_plan_ETB_comb,
        total_income_outcome_ETB,
        total_income_plan_USD,
        total_income_outcome_USD
      });

      // Calculate the difference in combined ETB
      const difference_combined_ETB = total_income_plan_combined_ETB - total_income_outcome_combined_ETB;

      // Prepare the response with detailed breakdown
      const response = {
        combined_ETB: {
          plan: total_income_plan_combined_ETB,
          outcome: total_income_outcome_combined_ETB,
          difference: difference_combined_ETB
        },
        breakdown: {
          ETB: {
            plan: total_income_plan_ETB_comb,
            outcome: total_income_outcome_ETB,
            difference: total_income_plan_ETB_comb - total_income_outcome_ETB
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