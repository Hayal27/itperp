import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/sidebar.css';

function StaffSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle function for sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      
      <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar} title="Toggle Sidebar" />

      {/* Sidebar */}
      <aside id="sidebar" className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <i className="bi bi-house-door" />
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Plan Management Nav */}
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-clipboard-data" />
              <span>Plan Management</span>
              <i className="bi bi-chevron-down ms-auto" />
            </a>
            <ul id="components-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <Link to='/plan/view' className="nav-link">
                  <i className="bi bi-eye" />
                  <span>View Plan</span>
                </Link>
              </li>
              <li>
                <Link to='/plan/PlanSteps/Add' className="nav-link">
                  <i className="bi bi-plus-circle" />
                  <span>Add Plan</span>
                </Link>
              </li>

              <li>
                <Link to='/plan/StaffViewDeclinedPlan' className="nav-link">
                  <i className="bi bi-eye" />
                  <span>Declined Plan</span>
                </Link>
              </li>


              <li>
                <Link to='/plan/ViewOrgPlan' className="nav-link">
                  <i className="bi bi-eye" />
                  <span>Orginazation Plan</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Report Management Nav */}
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-file-earmark-bar-graph" />
              <span>Report Management</span>
              <i className="bi bi-chevron-down ms-auto" />
            </a>
            <ul id="components-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <Link to='/report/view' className="nav-link">
                  <i className="bi bi-file-earmark-text" />
                  <span>View Reports</span>
                </Link>
              </li>
             
              <li>
                <Link to='/report/ViewOrgReport' className="nav-link">
                  <i className="bi bi-file-earmark-pencil" />
                  <span>Orginazation Report</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Chat Nav */}
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-chat-dots" />
              <span>Chat</span>
              <i className="bi bi-chevron-down ms-auto" />
            </a>
            <ul id="components-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <Link to='/UserForm' className="nav-link">
                  <i className="bi bi-inbox" />
                  <span>Inbox</span>
                </Link>
              </li>
              <li>
                <Link to='/UserTable' className="nav-link">
                  <i className="bi bi-person-circle" />
                  <span>Staff Groups</span>
                </Link>
              </li>
              <li>
                <Link to='/UserForm' className="nav-link">
                  <i className="bi bi-building" />
                  <span>Department Groups</span>
                </Link>
              </li>
            </ul>
          </li>

        </ul>
      </aside>

      {/* Main content */}
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        {/* Content for main app goes here */}
      </div>
    </>
  );
}

export default StaffSidebar;
