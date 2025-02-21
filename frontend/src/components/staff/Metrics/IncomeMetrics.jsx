import React from 'react';
import MetricsCard from './MetricsCard';
import BarChartVisualization from './BarChartVisualization';
import PieChartVisualization from './PieChartVisualization';


const IncomeMetrics = ({
  totalIncomePlanETB,
  totalIncomeOutcomeETB,
  totalIncomePlanUSD,
  totalIncomeOutcomeUSD,
  comparisonIncomePlanOutcomeETB,
  comparisonIncomePlanOutcomeUSD,
  compareIncomePlanOutcomeTotal  // The backend returns an object with combined_ETB, etc.
}) => {
  // Chart data preparation for ETB and USD comparisons
  const barChartData = comparisonIncomePlanOutcomeETB ? [
    { name: 'Income Plan ETB', value: comparisonIncomePlanOutcomeETB.total_income_plan_ETB },
    { name: 'Income Outcome ETB', value: comparisonIncomePlanOutcomeETB.total_income_outcome_ETB },
    { name: 'Difference', value: comparisonIncomePlanOutcomeETB.difference }
  ] : [];

  const barChartDataUSD = comparisonIncomePlanOutcomeUSD ? [
    { name: 'Income Plan USD', value: comparisonIncomePlanOutcomeUSD.total_income_plan_USD },
    { name: 'Income Outcome USD', value: comparisonIncomePlanOutcomeUSD.total_income_outcome_USD },
    { name: 'Difference', value: comparisonIncomePlanOutcomeUSD.difference }
  ] : [];

  // Using the compareIncomePlanOutcomeTotal prop properly:
  // The fetched data includes a nested 'combined_ETB' object.
  const barChartDataTotal = 
    compareIncomePlanOutcomeTotal && compareIncomePlanOutcomeTotal.combined_ETB ? [
      { name: 'Income Plan ETB', value: compareIncomePlanOutcomeTotal.combined_ETB.plan },
      { name: 'Income Outcome ETB', value: compareIncomePlanOutcomeTotal.combined_ETB.outcome },
      { name: 'Difference', value: compareIncomePlanOutcomeTotal.combined_ETB.difference }
  ] : [];

  // Prepare pie chart data for ETB and USD distributions.
  const pieChartData = comparisonIncomePlanOutcomeETB ? [
    { name: 'Income Plan ETB', value: comparisonIncomePlanOutcomeETB.total_income_plan_ETB },
    { name: 'Income Outcome ETB', value: comparisonIncomePlanOutcomeETB.total_income_outcome_ETB }
  ] : [];

  const pieChartDataUSD = comparisonIncomePlanOutcomeUSD ? [
    { name: 'Income Plan USD', value: comparisonIncomePlanOutcomeUSD.total_income_plan_USD },
    { name: 'Income Outcome USD', value: comparisonIncomePlanOutcomeUSD.total_income_outcome_USD }
  ] : [];

  // Using the combined_ETB from compareIncomePlanOutcomeTotal for the total distribution pie chart.
  const pieChartDataTotal = 
    compareIncomePlanOutcomeTotal && compareIncomePlanOutcomeTotal.combined_ETB ? [
      { name: 'Income Plan ETB', value: compareIncomePlanOutcomeTotal.combined_ETB.plan },
      { name: 'Income Outcome ETB', value: compareIncomePlanOutcomeTotal.combined_ETB.outcome }
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

      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <MetricsCard title="ETB Income Comparison">
            {barChartData.length > 0 ? (
              <BarChartVisualization data={barChartData} />
            ) : (
              <p className="text-center text-muted">No ETB comparison data available</p>
            )}
          </MetricsCard>
        </div>

        <div className="col-md-6">
          <MetricsCard title="USD Income Comparison">
            {barChartDataUSD.length > 0 ? (
              <BarChartVisualization data={barChartDataUSD} />
            ) : (
              <p className="text-center text-muted">No USD comparison data available</p>
            )}
          </MetricsCard>
        </div>

        <div className="col-md-6">
          <MetricsCard title="Total Income Comparison (Combined ETB)">
            {barChartDataTotal.length > 0 ? (
              <BarChartVisualization data={barChartDataTotal} />
            ) : (
              <p className="text-center text-muted">No combined comparison data available</p>
            )}
          </MetricsCard>
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-4">
          <MetricsCard title="ETB Distribution">
            {pieChartData.length > 0 ? (
              <PieChartVisualization data={pieChartData} />
            ) : (
              <p className="text-center text-muted">No ETB distribution data available</p>
            )}
          </MetricsCard>
        </div>

        <div className="col-md-4">
          <MetricsCard title="USD Distribution">
            {pieChartDataUSD.length > 0 ? (
              <PieChartVisualization data={pieChartDataUSD} />
            ) : (
              <p className="text-center text-muted">No USD distribution data available</p>
            )}
          </MetricsCard>
        </div>

        <div className="col-md-4">
          <MetricsCard title="Total Distribution (Combined ETB)">
            {pieChartDataTotal.length > 0 ? (
              <PieChartVisualization data={pieChartDataTotal} />
            ) : (
              <p className="text-center text-muted">No combined distribution data available</p>
            )}
          </MetricsCard>
        </div>
      </div>
    </>
  );
};

export default IncomeMetrics;