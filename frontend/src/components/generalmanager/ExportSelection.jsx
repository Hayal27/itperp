import React, { useState } from "react";
import { printSelectedSections } from "./utils/printUtil";
import { downloadPDFofSelectedSections } from "./utils/pdfExportUtil";
import styles from "./StaffDashboard.module.css";

/*
  ExportSelection Component
  - Allows the user to select which dashboard sections to export.
  - Provides checkboxes for "Income Metrics" and "Cost Metrics".
  - Includes buttons to print or download the selected sections.
  
  How it works:
    • A clone of the provided dashboard container (via contentRef) is created.
    • Selected sections (based on their IDs) are preserved; unselected ones are removed.
    • The modified clone is then passed to the respective export utility functions.
*/
const ExportSelection = ({ contentRef }) => {
  const [selection, setSelection] = useState({
    incomeMetrics: true,
    costMetrics: true
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelection((prev) => ({ ...prev, [name]: checked }));
  };

  // Creates a clone of the container and removes unselected sections.
  const getSelectedClone = () => {
    const containerClone = contentRef.current.cloneNode(true);
    if (!selection.incomeMetrics) {
      const incomeEl = containerClone.querySelector("#incomeMetrics");
      if (incomeEl) incomeEl.remove();
    }
    if (!selection.costMetrics) {
      const costEl = containerClone.querySelector("#costMetrics");
      if (costEl) costEl.remove();
    }
    return containerClone;
  };

  const handlePrint = () => {
    const cloneWithSelection = getSelectedClone();
    printSelectedSections(cloneWithSelection);
  };

  const handleDownload = async () => {
    const cloneWithSelection = getSelectedClone();
    await downloadPDFofSelectedSections(cloneWithSelection);
  };

  return (
    <div className={styles.exportSelection}>
      <div className={styles.selectionOptions}>
        <label>
          <input
            type="checkbox"
            name="incomeMetrics"
            checked={selection.incomeMetrics}
            onChange={handleCheckboxChange}
          />
          Include Income Metrics
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            name="costMetrics"
            checked={selection.costMetrics}
            onChange={handleCheckboxChange}
          />
          Include Cost Metrics
        </label>
      </div>
      <div className={styles.exportButtons} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          onClick={handlePrint}
          className={styles.button}
          style={{ backgroundColor: "#007BFF", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Print Selected
        </button>
        <button
          onClick={handleDownload}
          className={styles.button}
          style={{ backgroundColor: "#28A745", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ExportSelection;