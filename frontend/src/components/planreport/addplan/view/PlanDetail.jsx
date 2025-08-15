import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";

const PlanDetail = () => {
  const { planId } = useParams(); // Extract the plan ID from the URL
console.log(planId);

  const [plan, setPlan] = useState(null); // State to hold plan details
  const [loading, setLoading] = useState(true); // State for loading status
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  useEffect(() => {
    // Check if planId exists
    if (!planId) {
      setErrorMessage("Invalid Plan ID.");
      setLoading(false);
      return;
    }

    const fetchPlanDetail = async () => {
      try {
        const response = await Axios.get(`http://localhost:5000/api/pland/${planId}`, {
          headers: { Authorization: `Bearer ${token}` }, // Attach token in headers
        });

        if (response.data.success) {
          setPlan(response.data.plan); // Set plan details in state
          setErrorMessage(""); // Clear error message
        } else {
          setErrorMessage("Plan details not found."); // Handle no success response
        }
      } catch (error) {
        setErrorMessage("Failed to fetch plan details."); // Handle API error
        console.error(error);
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchPlanDetail(); // Fetch plan details on component mount
  }, [planId, token]);

  // Render loading spinner if data is being fetched
  if (loading) {
    return <p>Loading plan details...</p>;
  }

  // Render error message if there are any issues
  if (errorMessage) {
    return <p className="text-danger">{errorMessage}</p>;
  }

  // Render the plan details
  return (
    <div className="plan-detail">
      <h2>Plan Details</h2>
      {plan ? (
        <>
          <p><strong>Plan ID:</strong> {plan.Plan_ID}</p>
          <p><strong>አላማ:</strong> {plan.Objective}</p>
          <p><strong>ግብ:</strong> {plan.Goal}</p>
          <p><strong>Details:</strong> {plan.Details}</p>
          <p><strong>Measurement:</strong> {plan.Measurement}</p>
          <p><strong>Baseline:</strong> {plan.Baseline}</p>
          <p><strong>Plan:</strong> {plan.Plan}</p>
          <p><strong>ክንውን:</strong>   {plan.Outcome}</p>
          <p><strong>ክንውን በ%:</strong> {plan.Execution_Percentage}</p>
          <p><strong>Description:</strong> {plan.Description}</p>
          <p><strong>Status:</strong> {plan.Status}</p>
          <p><strong>Comment:</strong> {plan.Comment}</p>
          <p><strong>Created By:</strong> {plan.Created_By}</p>
          <p><strong>Department:</strong> {plan.Department_Name}</p>
          <p><strong>Year:</strong> {plan.Year}</p>
          <p><strong>ሩብ አመት:</strong> {plan.Quarter}</p>
          <p><strong>Progress:</strong> {plan.Progress}</p>
        </>
      ) : (
        <p>No details available.</p>
      )}
    </div>
  );
};

export default PlanDetail;
