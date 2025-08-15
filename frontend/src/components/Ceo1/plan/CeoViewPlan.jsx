import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../assets/css/viewplan.css";

const CeoViewPlan = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

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
        "http://localhost:5000/api/supervisor/plans/approvesp",
        { plan_id: planId, status: action, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(response.data.message);

        if (action === "Approved" && response.data.plan_details) {
          setSelectedPlan(response.data.plan_details);
        } else {
          setSelectedPlan(null);
        }

        fetchPlans();
        setComment("");
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

  return (
    <div className="supervisor-dashboard">
      <h2>በ ዲፓርትመንቱ  የታቀዱ እቅዶች</h2>

      <div className="plan-list">
        {plans.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Objective</th>
                <th>Goal</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.plan_id}>
                  <td>{plan.objective}</td>
                  <td>{plan.goal}</td>
                  <td>{plan.status}</td>
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
          <p><strong>አላማ:</strong> {selectedPlan.objective}</p>
          <p><strong>ግብ:</strong> {selectedPlan.goal}</p>
          <p><strong>Status:</strong> {selectedPlan.status}</p>
          <p><strong>Details:</strong> {selectedPlan.details}</p>
          <p><strong>Created By:</strong> {selectedPlan.created_by}</p>
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

export default CeoViewPlan;
