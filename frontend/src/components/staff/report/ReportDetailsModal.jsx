import React from "react";

const ReportDetailsModal = ({ data, closeModal }) => {
  const details = [
    { label: "Department", value: data.Department },
    { label: "Year", value: data.Year },
    { label: "Quarter", value: data.Quarter },
    { label: "Goal", value: data.Goal },
    { label: "Objective", value: data.Objective },
    { label: "Details", value: data.Details },
    { label: "Measurement", value: data.Measurement },
    { label: "Baseline", value: data.Baseline },
    { label: "Plan", value: data.Plan },
    { label: "Outcome", value: data.Outcome },
    { label: "Exec %", value: data.Execution_Percentage },
    { label: "Description", value: data.Description },
    { label: "Status", value: data.Status },
    { label: "Comment", value: data.Comment },
    { label: "Progress", value: data.Progress },
    { label: "Spec. Obj. Detail", value: data.specific_objective_detailname || "N/A" },
    { label: "Plan Type", value: data.plan_type || "N/A" },
    { label: "Income Exchange", value: data.income_exchange || "N/A" },
    { label: "Cost Type", value: data.cost_type || "N/A" },
    { label: "Employment Type", value: data.employment_type || "N/A" },
    { label: "Income Name", value: data.incomeName || "N/A" },
    { label: "Cost Name", value: data.costName || "N/A" },
    { label: "CI Baseline", value: data.CIbaseline || "N/A" },
    { label: "CI Plan", value: data.CIplan || "N/A" },
    { label: "CI Outcome", value: data.CIoutcome || "N/A" },
    { label: "CI Exec %", value: data.CIexecution_percentage || "N/A" },
  ];

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-warning text-dark">
            <h5 className="modal-title">Report Details</h5>
            <button type="button" className="close" onClick={closeModal}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              {details.map((item, idx) => (
                <div key={idx} className="col-md-4 mb-2">
                  <strong>{item.label}:</strong> <span>{item.value || "N/A"}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={closeModal} className="btn btn-warning">
              Close Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;