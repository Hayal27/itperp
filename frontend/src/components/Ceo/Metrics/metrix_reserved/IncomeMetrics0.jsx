import React, { useEffect } from 'react';
import MetricsCard from './MetricsCard';
import BarChartVisualization from './BarChartVisualization';
import PieChartVisualization from './PieChartVisualization';
import IncomeChart from './IncomeChart'; // Import the new IncomeChart component

const IncomeMetrics = ({
  totalIncomePlanETB,
  totalIncomeOutcomeETB,
  totalIncomePlanUSD,
  totalIncomeOutcomeUSD,
  comparisonIncomePlanOutcomeETB,
  comparisonIncomePlanOutcomeUSD,
  compareIncomePlanOutcomeTotal
}) => {
  useEffect(() => {
    console.log('Income Metrics Data:', {
      compareIncomePlanOutcomeTotal,
      comparisonIncomePlanOutcomeETB,
      comparisonIncomePlanOutcomeUSD
    });
  }, [compareIncomePlanOutcomeTotal, comparisonIncomePlanOutcomeETB, comparisonIncomePlanOutcomeUSD]);

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

  const barChartDataTotal = compareIncomePlanOutcomeTotal?.combined_ETB ? [
    { name: 'Income Plan ETB', value: compareIncomePlanOutcomeTotal.combined_ETB.plan },
    { name: 'Income Outcome ETB', value: compareIncomePlanOutcomeTotal.combined_ETB.outcome },
    { name: 'Difference', value: compareIncomePlanOutcomeTotal.combined_ETB.difference }
  ] : [];

  // Prepare pie chart data
  const pieChartData = comparisonIncomePlanOutcomeETB ? [
    { name: 'Income Plan ETB', value: comparisonIncomePlanOutcomeETB.total_income_plan_ETB },
    { name: 'Income Outcome ETB', value: comparisonIncomePlanOutcomeETB.total_income_outcome_ETB }
  ] : [];

  const pieChartDataUSD = comparisonIncomePlanOutcomeUSD ? [
    { name: 'Income Plan USD', value: comparisonIncomePlanOutcomeUSD.total_income_plan_USD },
    { name: 'Income Outcome USD', value: comparisonIncomePlanOutcomeUSD.total_income_outcome_USD }
  ] : [];

  const pieChartDataTotal = compareIncomePlanOutcomeTotal?.combined_ETB ? [
    { name: 'Income Plan ETB', value: compareIncomePlanOutcomeTotal.combined_ETB.plan },
    { name: 'Income Outcome ETB', value: compareIncomePlanOutcomeTotal.combined_ETB.outcome }
  ] : [];

  // Prepare data object for IncomeChart component
  const incomeChartData =
    compareIncomePlanOutcomeTotal?.combined_ETB &&
    comparisonIncomePlanOutcomeETB &&
    comparisonIncomePlanOutcomeUSD
      ? {
          combined_ETB: compareIncomePlanOutcomeTotal.combined_ETB,
          breakdown: {
            ETB: {
              plan: comparisonIncomePlanOutcomeETB.total_income_plan_ETB,
              outcome: comparisonIncomePlanOutcomeETB.total_income_outcome_ETB,
              difference: comparisonIncomePlanOutcomeETB.difference,
            },
            USD: {
              plan: comparisonIncomePlanOutcomeUSD.total_income_plan_USD,
              outcome: comparisonIncomePlanOutcomeUSD.total_income_outcome_USD,
              difference: comparisonIncomePlanOutcomeUSD.difference,
            },
          },
        }
      : null;

  return (
    <>
      <div className='container-dashboard'>
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

          {/* New Combined Total Card */}
          <div className="col-md-3">
            <MetricsCard title="Combined Total (ETB)">
              <div className="d-flex flex-column justify-content-center align-items-center py-4">
                {compareIncomePlanOutcomeTotal?.combined_ETB ? (
                  <>
                    <div className="text-center">
                      <p className="mb-2">
                        <span className="text-success">Plan: </span>
                        {compareIncomePlanOutcomeTotal.combined_ETB.plan?.toLocaleString() || 0} ETB
                      </p>
                      <p className="mb-2">
                        <span className="text-primary">Outcome: </span>
                        {compareIncomePlanOutcomeTotal.combined_ETB.outcome?.toLocaleString() || 0} ETB
                      </p>
                      <p className="mb-0">
                        <span className={compareIncomePlanOutcomeTotal.combined_ETB.difference >= 0 ? 'text-success' : 'text-danger'}>
                          Difference: {compareIncomePlanOutcomeTotal.combined_ETB.difference?.toLocaleString() || 0} ETB
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-muted">No combined total data available</p>
                )}
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

        {/* New row for the embedded IncomeChart */}
        <div className="row g-4 mt-4">
          <div className="col-12">
            <MetricsCard title="Income Chart">
              {incomeChartData ? (
                <IncomeChart data={incomeChartData} />
              ) : (
                <p className="text-center text-muted">No data available for Income Chart</p>
              )}
            </MetricsCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default IncomeMetrics;