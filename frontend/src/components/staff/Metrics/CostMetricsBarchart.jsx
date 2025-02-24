import React from "react";
import PropTypes from "prop-types";
import BarChartComponent from "./BarChartComponent";

/**
 * CostMetricsBarchart component configures and renders a bar chart
 * based on the type of cost metric data received from the backend, which is expected
 * under the "extra" property (or directly for legacy reasons).
 *
 * Expected prop data formats (from backend API endpoints):
 * - For type "totalCost": either data.total_cost or data.extra.displayTotalCost (number)
 * - For type "totalCostPlan": either data.total_cost_plan or data.extra.displayTotalCostPlan (number)
 * - For type "compareCostPlanOutcome": either data with properties total_cost_plan and total_cost_outcome,
 *     or data.extra.compareCostPlanOutcome (object with total_cost_plan, total_cost_outcome, difference)
 * - For type "totalCostExcutionPercentage": either data.averageCostCIExecutionPercentage or data.extra.displayTotalCostExcutionPercentage (object with averageCostCIExecutionPercentage)
 *
 * The component logs the received data and chosen values to help with debugging.
 */
const CostMetricsBarchart = ({ data, type }) => {
  // Log the entire backend data object.
  console.log("CostMetricsBarchart - received backend data:", data);

  // Provide a fallback to avoid warnings if type is undefined.
  const chartType = type || "totalCost";

  // Function to extract the metric value based on the type.
  const getValue = (key, nestedKey) => {
    // Try directly on data first, then check data.extra.
    if (data[key] !== undefined) return data[key];
    if (data.extra && data.extra[key] !== undefined) return data.extra[key];
    if (nestedKey && data.extra && data.extra[nestedKey] !== undefined) return data.extra[nestedKey];
    return 0;
  };

  // Debug logging: log value per expected type.
  switch (chartType) {
    case "totalCost":
      console.log("Mapping 'totalCost' with value:", getValue("total_cost", "displayTotalCost"));
      break;
    case "totalCostPlan":
      console.log("Mapping 'totalCostPlan' with value:", getValue("total_cost_plan", "displayTotalCostPlan"));
      break;
    case "compareCostPlanOutcome":
      // For compare, try direct properties or the whole object under extra.
      if (data.total_cost_plan !== undefined && data.total_cost_outcome !== undefined) {
        console.log("Mapping 'compareCostPlanOutcome' with values:", {
          total_cost_plan: data.total_cost_plan,
          total_cost_outcome: data.total_cost_outcome
        });
      } else if (data.extra && data.extra.compareCostPlanOutcome) {
        console.log("Mapping 'compareCostPlanOutcome' with values from extra:", data.extra.compareCostPlanOutcome);
      } else {
        console.log("Mapping 'compareCostPlanOutcome' defaulting to zeros");
      }
      break;
    case "totalCostExcutionPercentage":
      if (data.averageCostCIExecutionPercentage !== undefined) {
        console.log("Mapping 'totalCostExcutionPercentage' with value:", data.averageCostCIExecutionPercentage);
      } else if (data.extra && data.extra.displayTotalCostExcutionPercentage) {
        console.log("Mapping 'totalCostExcutionPercentage' with value from extra:", data.extra.displayTotalCostExcutionPercentage);
      } else {
        console.log("Mapping 'totalCostExcutionPercentage' defaulting to zero");
      }
      break;
    default:
      console.warn(`Unknown chart type: ${chartType}`);
      break;
  }

  // Basic chart configuration skeleton used by all cases.
  const chartConfig = {
    type: "bar",
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: ""
        }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true }
      }
    }
  };

  // Configure the chart based on the provided type and extracted values.
  switch (chartType) {
    case "totalCost": {
      // Expects: { total_cost: number } or extra.displayTotalCost
      const totalCost = getValue("total_cost", "displayTotalCost");
      chartConfig.data.labels = ["Total Cost"];
      chartConfig.data.datasets = [{
        label: "Total Cost",
        data: [totalCost],
        backgroundColor: "#58508d"
      }];
      chartConfig.options.plugins.title.text = "Total Cost";
      break;
    }
    case "totalCostPlan": {
      // Expects: { total_cost_plan: number } or extra.displayTotalCostPlan
      const totalCostPlan = getValue("total_cost_plan", "displayTotalCostPlan");
      chartConfig.data.labels = ["Total Cost Plan"];
      chartConfig.data.datasets = [{
        label: "Total Cost Plan",
        data: [totalCostPlan],
        backgroundColor: "#bc5090"
      }];
      chartConfig.options.plugins.title.text = "Total Cost Plan";
      break;
    }
    case "compareCostPlanOutcome": {
      // Expects: either top-level values or in extra.compareCostPlanOutcome
      let totalCostPlan, totalCostOutcome;
      if (data.total_cost_plan !== undefined && data.total_cost_outcome !== undefined) {
        totalCostPlan = data.total_cost_plan;
        totalCostOutcome = data.total_cost_outcome;
      } else if (data.extra && data.extra.compareCostPlanOutcome) {
        totalCostPlan = data.extra.compareCostPlanOutcome.total_cost_plan;
        totalCostOutcome = data.extra.compareCostPlanOutcome.total_cost_outcome;
      } else {
        totalCostPlan = totalCostOutcome = 0;
      }
      chartConfig.data.labels = ["Total Cost Plan", "Total Cost Outcome"];
      chartConfig.data.datasets = [{
        label: "Total Cost Plan",
        data: [totalCostPlan],
        backgroundColor: "#58508d"
      },
      {
        label: "Total Cost Outcome",
        data: [totalCostOutcome],
        backgroundColor: "#bc5090"
      }];
      chartConfig.options.plugins.title.text = "Cost Plan vs Outcome";
      break;
    }
    case "totalCostExcutionPercentage": {
      // Expects: { averageCostCIExecutionPercentage: number } or extra.displayTotalCostExcutionPercentage as an object
      let value;
      if (data.averageCostCIExecutionPercentage !== undefined) {
        value = data.averageCostCIExecutionPercentage;
      } else if (data.extra && data.extra.displayTotalCostExcutionPercentage && data.extra.displayTotalCostExcutionPercentage.averageCostCIExecutionPercentage !== undefined) {
        value = data.extra.displayTotalCostExcutionPercentage.averageCostCIExecutionPercentage;
      } else {
        value = 0;
      }
      chartConfig.data.labels = ["Average Cost Execution Percentage"];
      chartConfig.data.datasets = [{
        label: "Average Cost Execution Percentage",
        data: [value],
        backgroundColor: "#58508d"
      }];
      chartConfig.options.plugins.title.text = "Average Cost Execution Percentage";
      break;
    }
    default:
      console.warn(`Unknown chart type: ${chartType}. Defaulting to "totalCost".`);
      const fallbackValue = getValue("total_cost", "displayTotalCost") || 0;
      chartConfig.data.labels = ["Total Cost"];
      chartConfig.data.datasets = [{
        label: "Total Cost",
        data: [fallbackValue],
        backgroundColor: "#58508d"
      }];
      chartConfig.options.plugins.title.text = "Total Cost";
      break;
  }

  return (
    <div>
      <BarChartComponent chartConfig={chartConfig} />
    </div>
  );
};

CostMetricsBarchart.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.string
};

CostMetricsBarchart.defaultProps = {
  type: "totalCost"
};

export default CostMetricsBarchart;