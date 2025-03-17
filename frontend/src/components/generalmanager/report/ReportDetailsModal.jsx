import React from 'react';
import PropTypes from 'prop-types';

const ReportDetailsModal = ({ data, closeModal }) => {
  // Construct an array of detail items to display.
  const detailItems = [
    { label: "ስራ ክፍል", value: data.Department },
    { label: "Year", value: data.Year },
    { label: "Quarter", value: data.Quarter },
    { label: "ግብ" , value: data.Goal },
    { label: "አላማ" , value: data.Objective },
    { label: "ዝርዝር" , value: data.Details },
    { label: "መለኪያ በ %" , value: data.Measurement },
    { label: "መነሻ በ %" , value: data.Baseline },
    { label: "እቅድ በ %" , value: data.Plan },
    { label: "ክንዉን", value: data.Outcome },
    { label: "Exec %", value: data.Execution_Percentage },
    { label: "Description", value: data.Description },
    { label: "Status", value: data.Status },
    { label: "Comment", value: data.Comment },
    { label: "የ እቅዱ ሂደት", value: data.Progress },
    { label: "Spec. Obj. Detail", value: data.specific_objective_detailname || "N/A" },
    { label: "የ እቅዱ አይነት", value: data.plan_type || "N/A" },
    { label: "ምናዘሬው", value: data.income_exchange || "N/A" },
    { label: "Cost Type", value: data.cost_type || "N/A" },
    { label: "የ ቅጥር ሁኔታ", value: data.employment_type || "N/A" },
    { label: "የ ገቢው ስም", value: data.incomeName || "N/A" },
    { label: "የ ወጪው ስም", value: data.costName || "N/A" },
    { label: "መነሻ", value: data.CIbaseline || "N/A" },
    { label: "እቅድ", value: data.CIplan || "N/A" },
    { label: "CI Outcome", value: data.CIoutcome || "N/A" },
    { label: "CI Exec %", value: data.CIexecution_percentage || "N/A" },
  ];

  return (
    <div role="dialog" aria-modal="true" className="org-modal-container">
      {/* Increase width on modal content container via inline style */}
      <div className="org-modal-content" style={{ maxWidth: '100%', margin: '0 auto' }}>
        <header className="org-modal-header">
          <h2 className="org-modal-title">Report Details</h2>
          <button 
            type="button" 
            onClick={closeModal} 
            aria-label="Close Report Details" 
            className="org-modal-close-button"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </header>
        <main className="org-modal-body">
          {detailItems.map((item, idx) => (
            <div key={idx} className="org-detail-item">
              <label className="org-detail-label">{item.label}:</label>
              <span className="org-detail-value">{item.value || "N/A"}</span>
            </div>
          ))}
        </main>
        {/* Removed redundant close button from footer */}
      </div>
    </div>
  );
};

ReportDetailsModal.propTypes = {
  data: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default ReportDetailsModal;