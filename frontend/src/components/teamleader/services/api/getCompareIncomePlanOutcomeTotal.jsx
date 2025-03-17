/* 
  File: /services/api/getCompareIncomePlanOutcomeTotal.js
  Description: API call for CompareIncomePlanOutcomeTotal.
*/
import axios from "axios";
import { API_BASE_URL } from "../constants";

export const getCompareIncomePlanOutcomeTotal = async (queryString, headers) => {
  const url = queryString
    ? `${API_BASE_URL}/CompareIncomePlanOutcomeTotal?${queryString}`
    : `${API_BASE_URL}/CompareIncomePlanOutcomeTotal`;
  const response = await axios.get(url, { headers });
  console.log("Response from CompareIncomePlanOutcomeTotal:", response.data);
  return response.data;
};

