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
  Progress: "Progress",
  Plan_Type: "Plan Type",
  Income_Exchange: "Income Exchange",
  Cost_Type: "Cost Type",
  Employment_Type: "Employment Type",
  Income_Name: "Income Name",
  Cost_Name: "Cost Name",
  CI_Baseline: "CI Baseline",
  CI_Plan: "CI Plan",
  CI_Outcome: "CI Outcome",
  CI_Execution: "CI Exec %",
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

const PlanDataTable = ({
  sortedPlans,
  handleDelete,
  handleSorting,
  sortConfig,
  fetchDetail,
  getMagicalStyle,
}) => {
  const [transformedPlans, setTransformedPlans] = useState([]);

  useEffect(() => {
    if (sortedPlans.length > 0) {
      setTransformedPlans(normalizeData(sortedPlans));
    }
  }, [sortedPlans]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  return (
    <div className="table-responsive shadow rounded">
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            {Object.values(keyMap).map((label) => (
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
              const rowStyle = getMagicalStyle(plan["Plan Type"]);
              return (
                <tr key={planIndex} className={`${rowStyle} align-middle`}>
                  {Object.values(keyMap).map((label) => (
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
                    <Link to={`/add-report/${plan.Plan_ID}`} className="btn btn-success btn-sm mx-1">
                      Add Report
                    </Link>
                    <button onClick={() => fetchDetail(plan.Plan_ID, "plan")} className="btn btn-secondary btn-sm mx-1">
                      Plan Details
                    </button>
                    <button onClick={() => fetchDetail(plan.Plan_ID, "report")} className="btn btn-warning btn-sm mx-1">
                      View Report
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={Object.keys(keyMap).length + 1} className="text-center text-muted py-3">
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
