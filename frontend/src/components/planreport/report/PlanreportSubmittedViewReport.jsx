import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/css/viewplan.css";

const PlanreportSubmittedViewPlan = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
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

  const handleApproveDecline = async (planId, action) => {
    if (!comment.trim()) {
      alert("Comment is required for approval or declination.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/supervisor/plans/approve",
        { plan_id: planId, status: action, comment }, // Send plan_id along with status and comment
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
    setSelectedPlan(plan); // Set the selected plan to be reviewed
  };

  return (
    <div className="supervisor-dashboard">
      <h2>በ ዲፓርትመንቱ  የታቀዱ እቅዶች</h2>

      <div className="plan-list">
        {plans.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Pland By</th>
                <th>Goal</th>
                <th>Objective</th>
                <th>Specific Objecive </th>
                <th>Specific Objecive detail</th>
                <th>Status</th>
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
                  <td>{plan.specific_obective_detailname}</td>
                  <td>{plan.approval_status}</td>
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
          <p><strong>ግብ:</strong> {selectedPlan.goal_name}</p>
          <p><strong>አላማ:</strong> {selectedPlan.objective_name}</p>
         
          <p><strong>የ አላማው ውጤት </strong> {selectedPlan.specific_objective_name}</p>
          <p><strong>የ ውጤቱ ዝርዝር ተግባር :</strong> {selectedPlan.specific_obective_detailname}</p>
          <p><strong>Baseline:</strong> {selectedPlan.baseline}</p>
          <p><strong>Plan:</strong> {selectedPlan.plan}</p>
          <p><strong>Measurement:</strong> {selectedPlan.measurement}</p>
          <p><strong>Description:</strong> {selectedPlan.Description}</p>

          <p><strong>Status:</strong> {selectedPlan.specific_objective_detail_status}</p>
          <p><strong>Priority:</strong> {selectedPlan.priority}</p>
          <textarea
            placeholder="Add a comment (required)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div>
            <button onClick={() => handleApproveDecline(selectedPlan.plan_id, "Approved")} disabled={!comment.trim()}>
              Approve
            </button>
            <button onClick={() => handleApproveDecline(selectedPlan.plan_id, "Declined")} disabled={!comment.trim()}>
              Decline
            </button>
          </div>
          <div>
            <button onClick={() => setSelectedPlan(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanreportSubmittedViewPlan;
