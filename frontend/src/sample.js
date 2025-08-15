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
        {defaultVisible ? "⬆️" : "⬇️"} <i className="fas fa-chart-line animated-icon"></i> ሰው ሃብት
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