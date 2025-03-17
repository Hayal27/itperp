import React from "react";

/**
 * DataTableComponent is a presentational component responsible only for rendering 
 * the table layout with the provided categories data.
 *
 * Props:
 *  - categories: Array of category objects with properties: name, plan, outcome, difference.
 */
const DataTableComponent = ({ categories }) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
      <thead>
        <tr>
          <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Name</th>
          <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Plan</th>
          <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Outcome</th>
          <th style={{ border: "1px solid #ccc", padding: "0.5rem" }}>Difference</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cat, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.name}</td>
            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.plan}</td>
            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.outcome}</td>
            <td style={{ border: "1px solid #ccc", padding: "0.5rem" }}>{cat.difference}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTableComponent;

