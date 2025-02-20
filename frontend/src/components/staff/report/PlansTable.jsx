import React, { useState, useEffect } from "react";
import Axios from "axios";
import magicalStyles from "@/styles/magicalStyles";
import DashboardSummary from "./DashboardSummary";
import PlanDataTable from "./PlanDataTable";
import PlanDetailsModal from "./PlanDetailsModal";
import ReportDetailsModal from "./ReportDetailsModal";

const PlansTable = ({ plans, handleDelete, handleSorting, sortedPlans, sortConfig }) => {
  const [loading, setLoading] = useState(false);
  const [detailModalData, setDetailModalData] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [reportModalData, setReportModalData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportError, setReportError] = useState("");

  const token = localStorage.getItem("token");

  // Debug logging for sortedPlans
  useEffect(() => {
    console.log("Sorted Plans updated:", sortedPlans);
  }, [sortedPlans]);

  /**
   * Fetches detail for a plan or report.
   * @param {string} planId - The plan identifier.
   * @param {string} type - Either "plan" or "report".
   */
  const fetchDetail = async (planId, type = "plan") => {
    if (!planId) {
      console.error("fetchDetail: Received undefined planId.");
      setErrorMessage("Invalid plan ID provided.");
      return;
    }
    try {
      setLoading(true);
      const endpoint =
        type === "plan"
          ? `http://localhost:5000/api/reportd/${planId}`
          : `http://localhost:5000/api/report/${planId}`;

      console.log(
        `Fetching ${type} details from: ${endpoint} for plan ID ${planId}`
      );

      const response = await Axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response received:", response.data);

      if (response.data.success) {
        if (type === "plan") {
          setDetailModalData(response.data.plan);
          setShowDetailModal(true);
        } else {
          setReportModalData(response.data.report);
          setShowReportModal(true);
        }
        setErrorMessage("");
        setReportError("");
      } else {
        if (type === "plan") {
          setErrorMessage("Failed to fetch plan details.");
        } else {
          setReportError("Failed to fetch report details.");
        }
        console.error(`Response indicates failure for ${type} details.`);
      }
    } catch (error) {
      console.error(`Error fetching ${type} details:`, error);
      if (type === "plan") {
        setErrorMessage("Error fetching plan details.");
      } else {
        setReportError("Error fetching report details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setDetailModalData(null);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    setReportModalData(null);
  };

  // Function to determine magical style based on plan_type.
  const getMagicalStyle = (plan_type) => {
    if (!plan_type) return magicalStyles.default;
    const pt = plan_type.toLowerCase();
    if (pt === "cost") return magicalStyles.cost;
    if (pt === "income") return magicalStyles.income;
    if (pt === "hr") return magicalStyles.hr;
    return magicalStyles.default;
  };

  return (
    <div className="container mt-4">
      <DashboardSummary sortedPlans={sortedPlans} />
      <PlanDataTable
        sortedPlans={sortedPlans}
        handleDelete={handleDelete}
        handleSorting={handleSorting}
        sortConfig={sortConfig}
        fetchDetail={fetchDetail}
        getMagicalStyle={getMagicalStyle}
      />
      {showDetailModal && detailModalData && (
        <PlanDetailsModal data={detailModalData} closeModal={closeDetailModal} />
      )}
      {showReportModal && reportModalData && (
        <ReportDetailsModal data={reportModalData} closeModal={closeReportModal} />
      )}
      {loading && (
        <div className="text-center my-3">
          <span className="text-info h5">Loading...</span>
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger text-center my-3" role="alert">
          {errorMessage}
        </div>
      )}
      {reportError && (
        <div className="alert alert-danger text-center my-3" role="alert">
          {reportError}
        </div>
      )}
    </div>
  );
};

export default PlansTable;