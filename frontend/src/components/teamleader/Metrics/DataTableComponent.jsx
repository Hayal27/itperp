
import React, { useState } from "react";

/**
 * DataTableComponent is a presentational component that renders 
 * a table layout with filtering, search, and pagination.
 *
 * Expected props:
 *  - categories: Array of objects with keys: 
 *      name, department, plan, outcome, difference, excution_persantage, description.
 */
const DataTableComponent = ({ categories }) => {
  // State for search input and pagination
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust this value as needed

  // Handle search field change and reset page to 1
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };

  // Filter categories based on search text (case-insensitive)
  const filteredCategories = categories.filter((cat) => {
    const lowerSearch = searchText.toLowerCase();
    return (
      (cat.name && cat.name.toLowerCase().includes(lowerSearch)) ||
      (cat.department && cat.department.toLowerCase().includes(lowerSearch)) ||
      (cat.description && cat.description.toLowerCase().includes(lowerSearch))
    );
  });

  // Pagination calculations
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  // Handler for changing pages
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search by name, department or description..."
          style={{ padding: "0.5rem", width: "100%", maxWidth: "300px" }}
        />
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Name</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Department</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Plan</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Outcome</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Difference</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Excution Persantage</th>
            <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((cat, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.name}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.department}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.plan}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.outcome}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.difference}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.excution_persantage}</td>
                <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "1rem" }}>
                No data found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              style={{
                fontWeight: currentPage === i + 1 ? "bold" : "normal",
                margin: "0 5px"
              }}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTableComponent;
