import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import'../../../assets/css/Dashboard.css'

const PlanDetailsModal = ({ data, closeModal }) => {
  // Convert plan type to lowercase or default to "default"
  const planType = data.plan_type ? data.plan_type.toLowerCase() : "default";

  // Common details available for every plan type
  const commonDetails = [
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
    { label: "የ እቅዱ አይነት", value: data.plan_type || "N/A" }
  ];

  // Type-specific details based on planType
  let typeDetails = [];
  switch (planType) {
    case "cost":
      typeDetails = [
        { label: "Cost Type", value: data.cost_type || "N/A" },
        { label: "የ ወጪው ስም", value: data.costName || "N/A" },
        { label: "መነሻ", value: data.CIbaseline || "N/A" },
        { label: "እቅድ", value: data.CIplan || "N/A" },
        { label: "CI Outcome", value: data.CIoutcome || "N/A" },
        { label: "CI Exec %", value: data.CIexecution_percentage || "N/A" }
      ];
      break;
    case "income":
      typeDetails = [
        { label: "ምናዘሬው", value: data.income_exchange || "N/A" },
        { label: "የ ገቢው ስም", value: data.incomeName || "N/A" },
        { label: "መነሻ", value: data.CIbaseline || "N/A" },
        { label: "እቅድ", value: data.CIplan || "N/A" },
        { label: "CI Outcome", value: data.CIoutcome || "N/A" },
        { label: "CI Exec %", value: data.CIexecution_percentage || "N/A" }
      ];
      break;
    case "hr":
      typeDetails = [
        { label: "የ ቅጥር ሁኔታ", value: data.employment_type || "N/A" }
      ];
      break;
    default:
      typeDetails = [];
  }

  // Combine both common and type-specific details
  const details = [...commonDetails, ...typeDetails];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 bg-gray-100 z-50" // container starting at top with a light gray background
      tabIndex="-1"
      role="dialog"
    >
      <div className="position1 flex flex-col h-screen">
        <header className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-indigo-600 to-blue-600">
          <h5 className="text-white text-base sm:text-lg font-bold">Plan Details</h5>
          <button
            type="button"
            onClick={closeModal}
            className="text-white hover:text-gray-200 transition text-base sm:text-lg"
          >
            <span>&times;</span>
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {details.map((item, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-5 bg-white border border-gray-300 rounded-lg shadow hover:shadow-md transition"
              >
                <h6 className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
                  {item.label}
                </h6>
                <p className="mt-1 text-xs sm:text-sm text-gray-800">
                  {item.value || "N/A"}
                </p>
              </div>
            ))}
          </div>
        </main>
        <footer className="flex justify-end p-3 sm:p-4 border-t border-gray-300">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-xs sm:text-sm"
          >
            Close
          </button>
        </footer>
      </div>
    </motion.div>
  );
};

PlanDetailsModal.propTypes = {
  data: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default PlanDetailsModal;



