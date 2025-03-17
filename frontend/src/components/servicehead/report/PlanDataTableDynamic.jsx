// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import Axios from "axios";

// // Common columns with keys matching backend aliases.
// const commonHeaders = [
//   { label: "ስራ ክፍል", key: "Department" },
//   { label: "Year", key: "Year" },
//   { label: "Quarter", key: "Quarter" },
//   { label: "ግብ" , key: "Goal_Name" },
//   { label: "አላማ" , key: "Objective_Name" },
//   { label: "ዝርዝር" , key: "Details" },
//   { label: "መለኪያ በ %" , key: "Measurement" },
//   { label: "መነሻ በ %" , key: "Baseline" },
//   { label: "እቅድ በ %" , key: "Plan" },
//   { label: "ክንዉን", key: "CIoutcome" },
//   { label: "Exec %", key: "execution_percentage" },
//   { label: "Description", key: "Description" },
//   { label: "Status", key: "Status" },
//   { label: "Comment", key: "Comment" },
//   { label: "የ እቅዱ ሂደት", key: "የ እቅዱ ሂደት" },
//   { label: "Spec. Obj. Detail", key: "specObjectiveDetail" },
//   { label: "የ እቅዱ አይነት", key: "plan_type" },
//   { label: "አቃጅ" , key: "Created_By" },
//   { label: "Created At", key: "Created_At" },
//   { label: "Updated At", key: "Updated_At" }
// ];

// // Extra columns for each plan type.
// const extraHeadersByType = {
//   cost: [
//     { label: "Cost Type", key: "cost_type" },
//     { label: "የ ወጪው ስም", key: "costName" },
//     { label: "መነሻ", key: "CIBaseline" },
//     { label: "እቅድ", key: "CIplan" },
//     { label: "CI Outcome", key: "CIoutcome" }
//   ],
//   income: [
//     { label: "ምናዘሬው", key: "income_exchange" },
//     { label: "የ ገቢው ስም", key: "incomeName" },
//     { label: "መነሻ", key: "CIBaseline" },
//     { label: "እቅድ", key: "CIplan" },
//     { label: "CI Outcome", key: "CIoutcome" }
//   ],
//   hr: [
//     { label: "የ ቅጥር ሁኔታ", key: "employment_type" }
//   ]
// };

// /**
//  * PlanDataTableDynamic Component with optional fetch.
//  * 
//  * This component displays a table of plan data.
//  * If the prop "sortedPlans" is empty, it will attempt to fetch the data from the backend
//  * using a POST request with a given payload.
//  * It automatically detects the active plan type and displays extra columns related only to that type.
//  *
//  * Props:
//  *  - sortedPlans: array of plan objects (if available).
//  *  - activePlanType: string ("cost", "income", "hr", or "all").
//  *  - handleDelete: function to handle deletion.
//  *  - handleSorting: function to handle column sorting.
//  *  - sortConfig: object with sorting configuration.
//  *  - fetchDetail: callback to fetch plan details.
//  *  - getMagicalStyle: function to determine row styling.
//  *  - fetchPayload (optional): object representing payload for fetching plans.
//  *  - fetchUrl (optional): string endpoint to fetch plans if sortedPlans is empty.
//  */
// const PlanDataTableDynamic = ({
//   sortedPlans,
//   activePlanType,
//   handleDelete,
//   handleSorting,
//   sortConfig,
//   fetchDetail,
//   getMagicalStyle,
//   fetchPayload,
//   fetchUrl
// }) => {
//   // Use local state if sortedPlans prop is empty.
//   const [localPlans, setLocalPlans] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Determine data to display: use sortedPlans prop if provided and non-empty; otherwise use locally fetched data.
//   const plansToDisplay =
//     sortedPlans && sortedPlans.length > 0 ? sortedPlans : localPlans;

//   // If there's no data from props, try to fetch from backend using a payload.
//   useEffect(() => {
//     if ((!sortedPlans || sortedPlans.length === 0) && fetchUrl) {
//       async function fetchData() {
//         try {
//           setLoading(true);
//           const token = localStorage.getItem("token");
//           // Use POST to fetch data with the payload.
//           const response = await Axios.post(fetchUrl, fetchPayload, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           if (response.data.success && response.data.plans) {
//             setLocalPlans(response.data.plans);
//           } else {
//             console.error("Fetch unsuccessful:", response.data.message);
//           }
//         } catch (err) {
//           console.error("Error fetching plans:", err);
//         } finally {
//           setLoading(false);
//         }
//       }
//       fetchData();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sortedPlans, fetchUrl, fetchPayload]);

//   const dynamicHeaders =
//     activePlanType && activePlanType !== "all"
//       ? [...commonHeaders, ...extraHeadersByType[activePlanType]]
//       : [...commonHeaders];

//   const getSortIcon = (key) => {
//     if (sortConfig.key !== key) return null;
//     return sortConfig.direction === "asc" ? "↑" : "↓";
//   };

//   useEffect(() => {
//     if (plansToDisplay && plansToDisplay.length > 0) {
//       console.log("First plan keys:", Object.keys(plansToDisplay[0]));
//       console.log("First plan Year value:", plansToDisplay[0].Year);
//     }
//   }, [plansToDisplay]);

//   const filteredPlans =
//     activePlanType && activePlanType !== "all"
//       ? plansToDisplay.filter(
//           (plan) =>
//             plan.plan_type &&
//             plan.plan_type.toLowerCase() === activePlanType
//         )
//       : plansToDisplay;

//   return (
//     <div>
//       {loading && (
//         <p className="text-center text-info">Fetching plans...</p>
//       )}
//       <div className="table-responsive shadow rounded">
//         <table className="table table-bordered table-hover">
//           <thead className="table-dark">
//             <tr>
//               {dynamicHeaders.map((col, idx) => (
//                 <th
//                   key={idx}
//                   onClick={() =>
//                     col.key !== "actions" && handleSorting(col.key)
//                   }
//                   className="text-center align-middle cursor-pointer"
//                 >
//                   {col.label} {col.key !== "actions" && getSortIcon(col.key)}
//                 </th>
//               ))}
//               <th className="text-center align-middle">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredPlans && filteredPlans.length > 0 ? (
//               filteredPlans.map((plan) => {
//                 const rowStyle = getMagicalStyle(plan.plan_type);
//                 return (
//                   <tr key={plan.Plan_ID} className={`${rowStyle} align-middle`}>
//                     {dynamicHeaders.map((col, index) => (
//                       <td key={index} className="text-center">
//                         {plan[col.key] !== undefined && plan[col.key] !== null
//                           ? plan[col.key]
//                           : "N/A"}
//                       </td>
//                     ))}
//                     <td className="text-center">
//                       <button
//                         onClick={() => handleDelete(plan.Plan_ID)}
//                         className="btn btn-danger btn-sm mx-1"
//                       >
//                         Delete
//                       </button>
//                       <button
//                         onClick={() => fetchDetail(plan.Plan_ID, "plan")}
//                         className="btn btn-secondary btn-sm mx-1"
//                       >
//                         Plan Details
//                       </button>
//                       <button
//                         onClick={() => fetchDetail(plan.Plan_ID, "report")}
//                         className="btn btn-warning btn-sm mx-1"
//                       >
//                         View Report
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td
//                   colSpan={dynamicHeaders.length + 1}
//                   className="text-center text-muted py-3"
//                 >
//                   No plans found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// PlanDataTableDynamic.propTypes = {
//   sortedPlans: PropTypes.arrayOf(PropTypes.object),
//   activePlanType: PropTypes.string.isRequired,
//   handleDelete: PropTypes.func.isRequired,
//   handleSorting: PropTypes.func.isRequired,
//   sortConfig: PropTypes.object.isRequired,
//   fetchDetail: PropTypes.func.isRequired,
//   getMagicalStyle: PropTypes.func.isRequired,
//   fetchPayload: PropTypes.object, // optional payload for fetching
//   fetchUrl: PropTypes.string    // optional URL for fetching data
// };

// PlanDataTableDynamic.defaultProps = {
//   sortedPlans: [],
//   fetchPayload: {},
//   fetchUrl: ""
// };

// export default PlanDataTableDynamic;