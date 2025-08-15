import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Auths/AuthContex';
import './CeoSidebar.css';
import '../admin/Sidebar.css'; // Import admin sidebar styles for consistency

function CeoSidebar({ onSidebarToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const { state } = useAuth();

  // Enhanced toggle function with body component expansion/shrinking
  const handleToggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);

    // Close all submenus when collapsing
    if (newCollapsedState) {
      setActiveSubmenu(null);
    }

    // Calculate sidebar dimensions
    const sidebarWidth = newCollapsedState ? 60 : 260;
    const mainContentMargin = window.innerWidth <= 768 ? 0 : sidebarWidth;

    // Update body classes for global styling and component expansion/shrinking
    document.body.classList.remove('ceo-sidebar-collapsed', 'ceo-sidebar-expanded');
    if (newCollapsedState) {
      document.body.classList.add('ceo-sidebar-collapsed');
    } else {
      document.body.classList.add('ceo-sidebar-expanded');
    }

    // Update CSS custom properties for dynamic body component sizing
    document.documentElement.style.setProperty('--ceo-sidebar-width', `${sidebarWidth}px`);
    document.documentElement.style.setProperty('--ceo-main-content-margin', `${mainContentMargin}px`);
    document.documentElement.style.setProperty('--ceo-content-width', `calc(100vw - ${mainContentMargin}px)`);

    // Update all elements with ceo-main-content class
    const mainContentElements = document.querySelectorAll('.ceo-main-content, .main-content, [data-ceo-content]');
    mainContentElements.forEach(element => {
      element.style.marginLeft = `${mainContentMargin}px`;
      element.style.width = `calc(100% - ${mainContentMargin}px)`;
      element.style.transition = 'margin-left 0.3s ease, width 0.3s ease';
    });

    // Update dashboard and other body components
    const dashboardElements = document.querySelectorAll('.ceo-dashboard-container, .dashboard-container, .content-wrapper');
    dashboardElements.forEach(element => {
      element.style.marginLeft = `${mainContentMargin}px`;
      element.style.width = `calc(100vw - ${mainContentMargin}px)`;
      element.style.transition = 'margin-left 0.3s ease, width 0.3s ease';
    });

    // Notify parent component about sidebar state change
    if (onSidebarToggle) {
      onSidebarToggle({
        isCollapsed: newCollapsedState,
        sidebarWidth: sidebarWidth,
        mainContentMargin: mainContentMargin,
        contentWidth: `calc(100vw - ${mainContentMargin}px)`
      });
    }

    // Dispatch custom event for other components to handle expansion/shrinking
    const sidebarEvent = new CustomEvent('ceoSidebarStateChange', {
      detail: {
        isCollapsed: newCollapsedState,
        sidebarWidth: sidebarWidth,
        mainContentMargin: mainContentMargin,
        contentWidth: `calc(100vw - ${mainContentMargin}px)`,
        timestamp: Date.now(),
        action: 'toggle'
      }
    });
    window.dispatchEvent(sidebarEvent);

    // Trigger resize event for charts and other components that need to recalculate
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 350); // After animation completes
  };

  // Handle submenu toggle
  const toggleSubmenu = (menuId) => {
    if (isCollapsed) return; // Don't open submenus when collapsed
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  // Check if path is active
  const isPathActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Check if submenu has active item
  const hasActiveChild = (children) => {
    return children.some(child => isPathActive(child.path));
  };

  // Auto-collapse on mobile and handle body component sizing
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      const currentSidebarWidth = isCollapsed ? 60 : 260;
      const mainContentMargin = isMobile ? 0 : currentSidebarWidth;

      // Update CSS custom properties
      document.documentElement.style.setProperty('--ceo-sidebar-width', `${currentSidebarWidth}px`);
      document.documentElement.style.setProperty('--ceo-main-content-margin', `${mainContentMargin}px`);
      document.documentElement.style.setProperty('--ceo-content-width', `calc(100vw - ${mainContentMargin}px)`);

      // Update body components on resize
      const mainContentElements = document.querySelectorAll('.ceo-main-content, .main-content, [data-ceo-content]');
      mainContentElements.forEach(element => {
        element.style.marginLeft = `${mainContentMargin}px`;
        element.style.width = `calc(100% - ${mainContentMargin}px)`;
      });

      const dashboardElements = document.querySelectorAll('.ceo-dashboard-container, .dashboard-container, .content-wrapper');
      dashboardElements.forEach(element => {
        element.style.marginLeft = `${mainContentMargin}px`;
        element.style.width = `calc(100vw - ${mainContentMargin}px)`;
      });

      if (isMobile && !isCollapsed) {
        setIsCollapsed(true);
        if (onSidebarToggle) {
          onSidebarToggle({
            isCollapsed: true,
            sidebarWidth: 60,
            mainContentMargin: 0,
            contentWidth: '100vw'
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed, onSidebarToggle]);

  // Initialize body component sizing on mount
  useEffect(() => {
    const sidebarWidth = isCollapsed ? 60 : 260;
    const mainContentMargin = window.innerWidth <= 768 ? 0 : sidebarWidth;

    // Set initial CSS custom properties
    document.documentElement.style.setProperty('--ceo-sidebar-width', `${sidebarWidth}px`);
    document.documentElement.style.setProperty('--ceo-main-content-margin', `${mainContentMargin}px`);
    document.documentElement.style.setProperty('--ceo-content-width', `calc(100vw - ${mainContentMargin}px)`);

    // Set initial body class
    document.body.classList.remove('ceo-sidebar-collapsed', 'ceo-sidebar-expanded');
    document.body.classList.add(isCollapsed ? 'ceo-sidebar-collapsed' : 'ceo-sidebar-expanded');

    // Initialize body component sizing
    const mainContentElements = document.querySelectorAll('.ceo-main-content, .main-content, [data-ceo-content]');
    mainContentElements.forEach(element => {
      element.style.marginLeft = `${mainContentMargin}px`;
      element.style.width = `calc(100% - ${mainContentMargin}px)`;
      element.style.transition = 'margin-left 0.3s ease, width 0.3s ease';
    });

    const dashboardElements = document.querySelectorAll('.ceo-dashboard-container, .dashboard-container, .content-wrapper');
    dashboardElements.forEach(element => {
      element.style.marginLeft = `${mainContentMargin}px`;
      element.style.width = `calc(100vw - ${mainContentMargin}px)`;
      element.style.transition = 'margin-left 0.3s ease, width 0.3s ease';
    });
  }, []);

  // CEO menu items configuration
  const ceoMenuItems = [
    {
      id: 'dashboard',
      name: 'Executive Dashboard',
      path: '/ceo/dashboard',
      icon: 'bi-speedometer2',
      type: 'single'
    },
    {
      id: 'planning',
      name: 'Plan Management',
      icon: 'bi-clipboard-data',
      type: 'submenu',
      children: [
        { name: 'Pending Plans', path: '/plan/view', icon: 'bi-clock' },
        { name: 'Approved Plans', path: '/plan/View_myplan', icon: 'bi-check-circle' }
      ]
    },
    {
      id: 'reporting',
      name: 'Report Management',
      icon: 'bi-file-earmark-text',
      type: 'submenu',
      children: [
        { name: 'Pending Reports', path: '/report/Viewapprovedreport', icon: 'bi-clock' },
        { name: 'Approved Reports', path: '/report/ViewOrgReport', icon: 'bi-check-circle' }
      ]
    },
    {
      id: 'communication',
      name: 'Communication',
      icon: 'bi-chat-dots',
      type: 'submenu',
      children: [
        { name: 'Inbox', path: '/UserForm', icon: 'bi-inbox' },
        { name: 'Staff Groups', path: '/UserTable', icon: 'bi-people' },
        { name: 'Department Groups', path: '/UserForm', icon: 'bi-building' }
      ]
    }
  ];

  return (
    <>
      {/* Professional CEO Sidebar */}
      <div className={`ceo-professional-sidebar ${isCollapsed ? 'ceo-collapsed' : 'ceo-expanded'}`}>
        {/* Sidebar Header */}
        <div className="ceo-sidebar-header">
          <div className="ceo-sidebar-brand">
            {!isCollapsed ? (
              <>
                <i className="bi bi-person-badge ceo-brand-icon"></i>
                <span className="ceo-brand-text">CEO Portal</span>
              </>
            ) : (
              <i className="bi bi-person-badge ceo-brand-icon"></i>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="ceo-sidebar-user">
          <div className="ceo-user-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          {!isCollapsed && (
            <div className="ceo-user-info">
              <div className="ceo-user-name">{state.user?.name || 'CEO User'}</div>
              <div className="ceo-user-role">Chief Executive Officer</div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="ceo-sidebar-nav">
          <ul className="ceo-nav-list">
            {ceoMenuItems.map(item => (
              <li key={item.id} className="ceo-nav-item">
                {item.type === 'single' ? (
                  <Link
                    to={item.path}
                    className={`ceo-nav-link ${isPathActive(item.path) ? 'ceo-active' : ''}`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <i className={`ceo-nav-icon ${item.icon}`}></i>
                    {!isCollapsed && <span className="ceo-nav-text">{item.name}</span>}
                  </Link>
                ) : (
                  <>
                    <button
                      className={`ceo-nav-link ceo-submenu-toggle ${
                        hasActiveChild(item.children) ? 'ceo-active' : ''
                      } ${activeSubmenu === item.id ? 'ceo-expanded' : ''}`}
                      onClick={() => toggleSubmenu(item.id)}
                      title={isCollapsed ? item.name : ''}
                    >
                      <i className={`ceo-nav-icon ${item.icon}`}></i>
                      {!isCollapsed && (
                        <>
                          <span className="ceo-nav-text">{item.name}</span>
                          <i className={`ceo-submenu-arrow bi ${
                            activeSubmenu === item.id ? 'bi-chevron-up' : 'bi-chevron-down'
                          }`}></i>
                        </>
                      )}
                    </button>

                    {!isCollapsed && (
                      <ul className={`ceo-submenu ${activeSubmenu === item.id ? 'ceo-show' : ''}`}>
                        {item.children.map((child, index) => (
                          <li key={index} className="ceo-submenu-item">
                            <Link
                              to={child.path}
                              className={`ceo-submenu-link ${isPathActive(child.path) ? 'ceo-active' : ''}`}
                            >
                              <i className={`ceo-submenu-icon ${child.icon}`}></i>
                              <span className="ceo-submenu-text">{child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="ceo-sidebar-footer">
          {!isCollapsed && (
            <div className="ceo-footer-info">
              <small className="ceo-footer-text">CEO Portal v2.0</small>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button
        className="ceo-sidebar-toggle-btn"
        onClick={handleToggleSidebar}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
      </button>

      {/* Mobile Overlay */}
      {!isCollapsed && window.innerWidth <= 768 && (
        <div
          className="ceo-sidebar-overlay d-md-none"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}


    </>
  );
}

export default CeoSidebar;
