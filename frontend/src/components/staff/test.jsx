// /* 
//   File: /services/constants.js
//   Description: Define shared constants for API URLs.
// */
// export const API_BASE_URL = "http://localhost:5000/api";


// /* 
//   File: /services/api/getCompareIncomePlanOutcomeTotal.js
//   Description: API call for CompareIncomePlanOutcomeTotal.
// */
// import axios from "axios";
// import { API_BASE_URL } from "../constants";

// export const getCompareIncomePlanOutcomeTotal = async (queryString, headers) => {
//   const url = queryString
//     ? `${API_BASE_URL}/CompareIncomePlanOutcomeTotal?${queryString}`
//     : `${API_BASE_URL}/CompareIncomePlanOutcomeTotal`;
//   const response = await axios.get(url, { headers });
//   console.log("Response from CompareIncomePlanOutcomeTotal:", response.data);
//   return response.data;
// };


// /* 
//   File: /services/api/getDisplayTotalCostExcutionPercentage.js
//   Description: API call for displayTotalCostExcutionPercentage.
// */
// import axios from "axios";
// import { API_BASE_URL } from "../constants";

// export const getDisplayTotalCostExcutionPercentage = async (queryString, headers) => {
//   const url = queryString
//     ? `${API_BASE_URL}/displayTotalCostExcutionPercentage?${queryString}`
//     : `${API_BASE_URL}/displayTotalCostExcutionPercentage`;
//   const response = await axios.get(url, { headers });
//   console.log("Response from displayTotalCostExcutionPercentage:", response.data);
//   return response.data;
// };


// /* 
//   File: /services/api/getDisplayTotalCost.js
//   Description: API call for displayTotalCost.
// */
// import axios from "axios";
// import { API_BASE_URL } from "../constants";

// export const getDisplayTotalCost = async (headers) => {
//   const url = `${API_BASE_URL}/displayTotalCost`;
//   const response = await axios.get(url, { headers });
//   console.log("Response from displayTotalCost:", response.data);
//   return response.data;
// };


// /* 
//   File: /services/api/getDisplayTotalCostPlan.js
//   Description: API call for displayTotalCostPlan.
// */
// import axios from "axios";
// import { API_BASE_URL } from "../constants";

// export const getDisplayTotalCostPlan = async (queryString, headers) => {
//   const url = queryString
//     ? `${API_BASE_URL}/displayTotalCostPlan?${queryString}`
//     : `${API_BASE_URL}/displayTotalCostPlan`;
//   const response = await axios.get(url, { headers });
//   console.log("Response from displayTotalCostPlan:", response.data);
//   return response.data;
// };


// /* 
//   File: /services/api/getCompareCostPlanOutcome.js
//   Description: API call for compareCostPlanOutcome.
// */
// import axios from "axios";
// import { API_BASE_URL } from "../constants";

// export const getCompareCostPlanOutcome = async (queryString, headers) => {
//   const url = queryString
//     ? `${API_BASE_URL}/compareCostPlanOutcome?${queryString}`
//     : `${API_BASE_URL}/compareCostPlanOutcome`;
//   const response = await axios.get(url, { headers });
//   console.log("Response from compareCostPlanOutcome:", response.data);
//   return response.data;
// };


// /* 
//   File: /services/api/getDisplayTotalIncomeplanETB.js
//   Description: API call for displayTotalIncomeplanETB.
// */
// import axios from "axios";
// import { API_BASE_URL } from "../constants";

// export const getDisplayTotalIncomeplanETB = async (queryString, headers) => {
//   const url = queryString
//     ? `${API_BASE_URL}/displayTotalIncomeplanETB?${queryString}`
//     : `${API_BASE_URL}/displayTotalIncomeplanETB`;
//   const response = await axios.get(url, { headers });
//   console.log("Response from displayTotalIncomeplanETB:", response.data);
//   return response.data;
// };


// /* 
//   File: /services/api/getDisplayTotalIncomeOutcomeETB.js
//   Description: API call for displayTotalIncomeOutcomeETB.
// */
// import axios from "axios";
// import { API_BASE_URL } from "../constants";

// export const getDisplayTotalIncomeOutcomeETB = async (queryString, headers) => {
//   const url = queryString
//     ? `${API_BASE_URL}/displayTotalIncomeOutcomeETB?${queryString}`
//     : `${API_BASE_URL}/displayTotalIncomeOutcomeETB`;
//   const response = await axios.get(url, { headers });
//   console.log("Response from displayTotalIncomeOutcomeETB:", response.data);
//   return response.data;
// };


// /* 
//   File: /services/dashboardService.js
//   Description: Combines all the individual API calls into a single service function.
// */
// import { getCompareIncomePlanOutcomeTotal } from "./api/getCompareIncomePlanOutcomeTotal";
// import { getDisplayTotalCostExcutionPercentage } from "./api/getDisplayTotalCostExcutionPercentage";
// import { getDisplayTotalCost } from "./api/getDisplayTotalCost";
// import { getDisplayTotalCostPlan } from "./api/getDisplayTotalCostPlan";
// import { getCompareCostPlanOutcome } from "./api/getCompareCostPlanOutcome";
// import { getDisplayTotalIncomeplanETB } from "./api/getDisplayTotalIncomeplanETB";
// import { getDisplayTotalIncomeOutcomeETB } from "./api/getDisplayTotalIncomeOutcomeETB";

// export const buildQueryString = (filters) => {
//   const params = new URLSearchParams();
//   Object.keys(filters).forEach((key) => {
//     if (filters[key]) {
//       params.append(key === "createdBy" ? "created_by" : key, filters[key]);
//     }
//   });
//   return params.toString();
// };

// // Utility to get headers with auth token.
// export const getHeaders = () => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     throw new Error("Authentication token not found");
//   }
//   return {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json"
//   };
// };

// export const fetchDashboardData = async (filters) => {
//   const queryString = buildQueryString(filters);
//   const headers = getHeaders();

//   const [
//     primary,
//     displayTotalCostExcutionPercentage,
//     displayTotalCost,
//     displayTotalCostPlan,
//     compareCostPlanOutcome,
//     displayTotalIncomeplanETB,
//     displayTotalIncomeOutcomeETB
//   ] = await Promise.all([
//     getCompareIncomePlanOutcomeTotal(queryString, headers),
//     getDisplayTotalCostExcutionPercentage(queryString, headers),
//     getDisplayTotalCost(headers),
//     getDisplayTotalCostPlan(queryString, headers),
//     getCompareCostPlanOutcome(queryString, headers),
//     getDisplayTotalIncomeplanETB(queryString, headers),
//     getDisplayTotalIncomeOutcomeETB(queryString, headers)
//   ]);

//   const combinedData = {
//     primary,
//     extra: {
//       displayTotalCostExcutionPercentage, // e.g. { averageCostCIExecutionPercentage: 41.4 }
//       displayTotalCost,                    // e.g. 3356744
//       displayTotalCostPlan,                // e.g. 129193111.99
//       compareCostPlanOutcome,              // e.g. { total_cost_plan: ..., total_cost_outcome: ..., difference: ... }
//       displayTotalIncomeplanETB,
//       displayTotalIncomeOutcomeETB
//     }
//   };

//   console.log("Combined fetched data:", combinedData);
//   return combinedData;
// };
