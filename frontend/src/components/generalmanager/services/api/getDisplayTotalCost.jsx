// -------------------
// File: /services/api/getDisplayTotalCost.js
// Description: API call for displayTotalCost.
import axios from "axios";
import { API_BASE_URL } from "../constants";
export const getDisplayTotalCost = async (headers) => {
  const url = `${API_BASE_URL}/displayTotalCost`;
  const response = await axios.get(url, { headers });
  console.log("Response from displayTotalCost:", response.data);
  return response.data;
};