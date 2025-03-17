import React, { useState } from "react";
import styles from "./StaffDashboard.module.css";

/**
 * DashboardViewSelector provides a UI to select which types of content to display:
 * "all", "tables", "bar charts", or "pi charts". It calls the onSelect callback when
 * the selected view changes.
 */
const DashboardViewSelector = ({ currentView, onSelect }) => {
  const [selectedView, setSelectedView] = useState(currentView || "all");

  const handleChange = (e) => {
    const newView = e.target.value;
    setSelectedView(newView);
    onSelect(newView);
  };

  return (
    <div className={styles.selectorContainer}>
      <label className={styles.selectorLabel}> ማየት ሚፈልጉትን ይምረጡ: </label>
      <select value={selectedView} onChange={handleChange} className={styles.selectorInput}>
        <option value="all">All</option>
        <option value="tables">Tables</option>
        <option value="bar">Bar Charts</option>
        <option value="pi">Pi Charts</option>
      </select>
    </div>
  );
};

export default DashboardViewSelector;