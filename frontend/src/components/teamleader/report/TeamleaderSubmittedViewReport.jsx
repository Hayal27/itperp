import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip as ReactTooltip } from "react-tooltip"; // Using react-tooltip v5 named import
import "../../../assets/css/viewplan.css";
import "../../../assets/css/magic-tooltip.css";

const TeamleaderSubmittedViewPlan = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("http://192.168.56.1:5000/api/submitted_reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success && response.data.plans) {
        setPlans(response.data.plans);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Error fetching plans:", error.response?.data || error.message);
      setPlans([]);
    }
  };

  const handleApproveDecline = async (planId, action) => {
    try {
      const response = await axios.put(
        "http://192.168.56.1:5000/api/supervisor/plans/approve",
        { plan_id: planId, status: action, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(response.data.message);
        fetchPlans();  // Refresh the list of plans after the update
        setSelectedPlan(null);  // Clear selected plan
        setComment("");  // Clear comment
      } else {
        alert(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error updating plan:", error.response?.data || error.message);
      alert("Failed to update plan. Please try again.");
    }
  };

  const handleReviewClick = (plan) => {
    setSelectedPlan(plan);
  };

  // Mapping backend attribute keys to display labels.
  const fieldLabels = {
    created_by: "አቃጅ",
    department_name: "የስራ ክፍል",
    year: "የታቀደበት አመት",
    month: "ወር",
    day: "ቀን",
    deadline: "እስከ",
    // status: "Status",
    priority: "Priority",
    goal_name: "ግብ",
    objective_name: "አላማ",
    specific_objective_name: "ውጤት",
    specific_objective_detailname: "ዝርዝር ተግባር",
    measurement: "ፐርፎርማንስ መለኪያ",
    baseline: "መነሻ %",
    plan: "የታቀደው %",
    outcome: "ክንውን",
    execution_percentage: "ክንውን በ %",
    plan_type: "የ እቅዱ አይነት",
    income_exchange: "ምንዛሬ",
    cost_type: "ወጪ አይነት",
    employment_type: "የቅጥር ሁኔታ",
    incomeName: "የገቢ ስም",
    costName: "የመጪው ስም",
    CIbaseline: "መነሻ በ ገንዘብ",
    CIplan: "እቅድ በ ገንዘብ",
    CIoutcome: "ክንውን በ ገንዘብ",
  };

  // Filtering fields to only display those that are defined and not null in the plan.
  const renderPlanDetails = (plan) => {
    return Object.entries(fieldLabels).map(([key, label]) => {
      if (plan[key] !== undefined && plan[key] !== null && plan[key] !== "") {
        return (
          <p key={key}>
            <strong>{label}:</strong> {plan[key]}
          </p>
        );
      }
      return null;
    });
  };

  // Function to render the progress bar with tooltip using react-tooltip v5 attributes
  const renderProgressBar = (percentage) => {
    let color;
    if (percentage <= 33) {
      color = "red";
    } else if (percentage <= 66) {
      color = "yellow";
    } else {
      color = "green";
    }

    return (
      <div className="progress-bar" style={{ width: "100%", backgroundColor: "#e0e0e0" }}>
        <div
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            height: "10px",
          }}
          data-tooltip-id="executionTooltip" // Associate this element with the tooltip
          data-tooltip-content={`${percentage}%`} // Set the tooltip content to the execution percentage value
        ></div>
        <ReactTooltip id="executionTooltip" place="top" effect="solid" className="magical-tooltip" />
      </div>
    );
  };

  return (
    <div className="supervisor-dashboard">
      <h2>በ ዲፓርትመንቱ የታቀዱ እቅዶች</h2>

      <div className="plan-list">
        {plans.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ዲፓርትመንቱ</th>
                <th>አቃጅ</th>
                <th>ግብ</th>
                <th>አላማ</th>
                <th>ውጤት</th>
                <th>የውጤቱ ዝርዝር ተ��ባር</th>
                <th>Status</th>
                <th>ክንውን በ %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.plan_id}>
                  <td>{plan.department_name}</td>
                  <td>{plan.created_by}</td>
                  <td>{plan.goal_name}</td>
                  <td>{plan.objective_name}</td>
                  <td>{plan.specific_objective_name}</td>
                  <td>{plan.specific_objective_detailname}</td>
                  <td>{plan.status || "N/A"}</td>
                  <td>{renderProgressBar(plan.execution_percentage || 0)}</td>
                  <td>
                    <button onClick={() => handleReviewClick(plan)}>Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No plans available.</p>
        )}
      </div>

      {selectedPlan && (
        <div className="modal">
          <h3>Review Report</h3>
          <div className="plan-details">
            {renderPlanDetails(selectedPlan)}
          </div>
          <textarea
            placeholder="Add a comment here (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="modal-actions">
            <button onClick={() => handleApproveDecline(selectedPlan.plan_id, "Approved")}>
              Approve
            </button>
            <button onClick={() => handleApproveDecline(selectedPlan.plan_id, "Declined")}>
              Decline
            </button>
            <button onClick={() => setSelectedPlan(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamleaderSubmittedViewPlan;