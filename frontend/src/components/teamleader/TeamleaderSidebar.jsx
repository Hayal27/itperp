
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/TeamleaderSidebar.css';

function TeamleaderSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Holds which dropdown is currently active: 'plan', 'report', 'chat', 'letter' or null
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handlers for mouse events so that the dropdown remains open
  const handleMouseEnter = (menu) => {
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  // Determine classes for sidebar and main content based on open state
  const sidebarClassName = isSidebarOpen ? 'sidebar open' : 'sidebar closed';
  const mainContentClassName = isSidebarOpen ? 'main-content contracted' : 'main-content expanded';

  return (
    <>
      {/* Sidebar Toggle Button */}
      <i
        className="bi bi-list toggle-sidebar-btn"
        onClick={toggleSidebar}
        title="Toggle Sidebar"
      />

      {/* Common Container wrapping sidebar and main content */}
      <div className="common-container">
        {/* Sidebar */}
        <aside id="sidebar" className={sidebarClassName}>
          <ul className="sidebar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link" title="Dashboard">
                <i className="bi bi-speedometer2" />
                <span className="menu-title">Dashboard</span>
              </Link>
            </li>

            {/* Plan Management Nav */}
            <li
              className="nav-item"
              onMouseEnter={() => handleMouseEnter('plan')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="nav-link" title="Plan Management">
                <i className="bi bi-list-check" />
                <span className="menu-title">Plan Management</span>
              </div>
              {activeDropdown === 'plan' && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/plan/view" className="nav-link" title="Submitted Plan">
                      <i className="bi bi-check2-circle" />
                      <span className="menu-title">Submitted Plan</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/plan/View_myplan" className="nav-link" title="View My Plan">
                      <i className="bi bi-file-earmark-text" />
                      <span className="menu-title">View My Plan</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/plan/PlanSteps/Add" className="nav-link" title="Add Plan">
                      <i className="bi bi-plus-circle" />
                      <span className="menu-title">Add Plan</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/plan/TeamleaderViewDeclinedPlan" className="nav-link" title="Declined Plan">
                      <i className="bi bi-eye" />
                      <span className="menu-title">Declined Plan</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/plan/ViewOrgPlan" className="nav-link" title="Organization Plans">
                      <i className="bi bi-building" />
                      <span className="menu-title">Organization Plans</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Report Management Nav */}
            <li
              className="nav-item"
              onMouseEnter={() => handleMouseEnter('report')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="nav-link" title="Report Management">
                <i className="bi bi-file-earmark-bar-graph" />
                <span className="menu-title">Report Management</span>
              </div>
              {activeDropdown === 'report' && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/report/Viewapprovedreport" className="nav-link" title="Submitted Report">
                      <i className="bi bi-check2-circle" />
                      <span className="menu-title">Submitted Report</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/report/View_myreport" className="nav-link" title="View My Report">
                      <i className="bi bi-file-earmark-text" />
                      <span className="menu-title">View My Report</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/report/ViewOrgReport" className="nav-link" title="Organization Report">
                      <i className="bi bi-building" />
                      <span className="menu-title">Organization Report</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Chat Nav */}
            <li
              className="nav-item"
              onMouseEnter={() => handleMouseEnter('chat')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="nav-link" title="Chat">
                <i className="bi bi-chat-dots" />
                <span className="menu-title">Chat</span>
              </div>
              {activeDropdown === 'chat' && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/UserForm" className="nav-link" title="Inbox">
                      <i className="bi bi-chat-right-text" />
                      <span className="menu-title">Inbox</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/UserTable" className="nav-link" title="Staff Groups">
                      <i className="bi bi-people" />
                      <span className="menu-title">Staff Groups</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/UserForm" className="nav-link" title="Department Groups">
                      <i className="bi bi-diagram-3" />
                      <span className="menu-title">Department Groups</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Letter Management Nav */}
            <li
              className="nav-item"
              onMouseEnter={() => handleMouseEnter('letter')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="nav-link" title="Letter Management">
                <i className="bi bi-envelope" />
                <span className="menu-title">Letter Management</span>
              </div>
              {activeDropdown === 'letter' && (
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/letter/compose" className="nav-link" title="Compose Letter">
                      <i className="bi bi-pencil-square" />
                      <span className="menu-title">Compose Letter</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/letter/inbox" className="nav-link" title="Inbox">
                      <i className="bi bi-envelope-open" />
                      <span className="menu-title">Inbox</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/letter/drafts" className="nav-link" title="Drafts">
                      <i className="bi bi-file-earmark" />
                      <span className="menu-title">Drafts</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/letter/sent" className="nav-link" title="Sent Letters">
                      <i className="bi bi-send-check" />
                      <span className="menu-title">Sent Letters</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/letter/archive" className="nav-link" title="Archived Letters">
                      <i className="bi bi-archive" />
                      <span className="menu-title">Archived Letters</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <div className={mainContentClassName}>
          {/* Content for main app goes here */}
        </div>
      </div>
    </>
  );
}

export default TeamleaderSidebar;
