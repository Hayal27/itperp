
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

// capital budget 
import CostPlanOutcomeDifferenceCapitalBudgetTable from "./Metrics/CostPlanOutcomeDifferenceCapitalBudgetTable";
import CostPlanOutcomeDifferenceCapitalBudget from "./Metrics/CostPlanOutcomeDifferenceCapitalBudget";
import CostPlanOutcomeDifferenceCapitalBudgetPieChart from "./Metrics/CostPlan_Outcome_difference_capital_budget_pichart";

import { fetchDashboardData } from "./services/dashboardService";
import NotificationDisplay from "./NotificationDisplay";
import ExportSelection from "./ExportSelection";
import DashboardViewSelector from "./DashboardViewSelector";
import styles from "./StaffDashboard.module.css";

/**
 * Helper function to decide if a chart/table type should be rendered
 * based on the current view filter.
 */
const shouldRender = (viewFilter, componentType) =>
  viewFilter === "all" || viewFilter === componentType;

/**
 * Income Metrics Section Component.
 * Only shows charts and tables if valid income data is present.
 */
const IncomeMetricsSection = ({ data, viewFilter, incomeVisible, toggleVisibility }) => {
  // Use either filtered metrics or raw data
  const incomeData = (data.extra && data.extra.filteredIncomeMetrics) || data;
  // Check for necessary income data; for example, primary property having expected fields.
  const hasIncomeData = incomeData && incomeData.primary && (incomeData.primary.combined_ETB || incomeData.primary.breakdown);
  
  useEffect(() => {
    if (incomeData && incomeData.extra && incomeData.extra.filteredIncomeMetrics) {
      console.log("Filtered Income Metrics Data:", incomeData.extra.filteredIncomeMetrics);
    }
  }, [incomeData]);

  return (
    <div className={styles.metricGroup} id="incomeMetrics">
      <h3
        className={styles.groupTitle}
        onClick={toggleVisibility}
        style={{ cursor: "pointer" }}
      >
        {incomeVisible ? "⬆️" : "⬇️"} ገቢ
      </h3>
      {incomeVisible && hasIncomeData && (
        <>
          {/* Income Charts Row */}
          <div className={styles.chartsRow}>
            {shouldRender(viewFilter, "bar") && incomeData.primary && (
              <div className={styles.chartContainer}>
                <h3>Total Income Summation (ETB & USD)</h3>
                <IncomeMetricsBarchart data={incomeData} />
              </div>
            )}
            {shouldRender(viewFilter, "pi") && incomeData.primary && (
              <div className={styles.chartContainer}>
                <h3>Income Breakdown</h3>
                <IncomeMetricsPichart data={incomeData} />
              </div>
            )}
          </div>
          {/* Income Table */}
          {shouldRender(viewFilter, "tables") && incomeData.primary && (
            <div className={styles.dataTableContainer}>
              <h2>የታቀደው/የተገኘው ገቢ በ ETB እና USD </h2>
              <IncomeMetricsDataTable data={incomeData} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Cost Metrics Section Component updated for dynamic filtering.
 * Only shows charts and tables if valid cost data is present.
 */
const CostMetricsSection = ({ data, viewFilter, costVisible, toggleVisibility, appliedFilters }) => {
  // For easier access for each metric, extract the relevant data
  const extra = data.extra || {};
  const filteredTotalCost = extra.filteredTotalCost || extra.displayTotalCost;
  const filteredTotalCostPlan = extra.filteredTotalCostPlan || extra.displayTotalCostPlan;
  const filteredCompareCostPlanOutcome = extra.filteredCompareCostPlanOutcome || extra.compareCostPlanOutcome;
  const filteredExecutionPercentage =
    (extra.filteredExecutionPercentage && extra.filteredExecutionPercentage.averageCostCIExecutionPercentage) ||
    (extra.displayTotalCostExcutionPercentage && extra.displayTotalCostExcutionPercentage.averageCostCIExecutionPercentage);
  
  // Determine if at least one cost metric is available
  const hasCostChartData = filteredTotalCost || filteredTotalCostPlan || filteredCompareCostPlanOutcome || filteredExecutionPercentage;
  
  useEffect(() => {
    if (extra) {
      console.log("Filtered Regular Budget Data:", extra.filteredRegularBudget);
      console.log("Filtered Total Cost Data:", extra.filteredTotalCost);
      console.log("Filtered Compare CostPlanOutcome Data:", extra.filteredCompareCostPlanOutcome);
      console.log("Filtered Total Cost Execution Percentage Data:", extra.filteredExecutionPercentage);
    }
  }, [extra]);

  return (
    <div className={styles.metricGroup} id="costMetrics">
      <h3
        className={styles.groupTitle}
        onClick={toggleVisibility}
        style={{ cursor: "pointer" }}
      >
        {costVisible ? "⬆️" : "⬇️"} ወጪ
      </h3>
      {costVisible && hasCostChartData && (
        <>
          {/* Cost Charts for Total Cost, Cost Plan, and Comparison */}
          <div className={styles.costChartsRow}>
            {shouldRender(viewFilter, "bar") && (
              <>
                {filteredTotalCost && (
                  <div className={styles.costChart}>
                    <h4>Total Cost in ETB (millions birr)</h4>
                    <CostMetricsBarchart
                      data={{ total_cost: filteredTotalCost }}
                      type="totalCost"
                    />
                  </div>
                )}
                {filteredTotalCostPlan && (
                  <div className={styles.costChart}>
                    <h4>Total Cost Plan</h4>
                    <CostMetricsBarchart
                      data={{ total_cost_plan: filteredTotalCostPlan }}
                      type="totalCostPlan"
                    />
                  </div>
                )}
                {filteredCompareCostPlanOutcome && (
                  <div className={styles.costChart}>
                    <h4>Compare Cost Plan vs Outcome</h4>
                    <CostMetricsBarchart 
                      data={filteredCompareCostPlanOutcome}
                      type="compareCostPlanOutcome"
                    />
                  </div>
                )}
                {filteredExecutionPercentage && (
                  <div className={styles.costChart}>
                    <h4>Total Cost Execution Percentage</h4>
                    <CostMetricsBarchart 
                      data={{ averageCostCIExecutionPercentage: filteredExecutionPercentage }}
                      type="totalCostExcutionPercentage"
                    />
                  </div>
                )}
              </>
            )}
            {shouldRender(viewFilter, "pi") && (
              <>
                {filteredTotalCost && (
                  <div className={styles.costChart}>
                    <h4>Total Cost in ETB (millions birr)</h4>
                    <CostMetricsPichart
                      data={{ total_cost: filteredTotalCost }}
                      type="totalCost"
                    />
                  </div>
                )}
                {filteredTotalCostPlan && (
                  <div className={styles.costChart}>
                    <h4>Total Cost Plan</h4>
                    <CostMetricsPichart
                      data={{ total_cost_plan: filteredTotalCostPlan }}
                      type="totalCostPlan"
                    />
                  </div>
                )}
                {filteredCompareCostPlanOutcome && (
                  <div className={styles.costChart}>
                    <h4>Compare Cost Plan vs Outcome</h4>
                    <CostMetricsPichart 
                      data={filteredCompareCostPlanOutcome}
                      type="compareCostPlanOutcome"
                    />
                  </div>
                )}
                {filteredExecutionPercentage && (
                  <div className={styles.costChart}>
                    <h4>Total Cost Execution Percentage</h4>
                    <CostMetricsPichart 
                      data={{ averageCostCIExecutionPercentage: filteredExecutionPercentage }}
                      type="totalCostExcutionPercentage"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Cost Metrics Data Table */}
          {shouldRender(viewFilter, "tables") && extra.displayTotalCostPlan && (
            <div className={styles.dataTableContainer}>
              <h2>ጠቅላላ የ ወጪ እቅድ</h2>
              <CostMetricsDataTable data={data} type="totalCostPlan" />
            </div>
          )}

          {/* Regular Budget Section */}
          <div className={styles.chartsRow}>
            {shouldRender(viewFilter, "bar") && extra.filteredRegularBudget && (
              <div className={styles.chartContainer}>
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceRegularBudget filters={appliedFilters} />
              </div>
            )}
            {shouldRender(viewFilter, "pi") && extra.filteredRegularBudget && (
              <div className={styles.chartContainer}>
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlan_Outcome_difference_regular_budget_pichart filters={appliedFilters} />
              </div>
            )}
            {shouldRender(viewFilter, "tables") && extra.filteredRegularBudget && (
              <div className={styles.chartContainer}>
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceRegularBudgetTable filters={appliedFilters} />
              </div>
            )}
          </div>

          {/* Capital Budget Section */}
          <div className={styles.chartsRow}>
            {shouldRender(viewFilter, "bar") && extra.total_cost_plan_capital && (
              <div className={styles.chartContainer}>
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceCapitalBudget filters={appliedFilters} />
              </div>
            )}
            {shouldRender(viewFilter, "pi") && extra.total_cost_plan_capital && (
              <div className={styles.chartContainer}>
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceCapitalBudgetPieChart filters={appliedFilters} />
              </div>
            )}
            {shouldRender(viewFilter, "tables") && extra.total_cost_plan_capital && (
              <div className={styles.chartContainer}>
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceCapitalBudgetTable filters={appliedFilters} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const StaffDashboard = () => {
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

  // Dashboard view filter state; default is "all"
  const [viewFilter, setViewFilter] = useState("all");

  // Visibility states for collapsible sections; default to hidden as requested.
  const [incomeVisible, setIncomeVisible] = useState(false);
  const [costVisible, setCostVisible] = useState(false);

  // Reference for content (for export functionalities)
  const contentRef = useRef();

  // Fetch dashboard data based on appliedFilters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await fetchDashboardData(appliedFilters);
        console.log("Dashboard data fetched with filters:", appliedFilters, dashboardData);
        setData(dashboardData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      }
    };
    fetchData();
  }, [appliedFilters]);

  // Handler for filter submission. This updates both the form state and the appliedFilters.
  const handleFilterSubmit = (newFilters) => {
    setFormFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  if (error) {
    console.error("Dashboard error:", error);
    return <div className={styles.errorMessage}>Error loading data: {error}</div>;
  }
  if (!data) {
    return <div className={styles.loadingMessage}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Header: Filter Row */}
      <header className={styles.header}>
        <FilterForm filters={formFilters} onSubmit={handleFilterSubmit} />
      </header>

      {/* Dashboard View Selector */}
      <div className={styles.viewSelector}>
        <DashboardViewSelector currentView={viewFilter} onSelect={setViewFilter} />
      </div>

      {/* Main Section: Dashboard Content and Sidebar */}
      <main className={styles.mainContentArea}>
        <div className={styles.contentWrapper}>
          <section className={styles.dashboardContent} ref={contentRef}>
            <IncomeMetricsSection
              data={data}
              viewFilter={viewFilter}
              incomeVisible={incomeVisible}
              toggleVisibility={() => setIncomeVisible(prev => !prev)}
            />
            <CostMetricsSection
              data={data}
              viewFilter={viewFilter}
              costVisible={costVisible}
              toggleVisibility={() => setCostVisible(prev => !prev)}
              appliedFilters={appliedFilters}
            />
          </section>

          {/* Sidebar: Notifications and Additional Info */}
          <aside className={styles.rightSidebar}>
            <NotificationDisplay />
            <div className={styles.sidebarSection}>
              <h3>Daily Sticky Notes</h3>
              <div className={styles.stickyNote}>Review dashboard KPIs.</div>
              <div className={styles.stickyNote}>Call supplier for update.</div>
              <div className={styles.stickyNote}>Prepare presentation slides.</div>
            </div>
            <div className={styles.sidebarSection}>
              <h3>Ethiopian IT Park Info</h3>
              <table className={styles.infoTable}>
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>Ethiopian IT Park</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td>Addis Ababa</td>
                  </tr>
                  <tr>
                    <td>Contact</td>
                    <td>+251-11-1234567</td>
                  </tr>
                  <tr>
                    <td>Website</td>
                    <td>
                      <a href="https://ethiopianitpark.et/" target="_blank" rel="noopener noreferrer">
                        Visit
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>Area (hec)</td>
                    <td>200</td>
                  </tr>
                  <tr>
                    <td>Buildings No</td>
                    <td>25</td>
                  </tr>
                  <tr>
                    <td>Rented Units</td>
                    <td>15</td>
                  </tr>
                  <tr>
                    <td>Non-Rented Units</td>
                    <td>10</td>
                  </tr>
                  <tr>
                    <td>Residents Company No</td>
                    <td>100</td>
                  </tr>
                  <tr>
                    <td>Additional Info</td>
                    <td>State-of-the-art facilities with modern infrastructure</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer: Export Actions */}
      <footer className={styles.footer}>
        <ExportSelection contentRef={contentRef} />
      </footer>
    </div>
  );
};

export default StaffDashboard;
