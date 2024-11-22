import Axios from "axios";
import React, { useState, useEffect } from "react";
import "../../../assets/css/reportform.css";
// const jwt = require('jsonwebtoken');
const ReportSubmissionForm = () => {
  // State to hold form data for report
  const [formData, setFormData] = useState({
    objective: "",
    goal: "",
    row_no: "",
    details: "",
    measurement: "",
    baseline: "",
    plan: "",
    outcome: "",
    execution_percentage: "",
    description: "",
    year: "",
    quarter: "Q1",
    plan_id: "", // This will be selected from the fetched plans
  });

  // State to store approved plans
  const [approvedPlans, setApprovedPlans] = useState([]);

  // State to handle form submission status
  const [responseMessage, setResponseMessage] = useState("");

  // Fetch approved plans for the current user on component mount
  useEffect(() => {
    const fetchApprovedPlans = async () => {
      const token = localStorage.getItem("token"); // Get the JWT token from localStorage

      if (!token) {
        alert("You must be logged in to view approved plans.");
        return;
      }

      try {
        // Fetch approved plans for the logged-in user
        const response = await Axios.get("http://localhost:5000/api/reports/approved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && Array.isArray(response.data.plans)) {
          setApprovedPlans(response.data.plans);
        } else {
          setResponseMessage("No approved plans found.");
        }
      } catch (error) {
        console.error("Error fetching approved plans:", error);
        setResponseMessage("An error occurred while fetching approved plans.");
      }
    };

    fetchApprovedPlans();
  }, []);

  // Update state when form fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token"); // Get the JWT token from localStorage

    if (!token) {
      alert("You must be logged in to submit a report.");
      return;
    }

    try {
      // Send the request to submit the report using Axios
      const response = await Axios.post("http://localhost:5000/api/reports", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.report_id) {
        setResponseMessage(`Report submitted successfully with ID: ${response.data.report_id}`);
      } else {
        setResponseMessage(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      setResponseMessage("An error occurred while submitting the report.");
    }
  };

  return (
    <div className="form-container">
      <h2>Submit a New Report</h2>
      <form onSubmit={handleSubmit}>
        <label>Approved Plan:</label>
        <select
          name="plan_id"
          value={formData.plan_id}
          onChange={handleChange}
          required
        >
          <option value="">Select an approved plan</option>
          {approvedPlans.map((plan) => (
            <option key={plan.plan_id} value={plan.plan_id}>
              {plan.objective} ({plan.year}, {plan.quarter})
            </option>
          ))}
        </select>
        <br />

        <label>Objective:</label>
        <input
          type="text"
          name="objective"
          value={formData.objective}
          onChange={handleChange}
          required
        />
        <br />

        <label>Goal:</label>
        <input
          type="text"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          required
        />
        <br />

        <label>Row Number:</label>
        <input
          type="number"
          name="row_no"
          value={formData.row_no}
          onChange={handleChange}
        />
        <br />

        <label>Details:</label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
        />
        <br />

        <label>Measurement:</label>
        <input
          type="text"
          name="measurement"
          value={formData.measurement}
          onChange={handleChange}
        />
        <br />

        <label>Baseline:</label>
        <input
          type="text"
          name="baseline"
          value={formData.baseline}
          onChange={handleChange}
        />
        <br />

        <label>Plan:</label>
        <textarea
          name="plan"
          value={formData.plan}
          onChange={handleChange}
        />
        <br />

        <label>Outcome:</label>
        <textarea
          name="outcome"
          value={formData.outcome}
          onChange={handleChange}
        />
        <br />

        <label>Execution Percentage:</label>
        <input
          type="number"
          name="execution_percentage"
          value={formData.execution_percentage}
          onChange={handleChange}
          min="0"
          max="100"
        />
        <br />

        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <br />

        <label>Year:</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <br />

        <label>Quarter:</label>
        <select
          name="quarter"
          value={formData.quarter}
          onChange={handleChange}
        >
          <option value="Q1">Q1</option>
          <option value="Q2">Q2</option>
          <option value="Q3">Q3</option>
          <option value="Q4">Q4</option>
        </select>
        <br />

        <button type="submit">Submit Report</button>
      </form>

      {responseMessage && <div className="response-message">{responseMessage}</div>}
    </div>
  );
};

export default ReportSubmissionForm;
