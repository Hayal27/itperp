import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../services/constants";
import DataTableComponent from "./DataTableComponent";


const HRPlanOutcomeDifferenceFulltimeTable = ({ filters = {} }) => {
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
        ? `${API_BASE_URL}/hrPlanOutcomeDifferenceFulltime?${queryString}`
        : `${API_BASE_URL}/hrPlanOutcomeDifferenceFulltime`;
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
            name: item.specific_objective_detailname || "Inital",
            plan: item.plan ?? '-',
            outcome: item.outcome ?? 0,
            difference: item.difference ?? 0
          }));
        } else if (
          data.total_hr_plan_fulltime === undefined ||
          data.total_hr_outcome_fulltime === undefined ||
          data.difference === undefined
        ) {
          console.warn(`[${timestamp}] Insufficient or incorrect cost data received:`, data);
          setError("Insufficient or incorrect cost data received.");
          return;
        } else {
          // Fallback to legacy structure.
          newCategories = [
            {
              name: "Full Time",
              plan: data.total_hr_plan_fulltime ?? 0,
              outcome: data.total_hr_outcome_fulltime ?? 0,
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
      <h2>የ ስራ እድል ፈጠራ በ ቅጥር እቅድ እና ውጤት</h2>
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

export default HRPlanOutcomeDifferenceFulltimeTable;