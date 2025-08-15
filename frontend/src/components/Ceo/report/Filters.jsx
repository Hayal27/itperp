import React from "react";

const Filters = ({ filters, handleFilterChange, applyFilters }) => {
  return (
    <div className="professional-filters">
      <div className="filters-header">
        <h3 className="filters-title">🔍 Executive Report Filters</h3>
        <p className="filters-subtitle">Filter and analyze organizational data with precision</p>
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
              placeholder="Search across all report data..."
            />
            <div className="input-group-text">
              <span>⌕</span>
            </div>
          </div>
        </div>

        <div className="filter-group">
          <label htmlFor="year" className="filter-label">
            <span className="label-icon">📅</span>
            Fiscal Year
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

        <div className="filter-group">
          <label htmlFor="goal_id" className="filter-label">
            <span className="label-icon">🎯</span>
            Goal ID
          </label>
          <input
            type="number"
            id="goal_id"
            name="goal_id"
            value={filters.goal_id}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="Enter Goal ID"
            min="1"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="objective_id" className="filter-label">
            <span className="label-icon">📋</span>
            Objective ID
          </label>
          <input
            type="number"
            id="objective_id"
            name="objective_id"
            value={filters.objective_id}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="Enter Objective ID"
            min="1"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="specific_objective_id" className="filter-label">
            <span className="label-icon">🎪</span>
            Specific Objective ID
          </label>
          <input
            type="number"
            id="specific_objective_id"
            name="specific_objective_id"
            value={filters.specific_objective_id}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="Enter Specific Objective ID"
            min="1"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="specific_objective_detail_id" className="filter-label">
            <span className="label-icon">📝</span>
            Detail ID
          </label>
          <input
            type="number"
            id="specific_objective_detail_id"
            name="specific_objective_detail_id"
            value={filters.specific_objective_detail_id}
            onChange={handleFilterChange}
            className="form-control"
            placeholder="Enter Detail ID"
            min="1"
          />
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
          <button
            className="btn btn-export"
            onClick={() => console.log('Export filtered data')}
          >
            <span className="btn-icon">📊</span>
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
