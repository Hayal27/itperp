import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/constants";
import PieChartComponent1 from "./PieChartComponent1";

/**
 * CostPlanOutcomeDifferenceRegularBudgetPieChart component fetches cost plan and outcome data
 * for the regular budget, processes the API response and renders a pie chart.
 *
 * The backend now returns the computed totals in the following structure:
 * {
 *   data: [ ... ], // detailed results (not used here)
 *   totals: {
 *     plan: <number>,
 *     outcome: <number>,
 *     difference: <number>
 *   }
 * }
 *
 * To apply filters, pass an object as the "filters" prop. The component converts these
 * filters to a query string to modify API calls accordingly.
 */
const CostPlanOutcomeDifferenceRegularBudgetPieChart = ({ filters = {} }) => {
  const [chartConfig, setChartConfig] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const timestamp = new Date().toLocaleString();
      console.log(`[${timestamp}] Applied filters:`, filters);

      // Retrieve JWT token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn(`[${timestamp}] JWT token not found.`);
        setError("Authentication token missing.");
        return;
      }

      // Convert filters object to query string using URLSearchParams
      const queryString = new URLSearchParams(filters).toString();
      console.log(`[${timestamp}] Generated query string from filters:`, queryString);

      // Construct API URL; backend expects query parameters appended correctly.
      const url = queryString 
        ? `${API_BASE_URL}/costPlanOutcomeDifferenceRegularBudget?${queryString}` 
        : `${API_BASE_URL}/costPlanOutcomeDifferenceRegularBudget`;
      console.log(`[${timestamp}] Constructed API URL:`, url);

      try {
        // Call the API with the appropriate Authorization header.
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        console.log(`[${timestamp}] Backend data received:`, data);

        // Validate response data structure
        if (!data || !data.totals) {
          console.warn(`[${timestamp}] Incorrect data structure received from backend:`, data);
          setError("Insufficient or incorrect cost data received.");
          return;
        }

        // Destructure totals from the response
        const { plan, outcome, difference } = data.totals;

        // Construct chart configuration for a pie chart.
        const labels = ["Plan", "Outcome", "Difference"];
        const datasetData = [
          plan ?? 0,
          outcome ?? 0,
          difference ?? 0
        ];

        const config = {
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                data: datasetData,
                backgroundColor: ["#003f5c", "#58508d", "#bc5090"]
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "የ Regular በጀት እቅድ እና ውጤት"
              }
            }
          }
        };

        console.log(`[${timestamp}] Chart configuration constructed:`, config);
        setChartConfig(config);
        setError(null);
      } catch (err) {
        const errTimestamp = new Date().toLocaleString();
        console.error(`[${errTimestamp}] Error processing chart configuration:`, err);
        setError(err.message || "An error occurred while fetching data.");
      }
    };

    // Using JSON.stringify(filters) ensures that deep equality changes trigger the effect.
    fetchData();
  }, [JSON.stringify(filters)]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!chartConfig) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div>
      <h2>የ Regular በጀት እቅድ እና ውጤት</h2>
      <PieChartComponent1 config={chartConfig} />
    </div>
  );
};

export default CostPlanOutcomeDifferenceRegularBudgetPieChart;