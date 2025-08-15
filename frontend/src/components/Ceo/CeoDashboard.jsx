import React, { useState, useEffect, useRef } from "react";
import FilterForm from "./FilterForm";
import IncomeMetricsBarchart from "./Metrics/IncomeMetricsBarchart";
import IncomeMetricsPichart from "./Metrics/IncomeMetricsPichart";
import IncomeMetricsDataTable from "./Metrics/IncomeMetricsDataTable";
import CostMetricsBarchart from "./Metrics/CostMetricsBarchart";
import CostMetricsPichart from "./Metrics/CostMetricsPichart";
import CostMetricsDataTable from "./Metrics/CostMetricsDataTable";
import CostPlanOutcomeDifferenceRegularBudget from "./Metrics/CostPlanOutcomeDifferenceRegularBudget";
import CostPlan_Outcome_difference_regular_budget_pichart from "./Metrics/CostPlan_Outcome_difference_regular_budget_pichart";
import CostPlanOutcomeDifferenceRegularBudgetTable from "./Metrics/CostPlanOutcomeDifferenceRegularBudgetTable";

// Capital budget components
import CostPlanOutcomeDifferenceCapitalBudgetTable from "./Metrics/CostPlanOutcomeDifferenceCapitalBudgetTable";
import CostPlanOutcomeDifferenceCapitalBudget from "./Metrics/CostPlanOutcomeDifferenceCapitalBudget";
import CostPlanOutcomeDifferenceCapitalBudgetPieChart from "./Metrics/CostPlan_Outcome_difference_capital_budget_pichart";

// Services and utilities
import { fetchDashboardData } from "./services/dashboardService";
import NotificationDisplay from "./NotificationDisplay";
import ExportSelection from "./ExportSelection";
import DashboardViewSelector from "./DashboardViewSelector";

// CEO Sidebar integration utilities
import { initializeCeoSidebarIntegration, useCeoSidebarIntegration } from './CeoSidebarUtils';

// Professional CEO Dashboard Styles
import "./CeoDashboard.css";
import "../admin/AdminComponents.css"; // Import admin styles for consistency



/**
 * Helper function to decide if a chart/table type should be rendered
 * based on the current view filter.
 */
const shouldRender = (viewFilter, componentType) =>
  viewFilter === "all" || viewFilter === componentType;

/**
 * Professional Income Metrics Section Component
 * Enhanced with CEO-specific styling and professional layout
 */
const IncomeMetricsSection = ({ data, viewFilter, incomeVisible, toggleVisibility }) => {
  useEffect(() => {
    if (data && data.extra && data.extra.filteredIncomeMetrics) {
      console.log("Filtered Income Metrics Data:", data.extra.filteredIncomeMetrics);
    }
  }, [data]);

  return (
    <div className="ceo-metrics-section ceo-income-section" id="incomeMetrics">
      <div className="ceo-section-header">
        <button
          className="ceo-section-toggle"
          onClick={toggleVisibility}
          aria-expanded={incomeVisible}
          aria-controls="income-content"
        >
          <i className={`bi ${incomeVisible ? 'bi-chevron-up' : 'bi-chevron-down'} ceo-toggle-icon`}></i>
          <h2 className="ceo-section-title">
            <i className="bi bi-graph-up-arrow ceo-section-icon"></i>
            Income Analytics
            <span className="ceo-section-subtitle">ገቢ ትንተና</span>
          </h2>
        </button>
        <div className="ceo-section-badge">
          <span className="ceo-badge ceo-badge-success">Active</span>
        </div>
      </div>

      <div
        id="income-content"
        className={`ceo-section-content ${incomeVisible ? 'ceo-expanded' : 'ceo-collapsed'}`}
      >
        {incomeVisible && (
          <>
            {/* Professional Income Charts Grid */}
            <div className="ceo-charts-grid">
              {shouldRender(viewFilter, "bar") && (
                <div className="ceo-chart-card ceo-chart-primary">
                  <div className="ceo-card-header">
                    <h3 className="ceo-card-title">
                      <i className="bi bi-bar-chart ceo-card-icon"></i>
                      Total Income Summation
                    </h3>
                    <span className="ceo-card-subtitle">ETB & USD Analysis</span>
                  </div>
                  <div className="ceo-card-body">
                    <IncomeMetricsBarchart data={data.extra.filteredIncomeMetrics || data} />
                  </div>
                </div>
              )}

              {shouldRender(viewFilter, "pi") && (
                <div className="ceo-chart-card ceo-chart-secondary">
                  <div className="ceo-card-header">
                    <h3 className="ceo-card-title">
                      <i className="bi bi-pie-chart ceo-card-icon"></i>
                      Income Distribution
                    </h3>
                    <span className="ceo-card-subtitle">Breakdown Analysis</span>
                  </div>
                  <div className="ceo-card-body">
                    <IncomeMetricsPichart data={data.extra.filteredIncomeMetrics || data} />
                  </div>
                </div>
              )}
            </div>

            {/* Professional Income Data Table */}
            {shouldRender(viewFilter, "tables") && (
              <div className="ceo-data-table-container">
                <div className="ceo-table-header">
                  <h3 className="ceo-table-title">
                    <i className="bi bi-table ceo-table-icon"></i>
                    Detailed Income Report
                  </h3>
                  <span className="ceo-table-subtitle">የታቀደው/የተገኘው ገቢ በ ETB እና USD</span>
                </div>
                <div className="ceo-table-wrapper">
                  <IncomeMetricsDataTable data={data.extra.filteredIncomeMetrics || data} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Professional Cost Metrics Section Component
 * Enhanced with CEO-specific styling and comprehensive cost analysis
 */
const CostMetricsSection = ({ data, viewFilter, costVisible, toggleVisibility, appliedFilters }) => {
  useEffect(() => {
    if (data && data.extra) {
      console.log("Filtered Regular Budget Data:", data.extra.filteredRegularBudget);
      console.log("Filtered Total Cost Data:", data.extra.filteredTotalCost);
      console.log("Filtered Compare CostPlanOutcome Data:", data.extra.filteredCompareCostPlanOutcome);
      console.log("Filtered Total Cost Execution Percentage Data:", data.extra.filteredExecutionPercentage);
    }
  }, [data]);

  return (
    <div className="ceo-metrics-section ceo-cost-section" id="costMetrics">
      <div className="ceo-section-header">
        <button
          className="ceo-section-toggle"
          onClick={toggleVisibility}
          aria-expanded={costVisible}
          aria-controls="cost-content"
        >
          <i className={`bi ${costVisible ? 'bi-chevron-up' : 'bi-chevron-down'} ceo-toggle-icon`}></i>
          <h2 className="ceo-section-title">
            <i className="bi bi-graph-down-arrow ceo-section-icon"></i>
            Cost Analytics
            <span className="ceo-section-subtitle">ወጪ ትንተና</span>
          </h2>
        </button>
        <div className="ceo-section-badge">
          <span className="ceo-badge ceo-badge-warning">Monitoring</span>
        </div>
      </div>

      <div
        id="cost-content"
        className={`ceo-section-content ${costVisible ? 'ceo-expanded' : 'ceo-collapsed'}`}
      >
        {costVisible && (
          <>
            {/* Professional Cost Analysis Grid */}
            <div className="ceo-cost-analysis-grid">
              {shouldRender(viewFilter, "bar") && (
                <>
                  <div className="ceo-cost-card ceo-cost-primary">
                    <div className="ceo-card-header">
                      <h4 className="ceo-card-title">
                        <i className="bi bi-currency-exchange ceo-card-icon"></i>
                        Total Cost Analysis
                      </h4>
                      <span className="ceo-card-subtitle">ETB (millions birr)</span>
                    </div>
                    <div className="ceo-card-body">
                      <CostMetricsBarchart
                        data={{
                          total_cost: data.extra.filteredTotalCost || data.extra.displayTotalCost
                        }}
                        type="totalCost"
                      />
                    </div>
                  </div>

                  <div className="ceo-cost-card ceo-cost-secondary">
                    <div className="ceo-card-header">
                      <h4 className="ceo-card-title">
                        <i className="bi bi-clipboard-data ceo-card-icon"></i>
                        Cost Planning
                      </h4>
                      <span className="ceo-card-subtitle">Total Cost Plan</span>
                    </div>
                    <div className="ceo-card-body">
                      <CostMetricsBarchart
                        data={{
                          total_cost_plan: data.extra.filteredTotalCostPlan || data.extra.displayTotalCostPlan
                        }}
                        type="totalCostPlan"
                      />
                    </div>
                  </div>

                  <div className="ceo-cost-card ceo-cost-comparison">
                    <div className="ceo-card-header">
                      <h4 className="ceo-card-title">
                        <i className="bi bi-graph-up ceo-card-icon"></i>
                        Plan vs Outcome
                      </h4>
                      <span className="ceo-card-subtitle">Comparison Analysis</span>
                    </div>
                    <div className="ceo-card-body">
                      <CostMetricsBarchart
                        data={data.extra.filteredCompareCostPlanOutcome || data.extra.compareCostPlanOutcome}
                        type="compareCostPlanOutcome"
                      />
                    </div>
                  </div>

                  <div className="ceo-cost-card ceo-cost-performance">
                    <div className="ceo-card-header">
                      <h4 className="ceo-card-title">
                        <i className="bi bi-speedometer2 ceo-card-icon"></i>
                        Execution Rate
                      </h4>
                      <span className="ceo-card-subtitle">Performance Percentage</span>
                    </div>
                    <div className="ceo-card-body">
                      <CostMetricsBarchart
                        data={{
                          averageCostCIExecutionPercentage:
                            data.extra.filteredExecutionPercentage?.averageCostCIExecutionPercentage ||
                            data.extra.displayTotalCostExcutionPercentage?.averageCostCIExecutionPercentage
                        }}
                        type="totalCostExcutionPercentage"
                      />
                    </div>
                  </div>
                </>
              )}

              {shouldRender(viewFilter, "pi") && (
                <>
                  <div className="ceo-cost-card ceo-cost-primary">
                    <div className="ceo-card-header">
                      <h4 className="ceo-card-title">
                        <i className="bi bi-pie-chart ceo-card-icon"></i>
                        Cost Distribution
                      </h4>
                      <span className="ceo-card-subtitle">ETB (millions birr)</span>
                    </div>
                    <div className="ceo-card-body">
                      <CostMetricsPichart
                        data={{
                          total_cost: data.extra.filteredTotalCost || data.extra.displayTotalCost
                        }}
                        type="totalCost"
                      />
                    </div>
                  </div>

                  <div className="ceo-cost-card ceo-cost-secondary">
                    <div className="ceo-card-header">
                      <h4 className="ceo-card-title">
                        <i className="bi bi-pie-chart-fill ceo-card-icon"></i>
                        Plan Distribution
                      </h4>
                      <span className="ceo-card-subtitle">Total Cost Plan</span>
                    </div>
                    <div className="ceo-card-body">
                      <CostMetricsPichart
                        data={{
                          total_cost_plan: data.extra.filteredTotalCostPlan || data.extra.displayTotalCostPlan
                        }}
                        type="totalCostPlan"
                      />
                    </div>
                  </div>

                  <div className="ceo-cost-card ceo-cost-comparison">
                    <div className="ceo-card-header">
                      <h4 className="ceo-card-title">
                        <i className="bi bi-diagram-3 ceo-card-icon"></i>
                        Comparison Chart
                      </h4>
                      <span className="ceo-card-subtitle">Plan vs Outcome</span>
                    </div>
                    <div className="ceo-card-body">
                      <CostMetricsPichart
                        data={data.extra.filteredCompareCostPlanOutcome || data.extra.compareCostPlanOutcome}
                        type="compareCostPlanOutcome"
                      />
                    </div>
                  </div>

                  <div className="ceo-cost-card ceo-cost-performance">
                    <div className="ceo-card-header">
                      <h4 className="ceo-card-title">
                        <i className="bi bi-percent ceo-card-icon"></i>
                        Performance Pie
                      </h4>
                      <span className="ceo-card-subtitle">Execution Percentage</span>
                    </div>
                    <div className="ceo-card-body">
                      <CostMetricsPichart
                        data={{
                          averageCostCIExecutionPercentage:
                            data.extra.filteredExecutionPercentage?.averageCostCIExecutionPercentage ||
                            data.extra.displayTotalCostExcutionPercentage?.averageCostCIExecutionPercentage
                        }}
                        type="totalCostExcutionPercentage"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Professional Cost Data Table */}
            {shouldRender(viewFilter, "tables") && (
              <div className="ceo-data-table-container">
                <div className="ceo-table-header">
                  <h3 className="ceo-table-title">
                    <i className="bi bi-table ceo-table-icon"></i>
                    Comprehensive Cost Analysis
                  </h3>
                  <span className="ceo-table-subtitle">ጠቅላላ የ ወጪ እቅድ</span>
                </div>
                <div className="ceo-table-wrapper">
                  <CostMetricsDataTable data={data} type="totalCostPlan" />
                </div>
              </div>
            )}


          {/* Regular Budget Section */}
          <div className="ceo-charts-row">

            {shouldRender(viewFilter, "bar") && (
              <div className="ceo-chart-container">
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceRegularBudget filters={appliedFilters} />
              </div>
            )}

             {shouldRender(viewFilter, "pi") && (
              <div className="ceo-chart-container">
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlan_Outcome_difference_regular_budget_pichart filters={appliedFilters} />
              </div>
            )}

            {shouldRender(viewFilter, "tables") && (
              <div className="ceo-chart-container">
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceRegularBudgetTable
                 filters={appliedFilters} />
              </div>
            )}
   </div>





          {/* capital Budget Section */}
          <div className="ceo-charts-row">

            {shouldRender(viewFilter, "bar") && (
              <div className="ceo-chart-container">
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceCapitalBudget filters={appliedFilters} />
              </div>
            )}

             {shouldRender(viewFilter, "pi") && (
              <div className="ceo-chart-container">
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceCapitalBudgetPieChart filters={appliedFilters} />
              </div>
            )}

            {shouldRender(viewFilter, "tables") && (
              <div className="ceo-chart-container">
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceCapitalBudgetTable
                 filters={appliedFilters} />
              </div>
            )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CeoDashboard = () => {
  // CEO Sidebar integration
  const sidebarState = useCeoSidebarIntegration();

  // The filter values typed into the form
  const [formFilters, setFormFilters] = useState({
    year: "",
    quarter: "",
    department: "",
    createdBy: "",
    view: "",
    specific_objective_name: ""
  });

  // The filters actually applied to fetch the data.
  const [appliedFilters, setAppliedFilters] = useState(formFilters);

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dashboard view filter state; default is "all"
  const [viewFilter, setViewFilter] = useState("all");

  // Visibility states for collapsible sections
  const [incomeVisible, setIncomeVisible] = useState(true);
  const [costVisible, setCostVisible] = useState(true);

  // Reference for content (for export functionalities)
  const contentRef = useRef();

  // Initialize CEO Sidebar integration
  useEffect(() => {
    initializeCeoSidebarIntegration();
  }, []);

  // Fetch dashboard data based on appliedFilters
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchDashboardData(appliedFilters);
        console.log("Dashboard data fetched with filters:", appliedFilters, dashboardData);
        setData(dashboardData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appliedFilters]);

  // Handler for filter submission. This updates both the form state and the appliedFilters.
  const handleFilterSubmit = (newFilters) => {
    setFormFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  // Loading state
  if (loading) {
    return (
      <main className="admin-main-content">
        <div className="dashboard-container">
          <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="admin-main-content">
        <div className="dashboard-container">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="admin-main-content">
        <div className="dashboard-container">
          {/* Dashboard Header - Matching Admin Layout */}
          <div className="dashboard-header">
            <div className="page-title">
              <h1>Dashboard</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Executive Dashboard</li>
                </ol>
              </nav>
            </div>
            <div className="dashboard-actions">
              <button className="btn btn-primary btn-sm" onClick={() => window.location.reload()}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </button>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="row g-4">
              {/* Professional Filter Section */}
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-funnel me-2"></i>
                      Advanced Filters & Controls
                    </h5>
                  </div>
                  <div className="card-body">
                    <FilterForm
                      filters={formFilters}
                      onSubmit={handleFilterSubmit}
                    />

                    {/* Dashboard View Selector */}
                    <div className="mt-3">
                      <DashboardViewSelector currentView={viewFilter} onSelect={setViewFilter} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Income Analytics Section */}
              <div className="col-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-graph-up me-2"></i>
                      Income Analytics
                    </h5>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setIncomeVisible(!incomeVisible)}
                    >
                      <i className={`bi ${incomeVisible ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                    </button>
                  </div>

                  {incomeVisible && (
                    <div className="card-body">
                      <div className="row g-3">
                        {shouldRender(viewFilter, "bar") && (
                          <div className="col-lg-6">
                            <div className="chart-container">
                              <h6 className="chart-title">Income Bar Chart</h6>
                              <IncomeMetricsBarchart filters={appliedFilters} />
                            </div>
                          </div>
                        )}

                        {shouldRender(viewFilter, "pi") && (
                          <div className="col-lg-6">
                            <div className="chart-container">
                              <h6 className="chart-title">Income Pie Chart</h6>
                              <IncomeMetricsPichart filters={appliedFilters} />
                            </div>
                          </div>
                        )}

                        {shouldRender(viewFilter, "tables") && (
                          <div className="col-12">
                            <div className="table-container">
                              <h6 className="table-title">Income Data Table</h6>
                              <IncomeMetricsDataTable filters={appliedFilters} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cost Analytics Section */}
              <div className="col-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-graph-down me-2"></i>
                      Cost Analytics
                    </h5>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setCostVisible(!costVisible)}
                    >
                      <i className={`bi ${costVisible ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                    </button>
                  </div>

                  {costVisible && (
                    <div className="card-body">
                      <div className="row g-3">
                        {shouldRender(viewFilter, "bar") && (
                          <div className="col-lg-6">
                            <div className="chart-container">
                              <h6 className="chart-title">Cost Bar Chart</h6>
                              <CostMetricsBarchart filters={appliedFilters} />
                            </div>
                          </div>
                        )}

                        {shouldRender(viewFilter, "pi") && (
                          <div className="col-lg-6">
                            <div className="chart-container">
                              <h6 className="chart-title">Cost Pie Chart</h6>
                              <CostMetricsPichart filters={appliedFilters} />
                            </div>
                          </div>
                        )}

                        {shouldRender(viewFilter, "tables") && (
                          <div className="col-12">
                            <div className="table-container">
                              <h6 className="table-title">Cost Data Table</h6>
                              <CostMetricsDataTable filters={appliedFilters} />
                            </div>
                          </div>
                        )}

                        {/* Regular Budget Analysis */}
                        <div className="col-12">
                          <h6 className="section-title">Regular Budget Analysis</h6>
                          <div className="row g-3">
                            {shouldRender(viewFilter, "bar") && (
                              <div className="col-lg-6">
                                <div className="chart-container">
                                  <CostPlanOutcomeDifferenceRegularBudget filters={appliedFilters} />
                                </div>
                              </div>
                            )}

                            {shouldRender(viewFilter, "pi") && (
                              <div className="col-lg-6">
                                <div className="chart-container">
                                  <CostPlan_Outcome_difference_regular_budget_pichart filters={appliedFilters} />
                                </div>
                              </div>
                            )}

                            {shouldRender(viewFilter, "tables") && (
                              <div className="col-12">
                                <div className="table-container">
                                  <CostPlanOutcomeDifferenceRegularBudgetTable filters={appliedFilters} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Capital Budget Analysis */}
                        <div className="col-12">
                          <h6 className="section-title">Capital Budget Analysis</h6>
                          <div className="row g-3">
                            {shouldRender(viewFilter, "bar") && (
                              <div className="col-lg-6">
                                <div className="chart-container">
                                  <CostPlanOutcomeDifferenceCapitalBudget filters={appliedFilters} />
                                </div>
                              </div>
                            )}

                            {shouldRender(viewFilter, "pi") && (
                              <div className="col-lg-6">
                                <div className="chart-container">
                                  <CostPlanOutcomeDifferenceCapitalBudgetPieChart filters={appliedFilters} />
                                </div>
                              </div>
                            )}

                            {shouldRender(viewFilter, "tables") && (
                              <div className="col-12">
                                <div className="table-container">
                                  <CostPlanOutcomeDifferenceCapitalBudgetTable filters={appliedFilters} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Executive Notifications */}
              <div className="col-lg-4">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-bell me-2"></i>
                      Executive Notifications
                    </h5>
                  </div>
                  <div className="card-body">
                    <NotificationDisplay />
                  </div>
                </div>
              </div>

              {/* Organization Overview */}
              <div className="col-lg-8">
                <div className="card">
                  <div className="card-header">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-building me-2"></i>
                      Organization Overview
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Parameter</th>
                            <th>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Organization</td>
                            <td>Ethiopian IT Park</td>
                          </tr>
                          <tr>
                            <td>Location</td>
                            <td>Addis Ababa, Ethiopia</td>
                          </tr>
                          <tr>
                            <td>Contact</td>
                            <td>+251-11-1234567</td>
                          </tr>
                          <tr>
                            <td>Website</td>
                            <td>
                              <a href="https://ethiopianitpark.et/" target="_blank" rel="noopener noreferrer">
                                <i className="bi bi-box-arrow-up-right me-1"></i>
                                Visit Site
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td>Area (hectares)</td>
                            <td>200</td>
                          </tr>
                          <tr>
                            <td>Buildings</td>
                            <td>25</td>
                          </tr>
                          <tr>
                            <td>Occupied Units</td>
                            <td><span className="badge bg-success">15</span></td>
                          </tr>
                          <tr>
                            <td>Available Units</td>
                            <td><span className="badge bg-warning">10</span></td>
                          </tr>
                          <tr>
                            <td>Resident Companies</td>
                            <td><span className="badge bg-primary">100</span></td>
                          </tr>
                          <tr>
                            <td>Status</td>
                            <td>
                              <span className="badge bg-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Operational
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Professional Footer with Export Actions */}
      <footer className="admin-footer">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <ExportSelection contentRef={contentRef} />
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                <i className="bi bi-clock me-1"></i>
                Last updated: {new Date().toLocaleString()}
              </small>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default CeoDashboard;