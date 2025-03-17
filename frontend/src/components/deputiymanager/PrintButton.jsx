import React from "react";
import { printSelectedSections } from "./utils/printUtil";
import styles from "./StaffDashboard.module.css";

const PrintButton = ({ contentRef }) => {
  const handlePrint = () => {
    printSelectedSections(contentRef.current);
  };

  return (
    <button 
      className={styles.button} 
      onClick={handlePrint}
      style={{ backgroundColor: "#007BFF", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px", cursor:"pointer" }}
    >
      Print
    </button>
  );
};

export default PrintButton;