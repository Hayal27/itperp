import React from "react";
import PropTypes from "prop-types";
import DataTableComponent from "./DataTableComponent";

/**
 * CostMetricsDataTableRegularBudjet component configures and renders a data table
 * based on the regular budget cost metric data received from the backend.
 *
 * Expected backend response for regular budget:
 * - Either top-level properties:
 *      total_cost_plan_regular: number,
 *      total_cost_outcome_regular: number,
 *      difference: number (optional; calculated as plan - outcome if not provided)
 * - OR, an extra property:
 *      compareIncomePlanOutcomeTotal_regular: {
 *         total_cost_plan_regular: number,
 *         total_cost_outcome_regular: number,
 *         difference: number
 *      }
 *
 * If no such keys are found, the component will fallback to using:
 * - displayTotalCostPlan (for plan) and displayTotalCost (for outcome) from data.extra,
 *   which may represent overall cost metrics.
 *
 * All backend data is logged to help debug the data structure.
 */
const CostMetricsDataTableRegularBudjet = ({ data }) => {
  console.log("CostMetricsDataTableRegularBudjet - received backend data:", data);

  if (!data) {
    console.error("No data received from the backend.");
    return <>No data received.</>;
  }

  // Log the extra property if present.
  if (data.extra) {
    console.log("Data extra property content:", data.extra);
  }

  let plan = 0;
  let outcome = 0;
  let difference = 0;

  // First, try to use top-level properties.
  if (
    data.total_cost_plan_regular !== undefined &&
    data.total_cost_outcome_regular !== undefined
  ) {
    plan = data.total_cost_plan_regular;
    outcome = data.total_cost_outcome_regular;
    difference =
      data.difference !== undefined ? data.difference : plan - outcome;
    console.log("Mapping 'Regular Budget' using top-level keys:", { plan, outcome, difference });
  }
  // Otherwise, check for the nested extra.compareIncomePlanOutcomeTotal_regular object.
  else if (data.extra && data.extra.compareIncomePlanOutcomeTotal_regular) {
    const regularObj = data.extra.compareIncomePlanOutcomeTotal_regular;
    plan = regularObj.total_cost_plan_regular !== undefined ? regularObj.total_cost_plan_regular : 0;
    outcome = regularObj.total_cost_outcome_regular !== undefined ? regularObj.total_cost_outcome_regular : 0;
    difference = regularObj.difference !== undefined ? regularObj.difference : plan - outcome;
    console.log("Mapping 'Regular Budget' using extra.compareIncomePlanOutcomeTotal_regular:", { plan, outcome, difference });
  }
  // Fallback: if neither of the expected keys for regular budget are available,
  // try to use displayTotalCostPlan (for plan) and displayTotalCost (for outcome) from data.extra.
  else if (data.extra && data.extra.displayTotalCostPlan !== undefined && data.extra.displayTotalCost !== undefined) {
    console.warn("Expected regular budget keys not found. Falling back to displayTotalCostPlan and displayTotalCost for Regular Budget.");
    plan = data.extra.displayTotalCostPlan;
    outcome = data.extra.displayTotalCost;
    difference = plan - outcome;
    console.log("Mapping 'Regular Budget' fallback using displayTotalCostPlan and displayTotalCost:", { plan, outcome, difference });
  }
  // If none of the above conditions are met, log a warning and notify the user.
  else {
    console.warn("No sufficient cost data available for Regular Budget.");
    return <>No sufficient cost data available for Regular Budget.</>;
  }

  // Prepare the category for the DataTableComponent.
  const categories = [
    {
      name: "Total Cost Plan (Regular Budget)",
      plan,
      outcome,
      difference,
    },
  ];

  return <DataTableComponent categories={categories} />;
};

CostMetricsDataTableRegularBudjet.propTypes = {
  data: PropTypes.object.isRequired,
};

export default CostMetricsDataTableRegularBudjet;