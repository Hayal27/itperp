
/* 
  File: /services/api/getDisplayTotalIncomeplanETB.js
  Description: API call for displayTotalIncomeplanETB.
*/
import axios from "axios";
import { API_BASE_URL } from "../constants";

export const getDisplayTotalIncomeplanETB = async (queryString, headers) => {
  const url = queryString
    ? `${API_BASE_URL}/displayTotalIncomeplanETB?${queryString}`
    : `${API_BASE_URL}/displayTotalIncomeplanETB`;
  const response = await axios.get(url, { headers });
  console.log("Response from displayTotalIncomeplanETB:", response.data);
  return response.data;
};
