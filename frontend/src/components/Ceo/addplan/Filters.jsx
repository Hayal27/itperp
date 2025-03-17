import React from "react";

const Filters = ({ filters, handleFilterChange, applyFilters }) => {
  return (
    <div className="row mb-3">
      <div className="col-md-3">
        <label htmlFor="year" className="form-label">Year</label>
        <input
          type="number"
          id="year"
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          className="form-control"
          placeholder="Enter Year"
        />
      </div>
      <div className="col-md-3">
        <label htmlFor="quarter" className="form-label">Quarter</label>
        <select
          id="quarter"
          name="quarter"
          value={filters.quarter}
          onChange={handleFilterChange}
          className="form-control"
        >
          <option value="">⬇️ Select Quarter</option>
          <option value="1">Q1</option>
          <option value="2">Q2</option>
          <option value="3">Q3</option>
          <option value="4">Q4</option>
        </select>
      </div>
      <div className="col-md-3">
        <label htmlFor="department" className="form-label">Department</label>
        <select
          id="department"
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
          className="form-control"
        >
          <option value="">⬇️ Select Department</option>
          <option value="አካውንቲንግ እና ፋይናንስ">አካውንቲንግ እና ፋይናንስ</option>
          <option value="ኢንፎርሜሽን ቴክኖሎጂ ልማት">ኢንፎርሜሽን ቴክኖሎጂ ልማት</option>
          <option value="ኮንስትራክሽን">ኮንስትራክሽን</option>
          <option value="ኦዲት">ኦዲት</option>
          <option value="ቢዝነስ ዴቨሎፕመንት">ቢዝነስ ዴቨሎፕመንት</option>
          <option value="ህግ">ህግ</option>
        </select>
      </div>
      <div className="col-md-3">
        <button
          className="btn btn-primary mt-4"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default Filters;
