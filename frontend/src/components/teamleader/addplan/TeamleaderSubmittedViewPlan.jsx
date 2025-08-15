
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/css/viewplan.css";

const TeamleaderSubmittedViewPlan = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanIds, setSelectedPlanIds] = useState([]);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/supervisor/plans", {
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

  const handleApproveDecline = async (planId, action, actionComment = comment) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/supervisor/plans/approve",
        { plan_id: planId, status: action, comment: actionComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Show individual alert for feedback if needed
        console.log(response.data.message);
      } else {
        console.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error updating plan:", error.response?.data || error.message);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedPlanIds.length === 0) {
      alert("No plans selected.");
      return;
    }
    // Prompt for optional comment for bulk update
    const bulkComment = prompt("Add a comment (optional)") || "";
    try {
      // Execute request concurrently for all selected plans.
      await Promise.all(
        selectedPlanIds.map((planId) => handleApproveDecline(planId, action, bulkComment))
      );
      alert(`Plans ${action} successfully.`);
      fetchPlans(); // Refresh the list
      setSelectedPlanIds([]); // Clear bulk selection
    } catch (error) {
      alert("Failed to update one or more plans. Please try again.");
    }
  };

  const handleReviewClick = (plan) => {
    setSelectedPlan(plan);
  };

  // Handle checkbox selection for bulk actions
  const handleCheckboxChange = (planId, checked) => {
    if (checked) {
      setSelectedPlanIds((prev) => [...prev, planId]);
    } else {
      setSelectedPlanIds((prev) => prev.filter((id) => id !== planId));
    }
  };

  // Handle master checkbox to select/unselect all plans
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = plans.map((plan) => plan.plan_id);
      setSelectedPlanIds(allIds);
    } else {
      setSelectedPlanIds([]);
    }
  };

  // Mapping backend attribute keys to display labels.
  const fieldLabels = {
    created_by: "አቃጅ",
    department_name: "የስራ ክፍል",
    year: "የታቀደበት አመት",
    month: "ወር",
    day: "ቀን",
    deadline: "እስከ",
    priority: "Priority",
    goal_name: "ግብ",
    objective_name: "አላማ",
    specific_objective_name: "ውጤት",
    specific_objective_detailname: "ዝርዝር ተግባር",
    measurement: "ፐርፎርማንስ መለኪያ",
    baseline: "መነሻ %",
    plan: "የታቀደው %",
    outcome: "ክንውን",
    plan_type: "የ እቅዱ አይነት",
    income_exchange: "ምንዛሬ",
    cost_type: "ወጪ አይነት",
    employment_type: "የቅጥር ሁኔታ",
    incomeName: "የገቢ ስም",
    costName: "የመጪው ስም",
    CIbaseline: "መነሻ በ ገንዘብ",
    CIplan: "እቅድ በ ገንዘብ",
    outcomeCI: "ክንውን በ ገንዘብ",
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

  return (
    <div className="supervisor-dashboard">
      <h2>በ ዲፓርትመንቱ  የታቀዱ እቅዶች</h2>

      <div className="bulk-actions" style={{ marginBottom: "1rem" }}>
        <button onClick={() => handleBulkAction("Approved")} disabled={selectedPlanIds.length === 0}>
          Approve Selected
        </button>
        <button onClick={() => handleBulkAction("Declined")} disabled={selectedPlanIds.length === 0}>
          Decline Selected
        </button>
      </div>

      <div className="plan-list">
        {plans.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={plans.length > 0 && selectedPlanIds.length === plans.length}
                  />
                </th>
                <th>Department</th>
                <th>Plan By</th>
                <th>Goal</th>
                <th>Objective</th>
                <th>Specific Objective</th>
                <th>Specific Objective Detail</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.plan_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedPlanIds.includes(plan.plan_id)}
                      onChange={(e) =>
                        handleCheckboxChange(plan.plan_id, e.target.checked)
                      }
                    />
                  </td>
                  <td>{plan.department_name}</td>
                  <td>{plan.created_by}</td>
                  <td>{plan.goal_name}</td>
                  <td>{plan.objective_name}</td>
                  <td>{plan.specific_objective_name}</td>
                  <td>{plan.specific_objective_detailname}</td>
                  <td>{plan.status || "N/A"}</td>
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
          <h3>Review Plan</h3>
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
