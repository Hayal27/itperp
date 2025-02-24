import React, { useState, useEffect } from "react";
import axios from "axios";
import FilterForm from "./FilterForm";
import IncomeMetricsBarchart from "./Metrics/IncomeMetricsBarchart";
import IncomeMetricsPichart from "./Metrics/IncomeMetricsPichart";
import IncomeMetricsDataTable from "./Metrics/IncomeMetricsDataTable";
import CostMetricsBarchart from "./Metrics/CostMetricsBarchart";

// Base API URL for endpoints.
const API_BASE_URL = "http://localhost:5000/api";

const StaffDashboard = () => {
  // 'data' state holds the combined responses.
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Default filter values from FilterForm.
  const [filters, setFilters] = useState({
    year: "",
    quarter: "",
    department: "",
    createdBy: "",
    view: ""
  });

  // Build query string based on active filters.
  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        params.append(key === "createdBy" ? "created_by" : key, filters[key]);
      }
    });
    return params.toString();
  };

  // Fetch data from multiple endpoints concurrently.
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        const errorMessage = "Authentication token not found";
        console.error(errorMessage);
        setError(errorMessage);
        return;
      }
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const queryString = buildQueryString();

      try {
        const requests = [
          // Primary endpoint.
          axios.get(
            queryString
              ? `${API_BASE_URL}/CompareIncomePlanOutcomeTotal?${queryString}`
              : `${API_BASE_URL}/CompareIncomePlanOutcomeTotal`,
            { headers }
          ),
          // API for average cost execution percentage.
          axios.get(
            queryString
              ? `${API_BASE_URL}/displayTotalCostExcutionPercentage?${queryString}`
              : `${API_BASE_URL}/displayTotalCostExcutionPercentage`,
            { headers }
          ),
          // API for total cost.
          axios.get(`${API_BASE_URL}/displayTotalCost`, { headers }),
          // API for total cost plan.
          axios.get(
            queryString
              ? `${API_BASE_URL}/displayTotalCostPlan?${queryString}`
              : `${API_BASE_URL}/displayTotalCostPlan`,
            { headers }
          ),
          // API for comparing cost plan outcome.
          axios.get(
            queryString
              ? `${API_BASE_URL}/compareCostPlanOutcome?${queryString}`
              : `${API_BASE_URL}/compareCostPlanOutcome`,
            { headers }
          ),
          // API for total income plan ETB.
          axios.get(
            queryString
              ? `${API_BASE_URL}/displayTotalIncomeplanETB?${queryString}`
              : `${API_BASE_URL}/displayTotalIncomeplanETB`,
            { headers }
          ),
          // API for total income outcome ETB.
          axios.get(
            queryString
              ? `${API_BASE_URL}/displayTotalIncomeOutcomeETB?${queryString}`
              : `${API_BASE_URL}/displayTotalIncomeOutcomeETB`,
            { headers }
          )
        ];

        const responses = await Promise.all(requests);

        // Detailed logging for each API call.
        console.log("Response from CompareIncomePlanOutcomeTotal:", responses[0].data);
        console.log("Response from displayTotalCostExcutionPercentage:", responses[1].data);
        console.log("Response from displayTotalCost:", responses[2].data);
        console.log("Response from displayTotalCostPlan:", responses[3].data);
        console.log("Response from compareCostPlanOutcome:", responses[4].data);
        console.log("Response from displayTotalIncomeplanETB:", responses[5].data);
        console.log("Response from displayTotalIncomeOutcomeETB:", responses[6].data);

        // Structure the fetched data.
        const combinedData = {
          primary: responses[0].data,
          extra: {
            displayTotalCostExcutionPercentage: responses[1].data, // e.g. { averageCostCIExecutionPercentage: 41.4 }
            displayTotalCost: responses[2].data,                    // e.g. 3356744
            displayTotalCostPlan: responses[3].data,                // e.g. 129193111.99
            compareCostPlanOutcome: responses[4].data,              // e.g. { total_cost_plan: ..., total_cost_outcome: ..., difference: ... }
            displayTotalIncomeplanETB: responses[5].data,
            displayTotalIncomeOutcomeETB: responses[6].data
          }
        };

        console.log("Combined fetched data:", combinedData);
        setData(combinedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data from API:", err);
        setError(err.message);
      }
    };

    fetchData();
  }, [filters]);

  // Log updated dashboard data.
  useEffect(() => {
    if (data) {
      console.log("Dashboard data updated:", data);
    }
  }, [data]);

  // Handle filter form submission.
  const handleFilterSubmit = (newFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    return (
      <div style={{ padding: "1rem", color: "red" }}>
        Error loading data: {error}
      </div>
    );
  }

  if (!data) {
    return <div style={{ padding: "1rem" }}>Loading dashboard...</div>;
  }

  return (
    <div
      style={{
        display: "block",
        flexDirection: "column",
        margin: "0 auto",
        padding: "1rem",
        position: "absolute",
        left: "15%",
        top: "7%"
      }}
    >
      <FilterForm filters={filters} onSubmit={handleFilterSubmit} />
      <IncomeMetricsBarchart data={data} />
      <IncomeMetricsPichart data={data} />
      <IncomeMetricsDataTable data={data} />
      {/* Render separate CostMetricsBarchart for each metric using appropriate "type" and data mappings */}
      <h2>Cost Metrics</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        {/* Total Cost */}
        <CostMetricsBarchart 
          data={{ total_cost: data.extra.displayTotalCost }} 
          type="totalCost" 
        />
        {/* Total Cost Plan */}
        <CostMetricsBarchart 
          data={{ total_cost_plan: data.extra.displayTotalCostPlan }} 
          type="totalCostPlan" 
        />
        {/* Compare Cost Plan vs Outcome */}
        <CostMetricsBarchart 
          data={data.extra.compareCostPlanOutcome} 
          type="compareCostPlanOutcome" 
        />
        {/* Average Cost Execution Percentage */}
        <CostMetricsBarchart 
          data={{ averageCostCIExecutionPercentage: 
                    data.extra.displayTotalCostExcutionPercentage.averageCostCIExecutionPercentage 
                 }} 
          type="totalCostExcutionPercentage" 
        />
      </div>
    </div>
  );
};

export default StaffDashboard;








































