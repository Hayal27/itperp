import React from "react";
import { downloadPDFofSelectedSections } from "./utils/pdfExportUtil";
import styles from "./StaffDashboard.module.css";

const DownloadPDFButton = ({ contentRef }) => {
  const handleDownload = async () => {
    await downloadPDFofSelectedSections(contentRef.current);
  };

  return (
    <button 
      className={styles.button} 
      onClick={handleDownload}
      style={{ backgroundColor: "#28A745", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px", cursor:"pointer" }}
    >
      Download PDF 
    </button>
  );
};

export default DownloadPDFButton;