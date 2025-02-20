import React, { useState } from 'react';

const FilterForm = ({ filters, onSubmit }) => {
  const [formValues, setFormValues] = useState(filters);

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
      <div className="col-sm-2 d-flex align-items-end">
        <button type="submit" className="btn btn-primary w-100">
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default FilterForm;
