// File: /services/api/getDisplayTotalCostExcutionPercentage.js
// Description: API call for displayTotalCostExcutionPercentage.
import axios from "axios";
import { API_BASE_URL } from "../constants";
export const getDisplayTotalCostExcutionPercentage = async (queryString, headers) => {
  const url = queryString
    ? `${API_BASE_URL}/displayTotalCostExcutionPercentage?${queryString}`
    : `${API_BASE_URL}/displayTotalCostExcutionPercentage`;
  const response = await axios.get(url, { headers });
  console.log("Response from displayTotalCostExcutionPercentage:", response.data);
  return response.data;
};



