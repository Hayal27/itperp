// -------------------
// File: /services/api/getCompareCostPlanOutcome.js
// Description: API call for compareCostPlanOutcome.
import axios from "axios";
import { API_BASE_URL } from "../constants";
export const getCompareCostPlanOutcome = async (queryString, headers) => {
  const url = queryString
    ? `${API_BASE_URL}/compareCostPlanOutcome?${queryString}`
    : `${API_BASE_URL}/compareCostPlanOutcome`;
  const response = await axios.get(url, { headers });
  console.log("Response from compareCostPlanOutcome:", response.data);
  return response.data;
};