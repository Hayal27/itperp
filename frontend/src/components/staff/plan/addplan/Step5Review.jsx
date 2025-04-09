import React, { useState } from "react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { ArrowLeft, Save, Flag, Target, Zap } from "lucide-react";

const Step5Review = ({
  goal,
  objective,
  specificObjective,
  specificObjectiveDetails,
  onBack,
  onSubmit,
  isLoading,
  error,
  successMessage,
}) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [submitted, setSubmitted] = useState(false);

  // Summary data configuration
  const summaryData = [
    {
      title: "ግብ",
      value: goal?.name || "N/A",
      description: goal?.description || "N/A",
      icon: <Flag size={12} />,
      color: "blue",
      delay: 0,
    },
    {
      title: "አላማ",
      value: objective?.name || "N/A",
      description: objective?.description || "N/A",
      icon: <Target size={12} />,
      color: "green",
      delay: 0.1,
    },
    {
      title: "ውጤት",
      value: specificObjective?.specific_objective_name || "N/A",
      description: "ንኡስ አላማ",
      icon: <Zap size={12} />,
      color: "purple",
      delay: 0.2,
    },
  ];

  const handleFormSubmit = () => {
    if (!goal?.goal_id || !objective?.id || !specificObjective?.specific_objective_id) {
      Swal.fire({
        title: "የተፈለጉ መረጃዎች አልተሞሉም",
        text: "እባክዎ ሁሉንም መረጃዎች ያስገቡ",
        icon: "warning",
        confirmButtonText: "እሺ",
        background: "#ffffff",
        confirmButtonColor: "#10B981",
      });
      return;
    }
    // Call the onSubmit prop callback provided from the parent.
    onSubmit();
    // After successful submission, set the submitted flag to true, disabling further
    // resubmission or back navigation.
    setSubmitted(true);
  };

  // Function to render extra details for recognized plan types only.
  const renderPlanTypeDetails = (detail) => {
    switch (detail.planType) {
      case "cost":
        return (
          <td className="px-3 py-2 whitespace-nowrap text-xs">
            <div>
              <span className="font-medium text-emerald-600">
                {detail.costType || "N/A"}
              </span>{" "}
              | {detail.costName || "N/A"}
            </div>
          </td>
        );
      case "income":
        return (
          <td className="px-3 py-2 whitespace-nowrap text-xs">
            <div>
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {detail.incomeExchange || "N/A"}
              </span>{" "}
              | {detail.incomeName || "N/A"}
            </div>
          </td>
        );
      case "hr":
        return (
          <td className="px-3 py-2 whitespace-nowrap text-xs">
            <div>
              {detail.employmentType === "full_time" ? "ቋሚ" : "ኮንትራት"}
            </div>
          </td>
        );
      default:
        return null;
    }
  };

  const filteredDetails = specificObjectiveDetails?.filter((detail) =>
    activeTab === "all" || detail.planType === activeTab
  );

  // Extra columns in details table rendered only for recognized plan types.
  const showExtraColumns = activeTab === "cost" || activeTab === "income" || activeTab === "hr";

  // Updated Summary Table Component with only basic columns.
  const SummaryTable = () => (
    <div className="overflow-hidden rounded-lg shadow-sm border border-gray-200 bg-white mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ተ.ቁ</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ስም</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ገለጻ</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {summaryData.map((item) => (
            <motion.tr
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: item.delay }}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-3 py-2 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <div className={`flex-shrink-0 h-4 w-4 rounded bg-${item.color}-50 flex items-center justify-center`}>
                    {React.cloneElement(item.icon, { className: `text-${item.color}-500` })}
                  </div>
                  <span className="text-xs font-medium text-gray-900">{item.title}</span>
                </div>
              </td>
              <td className="px-3 py-2">
                <div className="text-xs text-gray-900">{item.value}</div>
              </td>
              <td className="px-3 py-2">
                <div className="text-xs text-gray-500">{item.description}</div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // If submitted, show a full-screen success message with a large animated happy emoji and disable navigation.
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-green-50">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <img
            src="https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif"
            alt="Happy Emoji"
            className="w-1/2 h-auto"
          />
          <h1 className="mt-4 text-6xl font-bold text-green-800">
          እቅዶ በተሳካ ሁኔታ ተመዝግቧል💥
          </h1>
          <p className="mt-2 text-3xl text-green-700">
            እባክዎ ይጠብቁ⏱️ ፡ እቅዶ በ CEO ተቀባይነት እስኪያገኝ ድረስ ይጠብቁ!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg"
    >
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-8"></h3>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg"
        >
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r-lg"
        >
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Summary Table */}
      <SummaryTable />

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          {["all", "cost", "income", "hr"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab === "all"
                ? "ሁሉም"
                : tab === "cost"
                ? "ወጪ"
                : tab === "income"
                ? "ገቢ"
                : "ሰራተኞች"}
            </button>
          ))}
        </div>

        {/* Details Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ተ.ቁ</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ስም</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ገለጻ</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">መነሻ</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">የታቀደው</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">መለኪያ</th>
                  {showExtraColumns && (
                    <>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ዝርዝር መረጃ</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIbaseline</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CIplan</th>
                    </>
                  )}
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">የሚጀመርበት</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">የሚጠናቀቅበት</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDetails?.map((detail, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`hover:bg-gray-50 transition-colors duration-200 ${expandedRow === index ? "bg-blue-50" : ""}`}
                    onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                  >
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">{index + 1}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-xs font-medium text-gray-900">
                        {detail.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-500 max-w-xs truncate">
                        {detail.description || "N/A"}
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {detail.baseline || "N/A"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {detail.plan || "N/A"}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {detail.measurement || "N/A"}
                    </td>
                    {showExtraColumns ? (
                      <>
                        {renderPlanTypeDetails(detail)}
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {detail.CIbaseline || "N/A"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {detail.CIplan || "N/A"}
                        </td>
                      </>
                    ) : null}
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {`${detail.year || "N/A"}/${detail.month || "N/A"}/${detail.day || "N/A"}`}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {detail.deadline || "N/A"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          ተመለስ
        </button>

        <button
          type="button"
          onClick={handleFormSubmit}
          disabled={isLoading}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
            isLoading
              ? "bg-yellow-500 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          } transition-colors duration-200`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              እባክዎ ይጠብቁ...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              እቅዱን አስገባ
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Step5Review;