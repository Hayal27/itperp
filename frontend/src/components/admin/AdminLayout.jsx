import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './AdminLayout.css';

/**
 * AdminLayout - Wrapper component that manages sidebar state and layout structure
 * This component ensures proper communication between Sidebar and other admin components
 */
const AdminLayout = ({ children }) => {
  const [sidebarState, setSidebarState] = useState({
    isCollapsed: false,
    sidebarWidth: 280,
    mainContentMargin: 280
  });

  // Handle sidebar state changes
  const handleSidebarToggle = (newState) => {
    console.log('🔄 AdminLayout: Sidebar state changed:', newState);
    setSidebarState(newState);
  };

  // Apply dynamic styles to main content
  const mainContentStyle = {
    marginLeft: window.innerWidth <= 768 ? 0 : sidebarState.mainContentMargin,
    transition: 'margin-left 0.3s ease',
    width: window.innerWidth <= 768 ? '100%' : `calc(100% - ${sidebarState.mainContentMargin}px)`,
    minHeight: '100vh'
  };

  // Listen for window resize to update mobile behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarState(prev => ({
          ...prev,
          mainContentMargin: 0
        }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="admin-layout">
      {/* Sidebar Component */}
      <Sidebar onSidebarToggle={handleSidebarToggle} />

      {/* Main Content Area */}
      <div
        className="admin-content-wrapper"
        style={mainContentStyle}
        data-sidebar-collapsed={sidebarState.isCollapsed}
      >
        {/* Clone children and pass sidebar state as props */}
        {React.Children.map(children, child =>
          React.isValidElement(child)
            ? React.cloneElement(child, { sidebarState })
            : child
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
