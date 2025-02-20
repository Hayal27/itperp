import React from "react";
  import PropTypes from "prop-types";
  import { motion } from "framer-motion";

  /**
   * PlanDetailsModal Component
   *
   * This component displays detailed information of a plan.
   * It automatically detects the planType from the fetched data and renders only
   * the related fields while hiding unrelated ones.
   *
   * Supported plan types:
   *  - cost: shows cost-related fields.
   *  - income: shows income-related fields.
   *  - hr: shows HR-related fields.
   *  - default: shows only common plan information.
   */
  const PlanDetailsModal = ({ data, closeModal }) => {
    // Detect the plan type in lowercase; default to "default" if undefined.
    const planType = data.plan_type ? data.plan_type.toLowerCase() : "default";

    // Common details available for every plan type.
    const commonDetails = [
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
      { label: "Plan Type", value: data.plan_type || "N/A" }
    ];

    // Type-specific details, rendered only if relevant to the planType.
    let typeDetails = [];
    switch (planType) {
      case "cost":
        typeDetails = [
          { label: "Cost Type", value: data.cost_type || "N/A" },
          { label: "Cost Name", value: data.costName || "N/A" },
          { label: "CI Baseline", value: data.CIbaseline || "N/A" },
          { label: "CI Plan", value: data.CIplan || "N/A" },
          { label: "CI Outcome", value: data.CIoutcome || "N/A" },
          { label: "CI Exec %", value: data.CIexecution_percentage || "N/A" }
        ];
        break;
      case "income":
        typeDetails = [
          { label: "Income Exchange", value: data.income_exchange || "N/A" },
          { label: "Income Name", value: data.incomeName || "N/A" },
          { label: "CI Baseline", value: data.CIbaseline || "N/A" },
          { label: "CI Plan", value: data.CIplan || "N/A" },
          { label: "CI Outcome", value: data.CIoutcome || "N/A" },
          { label: "CI Exec %", value: data.CIexecution_percentage || "N/A" }
        ];
        break;
      case "hr":
        typeDetails = [
          { label: "Employment Type", value: data.employment_type || "N/A" }
        ];
        break;
      default:
        typeDetails = [];
    }

    // Merge common and type-specific details.
    const details = [...commonDetails, ...typeDetails];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="modal d-block"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header bg-blue-600 text-white">
              <h5 className="modal-title">Plan Details</h5>
              <button type="button" className="close text-white" onClick={closeModal}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {details.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded shadow-sm">
                    <h6 className="text-sm font-medium text-gray-500">{item.label}</h6>
                    <p className="text-base text-gray-800">{item.value || "N/A"}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer flex justify-end p-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  PlanDetailsModal.propTypes = {
    data: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired
  };

  export default PlanDetailsModal;