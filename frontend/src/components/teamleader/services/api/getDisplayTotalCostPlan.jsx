// -------------------
// File: /services/api/getDisplayTotalCostPlan.jsx
// Description: API call for displayTotalCostPlan.
import axios from "axios";
import { API_BASE_URL } from "../constants";
export const getDisplayTotalCostPlan = async (queryString, headers) => {
  const url = queryString
    ? `${API_BASE_URL}/displayTotalCostPlan?${queryString}`
    : `${API_BASE_URL}/displayTotalCostPlan`;
  const response = await axios.get(url, { headers });
  console.log("Response from displayTotalCostPlan:", response.data);
  return response.data;
};