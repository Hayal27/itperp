import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterForm = ({ filters, onSubmit }) => {
  const [formValues, setFormValues] = useState(filters);
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(false); // State to track fetching objectives

  // Fetch specific objectives from the database on mount
  useEffect(() => {
    const fetchObjectives = async () => {
      const token = localStorage.getItem("token"); // Retrieve JWT token for authentication

      if (!token) {
        alert("You must be logged in to view this data.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Replace with the actual API endpoint if necessary
        const response = await axios.get("http://localhost:5000/api/getSpesificObjectives", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        });
        setObjectives(response.data);
      } catch (error) {
        console.error("Error fetching specific objectives:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchObjectives();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-5 row g-3">
      {/* filter by year */}
      <div className="col-sm-2">
        <label htmlFor="year" className="form-label">Year</label>
        <input
          id="year"
          type="text"
          value={formValues.year}
          onChange={handleChange}
          placeholder="e.g., 2023"
          className="form-control"
        />
      </div>

      {/* filter by year range */}
      <div className="col-sm-2">
        <label htmlFor="year_range" className="form-label">Year Range</label>
        <input
          id="year_range"
          type="text"
          value={formValues.year_range || ''}
          onChange={handleChange}
          placeholder="e.g., 2020-2023"
          className="form-control"
        />
      </div>

      {/* filter by quarter */}
      <div className="col-sm-2">
        <label htmlFor="quarter" className="form-label">Quarter</label>
        <input
          id="quarter"
          type="text"
          value={formValues.quarter}
          onChange={handleChange}
          placeholder="e.g., Q1"
          className="form-control"
        />
      </div>

      {/* filter by department */}
      <div className="col-sm-2">
        <label htmlFor="department" className="form-label">Department</label>
        <input
          id="department"
          type="text"
          value={formValues.department}
          onChange={handleChange}
          placeholder="Department"
          className="form-control"
        />
      </div>

      {/* filter by createdBy */}
      <div className="col-sm-2">
        <label htmlFor="createdBy" className="form-label">Created By</label>
        <input
          id="createdBy"
          type="text"
          value={formValues.createdBy}
          onChange={handleChange}
          placeholder="User ID/Name"
          className="form-control"
        />
      </div>

      {/* filter by view */}
      <div className="col-sm-2">
        <label htmlFor="view" className="form-label">View</label>
        <input
          id="view"
          type="text"
          value={formValues.view}
          onChange={handleChange}
          placeholder="View"
          className="form-control"
        />
      </div>

      {/* filter by specific objective - using a select dropdown with backend fields */}
      <div className="col-sm-2">
        <label htmlFor="specific_objective_name" className="form-label">Specific Objective</label>
        {loading ? (
          <p>Loading Objectives...</p>
        ) : (
          <select
            id="specific_objective_name"
            value={formValues.specific_objective_name || ''}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select specific objective</option>
            {objectives.map((objective) => (
              <option key={objective.specific_objective_name} value={objective.specific_objective_name}>
                {objective.specific_objective_name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="col-sm-2 d-flex align-items-end">
        <button type="submit" className="btn btn-primary w-100">
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default FilterForm;