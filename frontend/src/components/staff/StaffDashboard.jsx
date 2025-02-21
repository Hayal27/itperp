import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FilterForm from './FilterForm';
import CostMetrics from './Metrics/CostMetrics';
import IncomeMetrics from './Metrics/IncomeMetrics';
import { Alert, AlertDescription } from '@/components/ui/alert';

const StaffDashboard = () => {
  // Cost metrics state
  const [totalCIExecutionPercentageCost, setTotalCIExecutionPercentageCost] = useState(null);
  const [totalCIOutcome, setTotalCIOutcome] = useState(null);
  const [totalCostPlan, setTotalCostPlan] = useState(null);
  const [costComparison, setCostComparison] = useState(null);

  // Income metrics state
  const [totalIncomePlanETB, setTotalIncomePlanETB] = useState(null);
  const [totalIncomeOutcomeETB, setTotalIncomeOutcomeETB] = useState(null);
  const [totalIncomePlanUSD, setTotalIncomePlanUSD] = useState(null);
  const [totalIncomeOutcomeUSD, setTotalIncomeOutcomeUSD] = useState(null);
  const [totalComparisonIncomePlanOutcomeETB, setComparisonIncomePlanOutcomeETB] = useState(null);
  const [totalComparisonIncomePlanOutcomeUSD, setComparisonIncomePlanOutcomeUSD] = useState(null);

  const [CompareIncomePlanOutcomeTotal, setCompareIncomePlanOutcomeTotal] = useState(null);

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

  // Build query string based on filters
  const buildQueryString = () => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params.append(key === 'createdBy' ? 'created_by' : key, filters[key]);
      }
    });
    return params.toString();
  };

  // Fetch metrics from backend
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
      const [
        executionPercentageRes,
        outcomeRes,
        planRes,
        compareRes,
        incomePlanETBRes,
        incomeOutcomeETBRes,
        incomePlanUSDRes,
        incomeOutcomeUSDRes,
        incomePlanOutcomeETBRes,
        incomePlanOutcomeUSDRes,
        CompareIncomePlanOutcomeTotalRes
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/displayTotalCostExcutionPercentage?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalCost`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalCostPlan?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/compareCostPlanOutcome?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalIncomeplanETB?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalIncomeOutcomeETB?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalIncomePlanUSD?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/displayTotalIncomeOutcomeUSD?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/compareIncomePlanOutcomeETB?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/compareIncomePlanOutcomeUSD?${queryString}`, { headers }),
        axios.get(`${API_BASE_URL}/CompareIncomePlanOutcomeTotal?${queryString}`, { headers })
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
      setComparisonIncomePlanOutcomeETB(incomePlanOutcomeETBRes.data);
      setComparisonIncomePlanOutcomeUSD(incomePlanOutcomeUSDRes.data);
      setCompareIncomePlanOutcomeTotal(CompareIncomePlanOutcomeTotalRes.data);

      // Console log only the fetched CompareIncomePlanOutcomeTotal data
      console.log("CompareIncomePlanOutcomeTotal data:", CompareIncomePlanOutcomeTotalRes.data);

      setError('');
    } catch (axiosError) {
      console.error('Error fetching metrics from backend:', axiosError);
      setError(axiosError.response?.data?.message || 'Failed to fetch metrics from backend');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter submission and trigger re-fetching of metrics
  const handleFilterSubmit = (formFilters) => {
    setFilters(formFilters);
    setLoading(true);
    fetchMetrics();
  };

  useEffect(() => {
    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-gray-100">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container my-4">
        <Alert variant="destructive" className="text-center">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary"></h1>
        </div>

        <FilterForm filters={filters} onSubmit={handleFilterSubmit} />

        {/* Render cost related metrics */}
        <CostMetrics
          totalCIExecutionPercentageCost={totalCIExecutionPercentageCost}
          totalCIOutcome={totalCIOutcome}
          totalCostPlan={totalCostPlan}
          costComparison={costComparison}
        />

        {/* Render income related metrics */}
        <IncomeMetrics
          totalIncomePlanETB={totalIncomePlanETB}
          totalIncomeOutcomeETB={totalIncomeOutcomeETB}
          totalIncomePlanUSD={totalIncomePlanUSD}
          totalIncomeOutcomeUSD={totalIncomeOutcomeUSD}
          comparisonIncomePlanOutcomeETB={totalComparisonIncomePlanOutcomeETB}
          comparisonIncomePlanOutcomeUSD={totalComparisonIncomePlanOutcomeUSD}
          CompareIncomePlanOutcomeTotal={CompareIncomePlanOutcomeTotal}
        />
      </div>
    </div>
  );
};

export default StaffDashboard;