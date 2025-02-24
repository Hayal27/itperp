/* 
  File: /services/constants.js
  Description: Define shared constants for API URLs.
*/
export const API_BASE_URL = "http://localhost:5000/api";


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
