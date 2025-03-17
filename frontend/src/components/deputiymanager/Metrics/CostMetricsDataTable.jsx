import React from "react";
import PropTypes from "prop-types";
import DataTableComponent from "./DataTableComponent";

/**
 * CostMetricsDataTable component configures and renders a data table
 * based on the cost metric data received from the backend.
 *
 * Expected prop data formats for comparing cost plan and outcome:
 * - For type "totalCostPlan": the backend may return separate plan and outcome values.
 *   Alternatively, it may return an object under data.extra.compareCostPlanOutcome with:
 *      total_cost_plan, total_cost_outcome, and difference.
 *
 * For other types, see the documentation for totalCost, compareCostPlanOutcome, etc.
 *
 * This component uses similar data extraction logic as CostMetricsBarchart/Pichart.
 * It logs the received data and computed values to aid with debugging.
 */

// Resolve the value if provided as a function.
const resolveValue = (val) =>
  typeof val === "function" ? val() : val;

const CostMetricsDataTable = ({ data, type = "totalCost" }) => {
  console.log("CostMetricsDataTable - received backend data:", data);

  if (!data || (!data.total_cost && !data.extra)) {
    return <>No sufficient cost data available.</>;
  }

  // Helper function to extract a value by a primary key or from a nested extra object.
  const getValue = (key, nestedKey) => {
    let val;
    if (data[key] !== undefined) {
      val = data[key];
      return resolveValue(val);
    }
    if (data.extra && data.extra[key] !== undefined) {
      val = data.extra[key];
      return resolveValue(val);
    }
    if (nestedKey && data.extra && data.extra[nestedKey] !== undefined) {
      val = data.extra[nestedKey];
      return resolveValue(val);
    }
    return 0;
  };

  let categories = [];

  switch (type) {
    case "totalCost": {
      // For totalCost, extract plan and outcome separately.
      const plan = getValue("total_cost", "displayTotalCost");
      const outcomeCandidate =
        data.total_cost_outcome !== undefined
          ? resolveValue(data.total_cost_outcome)
          : getValue("total_cost_outcome", "displayTotalCostOutcome");
      const outcome = outcomeCandidate || plan;
      const difference = plan - outcome;
      console.log("Mapping 'totalCost' with values:", { plan, outcome, difference });
      categories.push({
        name: "Total Cost",
        plan,
        outcome,
        difference,
      });
      break;
    }
    case "totalCostPlan": {
      let plan, outcome, difference;
      // If backend provides compareCostPlanOutcome under extra, use those values.
      if (data.extra && data.extra.compareCostPlanOutcome) {
        const compareObj = data.extra.compareCostPlanOutcome;
        plan = compareObj.total_cost_plan !== undefined
          ? resolveValue(compareObj.total_cost_plan)
          : getValue("total_cost_plan", "displayTotalCostPlan");
        outcome = compareObj.total_cost_outcome !== undefined
          ? resolveValue(compareObj.total_cost_outcome)
          : (data.total_cost_outcome !== undefined ? resolveValue(data.total_cost_outcome) : plan);
        difference = compareObj.difference !== undefined
          ? resolveValue(compareObj.difference)
          : plan - outcome;
        console.log("Mapping 'totalCostPlan' with values from compareCostPlanOutcome:", {
          plan,
          outcome,
          difference,
        });
      } else {
        // Fallback if compareCostPlanOutcome is not available.
        plan = getValue("total_cost_plan", "displayTotalCostPlan");
        const outcomeCandidate =
          data.total_cost_outcome !== undefined
            ? resolveValue(data.total_cost_outcome)
            : getValue("total_cost_outcome", "displayTotalCostOutcome");
        outcome = outcomeCandidate || plan;
        difference = plan - outcome;
        console.log("Mapping 'totalCostPlan' with values:", { plan, outcome, difference });
      }
      categories.push({
        name: "Total Cost Plan",
        plan,
        outcome,
        difference,
      });
      break;
    }
    case "compareCostPlanOutcome": {
      let totalPlan = 0,
        totalOutcome = 0,
        diff = 0;
      // Prefer top-level values if available.
      if (
        data.total_cost_plan !== undefined &&
        data.total_cost_outcome !== undefined
      ) {
        totalPlan = resolveValue(data.total_cost_plan);
        totalOutcome = resolveValue(data.total_cost_outcome);
        diff =
          data.difference !== undefined
            ? resolveValue(data.difference)
            : totalPlan - totalOutcome;
        console.log("Mapping 'compareCostPlanOutcome' with top-level values:", {
          total_cost_plan: totalPlan,
          total_cost_outcome: totalOutcome,
          difference: diff,
        });
      } else if (data.extra && data.extra.compareCostPlanOutcome) {
        const compareObj = data.extra.compareCostPlanOutcome;
        totalPlan = compareObj.total_cost_plan !== undefined
          ? resolveValue(compareObj.total_cost_plan)
          : 0;
        totalOutcome = compareObj.total_cost_outcome !== undefined
          ? resolveValue(compareObj.total_cost_outcome)
          : 0;
        diff = compareObj.difference !== undefined
          ? resolveValue(compareObj.difference)
          : totalPlan - totalOutcome;
        console.log(
          "Mapping 'compareCostPlanOutcome' with values from extra:",
          data.extra.compareCostPlanOutcome
        );
      } else {
        console.log("Mapping 'compareCostPlanOutcome' defaulting to zeros");
      }
      categories.push({
        name: "Compare Cost Plan vs Outcome",
        plan: totalPlan,
        outcome: totalOutcome,
        difference: diff,
      });
      break;
    }
    case "totalCostExcutionPercentage": {
      const value = getValue("averageCostCIExecutionPercentage", null) || 0;
      console.log("Mapping 'totalCostExcutionPercentage' with value:", value);
      categories.push({
        name: "Avg Cost Execution %",
        plan: value,
        outcome: value,
        difference: 0,
      });
      break;
    }

  




    default: {
      console.warn(`Unknown type: ${type}. Defaulting to "totalCost".`);
      const fallback = getValue("total_cost", "displayTotalCost") || 0;
      categories.push({
        name: "Total Cost",
        plan: fallback,
        outcome: fallback,
        difference: 0,
      });
      break;
    }
  }

  return <DataTableComponent categories={categories} />;
};

CostMetricsDataTable.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.string,
};

export default CostMetricsDataTable;