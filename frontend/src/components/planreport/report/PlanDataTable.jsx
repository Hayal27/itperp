import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// Key mapping between backend response and frontend display labels
const keyMap = {
  Department: "Department",
  Year: "Year",
  Quarter: "Quarter",
  Goal_Name: "Goal",
  objectiveName: "Objective",
  Specific_Objective_Name: "Specific Objective",
  Specific_Detail: "SpecificDetail",
  Measurement: "Measurement",
  Baseline: "Baseline",
  Plan: "Plan",
  CIoutcome: "Outcome",
  Execution_Percentage: "Exec %",
  Description: "Description",
  Status: "Status",
  Comment: "Comment",
  Progress: "የ እቅዱ ሂደት",
  Plan_Type: "የ እቅዱ አይነት",
  Income_Exchange: "ምናዘሬው",
  Cost_Type: "Cost Type",
  Employment_Type: "የ ቅጥር ሁኔታ",
  Income_Name: "የ ገቢው ስም",
  Cost_Name: "የ ወጪው ስም",
  CI_Baseline: "መነሻ",
  CI_Plan: "እቅድ",
  CI_Outcome: "CI Outcome",
  CI_Execution: "CI Exec %"
};

// Normalize backend data to match frontend expectations
const normalizeData = (plans) => {
  return plans.map((plan) => {
    let normalizedPlan = {};
    Object.keys(plan).forEach((backendKey) => {
      const frontendKey = keyMap[backendKey] || backendKey;
      normalizedPlan[frontendKey] = plan[backendKey];
    });
    return normalizedPlan;
  });
};

// Define column sets for different plan types
const costColumns = [
  "Department",
  "Year",
  "Quarter",
  "Goal",
  "Objective",
  "Specific Objective",
  "Measurement",
  "Baseline",
  "Plan",
  "Outcome",
  "Exec %",
  "Description",
  "Comment",
  "የ እቅዱ ሂደት",
  "የ እቅዱ አይነት",
  "Cost Type",
  "የ ወጪው ስም"
];

const incomeColumns = [
  "Department",
  "Year",
  "Quarter",
  "Goal",
  "Objective",
  "Specific Objective",
  "Measurement",
  "Baseline",
  "Plan",
  "Outcome",
  "Exec %",
  "Description",
  "Comment",
  "የ እቅዱ ሂደት",
  "የ እቅዱ አይነት",
  "ምናዘሬው",
  "የ ገቢው ስም"
];

// Minimal default columns if plan type is not recognized
const defaultColumns = [
  "Department",
  "Year",
  "Quarter",
  "Goal",
  "Objective",
  "Specific Objective",
  "የ እቅዱ አይነት"
];

const PlanDataTable = ({
  sortedPlans,
  handleDelete,
  handleSorting,
  sortConfig,
  fetchDetail,
  getMagicalStyle,
}) => {
  const [transformedPlans, setTransformedPlans] = useState([]);
  const [columns, setColumns] = useState(defaultColumns);

  useEffect(() => {
    if (sortedPlans.length > 0) {
      const normalizedPlans = normalizeData(sortedPlans);
      setTransformedPlans(normalizedPlans);
      // Detect plan type from first plan (assuming all have same type)
      const firstPlanType = normalizedPlans[0]["የ እቅዱ አይነት"];
      if (firstPlanType === "Cost") {
        setColumns(costColumns);
      } else if (firstPlanType === "Income") {
        setColumns(incomeColumns);
      } else {
        setColumns(defaultColumns);
      }
    } else {
      setTransformedPlans([]);
    }
  }, [sortedPlans]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="shadow rounded">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            {columns.map((label) => (
              <th
                key={label}
                onClick={() => handleSorting(label)}
                className="text-center align-middle cursor-pointer"
              >
                {label} {getSortIcon(label)}
              </th>
            ))}
            <th className="text-center align-middle">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transformedPlans.length > 0 ? (
            transformedPlans.map((plan, planIndex) => {
              const rowStyle = getMagicalStyle(plan["የ እቅዱ አይነት"]);
              return (
                <tr key={planIndex} className={`${rowStyle} align-middle`}>
                  {columns.map((label) => (
                    <td key={label} className="text-center">
                      {plan?.[label] ?? "N/A"}
                    </td>
                  ))}
                  <td className="text-center">
                    <Link to={`/update/${plan.Plan_ID}`} className="btn btn-primary btn-sm mx-1">
                      Update
                    </Link>
                    <button onClick={() => handleDelete(plan.Plan_ID)} className="btn btn-danger btn-sm mx-1">
                      Delete
                    </button>
                    <button onClick={() => fetchDetail(plan.Plan_ID, "plan")} className="btn btn-warning btn-sm mx-1">
                      Report Details
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="text-center text-muted py-3">
                No plans found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

PlanDataTable.propTypes = {
  sortedPlans: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleSorting: PropTypes.func.isRequired,
  sortConfig: PropTypes.object.isRequired,
  fetchDetail: PropTypes.func.isRequired,
  getMagicalStyle: PropTypes.func.isRequired,
};

export default PlanDataTable;