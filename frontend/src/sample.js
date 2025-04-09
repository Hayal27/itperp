const HRMetricsSection = ({ data, viewFilter, hrVisible, toggleVisibility, appliedFilters }) => {
    useEffect(() => {
      if (data && data.extra) {
        console.log("Filtered Full time Employee Data:", data.extra.filteredFulltime);
        console.log("Filtered Total hr Data:", data.extra.filteredTotalHr);
        console.log("Filtered Compare hrPlanOutcome Data:", data.extra.filteredComparehrPlanOutcome);
        console.log("Filtered Total Hr Execution Percentage Data:", data.extra.filteredExecutionPercentage);
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
            {/* Hr Charts for Total Hr, Hr Plan, and Comparison */}
            <div className={styles.hrChartsRow}>
              {shouldRender(viewFilter, "bar") && (
                <>
                  <div className={styles.hrChart}>
                    <h4><i className="fas fa-chart-bar animated-icon"></i> Total Hr in ETB (millions birr)</h4>
                    <hrMetricsBarchart
                      data={{
                        total_hr: data.extra.filteredTotalhr || data.extra.displayTotalhr
                      }}
                      type="totalhr"
                    />
                  </div>
                  <div className={styles.hrChart}>
                    <h4><i className="fas fa-chart-bar animated-icon"></i> Total hr Plan</h4>
                    <hrMetricsBarchart
                      data={{
                        total_hr_plan: data.extra.filteredTotalhrPlan || data.extra.displayTotalhrtPlan
                      }}
                      type="totalhrtPlan"
                    />
                  </div>
                  <div className={styles.hrChart}>
                    <h4><i className="fas fa-chart-bar animated-icon"></i> Compare hr Plan vs Outcome</h4>
                    <HrMetricsBarchart
                      data={data.extra.filteredCompareHrPlanOutcome || data.extra.compareHrPlanOutcome}
                      type="compareHrPlanOutcome"
                    />
                  </div>
                  <div className={styles.hrChart}>
                    <h4><i className="fas fa-chart-bar animated-icon"></i> Total hr Execution Percentage</h4>
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
              )}
              {shouldRender(viewFilter, "pi") && (
                <>
                  <div className={styles.hrChart}>
                    <h4><i className="fas fa-pie-chart animated-icon"></i> Total Hr in ETB (millions birr)</h4>
                    <HrMetricsPichart
                      data={{
                        total_hr: data.extra.filteredTotalHr || data.extra.displayTotalHr
                      }}
                      type="totalHr"
                    />
                  </div>
                  <div className={styles.hrChart}>
                    <h4><i className="fas fa-pie-chart animated-icon"></i> Total Hr Plan</h4>
                    <HrMetricsPichart
                      data={{
                        total_hr_plan: data.extra.filteredTotalHrPlan || data.extra.displayTotalHrPlan
                      }}
                      type="totalHrPlan"
                    />
                  </div>
                  <div className={styles.hrChart}>
                    <h4><i className="fas fa-pie-chart animated-icon"></i> Compare Hr Plan vs Outcome</h4>
                    <HrMetricsPichart
                      data={data.extra.filteredCompareHrPlanOutcome || data.extra.compareHrPlanOutcome}
                      type="compareHrPlanOutcome"
                    />
                  </div>
                  <div className={styles.hrChart}>
                    <h4><i className="fas fa-pie-chart animated-icon"></i> Total Hr Execution Percentage</h4>
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
              )}
            </div>
  
            {/* Hr Metrics Data Table */}
            {shouldRender(viewFilter, "tables") && (
              <div className={styles.dataTableContainer}>
                <h2><i className="fas fa-table animated-icon"></i> ጠቅላላ የ ወጪ እቅድ</h2>
                <HrMetricsDataTable data={data} type="totalHrPlan" />
              </div>
            )}
  
            {/* Full Time Section */}
            <div className={styles.chartsRow}>
              {shouldRender(viewFilter, "bar") && (
                <div className={styles.chartContainer}>
                  <HrPlanOutcomeDifferenceRegularBudget filters={appliedFilters} />
                </div>
              )}
              {shouldRender(viewFilter, "pi") && (
                <div className={styles.chartContainer}>
                  <HrPlan_Outcome_difference_fulltime_pichart filters={appliedFilters} />
                </div>
              )}
              {shouldRender(viewFilter, "tables") && (
                <div className={styles.chartContainer}>
                  <HrPlanOutcomeDifferenceRegularBudgetTable filters={appliedFilters} />
                </div>
              )}
            </div>
  
            {/* Contrat Section */}
            <div className={styles.chartsRow}>
              {shouldRender(viewFilter, "bar") && (
                <div className={styles.chartContainer}>
                  <HrPlanOutcomeDifferenceContrat filters={appliedFilters} />
                </div>
              )}
              {shouldRender(viewFilter, "pi") && (
                <div className={styles.chartContainer}>
                  <HrPlanOutcomeDifferenceContratPieChart filters={appliedFilters} />
                </div>
              )}
              {shouldRender(viewFilter, "tables") && (
                <div className={styles.chartContainer}>
                  <HrPlanOutcomeDifferenceContratTable filters={appliedFilters} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };
  