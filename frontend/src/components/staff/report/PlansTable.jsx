
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 for popups
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

// DashboardSummary component displays cards and charts based on the plans data
const DashboardSummary = ({ sortedPlans }) => {
  // Aggregated Data Calculations
  let totalCostPlan = 0,
    totalCostOutcome = 0,
    totalIncomePlan = 0,
    totalIncomeOutcome = 0;
  sortedPlans.forEach((plan) => {
    if (plan.plan_type && plan.plan_type.toLowerCase() === "cost") {
      totalCostPlan += Number(plan.Plan) || 0;
      totalCostOutcome += Number(plan.Outcome) || 0;
    } else if (plan.plan_type && plan.plan_type.toLowerCase() === "income") {
      totalIncomePlan += Number(plan.Plan) || 0;
      totalIncomeOutcome += Number(plan.Outcome) || 0;
    }
  });
  const costExecutionPercentage = totalCostPlan
    ? (totalCostOutcome / totalCostPlan) * 100
    : 0;
  const incomeExecutionPercentage = totalIncomePlan
    ? (totalIncomeOutcome / totalIncomePlan) * 100
    : 0;

  // Data for Pie Chart: Cost distribution by cost type
  const costDistribution = {};
  sortedPlans.forEach((plan) => {
    if (plan.plan_type && plan.plan_type.toLowerCase() === "cost") {
      const costType = plan.cost_type || "Unknown";
      const planVal = Number(plan.Plan) || 0;
      costDistribution[costType] =
        (costDistribution[costType] || 0) + planVal;
    }
  });
  const pieData = Object.keys(costDistribution).map((key) => ({
    name: key,
    value: costDistribution[key],
  }));
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF"];

  // Data for Line Chart: Average execution percentage over period
  const executionByPeriod = {};
  sortedPlans.forEach((plan) => {
    const year = plan.Year;
    const quarter = plan.Quarter;
    if (year && quarter) {
      const key = `${year} Q${quarter}`;
      const exec = Number(plan.Execution_Percentage) || 0;
      if (!executionByPeriod[key]) {
        executionByPeriod[key] = { total: exec, count: 1 };
      } else {
        executionByPeriod[key].total += exec;
        executionByPeriod[key].count++;
      }
    }
  });
  const lineData = Object.keys(executionByPeriod).map((key) => ({
    period: key,
    execution: executionByPeriod[key].count
      ? executionByPeriod[key].total / executionByPeriod[key].count
      : 0,
  }));

  // Cumulative Aggregation by Actual Year
  const cumulativeByYear = sortedPlans.reduce((acc, plan) => {
    const year = plan.Year || "N/A";
    acc[year] = (acc[year] || 0) + (Number(plan.Plan) || 0);
    return acc;
  }, {});

  return (
    <div className="mb-5">
      <h3 className="mb-4">Dashboard Summary</h3>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-info shadow">
            <div className="card-body">
              <h5 className="card-title">Total Cost Plan</h5>
              <p className="card-text">{totalCostPlan.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5 className="card-title">Total Cost Outcome</h5>
              <p className="card-text">{totalCostOutcome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning shadow">
            <div className="card-body">
              <h5 className="card-title">Cost Execution %</h5>
              <p className="card-text">{costExecutionPercentage.toFixed(2)}%</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-info shadow">
            <div className="card-body">
              <h5 className="card-title">Total Income Plan</h5>
              <p className="card-text">{totalIncomePlan.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-success shadow">
            <div className="card-body">
              <h5 className="card-title">Total Income Outcome</h5>
              <p className="card-text">{totalIncomeOutcome.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card text-white bg-warning shadow">
            <div className="card-body">
              <h5 className="card-title">Income Execution %</h5>
              <p className="card-text">{incomeExecutionPercentage.toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>
      {/* Cumulative totals grouped by year */}
      <div className="row mt-4">
        {Object.keys(cumulativeByYear).map((year) => (
          <div key={year} className="col-md-4 mb-3">
            <div className="card shadow">
              <div className="card-body">
                <h6>Cumulative ({year})</h6>
                <p className="mb-0">{cumulativeByYear[year].toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Charts Section */}
      <div className="row mt-5">
        <div className="col-md-6 mb-4">
          <h5>Cost Distribution (Pie Chart)</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="col-md-6 mb-4">
          <h5>Average Execution % Over Period</h5>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="execution" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const PlansTable = ({ plans = [], handleSorting, sortConfig }) => {
  const [loading, setLoading] = useState(false);
  const [planDetail, setPlanDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

  // Returns sort icon based on column key
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  // Helper to determine progress bar color based on execution percentage
  const getProgressBarColor = (percentage) => {
    if (percentage < 50) return "bg-danger"; // Red for <50%
    if (percentage < 80) return "bg-warning"; // Yellow for 50-79%
    return "bg-success"; // Green for 80-100%
  };

  // New component to render the execution percentage as a colored progress bar.
  const ExecutionProgressBar = ({ percentage }) => {
    console.log("Rendering progress bar with percentage:", percentage);
    return (
      <div>
        <strong>Execution:</strong> {percentage}%
        <div className="progress mt-2" style={{ height: "20px", width: "100%" }}>
          <div
            className={`progress-bar ${getProgressBarColor(percentage)}`}
            role="progressbar"
            style={{ width: `${percentage}%`, transition: "width 0.5s ease-in-out" }}
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {percentage}%
          </div>
        </div>
      </div>
    );
  };

  const fetchPlanDetail = async (planId) => {
    try {
      setLoading(true);
      const response = await Axios.get(`http://localhost:5000/api/pland/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPlanDetail(response.data.plan);
        setShowDetail(true);
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to fetch plan details.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching plan details.");
    } finally {
      setLoading(false);
    }
  };

  const closePlanDetails = () => {
    setShowDetail(false);
    setPlanDetail(null);
  };

  const handleDelete = async (planId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await Axios.delete(`http://localhost:5000/api/plandelete/${planId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            Swal.fire("Deleted!", "The plan has been deleted.", "success");
            // Optionally, refresh plans or call a parent method to update the table.
          } else {
            Swal.fire("Error!", "Failed to delete the plan.", "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error!", "An error occurred while deleting the plan.", "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Define the list of fields to display with their corresponding labels.
  // Only fields present in the backend response (i.e. with a value) will be rendered.
  const planFields = [
    { key: "created_by", label: "አቃጅ" },
    { key: "department_name", label: "ስራ ክፍል" },
    { key: "goal_name", label: "ግብ" },
    { key: "objective_name", label: "አላማ" },
    { key: "specific_objective_name", label: "ውጤት" },
    { key: "specific_objective_detailname", label: "ዝርዝር ተገባር" },
    { key: "measurement", label: "መለኪያ በ %" },
    { key: "details", label: "መግለጫ" },
    { key: "baseline", label: "መነሻ በ %" },
    { key: "plan", label: "እቅድ በ %" },
    { key: "outcome", label: "ክንዉን" },
    { key: "execution_percentage", label: "ክንዉን በ %" },
    { key: "created_at", label: "Created At" },
    { key: "updated_at", label: "Updated At" },
    { key: "year", label: "አመት" },
    { key: "month", label: "ወር" },
    { key: "day", label: "Day" },
    { key: "deadline", label: "ማጠናቀቂያ ቀን" },
    { key: "status", label: "Status" },
    { key: "priority", label: "ቅድሚያ" },
    { key: "የ እቅዱ ሂደት", label: "የ እቅዱ ሂደት" },
    { key: "plan_type", label: "የ እቅዱ አይነት" },
    { key: "income_exchange", label: "ምናዘሬው" },
    { key: "cost_type", label: "የ ወጪው አይነት" },
    { key: "employment_type", label: "የ ቅጥር ሁኔታ" },
    { key: "incomeName", label: "የ ገቢው ስም" },
    { key: "costName", label: "የ ወጪው ስም" },
    { key: "CIbaseline", label: "መነሻ" },
    { key: "CIplan", label: "እቅድ" },
    { key: "CIoutcome", label: "ክንውን በቁጥር" },
  ];

  // Helper to format dates if the field appears to be a date.
  const formatValue = (key, value) => {
    if (!value) return value;
    if (["created_at", "updated_at", "deadline"].includes(key)) {
      return new Date(value).toLocaleString();
    }
    return value;
  };

  return (
    <div>
      {/* Dashboard Section */}
      <DashboardSummary sortedPlans={plans} />
      
      {/* Table Section */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSorting("Department")}>
              Department {getSortIcon("Department")}
            </th>
            <th onClick={() => handleSorting("Year")}>
              Year {getSortIcon("Year")}
            </th>
            <th>Quarter</th>
            <th onClick={() => handleSorting("Goal")}>
              Goal {getSortIcon("Goal")}
            </th>
            <th onClick={() => handleSorting("Objective")}>
              Objective {getSortIcon("Objective")}
            </th>
            <th onClick={() => handleSorting("SpecificObjective")}>
              Specific Objective {getSortIcon("SpecificObjective")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.length > 0 ? (
            plans.map((plan) => (
              <tr key={plan.Plan_ID}>
                <td>{plan.Department || "N/A"}</td>
                <td>{plan.Year || "N/A"}</td>
                <td>{plan.Quarter || "N/A"}</td>
                <td>{plan.Goal || "N/A"}</td>
                <td>{plan.Objective || "N/A"}</td>
                <td>{plan.SpecificObjective || "N/A"}</td>
                <td>
                  <button
                    onClick={() => fetchPlanDetail(plan.Plan_ID)}
                    className="btn btn-warning btn-sm"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No plans found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Plan Details */}
      {showDetail && planDetail && (
        <div
          className="modal fade show"
          style={{
            // display: "block",
            backgroundColor: "rgba(0,0,0,0.1)",
           width: 500,
            zIndex: 1050,
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">የ እቅዱ ርፖርት</h5>
                <button type="button" className="close" onClick={closePlanDetails}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {planFields.map(
                  ({ key, label }) =>
                    planDetail[key] !== undefined &&
                    planDetail[key] !== "" && (
                      <p key={key}>
                        <strong>{label}:</strong> {formatValue(key, planDetail[key])}
                      </p>
                    )
                )}
              </div>
              <div className="modal-footer">
                <button onClick={closePlanDetails} className="btn btn-primary">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && <div>Loading...</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    </div>
  );
};

export default PlansTable;
