import React, { useState, useEffect } from 'react';
import StaffSidebar from '../StaffSidebar';
import './StaffLayout.css';

/**
 * StaffLayout - Professional layout wrapper for staff components
 * Provides consistent styling and sidebar integration for staff modules
 */
const StaffLayout = ({ children, title, breadcrumbs, actions }) => {
  const [sidebarState, setSidebarState] = useState({
    isCollapsed: false,
    sidebarWidth: 260,
    mainContentMargin: 260
  });

  // Handle sidebar state changes
  const handleSidebarToggle = (newState) => {
    console.log('🔄 StaffLayout: Sidebar state changed:', newState);
    setSidebarState(newState);
  };

  // Apply dynamic styles to main content
  const mainContentStyle = {
    marginLeft: window.innerWidth <= 768 ? 0 : sidebarState.mainContentMargin,
    transition: 'margin-left 0.3s ease',
    width: window.innerWidth <= 768 ? '100%' : `calc(100% - ${sidebarState.mainContentMargin}px)`,
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
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
    <div className="staff-layout">
      {/* Staff Sidebar */}
      <StaffSidebar onSidebarToggle={handleSidebarToggle} />
      
      {/* Main Content Area */}
      <div 
        className="staff-content-wrapper"
        style={mainContentStyle}
        data-sidebar-collapsed={sidebarState.isCollapsed}
      >
        {/* Page Header */}
        {(title || breadcrumbs || actions) && (
          <div className="staff-page-header">
            <div className="staff-header-content">
              {/* Title and Breadcrumbs */}
              <div className="staff-header-info">
                {title && (
                  <h1 className="staff-page-title">
                    {title}
                    {sidebarState.isCollapsed && (
                      <small className="ms-3 badge bg-secondary">
                        <i className="bi bi-layout-sidebar me-1"></i>
                        Compact View
                      </small>
                    )}
                  </h1>
                )}
                
                {breadcrumbs && (
                  <nav aria-label="breadcrumb">
                    <ol className="staff-breadcrumb breadcrumb">
                      {breadcrumbs.map((crumb, index) => (
                        <li 
                          key={index} 
                          className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                        >
                          {crumb.link && index !== breadcrumbs.length - 1 ? (
                            <a href={crumb.link}>{crumb.label}</a>
                          ) : (
                            crumb.label
                          )}
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}
              </div>
              
              {/* Action Buttons */}
              {actions && (
                <div className="staff-header-actions">
                  {actions}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="staff-main-content">
          {/* Clone children and pass staff layout context */}
          {React.Children.map(children, child => 
            React.isValidElement(child) 
              ? React.cloneElement(child, { 
                  staffLayoutContext: {
                    sidebarState,
                    isCompactView: sidebarState.isCollapsed
                  }
                })
              : child
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * StaffPageWrapper - Simple wrapper for staff pages with common layout
 */
export const StaffPageWrapper = ({ 
  title, 
  breadcrumbs, 
  actions, 
  children,
  className = ""
}) => {
  return (
    <StaffLayout 
      title={title} 
      breadcrumbs={breadcrumbs} 
      actions={actions}
    >
      <div className={`staff-page-content ${className}`}>
        {children}
      </div>
    </StaffLayout>
  );
};

/**
 * StaffModuleWrapper - Wrapper for specific staff modules (plans, reports, etc.)
 */
export const StaffModuleWrapper = ({ 
  module, 
  title, 
  icon, 
  children,
  headerActions
}) => {
  const breadcrumbs = [
    { label: 'Staff', link: '/staff' },
    { label: 'Dashboard', link: '/staff/dashboard' },
    { label: title }
  ];

  const moduleTitle = (
    <>
      {icon && <i className={`${icon} me-2`}></i>}
      {title}
      <span className="badge bg-info ms-2">{module}</span>
    </>
  );

  return (
    <StaffLayout 
      title={moduleTitle}
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      <div className={`staff-module-content staff-${module}-module`}>
        {children}
      </div>
    </StaffLayout>
  );
};

export default StaffLayout;
