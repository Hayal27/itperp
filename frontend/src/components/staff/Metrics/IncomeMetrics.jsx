import React from 'react';
import MetricsCard from './MetricsCard';
import PieChartVisualization from './PieChartVisualization';

const IncomeMetrics = ({ totalIncomePlanETB, totalIncomeOutcomeETB, totalIncomePlanUSD, totalIncomeOutcomeUSD, costComparison }) => {
  // Build pie chart data if costComparison is available
  const pieChartData = costComparison ? [
    { name: 'Cost Plan', value: costComparison.total_cost_plan },
    { name: 'CI Outcome', value: costComparison.total_cost_outcome }
  ] : [];

  return (
    <>
      <div className="row g-4 mt-4">
        <div className="col-md-3">
          <MetricsCard title="Total Income Plan (ETB)">
            <div className="d-flex flex-column justify-content-center align-items-center py-4">
              <p className="display-7 text-success">
                {totalIncomePlanETB?.toLocaleString() || 0}
              </p>
              <small className="text-muted">Total Income Plan (ETB)</small>
            </div>
          </MetricsCard>
        </div>
        <div className="col-md-3">
          <MetricsCard title="Total Income Outcome (ETB)">
            <div className="d-flex flex-column justify-content-center align-items-center py-4">
              <p className="display-7 text-primary">
                {totalIncomeOutcomeETB?.toLocaleString() || 0}
              </p>
              <small className="text-muted">Total Income Outcome (ETB)</small>
            </div>
          </MetricsCard>
        </div>
        <div className="col-md-3">
          <MetricsCard title="Total Income Plan ($USD)">
            <div className="d-flex flex-column justify-content-center align-items-center py-4">
              <p className="display-7 text-success">
                {totalIncomePlanUSD?.toLocaleString() || 0}
              </p>
              <small className="text-muted">Total Income Plan ($USD)</small>
            </div>
          </MetricsCard>
        </div>
        <div className="col-md-3">
          <MetricsCard title="Total Income Outcome ($USD)">
            <div className="d-flex flex-column justify-content-center align-items-center py-4">
              <p className="display-7 text-primary">
                {totalIncomeOutcomeUSD?.toLocaleString() || 0}
              </p>
              <small className="text-muted">Total Income Outcome ($USD)</small>
            </div>
          </MetricsCard>
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="row g-4 mt-4">
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
    </>
  );
};

export default IncomeMetrics;