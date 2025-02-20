//     1. analytics for (cost,income,hr) based on number

// 1.1 cost-based on number

// 1.1.1 Display cost   using table, bar chart and pi chart 
// 	=>total cost CIplan (CIplan )
// 	=>total cost CIoutcome (CIoutcome )
// 	=>total cost CIexecution_percentage (CIexecution_percentage )

// 1.1.2 Compare cost CIplan and CIoutecome using table, bar chart and pi chart.

//     => use filter but 1st option cost_type(capital_budget,regular_budget,from_both)then filter all year, 5 year, current year, quarter.

// 1.1.3 Compare cost CIexecution_percentage of cost_type (capital_budget,regular_budget)using table, bar chart and pi chart.
//     => use filter all year(comulative), 5 year, current year, quarter.







// 1.2 income-based on number
// 1.2.1 Display income   using table, bar chart and pi chart 
       
// 	=>total income CIplan (CIplan )
// 	=>total income CIoutcome (CIoutcome )
//         =>total income CIexecution_percentage (CIexecution_percentage )
        
// 1.2.2 Compare total income  CIplan and CIoutecome using table, bar chart and pi chart.



//     => use filter but 1st select option income_exchange(USD,ETB,Addition of both by converting to ETB and here to convert ask 1st the converting rate manualy the user )then filter all year, 5 year, current year, quarter.
 
//    1.1.3 Compare income CIplan and CIoutecome using table, bar chart and pi chart(but 1st selectincome_exchangeUSD,ETB).

//       -> by year and quarter by selecting years and quarters manualy.

//      1.3 COMPARING COST AND INCOME 

// 	->compare CIplan plan type =cost with CIplan plan_type= income
// 	->compare CIoutecome plan type =cost with CIoutecome plan_type= income
//         ->compare CIexecution_percentage plan type =cost with CIexecution_percentage plan_type= income

   

// 1.4 hr-based on number

// 1.4.1 Display hr   using table, bar chart and pi chart 
       
// 	=>total hr CIplan (CIplan )
// 	=>total hr CIoutcome (CIoutcome )
//         =>total hr CIexecution_percentage (CIexecution_percentage )

// 1.4.2 Compare total hr  CIplan and CIoutecome using table, bar chart and pi chart.
//     => use filter but 1st option employee_type(contrat,full_time,adding both)then filter all year, 5 year, current year, quarter.






import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const StaffDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Chart configuration with shorter height
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 5 // Reduce number of ticks for shorter appearance
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10 // Smaller legend items
        }
      }
    }
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("You must be logged in.");
        setLoading(false);
        return;
      }
      try {
        const queryParams = "filterType=goal_id&filterValue=1";
        const url = `http://localhost:5000/api/getAnalyticsData1?${queryParams}`;
        const response = await Axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          setAnalyticsData(response.data.data);
        } else {
          setErrorMessage("Failed to load analytics data.");
        }
      } catch (error) {
        setErrorMessage("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMessage || !analyticsData) {
    return <div>{errorMessage || "No analytics data available."}</div>;
  }

  // Build dataset configuration
  const buildDataset = (label, data, bgColor, borderColor) => ({
    label,
    data,
    backgroundColor: bgColor,
    borderColor: borderColor,
    borderWidth: 1,
  });

  // Chart data configurations
  const costDisplayChart = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      buildDataset("Total Cost Planned", analyticsData.cost.display.CIplan, "#FF5733", "#C70039"),
      buildDataset("Total Cost Outcome", analyticsData.cost.display.CIoutcome, "#FFC300", "#FF5733"),
    ],
  };

  const incomeDisplayChart = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      buildDataset("Total Income Planned", analyticsData.income.display.CIplan, "#33FF57", "#39C700"),
      buildDataset("Total Income Outcome", analyticsData.income.display.CIoutcome, "#DAF7A6", "#33FF57"),
    ],
  };

  const hrDisplayChart = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      buildDataset("Total HR Planned", analyticsData.hr.display.CIplan, "#3357FF", "#0039C7"),
      buildDataset("Total HR Outcome", analyticsData.hr.display.CIoutcome, "#A6C8FF", "#3357FF"),
    ],
  };

  return (
    <main id="main" className="container my-4">
      {/* Cost Analysis Section */}
      <section className="my-5">
        <h2>Cost Analysis</h2>
        <div className="row my-3">
          <div className="col-md-6">
            <h5>Cost Bar Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Bar data={costDisplayChart} options={chartOptions} />
            </div>
          </div>
          <div className="col-md-6">
            <h5>Cost Pie Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Pie data={costDisplayChart} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </section>

      {/* Income Analysis Section */}
      <section className="my-5">
        <h2>Income Analysis</h2>
        <div className="row my-3">
          <div className="col-md-6">
            <h5>Income Bar Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Bar data={incomeDisplayChart} options={chartOptions} />
            </div>
          </div>
          <div className="col-md-6">
            <h5>Income Pie Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Pie data={incomeDisplayChart} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </section>

      {/* HR Analysis Section */}
      <section className="my-5">
        <h2>HR Analysis</h2>
        <div className="row my-3">
          <div className="col-md-6">
            <h5>HR Bar Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Bar data={hrDisplayChart} options={chartOptions} />
            </div>
          </div>
          <div className="col-md-6">
            <h5>HR Pie Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Pie data={hrDisplayChart} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StaffDashboard;




// the backend sample 


// Allowed filter types for security.
const allowedFilterTypes = ["goal_id", "plan_id", "department_id"];

// Deep sample analytics data for demonstration purposes.
const sampleAnalyticsData = {
  cost: {
    display: {
      CIplan: [11000, 15500, 12500, 17500],
      CIoutcome: [9500, 14500, 11500, 16500],
      CIexecution_percentage: [86, 94, 92, 94],
    },
    comparePlanOutcome: {
      byCostType: {
        capital_budget: {
          CIplan: [5000, 6000, 5500, 6500],
          CIoutcome: [4800, 5800, 5300, 6300],
          details: "Comparison data for capital budget",
        },
        regular_budget: {
          CIplan: [6000, 7500, 7000, 8000],
          CIoutcome: [5800, 7200, 6800, 7900],
          details: "Comparison data for regular budget",
        },
        from_both: {
          CIplan: [11000, 13500, 12500, 14500],
          CIoutcome: [9500, 11500, 10500, 13000],
          details: "Comparison data for combined budgets",
        },
      },
    },
    compareExecutionPercentage: {
      capital_budget: {
        CIexecution_percentage: [80, 85, 82, 88],
      },
      regular_budget: {
        CIexecution_percentage: [90, 92, 95, 97],
      },
      cumulative: {
        CIexecution_percentage: [86, 90, 88, 92],
      },
    },
  },
  income: {
    display: {
      CIplan: [21000, 25500, 22500, 27500],
      CIoutcome: [19000, 24500, 21500, 26500],
      CIexecution_percentage: [90, 96, 95, 97],
    },
    comparePlanOutcome: {
      byCurrency: {
        USD: {
          CIplan: [11000, 12500, 11500, 13500],
          CIoutcome: [10500, 12000, 11000, 13000],
          details: "Data for USD based income comparison",
        },
        ETB: {
          CIplan: [10000, 13000, 12000, 14000],
          CIoutcome: [9700, 12500, 11500, 13500],
          details: "Data for ETB based income comparison",
        },
        converted: {
          conversionRate: 40, // Manual conversion rate example.
          CIplan: [21000, 25500, 22500, 27500],
          CIoutcome: [19000, 24500, 21500, 26500],
          details: "Data for combined income after conversion to ETB",
        },
      },
    },
    compareByTimeFrame: {
      all_years: {
        CIplan: [21000, 25500, 22500, 27500],
        CIoutcome: [19000, 24500, 21500, 26500],
      },
      past_5_years: {
        CIplan: [19000, 23000, 21000, 25000],
        CIoutcome: [17000, 22000, 20000, 24000],
      },
      current_year: {
        CIplan: [22000, 26000, 24000, 28000],
        CIoutcome: [20000, 25000, 23000, 27000],
      },
      quarter: {
        Q1: { CIplan: 21000, CIoutcome: 19000 },
        Q2: { CIplan: 25500, CIoutcome: 24500 },
        Q3: { CIplan: 22500, CIoutcome: 21500 },
        Q4: { CIplan: 27500, CIoutcome: 26500 },
      },
    },
  },
  comparison: {
    cost_vs_income: {
      CIplan: {
        cost: [11000, 15500, 12500, 17500],
        income: [21000, 25500, 22500, 27500],
      },
      CIoutcome: {
        cost: [9500, 14500, 11500, 16500],
        income: [19000, 24500, 21500, 26500],
      },
      CIexecution_percentage: {
        cost: [86, 94, 92, 94],
        income: [90, 96, 95, 97],
      },
    },
  },
  hr: {
    display: {
      CIplan: [55, 63, 58, 68],
      CIoutcome: [48, 58, 53, 63],
      CIexecution_percentage: [87, 92, 91, 93],
    },
    comparePlanOutcome: {
      byEmployeeType: {
        contract: {
          CIplan: [30, 35, 33, 38],
          CIoutcome: [28, 34, 31, 36],
          details: "Data for contract employees",
        },
        full_time: {
          CIplan: [25, 28, 25, 30],
          CIoutcome: [20, 24, 22, 27],
          details: "Data for full-time employees",
        },
        combined: {
          CIplan: [55, 63, 58, 68],
          CIoutcome: [48, 58, 53, 63],
          details: "Combined HR data",
        },
      },
    },
  },
};

/**
 * getAnalyticsData - Returns sample analytics data based on request query parameters.
 *
 * Expected query parameters:
 *   - filterType: Must be one of the allowedFilterTypes.
 *   - filterValue: Any string value.
 *   - year (optional)
 *   - quarter (optional)
 *
 * This function ignores any actual database fetching and returns static, deeply nested sample data
 * for the following analyses:
 *
 * 1. Cost Analysis:
 *    1.1 Display cost using table, bar chart and pie chart:
 *        - Total cost CIplan, total cost CIoutcome,
 *          and total cost CIexecution_percentage.
 *    1.2 Compare cost CIplan vs CIoutcome using filters:
 *        - Based on cost_type: capital_budget, regular_budget, or from_both,
 *          then by all years, past 5 years, current year, or specific quarter.
 *    1.3 Compare cost CIexecution_percentage for cost_type (capital_budget, regular_budget)
 *
 * 2. Income Analysis:
 *    2.1 Display income using table, bar chart and pie chart:
 *        - Total income CIplan, total income CIoutcome,
 *          and total income CIexecution_percentage.
 *    2.2 Compare income CIplan vs CIoutcome using filters:
 *        - Based on income_exchange (USD, ETB, or converted total),
 *          then by all years, past 5 years, current year, or specific quarter.
 *    2.3 Compare income CIplan and CIoutcome by specific income_exchange
 *         and by selected year and quarter.
 *
 * 3. Cost and Income Comparison:
 *    - Compare CIplan, CIoutcome, and CIexecution_percentage between cost and income.
 *
 * 4. HR Analysis:
 *    4.1 Display HR using table, bar chart and pie chart:
 *        - Total HR CIplan, total HR CIoutcome,
 *          and total HR CIexecution_percentage.
 *    4.2 Compare HR CIplan vs CIoutcome using filters:
 *        - Based on employee_type (contract, full_time, or combined),
 *          then by all years, past 5 years, current year, or specific quarter.
 */
const getAnalyticsData = async (req, res) => {
  try {
    // Log incoming query parameters for debugging.
    console.log("Incoming query parameters:", req.query);
    const { filterType, filterValue, year, quarter } = req.query;

    // Validate input parameters.
    if (!filterType || !filterValue) {
      return res.status(400).json({
        success: false,
        message: "Filter type and filter value are required.",
      });
    }
    // Validate against the allowedFilterTypes list.
    if (!allowedFilterTypes.includes(filterType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid filter type provided.",
      });
    }

    // Construct a simulated SQL query for logging/debugging.
    let baseQuery = `
      SELECT
        sod.plan_type AS PlanType,
        sod.CIplan AS CIPlan,
        sod.CIoutcome AS CIOutcome,
        sod.CIexecution_percentage AS CIExecutionPercentage,
        g.year AS Year,
        g.quarter AS Quarter
      FROM specific_objective_details sod
      LEFT JOIN goals g ON sod.specific_objective_id = g.specific_objective_id
      WHERE sod.${filterType} = ?
    `;
    // Add optional filters (not affecting sample data).
    const queryParams = [filterValue];
    if (year) {
      baseQuery += " AND g.year = ?";
      queryParams.push(year);
    }
    if (quarter) {
      baseQuery += " AND g.quarter = ?";
      queryParams.push(quarter);
    }

    console.log("Constructed SQL Query (simulation):", baseQuery);
    console.log("Query Parameters:", queryParams);

    // Return the static deep sample analytics data.
    console.log("Returning deep sample analytics data.");
    return res.status(200).json({
      success: true,
      data: sampleAnalyticsData,
    });
  } catch (error) {
    console.error("Error in getAnalyticsData:", error.message);
    return res.status(500).json({
      success: false,
      message: `Unknown error occurred. ${error.message}`,
    });
  }
};
