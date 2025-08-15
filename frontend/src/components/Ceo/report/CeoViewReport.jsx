


import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Outlet } from "react-router-dom";
import debounce from "lodash.debounce";
import Filters from "./Filters";
import PlansTable from "./PlansTable";
import Pagination from "./Pagination";
import "./CeoViewReport.css";

const CeoViewPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState({
    year: "",
    quarter: "",
    department: "",
    objective_id: "",
    goal_id: "",
    specific_objective_id: "",
    specific_objective_detail_id: "",
    search: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  // Sidebar state management
  const [sidebarState, setSidebarState] = useState({
    isCollapsed: false,
    sidebarWidth: 260,
    mainContentMargin: 260
  });

  const fetchPlans = async () => {
    if (!token) {
      setErrorMessage("You must be logged in to view reports.");
      return;
    }

    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value)
    );

    try {
      setLoading(true);
      setErrorMessage("");

      console.log("📊 Fetching my reports with filters:", validFilters);
      console.log("📄 Page:", currentPage, "Limit:", itemsPerPage);

      const response = await Axios.get("http://localhost:5000/api/myreport", {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...validFilters, page: currentPage, limit: itemsPerPage },
      });

      console.log("📈 API Response:", response.data);

      if (response.data.success && response.data.plans) {
        setPlans(response.data.plans);
        setErrorMessage("");
        console.log("✅ Reports loaded successfully:", response.data.plans.length, "reports");
      } else {
        setPlans([]);
        setErrorMessage("No reports found for the current user.");
        console.log("⚠️ No reports found in response");
      }
    } catch (error) {
      console.error("❌ Error fetching reports:", error.response?.data || error.message);
      setPlans([]);

      if (error.response?.status === 404) {
        setErrorMessage("No reports found for the current user.");
      } else if (error.response?.status === 401) {
        setErrorMessage("Authentication failed. Please login again.");
      } else {
        setErrorMessage("Failed to fetch reports. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchPlans = debounce(fetchPlans, 500);

  // Listen for sidebar state changes
  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      const { isCollapsed, sidebarWidth, mainContentMargin } = event.detail;

      // Handle mobile responsiveness
      const isMobile = window.innerWidth <= 768;
      const adjustedMargin = isMobile ? 0 : mainContentMargin;

      setSidebarState({
        isCollapsed,
        sidebarWidth,
        mainContentMargin: adjustedMargin
      });
    };

    // Handle window resize for responsive behavior
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setSidebarState(prev => ({
          ...prev,
          mainContentMargin: 0
        }));
      } else {
        // Restore sidebar margin on desktop
        setSidebarState(prev => ({
          ...prev,
          mainContentMargin: prev.isCollapsed ?
            (prev.sidebarWidth === 70 ? 70 : 60) :
            (prev.sidebarWidth === 280 ? 280 : 260)
        }));
      }
    };

    // Listen for different sidebar events
    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    window.addEventListener('staffSidebarStateChange', handleSidebarStateChange);
    window.addEventListener('ceoSidebarStateChange', handleSidebarStateChange);
    window.addEventListener('resize', handleResize);

    // Initial check for mobile
    handleResize();

    // Cleanup event listeners
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
      window.removeEventListener('staffSidebarStateChange', handleSidebarStateChange);
      window.removeEventListener('ceoSidebarStateChange', handleSidebarStateChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    debouncedFetchPlans();
  }, [filters, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSorting = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedPlans = plans.sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleDelete = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await Axios.delete(`http://localhost:5000/api/plandelete/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.ID !== planId));
      } catch (error) {
        console.error("Failed to delete the plan.");
      }
    }
  };

  const nextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  // Calculate dynamic styles based on sidebar state
  const containerStyle = {
    '--sidebar-margin': `${sidebarState.mainContentMargin}px`,
    '--sidebar-width': `${sidebarState.sidebarWidth}px`
  };

  // Determine CSS classes based on sidebar state
  const getContainerClasses = () => {
    let classes = "ceo-report-container";

    if (sidebarState.isCollapsed) {
      if (sidebarState.sidebarWidth === 70) {
        classes += " admin-sidebar-collapsed";
      } else {
        classes += " sidebar-collapsed";
      }
    } else {
      if (sidebarState.sidebarWidth === 280) {
        classes += " admin-sidebar-expanded";
      } else {
        classes += " sidebar-expanded";
      }
    }

    return classes;
  };

  return (
    <div
      className={getContainerClasses()}
      style={containerStyle}
    >
      {/* Executive Dashboard Header */}
      <div className="report-header">
        <div className="header-content">
          <div className="header-title">
            <h1>📊 My Report </h1>
            <p className="header-subtitle">Comprehensive organizational reporting and analytics</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{plans.length}</span>
              <span className="stat-label">Total Reports</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{currentPage}</span>
              <span className="stat-label">Current Page</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{Math.ceil(plans.length / itemsPerPage)}</span>
              <span className="stat-label">Total Pages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Section */}
      <div className="filters-section">
        <Filters
          filters={filters}
          handleFilterChange={handleFilterChange}
          applyFilters={debouncedFetchPlans}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="main-content-section">
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">📈 Executive Reports Overview</h2>
            <div className="card-actions">
              <button
                className="btn btn-refresh"
                onClick={debouncedFetchPlans}
                disabled={loading}
              >
                {loading ? '🔄' : '↻'} Refresh Data
              </button>
              <button
                className="btn btn-export"
                onClick={() => console.log('Export functionality')}
              >
                📊 Export Report
              </button>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading executive reports...</p>
              </div>
            ) : errorMessage ? (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <p className="error-message">{errorMessage}</p>
                <button
                  className="btn btn-retry"
                  onClick={debouncedFetchPlans}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <PlansTable
                plans={plans}
                handleDelete={handleDelete}
                handleSorting={handleSorting}
                sortedPlans={sortedPlans}
                sortConfig={sortConfig}
                handleDetailClick={() => {}}
              />
            )}
          </div>
        </div>
      </div>

      {/* Professional Pagination */}
      <div className="pagination-section">
        <Pagination
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
          totalPages={Math.ceil(plans.length / itemsPerPage)}
        />
      </div>

      <Outlet />
    </div>
  );
};

export default CeoViewPlan;
