import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/constants";
import DataTableComponent from "./DataTableComponent";

/**
 * CostPlanOutcomeDifferenceRegularBudgetTable component fetches cost plan and outcome data
 * for the regular budget, processes the API response, and renders a data table.
 *
 * The component supports both legacy and new backend structures.
 *
 * Legacy Response:
 *   - total_cost_plan_regular
 *   - total_cost_outcome_regular
 *   - difference
 *
 * New Response:
 *   - data: an array of objects (each with costName, plan, outcome, difference)
 *   - totals: an object with totals for plan, outcome, and difference
 *
 * To apply filters, pass an object as the "filters" prop. The component converts these
 * filters to a query string to modify API calls accordingly. Ensure that the filter keys
 * match what the backend expects.
 *
 * Additional Tips:
 *   - Verify that the parent component sends a new filters object with new references.
 *   - Ensure filter keys exactly match what the backend expects.
 */
const CostPlanOutcomeDifferenceRegularBudgetTable = ({ filters = {} }) => {
  const [backendData, setBackendData] = useState(null);
  const [categories, setCategories] = useState(null);
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

        // Validate response data
        if (!data) {
          console.warn(`[${timestamp}] No data received from backend.`);
          setError("No data received from backend.");
          return;
        }

        let newCategories = [];
        // Check if the new response structure exists.
        if (data.data && Array.isArray(data.data)) {
          newCategories = data.data.map((item) => ({
            name: item.costName || "Inital",
            plan: item.plan ?? '-',
            outcome: item.outcome ?? 0,
            difference: item.difference ?? 0
          }));
        } else if (
          data.total_cost_plan_regular === undefined ||
          data.total_cost_outcome_regular === undefined ||
          data.difference === undefined
        ) {
          console.warn(`[${timestamp}] Insufficient or incorrect cost data received:`, data);
          setError("Insufficient or incorrect cost data received.");
          return;
        } else {
          // Fallback to legacy structure.
          newCategories = [
            {
              name: "Regular Budget",
              plan: data.total_cost_plan_regular ?? 0,
              outcome: data.total_cost_outcome_regular ?? 0,
              difference: data.difference ?? 0
            }
          ];
        }
        // Update state with received data.
        setBackendData(data);
        setCategories(newCategories);
        setError(null);
      } catch (err) {
        const errTimestamp = new Date().toLocaleString();
        console.error(`[${errTimestamp}] Error processing data:`, err);
        setError(err.message || "An error occurred while fetching data.");
      }
    };

    // Using JSON.stringify(filters) ensures that changes trigger the effect.
    fetchData();
  }, [JSON.stringify(filters)]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!categories) {
    return <div>Loading table data...</div>;
  }

  return (
    <div>
      <h2>የ Regular በጀት እቅድ እና ውጤት</h2>
      <DataTableComponent categories={categories} />
      {/* Display totals if available in the new response */}
      {backendData && backendData.totals && (
        <div className="totals" style={{ marginTop: "20px" }}>
          <h3>Totals</h3>
          <p>Total Plan: {backendData.totals.plan}</p>
          <p>Total Outcome: {backendData.totals.outcome}</p>
          <p>Total Difference: {backendData.totals.difference}</p>
          {/* Calculate and display Outcome Percentage */}
          <p>
            Outcome Percentage:{" "}
            {backendData.totals.plan > 0
              ? ((backendData.totals.outcome / backendData.totals.plan) * 100).toFixed(2)
              : "0.00"}%
          </p>
        </div>
      )}
    </div>
  );
};

export default CostPlanOutcomeDifferenceRegularBudgetTable;