
// -------------------
// File: /services/api/getDisplayTotalIncomeOutcomeETB.js
// Description: API call for displayTotalIncomeOutcomeETB.
import axios from "axios";
import { API_BASE_URL } from "../constants";
export const getDisplayTotalIncomeOutcomeETB = async (queryString, headers) => {
  const url = queryString
    ? `${API_BASE_URL}/displayTotalIncomeOutcomeETB?${queryString}`
    : `${API_BASE_URL}/displayTotalIncomeOutcomeETB`;
  const response = await axios.get(url, { headers });
  console.log("Response from displayTotalIncomeOutcomeETB:", response.data);
  return response.data;
};