import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterForm = ({ filters, onSubmit }) => {
  // Initialize form values; also include a new field to track the selected filter type.
  const [formValues, setFormValues] = useState({
    selectedFilter: '', // either 'year' or 'year_range'
    year: '',
    year_range: '',
    ...filters
  });
  const [objectives, setObjectives] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch specific objectives on component mount
  useEffect(() => {
    const fetchObjectives = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to view this data.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/getSpesificObjectives", {
          headers: { Authorization: `Bearer ${token}` },
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

  // Handler for all input changes including the dropdown and text inputs.
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  // Validate and then submit handler sends current filters to the parent component.
  const handleSubmit = (e) => {
    e.preventDefault();

    if(formValues.selectedFilter === 'year') {
      const year = parseInt(formValues.year, 10);
      // If year is not valid or is before 2017, alert and stop processing.
      if (isNaN(year) || year < 2017) {
        alert("No result for the inserted year");
        return;
      }
    } else if(formValues.selectedFilter === 'year_range') {
      // Expecting a format like "YYYY-YYYY"
      const rangeParts = formValues.year_range.split('-');
      if (rangeParts.length !== 2) {
        alert("Please enter a valid year range in the format YYYY-YYYY");
        return;
      }
      const startYear = parseInt(rangeParts[0].trim(), 10);
      const endYear = parseInt(rangeParts[1].trim(), 10);
      if (isNaN(startYear) || isNaN(endYear) || startYear < 2017) {
        alert("No result for the inserted year range");
        return;
      }
    }
    onSubmit(formValues);
  };

  // Determine if advanced fields should be shown.
  const showAdvanced = (
    (formValues.selectedFilter === 'year' && Boolean(formValues.year.trim())) ||
    (formValues.selectedFilter === 'year_range' && Boolean(formValues.year_range && formValues.year_range.trim()))
  );

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      {/* Row for selecting filter type */}
      <div className="row g-3 mb-3">
        <div className="col-sm-3">
          <label htmlFor="selectedFilter" className="form-label">Select Filter Type</label>
          <select
            id="selectedFilter"
            value={formValues.selectedFilter || ''}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Filter Type</option>
            <option value="year">Year</option>
            <option value="year_range">Year Range</option>
          </select>
        </div>
      </div>

      {/* Display input field based on the selected filter */}
      {formValues.selectedFilter === 'year' && (
        <div className="row g-3 mb-3">
          <div className="col-sm-3">
            <label htmlFor="year" className="form-label">Year</label>
            <input
              id="year"
              type="text"
              value={formValues.year || ''}
              onChange={handleChange}
              placeholder="e.g., 2023"
              className="form-control"
            />
          </div>
        </div>
      )}
      {formValues.selectedFilter === 'year_range' && (
        <div className="row g-3 mb-3">
          <div className="col-sm-3">
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
        </div>
      )}

      {/* Advanced Fields: Only shown if the selected filter field contains a value */}
      {showAdvanced && (
        <div className="slide-down">
          <div className="row g-3 mb-3">
            <div className="col-sm-3">
              <label htmlFor="quarter" className="form-label">Quarter</label>
              <input
                id="quarter"
                type="text"
                value={formValues.quarter || ''}
                onChange={handleChange}
                placeholder="e.g., Q1"
                className="form-control"
              />
            </div>
            <div className="col-sm-3">
              <label htmlFor="department" className="form-label">Department</label>
              <input
                id="department"
                type="text"
                value={formValues.department || ''}
                onChange={handleChange}
                placeholder="Department"
                className="form-control"
              />
            </div>
            <div className="col-sm-3">
              <label htmlFor="createdBy" className="form-label">Created By</label>
              <input
                id="createdBy"
                type="text"
                value={formValues.createdBy || ''}
                onChange={handleChange}
                placeholder="User ID/Name"
                className="form-control"
              />
            </div>
            <div className="col-sm-3">
              <label htmlFor="view" className="form-label">View</label>
              <input
                id="view"
                type="text"
                value={formValues.view || ''}
                onChange={handleChange}
                placeholder="View"
                className="form-control"
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-sm-3">
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
          </div>

          {/* Submit Button */}
          <div className="row">
            <div className="col-sm-3">
              <button type="submit" className="btn btn-primary w-100">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default FilterForm; 