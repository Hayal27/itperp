// import axios from "axios";
// import { API_BASE_URL } from "../constants";



// /**
//  * Fetches the cost plan outcome difference for the regular budget.
//  * Integrates JWT authentication by retrieving the token from localStorage.
//  * If the token is missing, it alerts the user and throws an error.
//  *
//  * @param {Object} additionalHeaders - Any additional headers to merge with the JWT header.
//  * @returns {Promise<Object>} - The data from the API response.
//  * @throws Will throw an error if the user is not authenticated or the API call fails.
//  */
// export const getCostPlanOutcomeDifferenceRegularBudget = async (additionalHeaders = {}) => {
//   // Retrieve JWT token from localStorage for authentication
//   const token = localStorage.getItem("token");
//   if (!token) {
//     alert("You must be logged in to view this data.");
//     // Throwing error to halt execution as no token is provided
//     throw new Error("Not authenticated: Missing JWT token.");
//   }

//   // Merge JWT header with additional headers and sanitize them
//   const headers = sanitizeHeaders({
//     Authorization: `Bearer ${token}`,
//     ...additionalHeaders
//   });

//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/costPlanOutcomeDifferenceRegularBudget`,
//       { headers }
//     );
//     return response.data;
//   } catch (err) {
//     // Rethrow error after logging for further handling
//     console.error("Error fetching dashboard data:", err);
//     throw err;
//   }
// };