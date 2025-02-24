// -------------------
// File: /src/components/staff/StaffDashboard.jsx
// Description: Parent dashboard component that imports the dashboard service.
import React, { useState, useEffect } from "react";
import FilterForm from "./FilterForm";
import IncomeMetricsBarchart from "./Metrics/IncomeMetricsBarchart";
import IncomeMetricsPichart from "./Metrics/IncomeMetricsPichart";
import IncomeMetricsDataTable from "./Metrics/IncomeMetricsDataTable";
import CostMetricsBarchart from "./Metrics/CostMetricsBarchart";
import { fetchDashboardData } from "./services/dashboardService";

const StaffDashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    year: "",
    quarter: "",
    department: "",
    createdBy: "",
    view: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await fetchDashboardData(filters);
        setData(dashboardData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      }
    };
    fetchData();
  }, [filters]);

  useEffect(() => {
    if (data) {
      console.log("Dashboard data updated:", data);
    }
  }, [data]);

  const handleFilterSubmit = (newFilters) => {
    setFilters(newFilters);
  };

  if (error) {
    return <div style={{ padding: "1rem", color: "red" }}>Error loading data: {error}</div>;
  }
  if (!data) {
    return <div style={{ padding: "1rem" }}>Loading dashboard...</div>;
  }
  return (
    <div style={{ display: "block", flexDirection: "column", margin: "0 auto", padding: "1rem", position: "absolute", left: "15%", top: "7%" }}>

      
      <FilterForm filters={filters} onSubmit={handleFilterSubmit} />
      
      <div><h1>Income Metrics</h1></div>
      
      <h2>Total Income sumation both ETB and USD </h2>
      <IncomeMetricsBarchart data={data} />
      <IncomeMetricsPichart data={data} />
      <IncomeMetricsDataTable data={data} />


      <br /> <br />
      <h1>Cost Metrics</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
       
       <h2>Total Cost in ETB millions birr</h2>

       
        <CostMetricsBarchart data={{ total_cost: data.extra.displayTotalCost }} type="totalCost" />
        <CostMetricsBarchart data={{ total_cost_plan: data.extra.displayTotalCostPlan }} type="totalCostPlan" />
        <CostMetricsBarchart data={data.extra.compareCostPlanOutcome} type="compareCostPlanOutcome" />
        <CostMetricsBarchart
          data={{ averageCostCIExecutionPercentage: data.extra.displayTotalCostExcutionPercentage.averageCostCIExecutionPercentage }}
          type="totalCostExcutionPercentage"
        />
      </div>
    </div>
  );
};

export default StaffDashboard;