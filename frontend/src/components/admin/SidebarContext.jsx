import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Sidebar Context
const SidebarContext = createContext();

// Custom hook to use the Sidebar Context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

// Sidebar Provider Component
export const SidebarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [collapsedWidth, setCollapsedWidth] = useState(70);

  // Function to toggle sidebar state
  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  // Function to collapse sidebar
  const collapseSidebar = () => {
    setIsCollapsed(true);
  };

  // Function to expand sidebar
  const expandSidebar = () => {
    setIsCollapsed(false);
  };

  // Function to set sidebar state directly
  const setSidebarCollapsed = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  // Calculate current sidebar width
  const getCurrentSidebarWidth = () => {
    return isCollapsed ? collapsedWidth : sidebarWidth;
  };

  // Get margin for main content
  const getMainContentMargin = () => {
    if (window.innerWidth <= 768) {
      return 0; // No margin on mobile
    }
    return getCurrentSidebarWidth();
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        // Auto-collapse on mobile
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update CSS custom properties for dynamic styling
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
    root.style.setProperty('--sidebar-collapsed-width', `${collapsedWidth}px`);
    root.style.setProperty('--current-sidebar-width', `${getCurrentSidebarWidth()}px`);
    root.style.setProperty('--main-content-margin', `${getMainContentMargin()}px`);
    
    // Add/remove body class for global styling
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, [isCollapsed, sidebarWidth, collapsedWidth]);

  // Broadcast sidebar state changes via custom events
  useEffect(() => {
    const sidebarStateEvent = new CustomEvent('sidebarStateChange', {
      detail: {
        isCollapsed,
        sidebarWidth: getCurrentSidebarWidth(),
        mainContentMargin: getMainContentMargin(),
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(sidebarStateEvent);
    
    // Also update localStorage for persistence
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        setIsCollapsed(JSON.parse(savedState));
      }
    } catch (error) {
      console.warn('Failed to load sidebar state from localStorage:', error);
    }
  }, []);

  const contextValue = {
    // State
    isCollapsed,
    sidebarWidth,
    collapsedWidth,
    
    // Actions
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    setSidebarCollapsed,
    
    // Computed values
    getCurrentSidebarWidth,
    getMainContentMargin,
    
    // Setters for customization
    setSidebarWidth,
    setCollapsedWidth,
    
    // Utility
    isMobile: window.innerWidth <= 768
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

export default SidebarContext;
