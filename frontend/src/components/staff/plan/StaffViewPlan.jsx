


import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Outlet } from "react-router-dom";
import debounce from "lodash.debounce";
import Filters from "./Filters";
import PlansTable from "./PlansTable";
import Pagination from "./Pagination";
import "./StaffViewPlan.css";

const StaffViewPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState({
    year: "",
    quarter: "",
    department: "",
    objective: "",
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
      setErrorMessage("You must be logged in to view plans.");
      return;
    }

    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value)
    );

    try {
      setLoading(true);
      const response = await Axios.get("http://localhost:5000/api/getplan", {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...validFilters, page: currentPage, limit: itemsPerPage },
      });

      if (response.data.success) {
        setPlans(response.data.plans);
        setErrorMessage("");
      } else {
        setErrorMessage("No plans found.");
      }
    } catch (error) {
      setErrorMessage("የተገኘ እቅድ ወይም ሪፖርት የለም");
      console.error(error);
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
    let classes = "staff-view-plan-container";

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
      {/* Professional Header */}
      <div className="plan-view-header">
        <div className="header-content">
          <div className="header-title">
            <h1>📊 የእቅድ እይታ</h1>
            <p className="header-subtitle">Manage and view your organizational plans</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{plans.length}</span>
              <span className="stat-label">Total Plans</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{currentPage}</span>
              <span className="stat-label">Current Page</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <Filters
          filters={filters}
          handleFilterChange={handleFilterChange}
          applyFilters={debouncedFetchPlans}
        />
      </div>

      {/* Main Content Section */}
      <div className="main-content-section">
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">📋 Plans Overview</h2>
            <div className="card-actions">
              <button
                className="btn btn-refresh"
                onClick={debouncedFetchPlans}
                disabled={loading}
              >
                {loading ? '🔄' : '↻'} Refresh
              </button>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading plans...</p>
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

      {/* Pagination Section */}
      <div className="pagination-section">
        <Pagination
          currentPage={currentPage}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      </div>

      <Outlet />
    </div>
  );
};

export default StaffViewPlan;
