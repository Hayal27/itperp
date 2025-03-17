import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

const DashboardSummary = ({ sortedPlans }) => {
  // Aggregated Data Calculations
  let totalCostPlan = 0,
    totalCostOutcome = 0,
    totalIncomePlan = 0,
    totalIncomeOutcome = 0;
  sortedPlans.forEach((plan) => {
    if (plan.plan_type && plan.plan_type.toLowerCase() === "cost") {
      totalCostPlan += Number(plan.Plan) || 0;
      totalCostOutcome += Number(plan.Outcome) || 0;
    } else if (plan.plan_type && plan.plan_type.toLowerCase() === "income") {
      totalIncomePlan += Number(plan.Plan) || 0;
      totalIncomeOutcome += Number(plan.Outcome) || 0;
    }
  });
  const costExecutionPercentage = totalCostPlan
    ? (totalCostOutcome / totalCostPlan) * 100
    : 0;
  const incomeExecutionPercentage = totalIncomePlan
    ? (totalIncomeOutcome / totalIncomePlan) * 100
    : 0;

  // Data for Pie Chart: Cost distribution by cost type
  const costDistribution = {};
  sortedPlans.forEach((plan) => {
    if (plan.plan_type && plan.plan_type.toLowerCase() === "cost") {
      const costType = plan.cost_type || "Unknown";
      const planVal = Number(plan.Plan) || 0;
      costDistribution[costType] =
        (costDistribution[costType] || 0) + planVal;
    }
  });
  const pieData = Object.keys(costDistribution).map((key) => ({
    name: key,
    value: costDistribution[key],
  }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

  // Data for Line Chart: Execution percentage over time
  const executionByPeriod = {};
  sortedPlans.forEach((plan) => {
    const year = plan.Year;
    const quarter = plan.Quarter;
    if (year && quarter) {
      const key = `${year} Q${quarter}`;
      const exec = Number(plan.Execution_Percentage) || 0;
      if (!executionByPeriod[key]) {
        executionByPeriod[key] = { total: exec, count: 1 };
      } else {
        executionByPeriod[key].total += exec;
        executionByPeriod[key].count++;
      }
    }
  });
  const lineData = Object.keys(executionByPeriod).map((key) => ({
    period: key,
    execution: executionByPeriod[key].count
      ? executionByPeriod[key].total / executionByPeriod[key].count
      : 0,
  }));

  // Cumulative Aggregation by Actual Year
  const cumulativeByYear = sortedPlans.reduce((acc, plan) => {
    const year = plan.Year || "N/A";
    acc[year] = (acc[year] || 0) + (Number(plan.Plan) || 0);
    return acc;
  }, {});

  return (
    <div className="mb-5">
      <h3 className="mb-4">Dashboard Summary</h3>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-info shadow">
            <div className="card-body">
              <h5 className="card-title">Total Cost Plan</h5>
              <p className="card-text">{totalCostPlan.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5 className="card-title">Total Cost Outcome</h5>
              <p className="card-text">{totalCostOutcome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning shadow">
            <div className="card-body">
              <h5 className="card-title">Cost Execution %</h5>
              <p className="card-text">{costExecutionPercentage.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-info shadow">
            <div className="card-body">
              <h5 className="card-title">Total Income Plan</h5>
              <p className="card-text">{totalIncomePlan.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5 className="card-title">Total Income Outcome</h5>
              <p className="card-text">{totalIncomeOutcome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning shadow">
            <div className="card-body">
              <h5 className="card-title">Income Execution %</h5>
              <p className="card-text">{incomeExecutionPercentage.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>
      {/* Cumulative totals grouped by year */}
      <div className="row mt-4">
        {Object.keys(cumulativeByYear).map((year) => (
          <div key={year} className="col-md-4 mb-3">
            <div className="card shadow">
              <div className="card-body">
                <h6>Cumulative ({year})</h6>
                <p className="mb-0">{cumulativeByYear[year].toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Charts Section */}
      <div className="row mt-5">
        <div className="col-md-6 mb-4">
          <h5>Cost Distribution (Pie Chart)</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="col-md-6 mb-4">
          <h5>Average Execution % Over Period</h5>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="execution" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;