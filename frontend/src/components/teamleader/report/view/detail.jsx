import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";

const AddReport = () => {
  const { planId } = useParams(); // Get the plan ID from the URL
  const [reportData, setReportData] = useState({
    title: "",
    content: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setErrorMessage("You must be logged in to add a report.");
      return;
    }

    try {
      const response = await Axios.post(
        `http://localhost:5000/api/reports/${planId}`,
        reportData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccessMessage("Report added successfully!");
        setTimeout(() => navigate("/staff/view-plans"), 2000); // Redirect after success
      } else {
        setErrorMessage("Failed to add the report.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding the report.");
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Report</h2>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      {successMessage && <p className="text-success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={reportData.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            name="content"
            value={reportData.content}
            onChange={handleChange}
            className="form-control"
            rows="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Report
        </button>
      </form>
    </div>
  );
};

export default AddReport;
