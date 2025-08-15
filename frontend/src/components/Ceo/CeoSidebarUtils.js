import { useState, useEffect } from 'react';

/**
 * CEO Sidebar Utilities
 * Helper functions for body component expansion/shrinking integration
 */

/**
 * Initialize CEO Sidebar body component integration
 * Call this function when your app starts to set up automatic body component sizing
 */
export const initializeCeoSidebarIntegration = () => {
  // Add data attributes to main content elements for automatic detection
  const mainContentSelectors = [
    '.main-content',
    '.dashboard-container',
    '.content-wrapper',
    '.page-content',
    '.main-wrapper'
  ];

  mainContentSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.setAttribute('data-ceo-content', 'true');
    });
  });

  // Set initial CSS custom properties
  const sidebarWidth = document.body.classList.contains('ceo-sidebar-collapsed') ? 60 : 260;
  const mainContentMargin = window.innerWidth <= 768 ? 0 : sidebarWidth;

  document.documentElement.style.setProperty('--ceo-sidebar-width', `${sidebarWidth}px`);
  document.documentElement.style.setProperty('--ceo-main-content-margin', `${mainContentMargin}px`);
  document.documentElement.style.setProperty('--ceo-content-width', `calc(100vw - ${mainContentMargin}px)`);

  console.log('CEO Sidebar integration initialized');
};

/**
 * Update body component sizing manually
 * @param {boolean} isCollapsed - Whether the sidebar is collapsed
 * @param {boolean} isMobile - Whether the current view is mobile
 */
export const updateBodyComponentSizing = (isCollapsed = false, isMobile = false) => {
  const sidebarWidth = isCollapsed ? 60 : 260;
  const mainContentMargin = isMobile ? 0 : sidebarWidth;

  // Update CSS custom properties
  document.documentElement.style.setProperty('--ceo-sidebar-width', `${sidebarWidth}px`);
  document.documentElement.style.setProperty('--ceo-main-content-margin', `${mainContentMargin}px`);
  document.documentElement.style.setProperty('--ceo-content-width', `calc(100vw - ${mainContentMargin}px)`);

  // Update body classes
  document.body.classList.remove('ceo-sidebar-collapsed', 'ceo-sidebar-expanded');
  document.body.classList.add(isCollapsed ? 'ceo-sidebar-collapsed' : 'ceo-sidebar-expanded');

  // Update all main content elements
  const mainContentElements = document.querySelectorAll('.ceo-main-content, .main-content, [data-ceo-content]');
  mainContentElements.forEach(element => {
    element.style.marginLeft = `${mainContentMargin}px`;
    element.style.width = `calc(100% - ${mainContentMargin}px)`;
    element.style.transition = 'margin-left 0.3s ease, width 0.3s ease';
  });

  // Update dashboard and content wrappers
  const dashboardElements = document.querySelectorAll('.ceo-dashboard-container, .dashboard-container, .content-wrapper');
  dashboardElements.forEach(element => {
    element.style.marginLeft = `${mainContentMargin}px`;
    element.style.width = `calc(100vw - ${mainContentMargin}px)`;
    element.style.transition = 'margin-left 0.3s ease, width 0.3s ease';
  });

  // Trigger resize event for charts and other components
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 350);
};

/**
 * React hook for CEO Sidebar integration
 * Use this hook in your main app component to automatically handle sidebar state
 */
export const useCeoSidebarIntegration = () => {
  const [sidebarState, setSidebarState] = useState({
    isCollapsed: false,
    sidebarWidth: 260,
    mainContentMargin: 260,
    contentWidth: 'calc(100vw - 260px)'
  });

  useEffect(() => {
    // Initialize integration
    initializeCeoSidebarIntegration();

    // Listen for sidebar state changes
    const handleSidebarStateChange = (event) => {
      const { isCollapsed, sidebarWidth, mainContentMargin, contentWidth } = event.detail;
      setSidebarState({ isCollapsed, sidebarWidth, mainContentMargin, contentWidth });
    };

    window.addEventListener('ceoSidebarStateChange', handleSidebarStateChange);

    return () => {
      window.removeEventListener('ceoSidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  return sidebarState;
};

/**
 * Add CEO content attribute to an element
 * @param {HTMLElement} element - The element to mark as CEO content
 */
export const markAsCeoContent = (element) => {
  if (element && element.setAttribute) {
    element.setAttribute('data-ceo-content', 'true');
  }
};

/**
 * Remove CEO content attribute from an element
 * @param {HTMLElement} element - The element to unmark as CEO content
 */
export const unmarkAsCeoContent = (element) => {
  if (element && element.removeAttribute) {
    element.removeAttribute('data-ceo-content');
  }
};

/**
 * Get current sidebar state from DOM
 * @returns {Object} Current sidebar state
 */
export const getCurrentSidebarState = () => {
  const isCollapsed = document.body.classList.contains('ceo-sidebar-collapsed');
  const sidebarWidth = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--ceo-sidebar-width')
  ) || (isCollapsed ? 60 : 260);
  const mainContentMargin = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--ceo-main-content-margin')
  ) || (window.innerWidth <= 768 ? 0 : sidebarWidth);

  return {
    isCollapsed,
    sidebarWidth,
    mainContentMargin,
    contentWidth: `calc(100vw - ${mainContentMargin}px)`
  };
};

/**
 * Force refresh all body components
 * Use this if components are not responding to sidebar changes
 */
export const refreshBodyComponents = () => {
  const currentState = getCurrentSidebarState();
  updateBodyComponentSizing(currentState.isCollapsed, window.innerWidth <= 768);
  
  // Force a layout recalculation
  document.body.offsetHeight;
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

/**
 * Check if an element is a CEO content element
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} Whether the element is marked as CEO content
 */
export const isCeoContent = (element) => {
  return element && element.hasAttribute && element.hasAttribute('data-ceo-content');
};

/**
 * Get all CEO content elements
 * @returns {NodeList} All elements marked as CEO content
 */
export const getAllCeoContentElements = () => {
  return document.querySelectorAll('[data-ceo-content], .ceo-main-content, .main-content');
};

/**
 * Debug function to log current sidebar state
 */
export const debugSidebarState = () => {
  const state = getCurrentSidebarState();
  console.group('CEO Sidebar State Debug');
  console.log('Is Collapsed:', state.isCollapsed);
  console.log('Sidebar Width:', state.sidebarWidth + 'px');
  console.log('Main Content Margin:', state.mainContentMargin + 'px');
  console.log('Content Width:', state.contentWidth);
  console.log('Body Classes:', Array.from(document.body.classList));
  console.log('CEO Content Elements:', getAllCeoContentElements().length);
  console.groupEnd();
};

/**
 * CSS class names used by the CEO Sidebar
 */
export const CEO_SIDEBAR_CLASSES = {
  SIDEBAR: 'ceo-professional-sidebar',
  COLLAPSED: 'ceo-sidebar-collapsed',
  EXPANDED: 'ceo-sidebar-expanded',
  MAIN_CONTENT: 'ceo-main-content',
  DASHBOARD: 'ceo-dashboard-container',
  TOGGLE_BTN: 'ceo-sidebar-toggle-btn',
  OVERLAY: 'ceo-sidebar-overlay'
};

/**
 * CSS custom property names
 */
export const CEO_SIDEBAR_CSS_VARS = {
  SIDEBAR_WIDTH: '--ceo-sidebar-width',
  MAIN_CONTENT_MARGIN: '--ceo-main-content-margin',
  CONTENT_WIDTH: '--ceo-content-width',
  TRANSITION_DURATION: '--ceo-transition-duration',
  HEADER_HEIGHT: '--ceo-header-height'
};

export default {
  initializeCeoSidebarIntegration,
  updateBodyComponentSizing,
  useCeoSidebarIntegration,
  markAsCeoContent,
  unmarkAsCeoContent,
  getCurrentSidebarState,
  refreshBodyComponents,
  isCeoContent,
  getAllCeoContentElements,
  debugSidebarState,
  CEO_SIDEBAR_CLASSES,
  CEO_SIDEBAR_CSS_VARS
};
