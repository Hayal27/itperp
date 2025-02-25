import React, { useState, useEffect, useRef } from "react";
import FilterForm from "./FilterForm";
import IncomeMetricsBarchart from "./Metrics/IncomeMetricsBarchart";
import IncomeMetricsPichart from "./Metrics/IncomeMetricsPichart";
import IncomeMetricsDataTable from "./Metrics/IncomeMetricsDataTable";
import CostMetricsBarchart from "./Metrics/CostMetricsBarchart";
import { fetchDashboardData } from "./services/dashboardService";
import NotificationDisplay from "./NotificationDisplay";
import ExportSelection from "./ExportSelection";  
import styles from "./StaffDashboard.module.css";

/*
  File: frontend/src/components/staff/StaffDashboard.jsx

  Layout Update:
    - The FilterForm occupies the top row.
    - The dashboard content with charts and tables is below the filter.
    - A right sidebar displays notifications and sticky notes.
    - The ExportSelection component (for printing/downloading with selection)
      is displayed at the bottom.
*/

const StaffDashboard = () => {
  // Dashboard data, error and filter states
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    year: "",
    quarter: "",
    department: "",
    createdBy: "",
    view: ""
  });

  // States for collapsible sections
  const [incomeVisible, setIncomeVisible] = useState(true);
  const [costVisible, setCostVisible] = useState(true);

  // Reference for the main content container (used for export functionalities)
  const contentRef = useRef();

  // Fetch dashboard data based on filters
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await fetchDashboardData(filters);
        setData(dashboardData);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      }
    };
    fetchData();
  }, [filters]);

  if (error) {
    return <div className={styles.errorMessage}>Error loading data: {error}</div>;
  }
  if (!data) {
    return <div className={styles.loadingMessage}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Row: FilterForm */}
      <div className={styles.filterRow}>
        <FilterForm filters={filters} onSubmit={(newFilters) => setFilters(newFilters)} />
      </div>

      {/* Bottom Row: Dashboard Content */}
      <div className={styles.dashboardContentRow}>
        {/* Left: Main Content (charts and data tables) */}
        <div className={styles.mainContent} ref={contentRef}>
          <div className={styles.metricGroup} id="incomeMetrics">
            <h3
              className={styles.groupTitle}
              onClick={() => setIncomeVisible(!incomeVisible)}
              style={{ cursor: "pointer" }}
            >
              Income Metrics {incomeVisible ? "⬆️" : "⬇️"}
            </h3>
            {incomeVisible && (
              <>
                <div className={styles.chartsRow}>
                  <div className={styles.chartContainer}>
                    <h3>Total Income Summation (ETB & USD)</h3>
                    <IncomeMetricsBarchart data={data} />
                  </div>
                  <div className={styles.chartContainer}>
                    <h3>Income Breakdown</h3>
                    <IncomeMetricsPichart data={data} />
                  </div>
                </div>
                <div className={styles.dataTableContainer}>
                  <IncomeMetricsDataTable data={data} />
                </div>
              </>
            )}
          </div>
          <div className={styles.metricGroup} id="costMetrics">
            <h3
              className={styles.groupTitle}
              onClick={() => setCostVisible(!costVisible)}
              style={{ cursor: "pointer" }}
            >
              Cost Metrics {costVisible ? "⬆️" : "⬇️"}
            </h3>
            {costVisible && (
              <div className={styles.costChartsRow}>
                <div className={styles.costChart}>
                  <h4>Total Cost in ETB (millions birr)</h4>
                  <CostMetricsBarchart 
                    data={{ total_cost: data.extra.displayTotalCost }}
                    type="totalCost"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>Total Cost Plan</h4>
                  <CostMetricsBarchart 
                    data={{ total_cost_plan: data.extra.displayTotalCostPlan }}
                    type="totalCostPlan"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>Compare Cost Plan vs Outcome</h4>
                  <CostMetricsBarchart 
                    data={data.extra.compareCostPlanOutcome}
                    type="compareCostPlanOutcome"
                  />
                </div>
                <div className={styles.costChart}>
                  <h4>Total Cost Execution Percentage</h4>
                  <CostMetricsBarchart 
                    data={{
                      averageCostCIExecutionPercentage: data.extra.displayTotalCostExcutionPercentage.averageCostCIExecutionPercentage
                    }}
                    type="totalCostExcutionPercentage"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar (notifications, sticky notes, etc.) */}
        <div className={styles.rightSidebar}>
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
        </div>
      </div>

      {/* Bottom Row: Export Selection Component */}
      <div className={styles.exportActions} style={{ marginTop: "20px" }}>
        <ExportSelection contentRef={contentRef} />
      </div>
    </div>
  );
};

export default StaffDashboard;