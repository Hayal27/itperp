import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FilterForm.css';

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

  // Helper function to count active filters
  const getActiveFiltersCount = () => {
    return Object.values(formValues).filter(value => value && value.toString().trim() !== '').length;
  };

  // Helper function to reset filters
  const handleReset = () => {
    const resetValues = Object.keys(formValues).reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {});
    setFormValues(resetValues);
    onSubmit(resetValues);
  };

  return (
    <div className="ceo-filter-form-container">
      <form onSubmit={handleSubmit} className="ceo-filter-form">
        {/* Professional Filter Grid Layout */}
        <div className="ceo-filter-grid">
          {/* Year Filter */}
          <div className="ceo-filter-group">
            <label htmlFor="year" className="ceo-filter-label">
              <i className="bi bi-calendar-event me-2"></i>
              Year
            </label>
            <input
              id="year"
              type="text"
              value={formValues.year}
              onChange={handleChange}
              placeholder="e.g., 2023"
              className="ceo-filter-input form-control"
            />
          </div>

          {/* Year Range Filter */}
          <div className="ceo-filter-group">
            <label htmlFor="year_range" className="ceo-filter-label">
              <i className="bi bi-calendar3-range me-2"></i>
              Year Range
            </label>
            <input
              id="year_range"
              type="text"
              value={formValues.year_range || ''}
              onChange={handleChange}
              placeholder="e.g., 2020-2023"
              className="ceo-filter-input form-control"
            />
          </div>

          {/* Quarter Filter */}
          <div className="ceo-filter-group">
            <label htmlFor="quarter" className="ceo-filter-label">
              <i className="bi bi-calendar3 me-2"></i>
              Quarter
            </label>
            <select
              id="quarter"
              value={formValues.quarter}
              onChange={handleChange}
              className="ceo-filter-select form-select"
            >
              <option value="">All Quarters</option>
              <option value="Q1">Q1 (Jan-Mar)</option>
              <option value="Q2">Q2 (Apr-Jun)</option>
              <option value="Q3">Q3 (Jul-Sep)</option>
              <option value="Q4">Q4 (Oct-Dec)</option>
            </select>
          </div>

          {/* Department Filter */}
          <div className="ceo-filter-group">
            <label htmlFor="department" className="ceo-filter-label">
              <i className="bi bi-building me-2"></i>
              Department
            </label>
            <input
              id="department"
              type="text"
              value={formValues.department}
              onChange={handleChange}
              placeholder="Department name"
              className="ceo-filter-input form-control"
            />
          </div>

          {/* Created By Filter */}
          <div className="ceo-filter-group">
            <label htmlFor="createdBy" className="ceo-filter-label">
              <i className="bi bi-person me-2"></i>
              Created By
            </label>
            <input
              id="createdBy"
              type="text"
              value={formValues.createdBy}
              onChange={handleChange}
              placeholder="User ID/Name"
              className="ceo-filter-input form-control"
            />
          </div>

          {/* View Filter */}
          <div className="ceo-filter-group">
            <label htmlFor="view" className="ceo-filter-label">
              <i className="bi bi-eye me-2"></i>
              View Type
            </label>
            <select
              id="view"
              value={formValues.view}
              onChange={handleChange}
              className="ceo-filter-select form-select"
            >
              <option value="">All Views</option>
              <option value="summary">Summary View</option>
              <option value="detailed">Detailed View</option>
              <option value="executive">Executive View</option>
            </select>
          </div>

          {/* Specific Objective Filter */}
          <div className="ceo-filter-group">
            <label htmlFor="specific_objective_name" className="ceo-filter-label">
              <i className="bi bi-target me-2"></i>
              Specific Objective
            </label>
            {loading ? (
              <div className="ceo-loading-state">
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Loading Objectives...
              </div>
            ) : (
              <select
                id="specific_objective_name"
                value={formValues.specific_objective_name || ''}
                onChange={handleChange}
                className="ceo-filter-select form-select"
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
        </div>

        {/* Professional Action Section */}
        <div className="ceo-filter-actions">
          <div className="ceo-action-buttons">
            <button type="submit" className="btn btn-primary ceo-filter-btn ceo-apply-btn">
              <i className="bi bi-funnel me-2"></i>
              Apply Filters
            </button>
            <button type="button" onClick={handleReset} className="btn btn-outline-secondary ceo-filter-btn ceo-reset-btn">
              <i className="bi bi-arrow-clockwise me-2"></i>
              Reset Filters
            </button>
          </div>

          {/* Filter Summary */}
          <div className="ceo-filter-summary">
            <div className="ceo-filter-count">
              <i className="bi bi-info-circle me-1"></i>
              <span className="ceo-count-text">
                {getActiveFiltersCount()} filter(s) active
              </span>
            </div>
            {getActiveFiltersCount() > 0 && (
              <div className="ceo-active-filters">
                <small className="text-muted">
                  Active: {Object.entries(formValues)
                    .filter(([key, value]) => value && value.toString().trim() !== '')
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')}
                </small>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FilterForm;