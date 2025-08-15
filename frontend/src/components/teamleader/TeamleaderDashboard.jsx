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
import CostPlanOutcomeDifferenceCapitalBudgetTable from "./Metrics/CostPlanOutcomeDifferenceCapitalBudgetTable";
import CostPlanOutcomeDifferenceCapitalBudget from "./Metrics/CostPlanOutcomeDifferenceCapitalBudget";
import CostPlanOutcomeDifferenceCapitalBudgetPieChart from "./Metrics/CostPlan_Outcome_difference_capital_budget_pichart";

// human resource metrics
// import HrMetricsBarchart from "./Metrics/HrMetricsBarchart";
// import HrMetricsPichart from "./Metrics/HrMetricsPichart";
// import HrMetricsDataTable from "./Metrics/HrMetricsDataTable";
import HRPlanOutcomeDifferenceFulltimeTable from "./Metrics/HRPlanOutcomeDifferenceFulltimeTable";
// import HrPlan_Outcome_difference_fulltime_pichart from "./Metrics/HrPlan_Outcome_difference_fulltime_pichart";
// import HrPlanOutcomeDifferenceContrat from "./Metrics/HrPlanOutcomeDifferenceContrat";
// import HrPlanOutcomeDifferenceContratPieChart from "./Metrics/HrPlanOutcomeDifferenceContratPieChart";
// import HrPlanOutcomeDifferenceContratTable from "./Metrics/HrPlanOutcomeDifferenceContratTable";


// default plan metrics
import DefaultPlanOutcomeDifferenceFulltimeTable from "./Metrics/DefaultPlanOutcomeDifferenceFulltimeTable";



import { fetchDashboardData } from "./services/dashboardService";
import NotificationDisplay from "./NotificationDisplay";
import ExportSelection from "./ExportSelection";
import DashboardViewSelector from "./DashboardViewSelector";
import styles from "./StaffDashboard.module.css";
import TaskManagement from "./TaskManagement";

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
        {incomeVisible ? "⬆️" : "⬇️"} <i className="fas fa-chart-line animated-icon"></i> ገቢ
      </h3>
      {incomeVisible && (
        <>
          {/* Income Charts Row */}
          <div className={styles.chartsRow}>
            {shouldRender(viewFilter, "bar") && (
              <div className={styles.chartContainer}>
                <h3>
                  <i className="fas fa-chart-bar animated-icon"></i> Total Income Summation (ETB & USD)
                </h3>
                <IncomeMetricsBarchart data={data.extra.filteredIncomeMetrics || data} />
              </div>
            )}
            {shouldRender(viewFilter, "pi") && (
              <div className={styles.chartContainer}>
                <h3>
                  <i className="fas fa-pie-chart animated-icon"></i> Income Breakdown
                </h3>
                <IncomeMetricsPichart data={data.extra.filteredIncomeMetrics || data} />
              </div>
            )}
          </div>
          {/* Income Table */}
          {shouldRender(viewFilter, "tables") && (
            <div className={styles.dataTableContainer}>
              <h2>
                <i className="fas fa-table animated-icon"></i> የታቀደው/የተገኘው ገቢ በ ETB እና USD
              </h2>
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
        {costVisible ? "⬆️" : "⬇️"} <i className="fas fa-chart-line animated-icon"></i> ወጪ
      </h3>
      {costVisible && (
        <>
          {/* Cost Charts for Total Cost, Cost Plan, and Comparison */}
          <div className={styles.costChartsRow}>
            {shouldRender(viewFilter, "bar") && (
              <>
                <div className={styles.costChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Total Cost in ETB (millions birr)
                  </h4>
                  <CostMetricsBarchart
                    data={{ total_cost: data.extra.filteredTotalCost || data.extra.displayTotalCost }}
                    type="totalCost"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Total Cost Plan
                  </h4>
                  <CostMetricsBarchart
                    data={{ total_cost_plan: data.extra.filteredTotalCostPlan || data.extra.displayTotalCostPlan }}
                    type="totalCostPlan"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Compare Cost Plan vs Outcome
                  </h4>
                  <CostMetricsBarchart
                    data={data.extra.filteredCompareCostPlanOutcome || data.extra.compareCostPlanOutcome}
                    type="compareCostPlanOutcome"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Total Cost Execution Percentage
                  </h4>
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
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Total Cost in ETB (millions birr)
                  </h4>
                  <CostMetricsPichart
                    data={{ total_cost: data.extra.filteredTotalCost || data.extra.displayTotalCost }}
                    type="totalCost"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Total Cost Plan
                  </h4>
                  <CostMetricsPichart
                    data={{ total_cost_plan: data.extra.filteredTotalCostPlan || data.extra.displayTotalCostPlan }}
                    type="totalCostPlan"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Compare Cost Plan vs Outcome
                  </h4>
                  <CostMetricsPichart
                    data={data.extra.filteredCompareCostPlanOutcome || data.extra.compareCostPlanOutcome}
                    type="compareCostPlanOutcome"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Total Cost Execution Percentage
                  </h4>
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
              <h2>
                <i className="fas fa-table animated-icon"></i> ጠቅላላ የ ወጪ እቅድ
              </h2>
              <CostMetricsDataTable data={data} type="totalCostPlan" />
            </div>
          )}

          {/* Regular Budget Section */}
          <div className={styles.chartsRow}>
            {shouldRender(viewFilter, "bar") && (
              <div className={styles.chartContainer}>
                <CostPlanOutcomeDifferenceRegularBudget filters={appliedFilters} />
              </div>
            )}
            {shouldRender(viewFilter, "pi") && (
              <div className={styles.chartContainer}>
                <CostPlan_Outcome_difference_regular_budget_pichart filters={appliedFilters} />
              </div>
            )}
            {shouldRender(viewFilter, "tables") && (
              <div className={styles.chartContainer}>
                <CostPlanOutcomeDifferenceRegularBudgetTable filters={appliedFilters} />
              </div>
            )}
          </div>

          {/* Capital Budget Section */}
          <div className={styles.chartsRow}>
            {shouldRender(viewFilter, "bar") && (
              <div className={styles.chartContainer}>
                <CostPlanOutcomeDifferenceCapitalBudget filters={appliedFilters} />
              </div>
            )}
            {shouldRender(viewFilter, "pi") && (
              <div className={styles.chartContainer}>
                <CostPlanOutcomeDifferenceCapitalBudgetPieChart filters={appliedFilters} />
              </div>
            )}
            {shouldRender(viewFilter, "tables") && (
              <div className={styles.chartContainer}>
                <CostPlanOutcomeDifferenceCapitalBudgetTable filters={appliedFilters} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * HR Metrics Section Component.
 * Logs filtered HR data and renders HR charts, tables, and subsections.
 */
const HrMetricsSection = ({ data, viewFilter, hrVisible, toggleVisibility, appliedFilters }) => {
  useEffect(() => {
    if (data && data.extra) {
      console.log("Filtered Full time Employee Data:", data.extra.filteredFulltime);
      console.log("Filtered Total HR Data:", data.extra.filteredTotalHr);
      console.log("Filtered Compare HrPlanOutcome Data:", data.extra.filteredCompareHrPlanOutcome);
      console.log("Filtered Total HR Execution Percentage Data:", data.extra.filteredExecutionPercentage);
    }
  }, [data]);

  return (
    <div className={styles.metricGroup} id="hrMetrics">
      <h3
        className={styles.groupTitle}
        onClick={toggleVisibility}
        style={{ cursor: "pointer" }}
      >
        {hrVisible ? "⬆️" : "⬇️"} <i className="fas fa-chart-line animated-icon"></i> ሰው ሃብት
      </h3>
      {hrVisible && (
        <>
          {/* HR Charts for Total HR, HR Plan, and Comparison */}
          <div className={styles.hrChartsRow}>
            {/* {shouldRender(viewFilter, "bar") && (
              <>
                <div className={styles.hrChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Total HR in ETB (millions birr)
                  </h4>
                  <HrMetricsBarchart
                    data={{ total_hr: data.extra.filteredTotalHr || data.extra.displayTotalHr }}
                    type="totalhr"
                  />
                </div>
                <div className={styles.hrChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Total HR Plan
                  </h4>
                  <HrMetricsBarchart
                    data={{ total_hr_plan: data.extra.filteredTotalHrPlan || data.extra.displayTotalHrPlan }}
                    type="totalHrPlan"
                  />
                </div>
                <div className={styles.hrChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Compare HR Plan vs Outcome
                  </h4>
                  <HrMetricsBarchart
                    data={data.extra.filteredCompareHrPlanOutcome || data.extra.compareHrPlanOutcome}
                    type="compareHrPlanOutcome"
                  />
                </div>
                <div className={styles.hrChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Total HR Execution Percentage
                  </h4>
                  <HrMetricsBarchart
                    data={{
                      averageHrCIExecutionPercentage:
                        data.extra.filteredExecutionPercentage?.averageHrCIExecutionPercentage ||
                        data.extra.displayTotalHrExcutionPercentage?.averageHrCIExecutionPercentage
                    }}
                    type="totalHrExcutionPercentage"
                  />
                </div>
              </>
            )} */}
            {/* {shouldRender(viewFilter, "pi") && (
              <>
                <div className={styles.hrChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Total HR in ETB (millions birr)
                  </h4>
                  <HrMetricsPichart
                    data={{ total_hr: data.extra.filteredTotalHr || data.extra.displayTotalHr }}
                    type="totalhr"
                  />
                </div>
                <div className={styles.hrChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Total HR Plan
                  </h4>
                  <HrMetricsPichart
                    data={{ total_hr_plan: data.extra.filteredTotalHrPlan || data.extra.displayTotalHrPlan }}
                    type="totalHrPlan"
                  />
                </div>
                <div className={styles.hrChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Compare HR Plan vs Outcome
                  </h4>
                  <HrMetricsPichart
                    data={data.extra.filteredCompareHrPlanOutcome || data.extra.compareHrPlanOutcome}
                    type="compareHrPlanOutcome"
                  />
                </div>
                <div className={styles.hrChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Total HR Execution Percentage
                  </h4>
                  <HrMetricsPichart
                    data={{
                      averageHrCIExecutionPercentage:
                        data.extra.filteredExecutionPercentage?.averageHrCIExecutionPercentage ||
                        data.extra.displayTotalHrExcutionPercentage?.averageHrCIExecutionPercentage
                    }}
                    type="totalHrExcutionPercentage"
                  />
                </div>
              </>
            )} */}
          </div>

          {/* HR Metrics Data Table */}
          {/* {shouldRender(viewFilter, "tables") && (
            <div className={styles.dataTableContainer}>
              <h2>
                <i className="fas fa-table animated-icon"></i> ጠቅላላ የ HR እቅድ
              </h2>
              <HrMetricsDataTable data={data} type="totalHrPlan" />
            </div>
          )} */}

          {/* Full Time Section */}
          <div className={styles.chartsRow}>
            {shouldRender(viewFilter, "bar") && (
              <div className={styles.chartContainer}>
                <HRPlanOutcomeDifferenceFulltimeTable filters={appliedFilters} />
              </div>
            )}
            {/* {shouldRender(viewFilter, "pi") && (
              <div className={styles.chartContainer}>
                <HrPlan_Outcome_difference_fulltime_pichart filters={appliedFilters} />
              </div>
            )} */}
            {/* {shouldRender(viewFilter, "tables") && (
              <div className={styles.chartContainer}>
                <HrMetricsDataTable data={data} type="totalHrPlan" />
              </div>
            )} */}
          </div>

          {/* Contract Section */}
          <div className={styles.chartsRow}>
            {/* {shouldRender(viewFilter, "bar") && (
              <div className={styles.chartContainer}>
                <HrPlanOutcomeDifferenceContrat filters={appliedFilters} />
              </div>
            )} */}
            {/* {shouldRender(viewFilter, "pi") && (
              <div className={styles.chartContainer}>
                <HrPlanOutcomeDifferenceContratPieChart filters={appliedFilters} />
              </div>
            )} */}
            {/* {shouldRender(viewFilter, "tables") && (
              <div className={styles.chartContainer}>
                <HrPlanOutcomeDifferenceContratTable filters={appliedFilters} />
              </div>
            )} */}
          </div>
        </>
      )}
    </div>
  );
};
const DefaultMetricsSection = ({ data, viewFilter, defaultVisible, toggleVisibility, appliedFilters }) => {
  useEffect(() => {
    if (data && data.extra) {
      console.log("Filtered Full time Employee Data:", data.extra.filteredFulltime);
      console.log("Filtered Total Default Data:", data.extra.filteredTotalDefault);
      console.log("Filtered Compare DefaultPlanOutcome Data:", data.extra.filteredCompareDefaultPlanOutcome);
      console.log("Filtered Total Default Execution Percentage Data:", data.extra.filteredExecutionPercentage);
    }
  }, [data]);

  return (
    <div className={styles.metricGroup} id="defaultMetrics">
      <h3
        className={styles.groupTitle}
        onClick={toggleVisibility}
        style={{ cursor: "pointer" }}
      >
        {defaultVisible ? "⬆️" : "⬇️"} <i className="fas fa-chart-line animated-icon"></i>  የተሰባጠሩ እቅዶች
      </h3>
      {defaultVisible && (
        <>
          {/* Default Charts for Total Default, Default Plan, and Comparison */}
          <div className={styles.defaultChartsRow}>
            {/* {shouldRender(viewFilter, "bar") && (
              <>
                <div className={styles.defaultChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Total Default in ETB (millions birr)
                  </h4>
                  <DefaultMetricsBarchart
                    data={{ total_default: data.extra.filteredTotalDefault || data.extra.displayTotalDefault }}
                    type="totaldefault"
                  />
                </div>
                <div className={styles.defaultChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Total Default Plan
                  </h4>
                  <DefaultMetricsBarchart
                    data={{ total_default_plan: data.extra.filteredTotalDefaultPlan || data.extra.displayTotalDefaultPlan }}
                    type="totalDefaultPlan"
                  />
                </div>
                <div className={styles.defaultChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Compare Default Plan vs Outcome
                  </h4>
                  <DefaultMetricsBarchart
                    data={data.extra.filteredCompareDefaultPlanOutcome || data.extra.compareDefaultPlanOutcome}
                    type="compareDefaultPlanOutcome"
                  />
                </div>
                <div className={styles.defaultChart}>
                  <h4>
                    <i className="fas fa-chart-bar animated-icon"></i> Total Default Execution Percentage
                  </h4>
                  <DefaultMetricsBarchart
                    data={{
                      averageDefaultCIExecutionPercentage:
                        data.extra.filteredExecutionPercentage?.averageDefaultCIExecutionPercentage ||
                        data.extra.displayTotalDefaultExcutionPercentage?.averageDefaultCIExecutionPercentage
                    }}
                    type="totalDefaultExcutionPercentage"
                  />
                </div>
              </>
            )} */}
            {/* {shouldRender(viewFilter, "pi") && (
              <>
                <div className={styles.defaultChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Total Default in ETB (millions birr)
                  </h4>
                  <DefaultMetricsPichart
                    data={{ total_default: data.extra.filteredTotalDefault || data.extra.displayTotalDefault }}
                    type="totaldefault"
                  />
                </div>
                <div className={styles.defaultChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Total Default Plan
                  </h4>
                  <DefaultMetricsPichart
                    data={{ total_default_plan: data.extra.filteredTotalDefaultPlan || data.extra.displayTotalDefaultPlan }}
                    type="totalDefaultPlan"
                  />
                </div>
                <div className={styles.defaultChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Compare Default Plan vs Outcome
                  </h4>
                  <DefaultMetricsPichart
                    data={data.extra.filteredCompareDefaultPlanOutcome || data.extra.compareDefaultPlanOutcome}
                    type="compareDefaultPlanOutcome"
                  />
                </div>
                <div className={styles.defaultChart}>
                  <h4>
                    <i className="fas fa-pie-chart animated-icon"></i> Total Default Execution Percentage
                  </h4>
                  <DefaultMetricsPichart
                    data={{
                      averageDefaultCIExecutionPercentage:
                        data.extra.filteredExecutionPercentage?.averageDefaultCIExecutionPercentage ||
                        data.extra.displayTotalDefaultExcutionPercentage?.averageDefaultCIExecutionPercentage
                    }}
                    type="totalDefaultExcutionPercentage"
                  />
                </div>
              </>
            )} */}
          </div>

          {/* Default Metrics Data Table */}
          {/* {shouldRender(viewFilter, "tables") && (
            <div className={styles.dataTableContainer}>
              <h2>
                <i className="fas fa-table animated-icon"></i> ጠቅላላ የ Default እቅድ
              </h2>
              <DefaultMetricsDataTable data={data} type="totalDefaultPlan" />
            </div>
          )} */}

          {/* Full Time Section */}
          <div className={styles.chartsRow}>
            {shouldRender(viewFilter, "bar") && (
              <div className={styles.chartContainer}>
                <DefaultPlanOutcomeDifferenceFulltimeTable filters={appliedFilters} />
              </div>
            )}
            {/* {shouldRender(viewFilter, "pi") && (
              <div className={styles.chartContainer}>
                <DefaultPlan_Outcome_execution_percentage_fulltime_pichart filters={appliedFilters} />
              </div>
            )} */}
            {/* {shouldRender(viewFilter, "tables") && (
              <div className={styles.chartContainer}>
                <DefaultMetricsDataTable data={data} type="totalDefaultPlan" />
              </div>
            )} */}
          </div>

          {/* Contract Section */}
          <div className={styles.chartsRow}>
            {/* {shouldRender(viewFilter, "bar") && (
              <div className={styles.chartContainer}>
                <DefaultPlanOutcomeDifferenceContrat filters={appliedFilters} />
              </div>
            )} */}
            {/* {shouldRender(viewFilter, "pi") && (
              <div className={styles.chartContainer}>
                <DefaultPlanOutcomeDifferenceContratPieChart filters={appliedFilters} />
              </div>
            )} */}
            {/* {shouldRender(viewFilter, "tables") && (
              <div className={styles.chartContainer}>
                <DefaultPlanOutcomeDifferenceContratTable filters={appliedFilters} />
              </div>
            )} */}
          </div>
        </>
      )}
    </div>
  );
};

const TeamleaderDashboard = () => {
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
  const [hrVisible, setHrVisible] = useState(true);
  const [defaultVisible, setDefaultVisible] = useState(true);

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
            <HrMetricsSection
              data={data}
              viewFilter={viewFilter}
              hrVisible={hrVisible}
              toggleVisibility={() => setHrVisible(prev => !prev)}
              appliedFilters={appliedFilters}
            />


            <DefaultMetricsSection
              data={data}
              viewFilter={viewFilter}
              defaultVisible={defaultVisible}
              toggleVisibility={() => setDefaultVisible(prev => !prev)}
              appliedFilters={appliedFilters}
            />
          </section>

          {/* Sidebar: Separated into independent container boxes */}
          <aside className={styles.rightSidebar}>
            {/* Notifications Container */}
            <div className={styles.sidebarContainer}>
              <NotificationDisplay />
            </div>

            {/* Task Management Container */}
            <div className={styles.sidebarContainer}>
              <TaskManagement />
            </div>

            {/* Ethiopian IT Park Info Container */}
            <div className={styles.sidebarContainer}>
              <div className={styles.sidebarSection}>
                <h3>
                  <i className="fas fa-info-circle animated-icon"></i> Ethiopian IT Park Info
                </h3>
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

export default TeamleaderDashboard;