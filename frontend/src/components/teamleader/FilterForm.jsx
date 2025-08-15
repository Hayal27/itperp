import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilterForm = ({ filters, onSubmit }) => {
  const [formValues, setFormValues] = useState(filters);
  const [objectives, setObjectives] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingObjectives, setLoadingObjectives] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  // Fallback static departments list
  const staticDepartments = [
    { department_id: "1", name: "አካውንቲንግ እና ፋይናንስ" },
    { department_id: "2", name: "ኢንፎርሜሽን ቴክኖሎጂ ልማት" },
    { department_id: "3", name: "ኮንስትራክሽን" },
    { department_id: "4", name: "ኦዲት" },
    { department_id: "5", name: "ቢዝነስ ዴቨሎፕመንት" },
    { department_id: "6", name: "ህግ" },
  ];

  // Fetch specific objectives from the database on mount
  useEffect(() => {
    const fetchObjectives = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to view this data.");
        setLoadingObjectives(false);
        return;
      }

      setLoadingObjectives(true);
      try {
        // Replace with the actual API endpoint if necessary
        const response = await axios.get("http://localhost:5000/api/getSpesificObjectives", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setObjectives(response.data);
      } catch (error) {
        console.error("Error fetching specific objectives:", error);
      } finally {
        setLoadingObjectives(false);
      }
    };

    fetchObjectives();
  }, []);

  // Fetch departments from the database on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to view this data.");
        setLoadingDepartments(false);
        return;
      }

      setLoadingDepartments(true);
      try {
        // Replace with the actual API endpoint for departments if necessary
        const response = await axios.get("http://localhost:5000/api/getDepartments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormValues({ ...formValues, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  // Use the fetched departments if available, otherwise fallback to staticDepartments
  const departmentOptions = (departments && departments.length > 0) ? departments : staticDepartments;

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

      {/* filter by department using a select dropdown */}
      <div className="col-sm-2">
        <label htmlFor="department" className="form-label">Department</label>
        {loadingDepartments ? (
          <p>Loading Departments...</p>
        ) : (
          <select
            id="department"
            value={formValues.department || ''}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Department</option>
            {departmentOptions.map((dept) => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* filter by createdBy */}
      <div className="col-sm-2">
        <label htmlFor="createdBy" className="form-label">Created By</label>
        <input
          id="createdBy"
          type="text"
          value={formValues.createdBy}
          onChange={handleChange}
          placeholder="Name"
          className="form-control"
        />
      </div>

      {/* filter by view using a select dropdown */}
      <div className="col-sm-2">
        <label htmlFor="view" className="form-label">View</label>
        <select
          id="view"
          value={formValues.view || ''}
          onChange={handleChange}
          className="form-control"
        >
          <option value="">Select View</option>
          <option value="1">የፋይናንስ ዕይታ</option>
          <option value="2">የተገሌጋይ ዕይታ</option>
          <option value="3">የውስጥ አሰራር ዕይታ</option>
          <option value="4">የመማማርና ዕዴገት ዕይታ</option>
        </select>
      </div>

      {/* filter by specific objective - using a select dropdown */}
      <div className="col-sm-2">
        <label htmlFor="specific_objective_name" className="form-label">ውጤት ይምረጡ</label>
        {loadingObjectives ? (
          <p>Loading Objectives...</p>
        ) : (
          <select
            id="specific_objective_name"
            value={formValues.specific_objective_name || ''}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">ውጤት ይምረጡ</option>
            {objectives.map((objective) => (
              <option
                key={objective.specific_objective_name}
                value={objective.specific_objective_name}
              >
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