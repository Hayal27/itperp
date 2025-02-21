import React from 'react';
import MetricsCard from './MetricsCard';
import BarChartVisualization from './BarChartVisualization';
import PieChartVisualization from './PieChartVisualization'; // New import for Pie Chart

const CostMetrics = ({ totalCIExecutionPercentageCost, totalCIOutcome, totalCostPlan, costComparison }) => {
  // Build bar chart data if costComparison is available
  const barChartData = costComparison ? [
    { name: 'Cost Plan', value: costComparison.total_cost_plan },
    { name: 'CI Outcome', value: costComparison.total_cost_outcome },
    { name: 'Difference', value: costComparison.difference }
  ] : [];
  
  // Build pie chart data for cost plan vs CI outcome
  const pieChartData = costComparison ? [
    { name: 'Cost Plan', value: costComparison.total_cost_plan },
    { name: 'CI Outcome', value: costComparison.total_cost_outcome }
  ] : [];

  return (
    <div className="row g-4">
      <div className="col-md-4">
        <MetricsCard title="Total Cost Execution Percentage">
          <div className="d-flex flex-column justify-content-center align-items-center py-4">
            <p className="display-7 text-primary">
              {totalCIExecutionPercentageCost?.averageCostCIExecutionPercentage?.toLocaleString() || 0}%
            </p>
            <small className="text-muted">Total Cost Execution Percentage</small>
          </div>
        </MetricsCard>
      </div>

      <div className="col-md-4">
        <MetricsCard title="Total CI Outcome">
          <div className="d-flex flex-column justify-content-center align-items-center py-4">
            <p className="display-7 text-primary">
              {totalCIOutcome?.toLocaleString() || 0}
            </p>
            <small className="text-muted">Total CI Outcome</small>
          </div>
        </MetricsCard>
      </div>

      <div className="col-md-4">
        <MetricsCard title="Total Cost Plan (CIplan)">
          <div className="d-flex flex-column justify-content-center align-items-center py-4">
            <p className="display-7 text-success">
              {totalCostPlan?.toLocaleString() || 0}
            </p>
            <small className="text-muted">Total Cost Plan</small>
          </div>
        </MetricsCard>
      </div>

      <div className="col-md-4">
        <MetricsCard title="Cost Plan vs CI Outcome">
          <div className="d-flex flex-column justify-content-center align-items-center py-4">
            {costComparison ? (
              <>
                <p className="mb-1 fw-semibold text-dark">
                  Plan: {costComparison.total_cost_plan?.toLocaleString() || 0}
                </p>
                <p className="mb-1 fw-semibold text-dark">
                  Outcome: {costComparison.total_cost_outcome?.toLocaleString() || 0}
                </p>
                <p className="mb-0 fw-semibold text-danger">
                  Diff: {costComparison.difference?.toLocaleString() || 0}
                </p>
              </>
            ) : (
              <small className="text-muted">No data available</small>
            )}
          </div>
        </MetricsCard>
      </div>

      {/* Bar Chart Section */}
      <div className="col-md-6">
        <MetricsCard title="Bar Chart">
          {barChartData.length > 0 ? (
            <BarChartVisualization data={barChartData} />
          ) : (
            <p className="text-center text-muted">No bar chart data available</p>
          )}
        </MetricsCard>
      </div>

      {/* Pie Chart Section for Cost Plan vs CI Outcome */}
      <div className="col-md-6">
        <MetricsCard title="Pie Chart">
          {pieChartData.length > 0 ? (
            <PieChartVisualization data={pieChartData} />
          ) : (
            <p className="text-center text-muted">No pie chart data available</p>
          )}
        </MetricsCard>
      </div>
    </div>
  );
};

export default CostMetrics;