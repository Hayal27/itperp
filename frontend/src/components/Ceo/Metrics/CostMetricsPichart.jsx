import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PiChartComponent from "./PiChartComponent";
import { safeGetValue, safeGetComparisonData, createDataPlaceholder, debugDataStructure } from "./MetricsUtils";


const CostMetricsPichart = ({ data, type }) => {
  // Log the entire backend data object for debugging.
  console.log("CostMetricsPichart - received backend data:", data);

  // Early return if data is not available
  if (!data) {
    console.warn("CostMetricsPichart - No data provided");
    return (
      <div className="chart-placeholder">
        <div className="text-center p-4">
          <i className="bi bi-pie-chart text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="text-muted mt-2">No cost data available</p>
          <small className="text-muted">Please check your data source or try refreshing the page.</small>
        </div>
      </div>
    );
  }

  // Provide a fallback to avoid warnings if type is undefined.
  const chartType = type || "totalCost";

  // Local state to hold the configured chart configuration.
  const [chartConfig, setChartConfig] = useState(null);

  // Utility function to extract the metric value in a flexible way.
  const getValue = (key, nestedKey) => {
    // Check if data exists first
    if (!data) return 0;

    if (data[key] !== undefined) return data[key];
    if (data.extra && data.extra[key] !== undefined) return data.extra[key];
    if (nestedKey && data.extra && data.extra[nestedKey] !== undefined) return data.extra[nestedKey];
    return 0;
  };

  // Build the basic pi chart configuration skeleton.
  const buildBaseConfig = () => ({
    type: "pie",
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: []  // Array of colors for each slice.
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: ""
        }
      }
    }
  });

  useEffect(() => {
    // Create a new configuration object based on the selected metric type.
    const config = buildBaseConfig();

    // Debug logging for metric mapping.
    switch (chartType) {
      case "totalCost": {
        const totalCost = getValue("total_cost", "displayTotalCost");
        console.log("Mapping 'totalCost' with value:", totalCost);
        config.data.labels = ["Total Cost"];
        config.data.datasets[0].data = [totalCost];
        config.data.datasets[0].backgroundColor = ["#58508d"];
        config.options.plugins.title.text = "Total Cost";
        break;
      }
      case "totalCostPlan": {
        const totalCostPlan = getValue("total_cost_plan", "displayTotalCostPlan");
        console.log("Mapping 'totalCostPlan' with value:", totalCostPlan);
        config.data.labels = ["Total Cost Plan"];
        config.data.datasets[0].data = [totalCostPlan];
        config.data.datasets[0].backgroundColor = ["#bc5090"];
        config.options.plugins.title.text = "Total Cost Plan";
        break;
      }
      case "compareCostPlanOutcome": {
        let totalCostPlan, totalCostOutcome;
        if (data && data.total_cost_plan !== undefined && data.total_cost_outcome !== undefined) {
          totalCostPlan = data.total_cost_plan;
          totalCostOutcome = data.total_cost_outcome;
          console.log("Mapping 'compareCostPlanOutcome' with values:", { total_cost_plan: totalCostPlan, total_cost_outcome: totalCostOutcome });
        } else if (data && data.extra && data.extra.compareCostPlanOutcome) {
          totalCostPlan = data.extra.compareCostPlanOutcome.total_cost_plan || 0;
          totalCostOutcome = data.extra.compareCostPlanOutcome.total_cost_outcome || 0;
          console.log("Mapping 'compareCostPlanOutcome' with values from extra:", data.extra.compareCostPlanOutcome);
        } else {
          totalCostPlan = totalCostOutcome = 0;
          console.log("Mapping 'compareCostPlanOutcome' defaulting to zeros");
        }
        config.data.labels = ["Total Cost Plan", "Total Cost Outcome"];
        config.data.datasets[0].data = [totalCostPlan, totalCostOutcome];
        config.data.datasets[0].backgroundColor = ["#58508d", "#bc5090"];
        config.options.plugins.title.text = "Cost Plan vs Outcome";
        break;
      }
      case "totalCostExcutionPercentage": {
        let value;
        if (data && data.averageCostCIExecutionPercentage !== undefined) {
          value = data.averageCostCIExecutionPercentage;
          console.log("Mapping 'totalCostExcutionPercentage' with value:", value);
        } else if (data && data.extra && data.extra.displayTotalCostExcutionPercentage && data.extra.displayTotalCostExcutionPercentage.averageCostCIExecutionPercentage !== undefined) {
          value = data.extra.displayTotalCostExcutionPercentage.averageCostCIExecutionPercentage;
          console.log("Mapping 'totalCostExcutionPercentage' with value from extra:", value);
        } else {
          value = 0;
          console.log("Mapping 'totalCostExcutionPercentage' defaulting to zero");
        }
        config.data.labels = ["Avg Cost Execution %"];
        config.data.datasets[0].data = [value];
        config.data.datasets[0].backgroundColor = ["#58508d"];
        config.options.plugins.title.text = "Average Cost Execution Percentage";
        break;
      }
      default: {
        console.warn(`Unknown chart type: ${chartType}. Defaulting to "totalCost".`);
        const fallbackValue = getValue("total_cost", "displayTotalCost") || 0;
        config.data.labels = ["Total Cost"];
        config.data.datasets[0].data = [fallbackValue];
        config.data.datasets[0].backgroundColor = ["#58508d"];
        config.options.plugins.title.text = "Total Cost";
        break;
      }
    }

    setChartConfig(config);
  }, [data, chartType]);

  return chartConfig ? (
    <PiChartComponent chartConfig={chartConfig} />
  ) : (
    <div>Insufficient data for Cost metrics pi chart.</div>
  );
};

CostMetricsPichart.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.string
};

CostMetricsPichart.defaultProps = {
  type: "totalCost"
};

export default CostMetricsPichart;