// Sidebar utility functions for managing layout and responsive behavior

export const initializeSidebar = () => {
  // Add event listener for sidebar toggle
  const toggleBtn = document.querySelector('.sidebar-toggle-btn');
  const sidebar = document.querySelector('.professional-sidebar');
  const mainContent = document.querySelector('.admin-main-content');
  const body = document.body;

  if (toggleBtn && sidebar && mainContent) {
    toggleBtn.addEventListener('click', () => {
      const isCollapsed = sidebar.classList.contains('collapsed');
      
      if (isCollapsed) {
        // Expand sidebar
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('expanded');
        body.classList.remove('sidebar-collapsed');
        
        // Adjust main content margin
        if (window.innerWidth > 768) {
          mainContent.style.marginLeft = '280px';
        }
      } else {
        // Collapse sidebar
        sidebar.classList.remove('expanded');
        sidebar.classList.add('collapsed');
        body.classList.add('sidebar-collapsed');
        
        // Adjust main content margin
        if (window.innerWidth > 768) {
          mainContent.style.marginLeft = '70px';
        } else {
          mainContent.style.marginLeft = '0';
        }
      }
    });
  }

  // Handle responsive behavior
  const handleResize = () => {
    const sidebar = document.querySelector('.professional-sidebar');
    const mainContent = document.querySelector('.admin-main-content');
    
    if (sidebar && mainContent) {
      if (window.innerWidth <= 768) {
        // Mobile: Always collapse sidebar and remove margin
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('expanded');
        mainContent.style.marginLeft = '0';
        body.classList.add('sidebar-collapsed');
      } else {
        // Desktop: Restore based on current state
        const isCollapsed = sidebar.classList.contains('collapsed');
        if (isCollapsed) {
          mainContent.style.marginLeft = '70px';
        } else {
          mainContent.style.marginLeft = '280px';
        }
      }
    }
  };

  // Add resize listener
  window.addEventListener('resize', handleResize);
  
  // Initial setup
  handleResize();

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    const profileDropdown = document.querySelector('.profile-dropdown');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const profileTrigger = document.querySelector('.profile-trigger');
    const notificationTrigger = document.querySelector('.notification-trigger');

    // Close profile dropdown if clicking outside
    if (profileDropdown && !profileTrigger?.contains(e.target)) {
      profileDropdown.style.display = 'none';
    }

    // Close notification dropdown if clicking outside
    if (notificationDropdown && !notificationTrigger?.contains(e.target)) {
      notificationDropdown.style.display = 'none';
    }
  });
};

export const updateMainContentMargin = (isCollapsed) => {
  const mainContent = document.querySelector('.admin-main-content');
  
  if (mainContent) {
    if (window.innerWidth <= 768) {
      mainContent.style.marginLeft = '0';
    } else {
      mainContent.style.marginLeft = isCollapsed ? '70px' : '280px';
    }
  }
};

export const handleSidebarState = (isCollapsed) => {
  const body = document.body;
  
  if (isCollapsed) {
    body.classList.add('sidebar-collapsed');
  } else {
    body.classList.remove('sidebar-collapsed');
  }
  
  updateMainContentMargin(isCollapsed);
};

// Auto-initialize when DOM is loaded
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSidebar);
  } else {
    initializeSidebar();
  }
}
