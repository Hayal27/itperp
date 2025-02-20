import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MetricsCard from './MetricsCard';
import FilterForm from './FilterForm';
import BarChartVisualization from './BarChartVisualization';
import PieChartVisualization from './PieChartVisualization';
import { Alert, AlertDescription } from "@/components/ui/alert";
import '../../assets/css/Dashboard.css';

const StaffDashboard = () => {
  // For cost metrics
  const [totalCIExecutionPercentageCost, setTotalCIExecutionPercentageCost] = useState(null);
  const [totalCostPlan, setTotalCostPlan] = useState(null);
  const [costComparison, setCostComparison] = useState(null);
  const [totalCIOutcome, setTotalCIOutcome] = useState(null);

  // For income metrics
  const [totalIncomePlanETB, setTotalIncomePlanETB] = useState(null);
  const [totalIncomeOutcomeETB, setTotalIncomeOutcomeETB] = useState(null);
  const [totalIncomePlanUSD, setTotalIncomePlanUSD] = useState(null);
  const [totalIncomeOutcomeUSD, setTotalIncomeOutcomeUSD] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter state managed as an object
  const [filters, setFilters] = useState({
    year: '',
    quarter: '',
    department: '',
    createdBy: '',
    view: ''
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  // Function to build query string from filters
  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        // Map createdBy to created_by for backend compatibility
        params.append(key === 'createdBy' ? 'created_by' : key, filters[key]);
      }
    });
    return params.toString();
  };

  // Fetch metrics from the backend (both cost and income)
  const fetchMetrics = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      const errorMessage = 'Authentication token not found';
      console.error(errorMessage);
      setError(errorMessage);
      setLoading(false);
      return;
    }
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const queryString = buildQueryString();
    try {
      // Execute API calls in parallel:
      // Cost APIs:
      //  - /displayTotalCostExcutionPercentage
      //  - /displayTotalCost
      //  - /displayTotalCostPlan
      //  - /compareCostPlanOutcome
      // Income APIs:
      //  - /displayTotalIncomeplanETB
      //  - /displayTotalIncomeOutcomeETB
      //  - /displayTotalIncomePlanUSD
      //  - /displayTotalIncomeOutcomeUSD
      const [
        executionPercentageRes,
        outcomeRes,
        planRes,
        compareRes,
        incomePlanETBRes,
        incomeOutcomeETBRes,
        incomePlanUSDRes,
        incomeOutcomeUSDRes
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/displayTotalCostExcutionPercentage?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalCost`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalCostPlan?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/compareCostPlanOutcome?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalIncomeplanETB?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalIncomeOutcomeETB?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalIncomePlanUSD?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalIncomeOutcomeUSD?${queryString}`, { headers })
      ]);
      // Set cost metrics
      setTotalCIExecutionPercentageCost(executionPercentageRes.data);
      setTotalCIOutcome(outcomeRes.data);
      setTotalCostPlan(planRes.data);
      setCostComparison(compareRes.data);
      // Set income metrics
      setTotalIncomePlanETB(incomePlanETBRes.data);
      setTotalIncomeOutcomeETB(incomeOutcomeETBRes.data);
      setTotalIncomePlanUSD(incomePlanUSDRes.data);
      setTotalIncomeOutcomeUSD(incomeOutcomeUSDRes.data);
      setError('');
    } catch (axiosError) {
      console.error('Error fetching metrics from backend:', axiosError);
      setError(axiosError.response?.data?.message || 'Failed to fetch metrics from backend');
    } finally {
      setLoading(false);
    }
  };

  // Update filters and re-fetch metrics
  const handleFilterSubmit = (formFilters) => {
    setFilters(formFilters);
    setLoading(true);
    fetchMetrics();
  };

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-gray-100">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-4">
        <Alert variant="destructive" className="text-center">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Prepare data for charts (using costComparison data)
  const barChartData = costComparison ? [
    { name: 'Cost Plan', value: costComparison.total_cost_plan },
    { name: 'CI Outcome', value: costComparison.total_cost_outcome },
    { name: 'Difference', value: costComparison.difference }
  ] : [];

  const pieChartData = costComparison ? [
    { name: 'Cost Plan', value: costComparison.total_cost_plan },
    { name: 'CI Outcome', value: costComparison.total_cost_outcome }
  ] : [];

  return (
    <div className="container-fluid p-4">
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary">Staff Dashboard</h1>
        </div>

        <FilterForm filters={filters} onSubmit={handleFilterSubmit} />

        {/* Cost Metrics */}
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
        </div>

        {/* Income Metrics */}
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

        {/* Charts Section (using existing cost data) */}
        <div className="row g-4 mt-4">
          <div className="col-md-6">
            <MetricsCard title="Bar Chart">
              {barChartData.length > 0 ? (
                <BarChartVisualization data={barChartData} />
              ) : (
                <p className="text-center text-muted">No bar chart data available</p>
              )}
            </MetricsCard>
          </div>
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
      </div>
    </div>
  );
};

export default StaffDashboard;