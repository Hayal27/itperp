import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/constants";
import BarChartComponent1 from "./BarChartComponent1";

/**
 * CostPlanOutcomeDifferenceRegularBudget component fetches cost plan and outcome data
 * for the regular budget, processes the API response, and renders a bar chart.
 *
 * To apply filters, pass an object as the "filters" prop. The component converts these
 * filters to a query string to modify API calls accordingly. Ensure that the filter keys
 * match what the backend expects:
 *    - year
 *    - specific_objective_name
 *    - year_range
 *    - quarter
 *    - department
 *    - created_by
 *    - view
 *
 * If filtering values are not updating, verify that:
 * 1. The parent component sends a new filters object with new references.
 * 2. The filter keys exactly match the backend expectations (e.g., "year_range" not "yearRange").
 * 3. Additional logging will output the applied filters, generated query string, and constructed URL.
 */
const CostPlanOutcomeDifferenceRegularBudget = ({ filters = {} }) => {
  const [backendData, setBackendData] = useState(null);
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
        // Call the API with appropriate Authorization header.
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        console.log(`[${timestamp}] Backend data received:`, data);

        // Validate response data - expect a totals object with plan, outcome, and difference.
        if (!data || !data.totals) {
          console.warn(`[${timestamp}] No data received from backend or missing totals.`);
          setError("No data received from backend.");
          return;
        }
        
        const { plan, outcome, difference } = data.totals;
        if (plan === undefined || outcome === undefined || difference === undefined) {
          console.warn(`[${timestamp}] Insufficient or incorrect cost data received:`, data);
          setError("Insufficient or incorrect cost data received.");
          return;
        }

        // Update state with received data.
        setBackendData(data);

        // Construct chart configuration - show the overall totals.
        const barLabels = ["Regular Budget"];
        const planData = [plan ?? 0];
        const outcomeData = [outcome ?? 0];
        const differenceData = [difference ?? 0];

        const config = {
          type: "bar",
          data: {
            labels: barLabels,
            datasets: [
              {
                label: "እቅድ በ %" ,
                data: planData,
                backgroundColor: "#003f5c"
              },
              {
                label: "ክንዉን",
                data: outcomeData,
                backgroundColor: "#58508d"
              },
              {
                label: "Difference",
                data: differenceData,
                backgroundColor: "#bc5090"
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
            },
            scales: {
              x: { stacked: true },
              y: { stacked: true }
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

    // Using JSON.stringify(filters) ensures that changes (deep equality) trigger the effect.
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
      <BarChartComponent1 config={chartConfig} />
    </div>
  );
};

export default CostPlanOutcomeDifferenceRegularBudget;