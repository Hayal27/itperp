
import React from "react";

const Filters = ({ filters, handleFilterChange, applyFilters }) => {
  return (
    <div className="professional-filters">
      <div className="filters-header">
        <h3 className="filters-title">🔍 Search & Filter Plans</h3>
        <p className="filters-subtitle">Use the filters below to find specific plans</p>
      </div>

      <div className="filters-grid">
        <div className="filter-group full-width">
          <label htmlFor="search" className="filter-label">
            <span className="label-icon">🔎</span>
            Global Search
          </label>
          <div className="input-group">
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search || ""}
              onChange={handleFilterChange}
              className="form-control search-input"
              placeholder="Search across all plan data..."
            />
            <div className="input-group-text">
              <span>⌕</span>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="year" className="filter-label">
            <span className="label-icon">📅</span>
            Year
          </label>
          <input
            type="number"
            id="year"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="e.g., 2024"
            min="2020"
            max="2030"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="quarter" className="filter-label">
            <span className="label-icon">📊</span>
            Quarter
          </label>
          <select
            id="quarter"
            name="quarter"
            value={filters.quarter}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="">All Quarters</option>
            <option value="1">Q1 (Jan-Mar)</option>
            <option value="2">Q2 (Apr-Jun)</option>
            <option value="3">Q3 (Jul-Sep)</option>
            <option value="4">Q4 (Oct-Dec)</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="department" className="filter-label">
            <span className="label-icon">🏢</span>
            Department
          </label>
          <select
            id="department"
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="form-select"
          >
            <option value="">All Departments</option>
            <option value="አካውንቲንግ እና ፋይናንስ">አካውንቲንግ እና ፋይናንስ</option>
            <option value="ኢንፎርሜሽን ቴክኖሎጂ ልማት">ኢንፎርሜሽን ቴክኖሎጂ ልማት</option>
            <option value="ኮንስትራክሽን">ኮንስትራክሽን</option>
            <option value="ኦዲት">ኦዲት</option>
            <option value="ቢዝነስ ዴቨሎፕመንት">ቢዝነስ ዴቨሎፕመንት</option>
            <option value="ህግ">ህግ</option>
          </select>
        </div>

        <div className="filter-actions">
          <button
            className="btn btn-apply"
            onClick={applyFilters}
          >
            <span className="btn-icon">🔍</span>
            Apply Filters
          </button>
          <button
            className="btn btn-clear"
            onClick={() => {
              // Clear all filters
              Object.keys(filters).forEach(key => {
                handleFilterChange({ target: { name: key, value: '' } });
              });
              applyFilters();
            }}
          >
            <span className="btn-icon">🗑️</span>
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
