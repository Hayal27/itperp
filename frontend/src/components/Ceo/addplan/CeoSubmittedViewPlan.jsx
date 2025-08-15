
import React, { useEffect, useState } from "react";
import axios from "axios";
// import "../../../assets/css/viewplan.css";
import "./CeoSubmittedViewPlan.css";

const CeoSubmittedViewPlan = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [comment, setComment] = useState("");
  const [selectedPlanIds, setSelectedPlanIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");

  // Sidebar state management
  const [sidebarState, setSidebarState] = useState({
    isCollapsed: false,
    sidebarWidth: 260,
    mainContentMargin: 260
  });

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
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await axios.get("http://localhost:5000/api/supervisor/plans", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success && response.data.plans) {
        setPlans(response.data.plans);
        setErrorMessage("");
      } else {
        setPlans([]);
        setErrorMessage("No plans found.");
      }
    } catch (error) {
      console.error("Error fetching plans:", error.response?.data || error.message);
      setPlans([]);
      setErrorMessage("Failed to fetch plans. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDecline = async (planId, action, actionComment = comment) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/supervisor/plans/approveceo",
        { plan_id: planId, status: action, comment: actionComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(response.data.message);
        fetchPlans();  // Refresh the list of plans after the update
        setSelectedPlan(null);  // Clear selected plan
        setComment("");  // Clear comment
      } else {
        alert(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error updating plan:", error.response?.data || error.message);
      alert("Failed to update plan. Please try again.");
    }
  };

  const handleReviewClick = (plan) => {
    setSelectedPlan(plan);
  };

  // Handlers for bulk selection
  const handleCheckboxChange = (planId, checked) => {
    if (checked) {
      setSelectedPlanIds((prev) => [...prev, planId]);
    } else {
      setSelectedPlanIds((prev) => prev.filter((id) => id !== planId));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = plans.map((plan) => plan.plan_id);
      setSelectedPlanIds(allIds);
    } else {
      setSelectedPlanIds([]);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedPlanIds.length === 0) {
      alert("No plans selected.");
      return;
    }
    // Optional comment for bulk action
    const bulkComment = prompt("Add a comment (optional)") || "";
    try {
      await Promise.all(
        selectedPlanIds.map((id) =>
          handleApproveDecline(id, action, bulkComment)
        )
      );
      alert(`Plans ${action} successfully.`);
      // Clear selections and refresh
      setSelectedPlanIds([]);
      fetchPlans();
    } catch (error) {
      alert("Failed to update one or more plans. Please try again.");
    }
  };

  // Mapping backend attribute keys to display labels.
  const fieldLabels = {
    created_by: "አቃጅ",
    department_name: "የስራ ክፍል",
    year: "የታቀደበት አመት",
    month: "ወር",
    day: "ቀን",
    deadline: "እስከ",
    priority: "Priority",
    goal_name: "ግብ",
    objective_name: "አላማ",
    specific_objective_name: "ውጤት",
    specific_objective_detailname: "ዝርዝር ተግባር",
    measurement: "ፐርፎርማንስ መለኪያ",
    baseline: "መነሻ %",
    plan: "የታቀደው %",
    outcome: "ክንውን",
    plan_type: "የ እቅዱ አይነት",
    income_exchange: "ምንዛሬ",
    cost_type: "ወጪ አይነት",
    employment_type: "የቅጥር ሁኔታ",
    incomeName: "የገቢ ስም",
    costName: "የመጪው ስም",
    CIbaseline: "መነሻ በ ገንዘብ",
    CIplan: "እቅድ በ ገንዘብ",
    outcomeCI: "ክንውን በ ገንዘብ"
  };

  // Filtering fields to only display those that are defined and not null in the plan.
  const renderPlanDetails = (plan) => {
    return Object.entries(fieldLabels).map(([key, label]) => {
      if (plan[key] !== undefined && plan[key] !== null && plan[key] !== "") {
        return (
          <p key={key}>
            <strong>{label}:</strong> {plan[key]}
          </p>
        );
      }
      return null;
    });
  };

  // Filter plans based on the search term across all values
  const filteredPlans = plans.filter(plan => {
    return Object.values(plan)
      .filter(value => value !== null && value !== undefined)
      .some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Calculate dynamic styles based on sidebar state
  const containerStyle = {
    '--sidebar-margin': `${sidebarState.mainContentMargin}px`,
    '--sidebar-width': `${sidebarState.sidebarWidth}px`
  };

  // Determine CSS classes based on sidebar state
  const getContainerClasses = () => {
    let classes = "ceo-view-plan-container";

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
            <h1>👑 CEO Plan Review Dashboard</h1>
            <p className="header-subtitle">Review and approve departmental plans</p>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{plans.length}</span>
              <span className="stat-label">Total Plans</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{selectedPlanIds.length}</span>
              <span className="stat-label">Selected</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{filteredPlans.length}</span>
              <span className="stat-label">Filtered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="filters-section">
        <div className="professional-filters">
          <div className="filters-header">
            <h3 className="filters-title">🔍 Search & Filter Plans</h3>
            <p className="filters-subtitle">Find specific plans to review</p>
          </div>

          <div className="filters-grid">
            <div className="filter-group full-width">
              <label htmlFor="search" className="filter-label">
                <span className="label-icon">🔎</span>
                Global Search
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="search"
                  placeholder="Search across all plan data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control search-input"
                />
                <div className="input-group-text">
                  <span>⌕</span>
                </div>
              </div>
            </div>

            <div className="filter-actions">
              <button
                className="btn btn-apply"
                onClick={() => handleBulkAction("Approved")}
                disabled={selectedPlanIds.length === 0}
              >
                <span className="btn-icon">✅</span>
                Approve Selected ({selectedPlanIds.length})
              </button>
              <button
                className="btn btn-decline"
                onClick={() => handleBulkAction("Declined")}
                disabled={selectedPlanIds.length === 0}
              >
                <span className="btn-icon">❌</span>
                Decline Selected ({selectedPlanIds.length})
              </button>
              <button
                className="btn btn-clear"
                onClick={() => {
                  setSelectedPlanIds([]);
                  setSearchTerm("");
                }}
              >
                <span className="btn-icon">🗑️</span>
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-content-section">
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">📋 Plans for Review</h2>
            <div className="card-actions">
              <button
                className="btn btn-refresh"
                onClick={fetchPlans}
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
                  onClick={fetchPlans}
                >
                  Try Again
                </button>
              </div>
            ) : filteredPlans.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="checkbox-column">
                        <input
                          type="checkbox"
                          onChange={handleSelectAll}
                          checked={filteredPlans.length > 0 && selectedPlanIds.length === filteredPlans.length}
                          className="select-all-checkbox"
                        />
                        <span className="select-label">Select All</span>
                      </th>
                      <th>🏢 Department</th>
                      <th>👤 Created By</th>
                      <th>🎯 Goal</th>
                      <th>📊 Objective</th>
                      <th>🎪 Specific Objective</th>
                      <th>📝 Details</th>
                      <th>📈 Status</th>
                      <th>⚡ Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPlans.map((plan) => (
                      <tr
                        key={plan.plan_id}
                        className={selectedPlanIds.includes(plan.plan_id) ? 'table-success' : ''}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedPlanIds.includes(plan.plan_id)}
                            onChange={(e) => handleCheckboxChange(plan.plan_id, e.target.checked)}
                            className="row-checkbox"
                          />
                        </td>
                        <td className="department-cell">{plan.department_name || "N/A"}</td>
                        <td className="creator-cell">{plan.created_by || "N/A"}</td>
                        <td className="goal-cell">{plan.goal_name || "N/A"}</td>
                        <td className="objective-cell">{plan.objective_name || "N/A"}</td>
                        <td className="specific-objective-cell">{plan.specific_objective_name || "N/A"}</td>
                        <td className="details-cell">{plan.specific_objective_detailname || "N/A"}</td>
                        <td className="status-cell">
                          <span className={`status-badge status-${(plan.status || 'pending').toLowerCase()}`}>
                            {plan.status || "Pending"}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button
                            className="btn btn-review"
                            onClick={() => handleReviewClick(plan)}
                          >
                            <span className="btn-icon">👁️</span>
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Plans Found</h3>
                <p>No plans match your current search criteria.</p>
                <button
                  className="btn btn-clear"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Modal */}
      {selectedPlan && (
        <div className="modal-overlay">
          <div className="professional-modal">
            <div className="modal-header">
              <h3 className="modal-title">
                <span className="modal-icon">👁️</span>
                Plan Review Details
              </h3>
              <button
                className="modal-close"
                onClick={() => setSelectedPlan(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="plan-details-grid">
                {renderPlanDetails(selectedPlan)}
              </div>

              <div className="comment-section">
                <label htmlFor="comment" className="comment-label">
                  <span className="label-icon">💬</span>
                  Add Review Comment (Optional)
                </label>
                <textarea
                  id="comment"
                  className="comment-textarea"
                  placeholder="Add your review comments here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                />
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-actions">
                <button
                  className="btn btn-approve"
                  onClick={() => handleApproveDecline(selectedPlan.plan_id, "Approved")}
                >
                  <span className="btn-icon">✅</span>
                  Approve Plan
                </button>
                <button
                  className="btn btn-decline"
                  onClick={() => handleApproveDecline(selectedPlan.plan_id, "Declined")}
                >
                  <span className="btn-icon">❌</span>
                  Decline Plan
                </button>
                <button
                  className="btn btn-cancel"
                  onClick={() => setSelectedPlan(null)}
                >
                  <span className="btn-icon">🚫</span>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CeoSubmittedViewPlan;
