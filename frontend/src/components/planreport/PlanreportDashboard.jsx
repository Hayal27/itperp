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
 * Passes dynamic income data with filtering applied.
 */
const IncomeMetricsSection = ({ data, viewFilter, incomeVisible, toggleVisibility }) => {
  useEffect(() => {
    if (data && data.extra && data.extra.filteredIncomeMetrics) {
      console.log("Filtered Income Metrics Data:", data.extra.filteredIncomeMetrics);
    }
  }, [data]);

  return (
    <div className={styles.metricGroup} id="incomeMetrics">
      <h3
        className={styles.groupTitle}
        onClick={toggleVisibility}
        style={{ cursor: "pointer" }}
      >
        {incomeVisible ? "⬆️" : "⬇️"} ገቢ
      </h3>
      {incomeVisible && (
        <>
          {/* Income Charts Row */}
          <div className={styles.chartsRow}>
            {shouldRender(viewFilter, "bar") && (
              <div className={styles.chartContainer}>
                <h3>Total Income Summation (ETB & USD)</h3>
                <IncomeMetricsBarchart data={data.extra.filteredIncomeMetrics || data} />
              </div>
            )}
            {shouldRender(viewFilter, "pi") && (
              <div className={styles.chartContainer}>
                <h3>Income Breakdown</h3>
                <IncomeMetricsPichart data={data.extra.filteredIncomeMetrics || data} />
              </div>
            )}
          </div>
          {/* Income Table */}
          {shouldRender(viewFilter, "tables") && (
            <div className={styles.dataTableContainer}>
              <h2>የታቀደው/የተገኘው ገቢ በ ETB እና USD </h2>
              <IncomeMetricsDataTable data={data.extra.filteredIncomeMetrics || data} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Cost Metrics Section Component updated for dynamic filtering.
 * This component logs the filtered cost metrics data and uses them when available.
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
    <div className={styles.metricGroup} id="costMetrics">
      <h3
        className={styles.groupTitle}
        onClick={toggleVisibility}
        style={{ cursor: "pointer" }}
      >
        {costVisible ? "⬆️" : "⬇️"} ወጪ
      </h3>
      {costVisible && (
        <>
          {/* Cost Charts for Total Cost, Cost Plan, and Comparison */}
          <div className={styles.costChartsRow}>
            {shouldRender(viewFilter, "bar") && (
              <>
                <div className={styles.costChart}>
                  <h4>Total Cost in ETB (millions birr)</h4>
                  <CostMetricsBarchart
                    data={{
                      total_cost: data.extra.filteredTotalCost || data.extra.displayTotalCost
                    }}
                    type="totalCost"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>Total Cost Plan</h4>
                  <CostMetricsBarchart
                    data={{
                      total_cost_plan: data.extra.filteredTotalCostPlan || data.extra.displayTotalCostPlan
                    }}
                    type="totalCostPlan"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>Compare Cost Plan vs Outcome</h4>
                  <CostMetricsBarchart 
                    data={data.extra.filteredCompareCostPlanOutcome || data.extra.compareCostPlanOutcome}
                    type="compareCostPlanOutcome"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>Total Cost Execution Percentage</h4>
                  <CostMetricsBarchart 
                    data={{
                      averageCostCIExecutionPercentage:
                        data.extra.filteredExecutionPercentage?.averageCostCIExecutionPercentage ||
                        data.extra.displayTotalCostExcutionPercentage?.averageCostCIExecutionPercentage
                    }}
                    type="totalCostExcutionPercentage"
                  />
                </div>
              </>
            )}
            {shouldRender(viewFilter, "pi") && (
              <>
                <div className={styles.costChart}>
                  <h4>Total Cost in ETB (millions birr)</h4>
                  <CostMetricsPichart
                    data={{
                      total_cost: data.extra.filteredTotalCost || data.extra.displayTotalCost
                    }}
                    type="totalCost"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>Total Cost Plan</h4>
                  <CostMetricsPichart
                    data={{
                      total_cost_plan: data.extra.filteredTotalCostPlan || data.extra.displayTotalCostPlan
                    }}
                    type="totalCostPlan"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>Compare Cost Plan vs Outcome</h4>
                  <CostMetricsPichart 
                    data={data.extra.filteredCompareCostPlanOutcome || data.extra.compareCostPlanOutcome}
                    type="compareCostPlanOutcome"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>Total Cost Execution Percentage</h4>
                  <CostMetricsPichart 
                    data={{
                      averageCostCIExecutionPercentage:
                        data.extra.filteredExecutionPercentage?.averageCostCIExecutionPercentage ||
                        data.extra.displayTotalCostExcutionPercentage?.averageCostCIExecutionPercentage
                    }}
                    type="totalCostExcutionPercentage"
                  />
                </div>
              </>
            )}
          </div>

          {/* Cost Metrics Data Table */}
          {shouldRender(viewFilter, "tables") && (
            <div className={styles.dataTableContainer}>
              <h2>ጠቅላላ የ ወጪ እቅድ</h2>
              <CostMetricsDataTable data={data} type="totalCostPlan" />
            </div>
          )}


          {/* Regular Budget Section */}
          <div className={styles.chartsRow}>

            {shouldRender(viewFilter, "bar") && (
              <div className={styles.chartContainer}>
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceRegularBudget filters={appliedFilters} />
              </div>
            )}

             {shouldRender(viewFilter, "pi") && (
              <div className={styles.chartContainer}>
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlan_Outcome_difference_regular_budget_pichart filters={appliedFilters} />
              </div>
            )}

            {shouldRender(viewFilter, "tables") && (
              <div className={styles.chartContainer}>
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceRegularBudgetTable
                 filters={appliedFilters} />
              </div>
            )}
   </div>





          {/* capital Budget Section */}
          <div className={styles.chartsRow}>

            {shouldRender(viewFilter, "bar") && (
              <div className={styles.chartContainer}>
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceCapitalBudget filters={appliedFilters} />
              </div>
            )}

             {shouldRender(viewFilter, "pi") && (
              <div className={styles.chartContainer}>
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceCapitalBudgetPieChart filters={appliedFilters} />
              </div>
            )}

            {shouldRender(viewFilter, "tables") && (
              <div className={styles.chartContainer}>
                
                {/* Pass the appliedFilters to ensure filtering functionality */}
                <CostPlanOutcomeDifferenceCapitalBudgetTable
                 filters={appliedFilters} />
              </div>
            )}
          </div>
        </>
      )}
    </div>





  );
};

const PlanreportDashboard = () => {
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

  // Visibility states for collapsible sections
  const [incomeVisible, setIncomeVisible] = useState(true);
  const [costVisible, setCostVisible] = useState(true);

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
        <FilterForm 
          filters={formFilters} 
          onSubmit={handleFilterSubmit} 
        />
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

export default PlanreportDashboard;