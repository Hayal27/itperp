import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function GeneraManagerSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle function for sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <style>
        {`
          /* Sidebar Styling */
          .sidebar {
            transition: transform 0.3s ease;
            transform: ${isSidebarOpen ? 'translateX(0)' : 'translateX(-250px)'};
            width: 250px;
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            background-image: linear-gradient(180deg,#2a3753 0%,#0C7C92 100% );
            color: #ffffff;
            z-index: 1000;
            box-shadow: ${isSidebarOpen ? '2px 0 5px rgba(0,0,0,0.1)' : 'none'};
            padding-top: 20px;
          }

          /* Sidebar Nav Items */
          .sidebar-nav {
            padding-left: 0;
            list-style-type: none;
          }

          .sidebar-nav .nav-item {
            border-bottom: 1px solid #495057;
            background-image: linear-gradient(180deg,#2a3753 0%,#0C7C92 100% );
          }

          /* Magical Hover Effect for Sidebar Items */
          .sidebar-nav .nav-item:hover {
            transform: scale(1.05) rotate(2deg);
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
            background-color: #007bff; /* Change background color on hover */
          }

          /* Sidebar Links */
          .sidebar-nav .nav-link {
            color: #adb5bd;
            display: flex;
            align-items: center;
            padding: 10px 20px;
            transition: color 0.3s ease, transform 0.3s ease;
          }

          .sidebar-nav .nav-link i {
            margin-right: 10px;
            font-size: 1.2rem;
            transition: transform 0.3s ease;
          }

          /* Add magical hover effect to the nav link */
          .sidebar-nav .nav-link:hover {
            color: #ffffff;
            transform: translateX(10px);
          }

          /* Sidebar Toggle Button */
          .toggle-sidebar-btn {
            cursor: pointer;
            font-size: 1.5rem;
            position: fixed;
            top: 15px;
            left: 15px;
            z-index: 1050;
            color: #007bff;
            transition: color 0.3s ease;
          }

          .toggle-sidebar-btn:hover {
            color: #0056b3;
          }

          /* Main content shift when sidebar is open */
          .main-content {
            margin-left: ${isSidebarOpen ? '250px' : '0'};
            transition: margin-left 0.3s ease;
            padding: 20px;
            transition: padding-left 0.3s ease;
          }

          /* Mobile Responsiveness */
          @media (max-width: 768px) {
            .sidebar {
              transform: ${isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)'};
              // width: 20%;
            }

            .main-content {
              margin-left: 0;
            }

            .toggle-sidebar-btn {
              left: 15px;
            }
          }
        `}
      </style>

      {/* Sidebar Toggle Button */}
      <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar} title="Toggle Sidebar" />

      {/* Sidebar */}
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              <i className="bi bi-grid" />
            </Link>
          </li>
          
          {/* Plan Management Nav */}
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-menu-button-wide" />
              <span>Plan Management</span>
              <i className="bi bi-chevron-down ms-auto" />
            </a>
            <ul id="components-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <Link to='/plan/view' className="nav-link">
                  <i className="bi bi-circle" />
                  <span>View Plan</span>
                </Link>
              </li>
              <li>
                <Link to='/UserTable' className="nav-link">
                  <i className="bi bi-circle" />
                  <span>Add Plan</span>
                </Link>
              </li>
              <li>
                <Link to='/UserForm' className="nav-link">
                  <i className="bi bi-circle" />
                  <span>Edit Plan</span>
                </Link>
              </li>
            </ul>
          </li>
        </ul>



        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            {/* <Link to="/" className="nav-link">
             
            </Link> */}
          </li>
          
          {/* report Management Nav */}
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-menu-button-wide" />
              <span>report Management</span>
              <i className="bi bi-chevron-down ms-auto" />
            </a>
            <ul id="components-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <Link to='/UserForm' className="nav-link">
                  <i className="bi bi-circle" />
                  <span>View reports</span>
                </Link>
              </li>
              <li>
                <Link to='/UserTable' className="nav-link">
                  <i className="bi bi-circle" />
                  <span>Add report</span>
                </Link>
              </li>
              <li>
                <Link to='/UserForm' className="nav-link">
                  <i className="bi bi-circle" />
                  <span>Edit report</span>
                </Link>
              </li>
            </ul>
          </li>

        </ul>


        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            {/* <Link to="/" className="nav-link">
             
            </Link> */}
          </li>
          
          {/* Chat */}
          <li className="nav-item">
            <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
              <i className="bi bi-menu-button-wide" />
              <span>Chat</span>
              <i className="bi bi-chevron-down ms-auto" />
            </a>
            <ul id="components-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
              <li>
                <Link to='/UserForm' className="nav-link">
                  <i className="bi bi-circle" />
                  <span>inbox</span>
                </Link>
              </li>
              <li>
                <Link to='/UserTable' className="nav-link">
                  <i className="bi bi-circle" />
                  <span>Staf groups</span>
                </Link>
              </li>
              <li>
                <Link to='/UserForm' className="nav-link">
                  <i className="bi bi-circle" />
                  <span>Department groups</span>
                </Link>
              </li>
            </ul>
          </li>

        </ul>

        
      </aside>

      {/* Main content */}
      <div className="main-content">
        {/* Content for main app goes here */}
      </div>
    </>
  );
}

export default GeneraManagerSidebar;



