import React, { useState, useEffect } from 'react';
import CeoSidebar from './CeoSidebar';
import './CeoSidebarIntegration.css';

/**
 * CEO Sidebar Integration Component
 * Demonstrates how to integrate the CEO Sidebar with main content
 * and handle sidebar state changes for responsive layout
 */
const CeoSidebarIntegration = ({ children }) => {
  const [sidebarState, setSidebarState] = useState({
    isCollapsed: false,
    sidebarWidth: 260,
    mainContentMargin: 260
  });

  // Handle sidebar state changes from CeoSidebar component
  const handleSidebarToggle = (newState) => {
    setSidebarState(newState);
    
    // Update CSS custom properties for dynamic styling
    document.documentElement.style.setProperty('--ceo-sidebar-width', `${newState.sidebarWidth}px`);
    document.documentElement.style.setProperty('--ceo-main-content-margin', `${newState.mainContentMargin}px`);
  };

  // Listen for sidebar state changes via custom events
  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      const { isCollapsed, sidebarWidth, mainContentMargin } = event.detail;
      setSidebarState({ isCollapsed, sidebarWidth, mainContentMargin });
      
      // Update CSS custom properties
      document.documentElement.style.setProperty('--ceo-sidebar-width', `${sidebarWidth}px`);
      document.documentElement.style.setProperty('--ceo-main-content-margin', `${mainContentMargin}px`);
    };

    window.addEventListener('ceoSidebarStateChange', handleSidebarStateChange);
    
    return () => {
      window.removeEventListener('ceoSidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  // Initialize CSS custom properties on mount
  useEffect(() => {
    document.documentElement.style.setProperty('--ceo-sidebar-width', `${sidebarState.sidebarWidth}px`);
    document.documentElement.style.setProperty('--ceo-main-content-margin', `${sidebarState.mainContentMargin}px`);
  }, []);

  return (
    <div className="ceo-layout-container">
      {/* CEO Sidebar */}
      <CeoSidebar onSidebarToggle={handleSidebarToggle} />
      
      {/* Main Content Area */}
      <main 
        className={`ceo-main-content ${sidebarState.isCollapsed ? 'ceo-sidebar-collapsed' : 'ceo-sidebar-expanded'}`}
        style={{
          marginLeft: window.innerWidth > 768 ? `${sidebarState.mainContentMargin}px` : '0',
          transition: 'margin-left 0.3s ease'
        }}
      >
        {/* Content Header */}
        <div className="ceo-content-header">
          <div className="ceo-header-info">
            <h1 className="ceo-page-title">CEO Executive Portal</h1>
            <p className="ceo-page-subtitle">
              Sidebar is {sidebarState.isCollapsed ? 'collapsed' : 'expanded'} 
              (Width: {sidebarState.sidebarWidth}px)
            </p>
          </div>
          
          <div className="ceo-header-actions">
            <div className="ceo-sidebar-status">
              <span className={`ceo-status-indicator ${sidebarState.isCollapsed ? 'collapsed' : 'expanded'}`}>
                <i className={`bi ${sidebarState.isCollapsed ? 'bi-layout-sidebar' : 'bi-layout-sidebar-reverse'}`}></i>
                {sidebarState.isCollapsed ? 'Collapsed' : 'Expanded'}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="ceo-content-body">
          {children || (
            <div className="ceo-demo-content">
              <div className="ceo-demo-card">
                <h2>CEO Sidebar Integration Demo</h2>
                <p>This demonstrates how the CEO Sidebar integrates with main content:</p>
                
                <div className="ceo-feature-list">
                  <div className="ceo-feature-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Professional executive-level design</span>
                  </div>
                  <div className="ceo-feature-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Smooth expand/collapse animations</span>
                  </div>
                  <div className="ceo-feature-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Responsive mobile-friendly layout</span>
                  </div>
                  <div className="ceo-feature-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Dynamic content margin adjustment</span>
                  </div>
                  <div className="ceo-feature-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>Custom event-based state management</span>
                  </div>
                  <div className="ceo-feature-item">
                    <i className="bi bi-check-circle-fill"></i>
                    <span>CSS custom properties for styling</span>
                  </div>
                </div>

                <div className="ceo-integration-info">
                  <h3>Integration Details:</h3>
                  <div className="ceo-info-grid">
                    <div className="ceo-info-item">
                      <strong>Sidebar Width:</strong>
                      <span>{sidebarState.sidebarWidth}px</span>
                    </div>
                    <div className="ceo-info-item">
                      <strong>Content Margin:</strong>
                      <span>{sidebarState.mainContentMargin}px</span>
                    </div>
                    <div className="ceo-info-item">
                      <strong>State:</strong>
                      <span>{sidebarState.isCollapsed ? 'Collapsed' : 'Expanded'}</span>
                    </div>
                    <div className="ceo-info-item">
                      <strong>Responsive:</strong>
                      <span>{window.innerWidth <= 768 ? 'Mobile' : 'Desktop'}</span>
                    </div>
                  </div>
                </div>

                <div className="ceo-usage-example">
                  <h3>Usage Example:</h3>
                  <pre className="ceo-code-block">
{`import CeoSidebarIntegration from './CeoSidebarIntegration';

function App() {
  return (
    <CeoSidebarIntegration>
      <YourMainContent />
    </CeoSidebarIntegration>
  );
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CeoSidebarIntegration;
