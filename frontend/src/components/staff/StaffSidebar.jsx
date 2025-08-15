import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Auths/AuthContex';
import './StaffSidebar.css';

function StaffSidebar({ onSidebarToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const location = useLocation();
  const { state } = useAuth();

  // Enhanced toggle function
  const handleToggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);

    // Close all submenus when collapsing
    if (newCollapsedState) {
      setActiveSubmenu(null);
    }

    // Notify parent component about sidebar state change
    if (onSidebarToggle) {
      onSidebarToggle({
        isCollapsed: newCollapsedState,
        sidebarWidth: newCollapsedState ? 60 : 260,
        mainContentMargin: newCollapsedState ? 60 : 260
      });
    }

    // Dispatch custom event for other components
    const sidebarEvent = new CustomEvent('staffSidebarStateChange', {
      detail: {
        isCollapsed: newCollapsedState,
        sidebarWidth: newCollapsedState ? 60 : 260,
        mainContentMargin: newCollapsedState ? 60 : 260,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(sidebarEvent);
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

  // Staff menu items configuration
  const staffMenuItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      path: '/staff/dashboard',
      icon: 'bi-speedometer2',
      type: 'single'
    },
    {
      id: 'planning',
      name: 'Planning',
      icon: 'bi-clipboard-data',
      type: 'submenu',
      children: [
        { name: 'View Plans', path: '/plan/view', icon: 'bi-eye' },
        { name: 'Add Plan', path: '/plan/PlanSteps/Add', icon: 'bi-plus-circle' },
        { name: 'Declined Plans', path: '/plan/declined', icon: 'bi-x-circle' },
        { name: 'Organization Plans', path: '/plan/org', icon: 'bi-building' }
      ]
    },
    {
      id: 'reporting',
      name: 'Reporting',
      icon: 'bi-file-earmark-text',
      type: 'submenu',
      children: [
        { name: 'View Reports', path: '/report/view', icon: 'bi-eye' },
        { name: 'Add Report', path: '/report/Add', icon: 'bi-plus-circle' },
        { name: 'Declined Reports', path: '/report/declined', icon: 'bi-x-circle' },
        { name: 'Organization Reports', path: '/report/org', icon: 'bi-building' }
      ]
    }
  ];

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
        if (onSidebarToggle) {
          onSidebarToggle({
            isCollapsed: true,
            sidebarWidth: 60,
            mainContentMargin: 0 // No margin on mobile
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, [onSidebarToggle]);

  return (
    <>
      {/* Professional Staff Sidebar */}
      <div className={`staff-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="staff-sidebar-header">
          <div className="staff-sidebar-brand">
            {!isCollapsed ? (
              <>
                <i className="bi bi-person-workspace brand-icon"></i>
                <span className="brand-text">Staff Portal</span>
              </>
            ) : (
              <i className="bi bi-person-workspace brand-icon-collapsed"></i>
            )}
          </div>

          <button
            className="staff-sidebar-toggle-btn"
            onClick={handleToggleSidebar}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
          </button>
        </div>

        {/* User Info */}
        <div className="staff-sidebar-user">
          <div className="user-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name">{state.user?.name || 'Staff User'}</div>
              <div className="user-role">Staff Member</div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="staff-sidebar-nav">
          <ul className="nav-list">
            {staffMenuItems.map(item => (
              <li key={item.id} className="nav-item">
                {item.type === 'single' ? (
                  <Link
                    to={item.path}
                    className={`nav-link ${isPathActive(item.path) ? 'active' : ''}`}
                    title={isCollapsed ? item.name : ''}
                  >
                    <i className={`nav-icon ${item.icon}`}></i>
                    {!isCollapsed && <span className="nav-text">{item.name}</span>}
                  </Link>
                ) : (
                  <>
                    <button
                      className={`nav-link submenu-toggle ${
                        hasActiveChild(item.children) ? 'active' : ''
                      } ${activeSubmenu === item.id ? 'expanded' : ''}`}
                      onClick={() => toggleSubmenu(item.id)}
                      title={isCollapsed ? item.name : ''}
                    >
                      <i className={`nav-icon ${item.icon}`}></i>
                      {!isCollapsed && (
                        <>
                          <span className="nav-text">{item.name}</span>
                          <i className={`submenu-arrow bi ${
                            activeSubmenu === item.id ? 'bi-chevron-up' : 'bi-chevron-down'
                          }`}></i>
                        </>
                      )}
                    </button>

                    {!isCollapsed && (
                      <ul className={`submenu ${activeSubmenu === item.id ? 'show' : ''}`}>
                        {item.children.map((child, index) => (
                          <li key={index} className="submenu-item">
                            <Link
                              to={child.path}
                              className={`submenu-link ${isPathActive(child.path) ? 'active' : ''}`}
                            >
                              <i className={`submenu-icon ${child.icon}`}></i>
                              <span className="submenu-text">{child.name}</span>
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
        <div className="staff-sidebar-footer">
          {!isCollapsed && (
            <div className="footer-info">
              <small className="text-muted">Staff Portal v2.0</small>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && window.innerWidth <= 768 && (
        <div
          className="staff-sidebar-overlay d-md-none"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}
    </>
  );
}

export default StaffSidebar;
