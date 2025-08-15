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
  console.log("📊 DashboardSummary received plans:", sortedPlans);

  // Aggregated Data Calculations based on the new API structure
  let totalCostPlan = 0,
    totalCostOutcome = 0,
    totalIncomePlan = 0,
    totalIncomeOutcome = 0,
    totalPlans = 0,
    totalProgress = 0;

  sortedPlans.forEach((plan) => {
    totalPlans++;

    // Use the correct field names from the backend API
    const planType = plan.Plan_Type || plan.plan_type;
    const planValue = Number(plan.Plan) || 0;
    const outcomeValue = Number(plan.Outcome) || 0;
    const progressValue = Number(plan.Progress) || 0;
    const executionPercentage = Number(plan.Execution_Percentage) || 0;

    totalProgress += progressValue;

    if (planType && planType.toLowerCase() === "cost") {
      totalCostPlan += planValue;
      totalCostOutcome += outcomeValue;
    } else if (planType && planType.toLowerCase() === "income") {
      totalIncomePlan += planValue;
      totalIncomeOutcome += outcomeValue;
    }
  });

  const costExecutionPercentage = totalCostPlan
    ? (totalCostOutcome / totalCostPlan) * 100
    : 0;
  const incomeExecutionPercentage = totalIncomePlan
    ? (totalIncomeOutcome / totalIncomePlan) * 100
    : 0;
  const averageProgress = totalPlans ? totalProgress / totalPlans : 0;

  // Data for Pie Chart: Cost distribution by cost type
  const costDistribution = {};
  const departmentDistribution = {};

  sortedPlans.forEach((plan) => {
    const planType = plan.Plan_Type || plan.plan_type;
    const costType = plan.Cost_Type || plan.cost_type || "Unknown";
    const department = plan.Department || "Unknown";
    const planVal = Number(plan.Plan) || 0;

    // Cost distribution
    if (planType && planType.toLowerCase() === "cost") {
      costDistribution[costType] = (costDistribution[costType] || 0) + planVal;
    }

    // Department distribution
    departmentDistribution[department] = (departmentDistribution[department] || 0) + planVal;
  });

  const pieData = Object.keys(costDistribution).map((key) => ({
    name: key,
    value: costDistribution[key],
  }));

  const departmentPieData = Object.keys(departmentDistribution).map((key) => ({
    name: key,
    value: departmentDistribution[key],
  }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

  // Data for Line Chart: Execution percentage over time
  const executionByPeriod = {};
  const progressByPeriod = {};

  sortedPlans.forEach((plan) => {
    const year = plan.Year;
    const quarter = plan.Quarter;

    if (year && quarter) {
      const key = `${year} Q${quarter}`;
      const exec = Number(plan.Execution_Percentage) || 0;
      const progress = Number(plan.Progress) || 0;

      // Execution percentage tracking
      if (!executionByPeriod[key]) {
        executionByPeriod[key] = { total: exec, count: 1 };
      } else {
        executionByPeriod[key].total += exec;
        executionByPeriod[key].count++;
      }

      // Progress tracking
      if (!progressByPeriod[key]) {
        progressByPeriod[key] = { total: progress, count: 1 };
      } else {
        progressByPeriod[key].total += progress;
        progressByPeriod[key].count++;
      }
    }
  });

  const lineData = Object.keys(executionByPeriod).map((key) => ({
    period: key,
    execution: executionByPeriod[key].count
      ? executionByPeriod[key].total / executionByPeriod[key].count
      : 0,
    progress: progressByPeriod[key] && progressByPeriod[key].count
      ? progressByPeriod[key].total / progressByPeriod[key].count
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
      <div className="dashboard-header">
        <h3 className="dashboard-title">📊 Executive Dashboard Summary</h3>
        <p className="dashboard-subtitle">Comprehensive overview of organizational performance</p>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary shadow-lg">
            <div className="card-body">
              <div className="card-icon">📋</div>
              <h5 className="card-title">Total Reports</h5>
              <p className="card-text display-6">{totalPlans}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success shadow-lg">
            <div className="card-body">
              <div className="card-icon">📈</div>
              <h5 className="card-title">Average Progress</h5>
              <p className="card-text display-6">{averageProgress.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info shadow-lg">
            <div className="card-body">
              <div className="card-icon">💰</div>
              <h5 className="card-title">Total Cost Plan</h5>
              <p className="card-text display-6">{totalCostPlan.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning shadow-lg">
            <div className="card-body">
              <div className="card-icon">🎯</div>
              <h5 className="card-title">Cost Execution</h5>
              <p className="card-text display-6">{costExecutionPercentage.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success shadow-lg">
            <div className="card-body">
              <div className="card-icon">💵</div>
              <h5 className="card-title">Total Cost Outcome</h5>
              <p className="card-text display-6">{totalCostOutcome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-white bg-info shadow-lg">
            <div className="card-body">
              <div className="card-icon">💎</div>
              <h5 className="card-title">Total Income Plan</h5>
              <p className="card-text display-6">{totalIncomePlan.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success shadow-lg">
            <div className="card-body">
              <div className="card-icon">💰</div>
              <h5 className="card-title">Total Income Outcome</h5>
              <p className="card-text display-6">{totalIncomeOutcome.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning shadow-lg">
            <div className="card-body">
              <div className="card-icon">📊</div>
              <h5 className="card-title">Income Execution</h5>
              <p className="card-text display-6">{incomeExecutionPercentage.toFixed(1)}%</p>
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
        <div className="col-md-4 mb-4">
          <div className="chart-card">
            <h5 className="chart-title">💰 Cost Distribution by Type</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={80} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="chart-card">
            <h5 className="chart-title">🏢 Department Distribution</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie dataKey="value" data={departmentPieData} cx="50%" cy="50%" outerRadius={80} label>
                  {departmentPieData.map((entry, index) => (
                    <Cell key={`dept-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value.toLocaleString(), 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="chart-card">
            <h5 className="chart-title">📈 Performance Over Time</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  `${value.toFixed(1)}%`,
                  name === 'execution' ? 'Execution %' : 'Progress %'
                ]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="execution"
                  stroke="#8884d8"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  name="Execution %"
                />
                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#82ca9d"
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  name="Progress %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;