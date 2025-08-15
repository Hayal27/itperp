import React, { useEffect, useState } from 'react';
import CeoSidebar from './CeoSidebar';
import { initializeCeoSidebarIntegration, getCurrentSidebarState } from './CeoSidebarUtils';
import './CeoLayoutExample.css';

/**
 * CEO Layout Example Component
 * Demonstrates how body components automatically expand and shrink with the sidebar
 */
const CeoLayoutExample = () => {
  const [sidebarState, setSidebarState] = useState({
    isCollapsed: false,
    sidebarWidth: 260,
    mainContentMargin: 260,
    contentWidth: 'calc(100vw - 260px)'
  });

  const [componentDimensions, setComponentDimensions] = useState({
    mainContent: { width: 0, marginLeft: 0 },
    dashboard: { width: 0, marginLeft: 0 },
    cards: []
  });

  // Initialize CEO Sidebar integration
  useEffect(() => {
    initializeCeoSidebarIntegration();
    
    // Set initial state
    const initialState = getCurrentSidebarState();
    setSidebarState(initialState);
    
    // Listen for sidebar state changes
    const handleSidebarStateChange = (event) => {
      const newState = event.detail;
      setSidebarState(newState);
      
      // Update component dimensions for display
      setTimeout(() => {
        updateComponentDimensions();
      }, 350); // After animation completes
    };

    window.addEventListener('ceoSidebarStateChange', handleSidebarStateChange);

    // Initial dimension update
    setTimeout(() => {
      updateComponentDimensions();
    }, 100);

    return () => {
      window.removeEventListener('ceoSidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  // Update component dimensions for display
  const updateComponentDimensions = () => {
    const mainContentEl = document.querySelector('.ceo-example-main-content');
    const dashboardEl = document.querySelector('.ceo-example-dashboard');
    const cardEls = document.querySelectorAll('.ceo-example-card');

    const newDimensions = {
      mainContent: mainContentEl ? {
        width: mainContentEl.offsetWidth,
        marginLeft: parseInt(getComputedStyle(mainContentEl).marginLeft)
      } : { width: 0, marginLeft: 0 },
      dashboard: dashboardEl ? {
        width: dashboardEl.offsetWidth,
        marginLeft: parseInt(getComputedStyle(dashboardEl).marginLeft)
      } : { width: 0, marginLeft: 0 },
      cards: Array.from(cardEls).map(card => ({
        width: card.offsetWidth,
        height: card.offsetHeight
      }))
    };

    setComponentDimensions(newDimensions);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        updateComponentDimensions();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="ceo-layout-example">
      {/* CEO Sidebar */}
      <CeoSidebar />

      {/* Main Content Area - Automatically expands/shrinks */}
      <main className="ceo-example-main-content main-content" data-ceo-content="true">
        {/* Header Section */}
        <div className="ceo-example-header">
          <h1 className="ceo-example-title">CEO Layout Integration Demo</h1>
          <p className="ceo-example-subtitle">
            Watch how body components automatically expand and shrink when the sidebar toggles
          </p>
        </div>

        {/* Sidebar State Display */}
        <div className="ceo-state-display">
          <div className="ceo-state-card">
            <h3>Sidebar State</h3>
            <div className="ceo-state-grid">
              <div className="ceo-state-item">
                <span className="ceo-state-label">Status:</span>
                <span className={`ceo-state-value ${sidebarState.isCollapsed ? 'collapsed' : 'expanded'}`}>
                  {sidebarState.isCollapsed ? 'Collapsed' : 'Expanded'}
                </span>
              </div>
              <div className="ceo-state-item">
                <span className="ceo-state-label">Sidebar Width:</span>
                <span className="ceo-state-value">{sidebarState.sidebarWidth}px</span>
              </div>
              <div className="ceo-state-item">
                <span className="ceo-state-label">Content Margin:</span>
                <span className="ceo-state-value">{sidebarState.mainContentMargin}px</span>
              </div>
              <div className="ceo-state-item">
                <span className="ceo-state-label">Content Width:</span>
                <span className="ceo-state-value">{sidebarState.contentWidth}</span>
              </div>
            </div>
          </div>

          <div className="ceo-dimensions-card">
            <h3>Component Dimensions</h3>
            <div className="ceo-dimensions-grid">
              <div className="ceo-dimension-item">
                <span className="ceo-dimension-label">Main Content:</span>
                <span className="ceo-dimension-value">
                  {componentDimensions.mainContent.width}px wide, 
                  {componentDimensions.mainContent.marginLeft}px margin
                </span>
              </div>
              <div className="ceo-dimension-item">
                <span className="ceo-dimension-label">Dashboard:</span>
                <span className="ceo-dimension-value">
                  {componentDimensions.dashboard.width}px wide, 
                  {componentDimensions.dashboard.marginLeft}px margin
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Container - Automatically expands/shrinks */}
        <div className="ceo-example-dashboard dashboard-container">
          <h2>Dashboard Components</h2>
          <p>These components automatically adjust their width when the sidebar toggles:</p>

          {/* Example Cards Grid */}
          <div className="ceo-example-cards-grid">
            <div className="ceo-example-card">
              <div className="ceo-card-header">
                <h3>Revenue Chart</h3>
                <span className="ceo-card-size">
                  {componentDimensions.cards[0]?.width || 0}px × {componentDimensions.cards[0]?.height || 0}px
                </span>
              </div>
              <div className="ceo-card-content">
                <div className="ceo-mock-chart">
                  <div className="ceo-chart-bar" style={{ height: '60%' }}></div>
                  <div className="ceo-chart-bar" style={{ height: '80%' }}></div>
                  <div className="ceo-chart-bar" style={{ height: '45%' }}></div>
                  <div className="ceo-chart-bar" style={{ height: '90%' }}></div>
                  <div className="ceo-chart-bar" style={{ height: '70%' }}></div>
                </div>
              </div>
            </div>

            <div className="ceo-example-card">
              <div className="ceo-card-header">
                <h3>Performance Metrics</h3>
                <span className="ceo-card-size">
                  {componentDimensions.cards[1]?.width || 0}px × {componentDimensions.cards[1]?.height || 0}px
                </span>
              </div>
              <div className="ceo-card-content">
                <div className="ceo-metrics-grid">
                  <div className="ceo-metric">
                    <span className="ceo-metric-value">$2.4M</span>
                    <span className="ceo-metric-label">Revenue</span>
                  </div>
                  <div className="ceo-metric">
                    <span className="ceo-metric-value">15.2%</span>
                    <span className="ceo-metric-label">Growth</span>
                  </div>
                  <div className="ceo-metric">
                    <span className="ceo-metric-value">1,247</span>
                    <span className="ceo-metric-label">Customers</span>
                  </div>
                  <div className="ceo-metric">
                    <span className="ceo-metric-value">98.5%</span>
                    <span className="ceo-metric-label">Uptime</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ceo-example-card">
              <div className="ceo-card-header">
                <h3>Data Table</h3>
                <span className="ceo-card-size">
                  {componentDimensions.cards[2]?.width || 0}px × {componentDimensions.cards[2]?.height || 0}px
                </span>
              </div>
              <div className="ceo-card-content">
                <div className="ceo-mock-table">
                  <div className="ceo-table-header">
                    <span>Department</span>
                    <span>Budget</span>
                    <span>Spent</span>
                    <span>Remaining</span>
                  </div>
                  <div className="ceo-table-row">
                    <span>Marketing</span>
                    <span>$50K</span>
                    <span>$32K</span>
                    <span>$18K</span>
                  </div>
                  <div className="ceo-table-row">
                    <span>Development</span>
                    <span>$120K</span>
                    <span>$95K</span>
                    <span>$25K</span>
                  </div>
                  <div className="ceo-table-row">
                    <span>Operations</span>
                    <span>$80K</span>
                    <span>$67K</span>
                    <span>$13K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Component */}
          <div className="ceo-example-full-width">
            <h3>Full Width Component</h3>
            <p>This component spans the full available width and adjusts automatically:</p>
            <div className="ceo-full-width-content">
              <div className="ceo-progress-bar">
                <div className="ceo-progress-fill" style={{ width: '75%' }}>
                  <span>Project Progress: 75%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="ceo-instructions">
          <h2>How It Works</h2>
          <div className="ceo-instruction-list">
            <div className="ceo-instruction-item">
              <i className="bi bi-1-circle-fill"></i>
              <span>Click the sidebar toggle button to expand/collapse the sidebar</span>
            </div>
            <div className="ceo-instruction-item">
              <i className="bi bi-2-circle-fill"></i>
              <span>Watch how all body components automatically adjust their width and margin</span>
            </div>
            <div className="ceo-instruction-item">
              <i className="bi bi-3-circle-fill"></i>
              <span>Resize the browser window to see responsive behavior</span>
            </div>
            <div className="ceo-instruction-item">
              <i className="bi bi-4-circle-fill"></i>
              <span>Check the component dimensions display to see real-time measurements</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CeoLayoutExample;
