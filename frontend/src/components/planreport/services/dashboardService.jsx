// -------------------
// File: /services/dashboardService.js
// Description: Combines all the individual API calls into a single service function.
import { getCompareIncomePlanOutcomeTotal } from "./api/getCompareIncomePlanOutcomeTotal";
import { getDisplayTotalCostExcutionPercentage } from "./api/getDisplayTotalCostExcutionPercentage";
import { getDisplayTotalCost } from "./api/getDisplayTotalCost";
import { getDisplayTotalCostPlan } from "./api/getDisplayTotalCostPlan.jsx";
import { getCompareCostPlanOutcome } from "./api/getCompareCostPlanOutcome";
import { getDisplayTotalIncomeplanETB } from "./api/getDisplayTotalIncomeplanETB";
import { getDisplayTotalIncomeOutcomeETB } from "./api/getDisplayTotalIncomeOutcomeETB";
// import { getCostPlanOutcomeDifferenceRegularBudget } from "../Metrics/CostPlanOutcomeDifferenceRegularBudget";

export const buildQueryString = (filters) => {
  const params = new URLSearchParams();
  Object.keys(filters).forEach((key) => {
    if (filters[key]) {
      params.append(key === "createdBy" ? "created_by" : key, filters[key]);
    }
  });
  return params.toString();
};

export const getHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

export const fetchDashboardData = async (filters) => {
  const queryString = buildQueryString(filters);
  const headers = getHeaders();

  const [
    primary,
    displayTotalCostExcutionPercentage,
    displayTotalCost,
    displayTotalCostPlan,
    compareCostPlanOutcome,
    displayTotalIncomeplanETB,
    displayTotalIncomeOutcomeETB,
    // costPlanOutcomeDifferenceRegularBudget    
  ] = await Promise.all([
    getCompareIncomePlanOutcomeTotal(queryString, headers),
    getDisplayTotalCostExcutionPercentage(queryString, headers),
    getDisplayTotalCost(headers),
    getDisplayTotalCostPlan(queryString, headers),
    getCompareCostPlanOutcome(queryString, headers),
    getDisplayTotalIncomeplanETB(queryString, headers),
    getDisplayTotalIncomeOutcomeETB(queryString, headers),
    // getCostPlanOutcomeDifferenceRegularBudget(queryString, headers)
  ]);

  const combinedData = {
    primary,
    extra: {
      displayTotalCostExcutionPercentage,
      displayTotalCost,
      displayTotalCostPlan,
      compareCostPlanOutcome,
      displayTotalIncomeplanETB,
      displayTotalIncomeOutcomeETB,
          }
  };

  console.log("Combined fetched data:", combinedData);
  return combinedData;
};