import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Auths/AuthContex';
import axios from 'axios';
import './Sidebar.css';
import { handleSidebarState, updateMainContentMargin } from './sidebarUtils';

function Sidebar({ onSidebarToggle }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { state } = useAuth();

  // Fetch menu items based on user role
  useEffect(() => {
    const fetchMenuItems = async () => {
      console.log('🔍 Sidebar: Starting menu fetch process...');
      console.log('🔍 Sidebar: Auth state:', state);
      console.log('🔍 Sidebar: User ID:', state.user);
      console.log('🔍 Sidebar: Role ID:', state.role_id);
      console.log('🔍 Sidebar: Is Authenticated:', state.isAuthenticated);

      // First test the API connection
      try {
        console.log('🧪 Sidebar: Testing API connection...');
        const testResponse = await axios.get('http://localhost:5000/api/menu-permissions/test');
        console.log('✅ Sidebar: API test successful:', testResponse.data);
      } catch (testErr) {
        console.error('💥 Sidebar: API test failed:', testErr);
      }

      try {
        if (state.user && state.role_id && state.isAuthenticated) {
          console.log('✅ Sidebar: User and role_id found, proceeding with fetch');
          setLoading(true);
          setError(null);

          const apiUrl = `http://localhost:5000/api/menu-permissions/user-permissions/${state.role_id}`;
          console.log('🌐 Sidebar: Making API call to:', apiUrl);

          const response = await axios.get(apiUrl);

          console.log('📡 Sidebar: API Response received:', response);
          console.log('📡 Sidebar: Response status:', response.status);
          console.log('📡 Sidebar: Response data:', response.data);

          if (response.data && response.data.success) {
            console.log('✅ Sidebar: API call successful');
            console.log('📋 Sidebar: Menu items received:', response.data.data);
            console.log('📋 Sidebar: Number of menu items:', response.data.data?.length);

            setMenuItems(response.data.data);
            setError(null);
          } else {
            console.error('❌ Sidebar: API call failed - success flag is false');
            console.error('❌ Sidebar: Response data:', response.data);
            setError(`API Error: ${response.data?.message || 'Unknown error'}`);
          }
        } else {
          console.warn('⚠️ Sidebar: Missing user or role_id');
          console.warn('⚠️ Sidebar: state.user:', state.user);
          console.warn('⚠️ Sidebar: state.role_id:', state.role_id);
          console.warn('⚠️ Sidebar: state.isAuthenticated:', state.isAuthenticated);
          setError('User authentication data missing');
        }
      } catch (err) {
        console.error('💥 Sidebar: Error fetching menu items:', err);
        console.error('💥 Sidebar: Error message:', err.message);
        console.error('💥 Sidebar: Error response:', err.response);
        console.error('💥 Sidebar: Error response data:', err.response?.data);
        console.error('💥 Sidebar: Error response status:', err.response?.status);
        console.error('💥 Sidebar: Error stack:', err.stack);

        let errorMessage = 'Failed to load menu items';
        if (err.response) {
          errorMessage = `API Error ${err.response.status}: ${err.response.data?.message || err.message}`;
        } else if (err.request) {
          errorMessage = 'Network Error: Unable to reach server';
        } else {
          errorMessage = `Request Error: ${err.message}`;
        }

        setError(errorMessage);
      } finally {
        console.log('🏁 Sidebar: Fetch process completed');
        setLoading(false);
      }
    };

    console.log('🚀 Sidebar: useEffect triggered');
    fetchMenuItems();
  }, [state.user, state.role_id, state.isAuthenticated]);

  // Enhanced toggle function that also handles submenus
  const handleToggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);

    // Close all submenus when collapsing
    if (newCollapsedState) {
      setActiveSubmenu(null);
    }

    // Update body class and main content margin
    handleSidebarState(newCollapsedState);

    // Notify parent component about sidebar state change
    if (onSidebarToggle) {
      onSidebarToggle({
        isCollapsed: newCollapsedState,
        sidebarWidth: newCollapsedState ? 70 : 280,
        mainContentMargin: newCollapsedState ? 70 : 280
      });
    }

    // Dispatch custom event for other components to listen
    const sidebarEvent = new CustomEvent('sidebarStateChange', {
      detail: {
        isCollapsed: newCollapsedState,
        sidebarWidth: newCollapsedState ? 70 : 280,
        mainContentMargin: newCollapsedState ? 70 : 280,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(sidebarEvent);
  };

  // Toggle submenu
  const toggleSubmenu = (menuId) => {
    if (isCollapsed) return; // Don't open submenus when collapsed
    setActiveSubmenu(activeSubmenu === menuId ? null : menuId);
  };

  // Check if current path matches the link
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Auto-collapse on mobile and handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsCollapsed(true);
        handleSidebarState(true);

        // Notify about mobile collapse
        if (onSidebarToggle) {
          onSidebarToggle({
            isCollapsed: true,
            sidebarWidth: 70,
            mainContentMargin: 0 // No margin on mobile
          });
        }
      } else {
        // Update margin based on current state
        updateMainContentMargin(isCollapsed);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed, onSidebarToggle]);

  // Initial setup
  useEffect(() => {
    handleSidebarState(isCollapsed);
  }, []);

  // Render menu item recursively
  const renderMenuItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = isActiveLink(item.path);
    const isSubmenuActive = activeSubmenu === item.id;

    if (hasChildren) {
      return (
        <li key={item.id} className="as-nav-item">
          <div
            className={`as-nav-link as-submenu-toggle ${isSubmenuActive ? 'as-active' : ''}`}
            onClick={() => toggleSubmenu(item.id)}
            title={isCollapsed ? item.name : ""}
          >
            <i className={`${item.icon} as-nav-icon`}></i>
            {!isCollapsed && (
              <>
                <span className="as-nav-text">{item.name}</span>
                <i className={`bi bi-chevron-${isSubmenuActive ? 'up' : 'down'} as-submenu-arrow`}></i>
              </>
            )}
          </div>

          {!isCollapsed && (
            <ul className={`as-submenu ${isSubmenuActive ? 'as-show' : ''}`}>
              {item.children.map(child => (
                <li key={child.id} className="as-submenu-item">
                  <Link
                    to={child.path}
                    className={`as-submenu-link ${isActiveLink(child.path) ? 'as-active' : ''}`}
                  >
                    <i className={`${child.icon} as-submenu-icon`}></i>
                    <span>{child.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    } else {
      return (
        <li key={item.id} className="as-nav-item">
          <Link
            to={item.path}
            className={`as-nav-link ${isActive ? 'as-active' : ''}`}
            title={isCollapsed ? item.name : ""}
          >
            <i className={`${item.icon} as-nav-icon`}></i>
            {!isCollapsed && <span className="as-nav-text">{item.name}</span>}
          </Link>
        </li>
      );
    }
  };

  // Show loading state
  if (loading) {
    console.log('⏳ Sidebar: Rendering loading state');
    return (
      <>
        {/* Sidebar Toggle Button */}
        <button
          className="as-sidebar-toggle-btn"
          onClick={handleToggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>

        <aside className={`as-professional-sidebar ${isCollapsed ? 'as-collapsed' : 'as-expanded'}`}>
          <div className="as-sidebar-header">
            <div className="as-sidebar-brand">
              <i className="bi bi-shield-check as-brand-icon"></i>
              {!isCollapsed && <span className="as-brand-text">Loading...</span>}
            </div>
          </div>
          <nav className="as-sidebar-nav">
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading menu...</span>
              </div>
            </div>
            {!isCollapsed && (
              <div className="text-center p-3">
                <small className="text-muted">
                  Loading menu for role: {state.role_id || 'Unknown'}
                </small>
              </div>
            )}
          </nav>
        </aside>
      </>
    );
  }

  // Show error state
  if (error) {
    console.error('🚨 Sidebar: Rendering error state:', error);
    return (
      <>
        {/* Sidebar Toggle Button */}
        <button
          className="as-sidebar-toggle-btn"
          onClick={handleToggleSidebar}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>

        <aside className={`as-professional-sidebar ${isCollapsed ? 'as-collapsed' : 'as-expanded'}`}>
          <div className="as-sidebar-header">
            <div className="as-sidebar-brand">
              <i className="bi bi-exclamation-triangle as-brand-icon text-warning"></i>
              {!isCollapsed && <span className="as-brand-text">Menu Error</span>}
            </div>
          </div>
          <nav className="as-sidebar-nav">
            <div className="p-3">
              <div className="alert alert-warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>Menu Loading Error</strong>
                {!isCollapsed && (
                  <>
                    <p className="small mt-2 mb-1">{error}</p>
                    <hr />
                    <p className="small mb-1"><strong>Debug Info:</strong></p>
                    <p className="small mb-1">User ID: {state.user || 'Not found'}</p>
                    <p className="small mb-1">Role ID: {state.role_id || 'Not found'}</p>
                    <p className="small mb-1">Auth State: {state.isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
                    <p className="small mb-1">User Name: {state.user_name || 'Not found'}</p>
                    <button
                      className="btn btn-sm btn-outline-warning mt-2"
                      onClick={() => window.location.reload()}
                    >
                      Reload Page
                    </button>
                  </>
                )}
              </div>
            </div>
          </nav>
        </aside>
      </>
    );
  }

  // Log final render state
  console.log('🎨 Sidebar: Rendering main sidebar');
  console.log('🎨 Sidebar: Menu items count:', menuItems?.length || 0);
  console.log('🎨 Sidebar: Menu items:', menuItems);
  console.log('🎨 Sidebar: Loading state:', loading);
  console.log('🎨 Sidebar: Error state:', error);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className="as-sidebar-toggle-btn"
        onClick={handleToggleSidebar}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <i className={`bi ${isCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
      </button>

      {/* Sidebar */}
      <aside className={`as-professional-sidebar ${isCollapsed ? 'as-collapsed' : 'as-expanded'}`}>
        {/* Sidebar Header */}
        <div className="as-sidebar-header">
          <div className="as-sidebar-brand">
            <i className="bi bi-shield-check as-brand-icon"></i>
            {!isCollapsed && <span className="as-brand-text">Admin Panel</span>}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="as-sidebar-nav">
          <ul className="as-nav-list">
            {menuItems && menuItems.length > 0 ? (
              menuItems.map(item => {
                console.log('🔧 Sidebar: Rendering menu item:', item);
                return renderMenuItem(item);
              })
            ) : (
              <li className="as-nav-item">
                <div className="p-3 text-center">
                  <i className="bi bi-info-circle text-info"></i>
                  {!isCollapsed && (
                    <div className="mt-2">
                      <p className="small text-muted mb-1">No menu items found</p>
                      <p className="small text-muted mb-1">Role ID: {state.role_id}</p>
                      <p className="small text-muted">Check permissions</p>
                    </div>
                  )}
                </div>
              </li>
            )}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="as-sidebar-footer">
            <div className="as-footer-content">
              <small className="text-muted">ITPC Plan and Reporting v2.0</small>
            </div>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="as-sidebar-overlay d-md-none"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}
    </>
  );
}

export default Sidebar;
