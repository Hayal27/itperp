import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminComponents.css';
import './MenuPermissions.css'; // Custom styles with mp- prefix

// Add some inline styles for better UX
const pathClickableStyle = {
  cursor: 'pointer',
  textDecoration: 'underline',
  transition: 'all 0.2s ease'
};

// Custom styles are now in MenuPermissions.css with mp- prefix

const MenuPermissions = ({ sidebarState: propSidebarState }) => {
  const [permissionMatrix, setPermissionMatrix] = useState({
    menuItems: [],
    roles: [],
    permissions: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Sidebar state - use prop if available, otherwise default
  const [sidebarState, setSidebarState] = useState(
    propSidebarState || {
      isCollapsed: false,
      sidebarWidth: 280,
      mainContentMargin: 280
    }
  );
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAddMenuForm, setShowAddMenuForm] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    path: '',
    icon: '',
    parent_id: null,
    sort_order: 1,
    file_name: ''
  });
  const [addingMenu, setAddingMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('permissions'); // permissions, menu-management, roles-overview, settings
  const [showEditMenuForm, setShowEditMenuForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [editMenuItem, setEditMenuItem] = useState({
    id: null,
    name: '',
    path: '',
    icon: '',
    parent_id: null,
    sort_order: 1,
    file_name: '',
    is_active: true
  });
  const [updatingMenu, setUpdatingMenu] = useState(false);

  // Search functionality states
  const [hierarchySearchTerm, setHierarchySearchTerm] = useState('');
  const [menuListSearchTerm, setMenuListSearchTerm] = useState('');
  const [permissionsSearchTerm, setPermissionsSearchTerm] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    showActiveOnly: false,
    showInactiveOnly: false,
    parentFilter: 'all' // 'all', 'root', 'child'
  });

  useEffect(() => {
    fetchPermissionMatrix();
  }, []);

  // Listen for sidebar state changes from props and custom events
  useEffect(() => {
    // Update from props if available
    if (propSidebarState) {
      setSidebarState(propSidebarState);
    }
  }, [propSidebarState]);

  // Listen for custom sidebar events (fallback for direct usage)
  useEffect(() => {
    const handleSidebarChange = (event) => {
      console.log('🔄 MenuPermissions: Sidebar state changed via event:', event.detail);
      setSidebarState({
        isCollapsed: event.detail.isCollapsed,
        sidebarWidth: event.detail.sidebarWidth,
        mainContentMargin: event.detail.mainContentMargin
      });
    };

    window.addEventListener('sidebarStateChange', handleSidebarChange);

    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarChange);
    };
  }, []);

  const fetchPermissionMatrix = async (preserveSelection = true) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching permission matrix...');
      const response = await axios.get('http://localhost:5000/api/menu-permissions/permission-matrix');

      console.log('📊 API Response:', response.data);

      if (response.data.success) {
        const data = response.data.data;
        console.log('✅ Permission matrix loaded:', {
          menuItems: data.menuItems.length,
          roles: data.roles.length,
          permissions: data.permissions.length
        });
        console.log('📋 Menu items:', data.menuItems.map(item => ({
          id: item.id,
          name: item.name,
          parent_id: item.parent_id,
          is_active: item.is_active
        })));

        // Preserve current state when updating
        setPermissionMatrix(prev => ({
          ...data,
          // Preserve any local changes that might not be reflected in server response yet
          menuItems: data.menuItems.map(serverItem => {
            const localItem = prev?.menuItems?.find(local => local.id === serverItem.id);
            // If we have a local version that's newer, keep it
            return localItem && localItem.updated_at > serverItem.updated_at ? localItem : serverItem;
          })
        }));

        // Auto-select first role if available and no role is currently selected
        if (data.roles.length > 0 && !selectedRole && preserveSelection) {
          setSelectedRole(data.roles[0].role_id);
          console.log('🎯 Auto-selected role:', data.roles[0]);
        } else {
          console.log('🎯 Current selected role:', selectedRole);
        }
      } else {
        console.error('❌ API returned error:', response.data);
        setError('Failed to load permission matrix');
      }
    } catch (err) {
      console.error('💥 Error fetching permission matrix:', err);
      setError(`Failed to load permission matrix: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (roleId, menuItemId, permissionType, value) => {
    setPermissionMatrix(prev => ({
      ...prev,
      permissions: prev.permissions.map(rolePermission => {
        if (rolePermission.role_id === roleId) {
          return {
            ...rolePermission,
            menuPermissions: rolePermission.menuPermissions.map(menuPerm => {
              if (menuPerm.menu_item_id === menuItemId) {
                return {
                  ...menuPerm,
                  [permissionType]: value ? 1 : 0
                };
              }
              return menuPerm;
            })
          };
        }
        return rolePermission;
      })
    }));
  };

  const savePermissions = async (roleId) => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');
      
      const rolePermissions = permissionMatrix.permissions.find(p => p.role_id === roleId);
      if (!rolePermissions) {
        throw new Error('Role permissions not found');
      }
      
      const permissionsToSave = rolePermissions.menuPermissions
        .filter(p => p.can_view === 1) // Only save permissions for items that can be viewed
        .map(p => ({
          menu_item_id: p.menu_item_id,
          can_view: p.can_view,
          can_create: p.can_create,
          can_edit: p.can_edit,
          can_delete: p.can_delete
        }));
      
      await axios.put(`http://localhost:5000/api/menu-permissions/role-permissions/${roleId}`, {
        permissions: permissionsToSave
      });
      
      setSuccessMessage('Permissions saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving permissions:', err);
      setError('Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const getSelectedRolePermissions = () => {
    if (!selectedRole) return null;
    return permissionMatrix.permissions.find(p => p.role_id === selectedRole);
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();

    try {
      setAddingMenu(true);
      setError(null);
      setSuccessMessage('');

      console.log('➕ Adding new menu item:', newMenuItem);

      const response = await axios.post('http://localhost:5000/api/menu-permissions/menu-items', {
        name: newMenuItem.name,
        path: newMenuItem.path,
        icon: newMenuItem.icon,
        parent_id: newMenuItem.parent_id || null,
        sort_order: parseInt(newMenuItem.sort_order) || 1,
        file_name: newMenuItem.file_name
      });

      if (response.data.success) {
        setSuccessMessage(`Menu item "${newMenuItem.name}" created successfully!`);
        setShowAddMenuForm(false);
        setNewMenuItem({
          name: '',
          path: '',
          icon: '',
          parent_id: null,
          sort_order: 1,
          file_name: ''
        });

        // Refresh the permission matrix to show the new menu item
        await fetchPermissionMatrix();

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to create menu item');
      }
    } catch (err) {
      console.error('💥 Error adding menu item:', err);
      setError(`Failed to create menu item: ${err.response?.data?.message || err.message}`);
    } finally {
      setAddingMenu(false);
    }
  };

  const handleMenuInputChange = (field, value) => {
    setNewMenuItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetAddMenuForm = () => {
    setNewMenuItem({
      name: '',
      path: '',
      icon: '',
      parent_id: null,
      sort_order: 1,
      file_name: ''
    });
    setShowAddMenuForm(false);
  };

  // Helper function to resolve relative paths for preview
  const resolvePathPreview = (path) => {
    if (!path) return '/path';
    if (path === '#') return '# (No Navigation)';
    if (path.startsWith('/')) return path; // Absolute path

    // For relative paths, show what they might resolve to
    const currentLocation = window.location.pathname;
    const pathParts = currentLocation.split('/').filter(part => part);

    if (path.startsWith('../')) {
      const backLevels = (path.match(/\.\.\//g) || []).length;
      const remainingPath = path.replace(/\.\.\//g, '');
      const newParts = pathParts.slice(0, Math.max(0, pathParts.length - backLevels));
      if (remainingPath) newParts.push(remainingPath);
      return '/' + newParts.join('/');
    }

    if (path.startsWith('./')) {
      return currentLocation + '/' + path.substring(2);
    }

    return path;
  };

  // Helper function to get path type description
  const getPathTypeDescription = (path) => {
    if (!path) return '';
    if (path === '#') return 'Parent menu (no navigation)';
    if (path.startsWith('/')) return 'Absolute path from root';
    if (path.startsWith('../')) {
      const levels = (path.match(/\.\.\//g) || []).length;
      return `Relative path (${levels} level${levels > 1 ? 's' : ''} back)`;
    }
    if (path.startsWith('./')) return 'Relative path (current level)';
    return 'Custom path';
  };

  // Edit menu functions
  const handleEditMenu = (menuItem) => {
    console.log('✏️ Editing menu item:', menuItem);
    setEditingMenu(menuItem);
    setEditMenuItem({
      id: menuItem.id,
      name: menuItem.name,
      path: menuItem.path,
      icon: menuItem.icon,
      parent_id: menuItem.parent_id,
      sort_order: menuItem.sort_order,
      file_name: menuItem.file_name || '',
      is_active: menuItem.is_active
    });
    setShowEditMenuForm(true);
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();

    try {
      setUpdatingMenu(true);
      setError(null);
      setSuccessMessage('');

      console.log('🔄 Updating menu item:', editMenuItem);
      console.log('🔍 Current menu items before update:', permissionMatrix.menuItems.length);

      const response = await axios.put(`http://localhost:5000/api/menu-permissions/menu-items/${editMenuItem.id}`, {
        name: editMenuItem.name,
        path: editMenuItem.path,
        icon: editMenuItem.icon,
        parent_id: editMenuItem.parent_id || null,
        sort_order: parseInt(editMenuItem.sort_order) || 1,
        file_name: editMenuItem.file_name,
        is_active: editMenuItem.is_active
      });

      console.log('📝 Update response:', response.data);

      if (response.data.success) {
        // Create the updated menu item object
        const updatedMenuItem = {
          id: editMenuItem.id,
          name: editMenuItem.name,
          path: editMenuItem.path,
          icon: editMenuItem.icon,
          parent_id: editMenuItem.parent_id || null,
          sort_order: parseInt(editMenuItem.sort_order) || 1,
          file_name: editMenuItem.file_name,
          is_active: editMenuItem.is_active
        };

        console.log('✅ Updated menu item object:', updatedMenuItem);

        // Update the local state immediately and preserve all other data
        setPermissionMatrix(prev => {
          const updatedMenuItems = prev.menuItems.map(item =>
            item.id === editMenuItem.id
              ? { ...item, ...updatedMenuItem }
              : item
          );

          console.log('🔄 Updated menu items array:', updatedMenuItems.length);
          console.log('🎯 Updated item in array:', updatedMenuItems.find(item => item.id === editMenuItem.id));

          return {
            ...prev,
            menuItems: updatedMenuItems
          };
        });

        setSuccessMessage(`Menu item "${editMenuItem.name}" updated successfully!`);
        setShowEditMenuForm(false);
        setEditingMenu(null);

        // Don't refresh immediately - let the user see the changes
        console.log('✅ Menu item updated successfully in local state');

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Failed to update menu item');
      }
    } catch (err) {
      console.error('💥 Error updating menu item:', err);
      setError(`Failed to update menu item: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdatingMenu(false);
    }
  };

  const handleEditMenuInputChange = (field, value) => {
    setEditMenuItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetEditMenuForm = () => {
    setEditMenuItem({
      id: null,
      name: '',
      path: '',
      icon: '',
      parent_id: null,
      sort_order: 1,
      file_name: '',
      is_active: true
    });
    setEditingMenu(null);
    setShowEditMenuForm(false);
  };

  // Force refresh function to ensure menu items are visible
  const forceRefreshHierarchy = async () => {
    console.log('🔄 Force refreshing hierarchy...');
    try {
      setLoading(true);

      // Clear current state
      setPermissionMatrix(prev => ({
        ...prev,
        menuItems: []
      }));

      // Fetch fresh data
      await fetchPermissionMatrix(false);

      console.log('✅ Hierarchy force refresh completed');
    } catch (error) {
      console.error('💥 Error during force refresh:', error);
      setError('Failed to refresh hierarchy');
    } finally {
      setLoading(false);
    }
  };

  // Search utility functions
  const filterMenuItems = (items, searchTerm, filters = {}) => {
    let filteredItems = items;

    // Apply text search
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.path.toLowerCase().includes(searchLower) ||
        (item.file_name && item.file_name.toLowerCase().includes(searchLower)) ||
        (item.icon && item.icon.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filters
    if (filters.showActiveOnly) {
      filteredItems = filteredItems.filter(item => item.is_active);
    } else if (filters.showInactiveOnly) {
      filteredItems = filteredItems.filter(item => !item.is_active);
    }

    // Apply parent filter
    if (filters.parentFilter === 'root') {
      filteredItems = filteredItems.filter(item => !item.parent_id);
    } else if (filters.parentFilter === 'child') {
      filteredItems = filteredItems.filter(item => item.parent_id);
    }

    return filteredItems;
  };

  // Get filtered menu items for hierarchy view
  const getFilteredHierarchyItems = () => {
    return filterMenuItems(permissionMatrix.menuItems, hierarchySearchTerm, searchFilters);
  };

  // Get filtered menu items for menu list view
  const getFilteredMenuListItems = () => {
    return filterMenuItems(permissionMatrix.menuItems, menuListSearchTerm, searchFilters);
  };

  // Get filtered menu items for permissions view
  const getFilteredPermissionsItems = () => {
    return filterMenuItems(permissionMatrix.menuItems, permissionsSearchTerm, {});
  };

  // Clear all search filters
  const clearAllSearchFilters = () => {
    setHierarchySearchTerm('');
    setMenuListSearchTerm('');
    setPermissionsSearchTerm('');
    setSearchFilters({
      showActiveOnly: false,
      showInactiveOnly: false,
      parentFilter: 'all'
    });
  };

  // Debug function to check menu item visibility
  const debugMenuVisibility = (menuId) => {
    const menuItem = permissionMatrix.menuItems.find(item => item.id === menuId);
    if (menuItem) {
      console.log('🔍 Menu item found:', {
        id: menuItem.id,
        name: menuItem.name,
        parent_id: menuItem.parent_id,
        is_active: menuItem.is_active,
        sort_order: menuItem.sort_order
      });

      const isRoot = !menuItem.parent_id;
      const rootItems = permissionMatrix.menuItems.filter(item => !item.parent_id);
      const childItems = permissionMatrix.menuItems.filter(item => item.parent_id === menuItem.parent_id);

      console.log('🌳 Hierarchy info:', {
        isRoot,
        totalRootItems: rootItems.length,
        totalChildItems: childItems.length,
        parentExists: menuItem.parent_id ? permissionMatrix.menuItems.some(item => item.id === menuItem.parent_id) : 'N/A'
      });
    } else {
      console.error('❌ Menu item not found with ID:', menuId);
      console.log('📋 Available menu items:', permissionMatrix.menuItems.map(item => ({
        id: item.id,
        name: item.name
      })));
    }
  };

  const renderPermissionCheckbox = (menuItem, permissionType, label) => {
    const rolePermissions = getSelectedRolePermissions();
    if (!rolePermissions) return null;
    
    const menuPermission = rolePermissions.menuPermissions.find(p => p.menu_item_id === menuItem.id);
    if (!menuPermission) return null;
    
    const isChecked = menuPermission[permissionType] === 1;
    const isDisabled = permissionType !== 'can_view' && menuPermission.can_view === 0;
    
    return (
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id={`${menuItem.id}-${permissionType}`}
          checked={isChecked}
          disabled={isDisabled}
          onChange={(e) => handlePermissionChange(selectedRole, menuItem.id, permissionType, e.target.checked)}
        />
        <label className="form-check-label" htmlFor={`${menuItem.id}-${permissionType}`}>
          {label}
        </label>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="mp-main-content">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mp-main-content">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </main>
    );
  }

  // Dynamic styles based on sidebar state (only when not using AdminLayout)
  const dynamicStyles = propSidebarState ? {} : {
    marginLeft: sidebarState.mainContentMargin,
    transition: 'margin-left 0.3s ease',
    width: `calc(100% - ${sidebarState.mainContentMargin}px)`,
    minHeight: '100vh'
  };

  // Mobile responsive adjustments (only when not using AdminLayout)
  if (!propSidebarState && window.innerWidth <= 768) {
    dynamicStyles.marginLeft = 0;
    dynamicStyles.width = '100%';
  }

  return (
    <main
      className="mp-main-content"
      style={dynamicStyles}
      data-sidebar-collapsed={sidebarState.isCollapsed}
    >
      <div className="mp-dashboard-container">
        <div className="mp-dashboard-header">
          <div className="mp-page-title">
            <h1>
              Menu Permissions Management
              {sidebarState.isCollapsed && (
                <small className="ms-3 badge bg-secondary">
                  <i className="bi bi-layout-sidebar me-1"></i>
                  Sidebar Collapsed
                </small>
              )}
            </h1>
            <nav aria-label="breadcrumb">
              <ol className="mp-breadcrumb breadcrumb">
                <li className="breadcrumb-item"><a href="/">Admin</a></li>
                <li className="breadcrumb-item">Settings</li>
                <li className="breadcrumb-item">Menu Permissions</li>
                <li className="breadcrumb-item active">
                  {activeTab === 'permissions' && 'Role Permissions'}
                  {activeTab === 'menu-management' && 'Menu Management'}
                  {activeTab === 'roles-overview' && 'Roles Overview'}
                  {activeTab === 'menu-tree' && 'Menu Structure'}
                  {activeTab === 'settings' && 'Settings'}
                </li>
              </ol>
            </nav>
          </div>
          <div className="mp-dashboard-actions">
            {/* Sidebar State Indicator */}
            <div className="me-3 d-flex align-items-center">
              <small className="text-muted me-2">Layout:</small>
              <span className={`badge ${sidebarState.isCollapsed ? 'bg-warning' : 'bg-info'}`}>
                <i className={`bi ${sidebarState.isCollapsed ? 'bi-layout-sidebar-inset' : 'bi-layout-sidebar'} me-1`}></i>
                {sidebarState.isCollapsed ? 'Compact' : 'Full'}
              </span>
              <small className="text-muted ms-2">
                {sidebarState.sidebarWidth}px
              </small>
            </div>

            <button
              className="btn btn-success me-2"
              onClick={() => setShowAddMenuForm(true)}
              disabled={loading}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Menu
            </button>
            <button
              className="btn btn-primary"
              onClick={() => selectedRole && savePermissions(selectedRole)}
              disabled={saving || !selectedRole}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  Save Permissions
                </>
              )}
            </button>
          </div>
        </div>

        {/* Horizontal Sub-Menu Navigation Bar */}
        <div
          className="mp-sub-menu-bar"
          data-sidebar-collapsed={sidebarState.isCollapsed}
          style={{
            transition: 'all 0.3s ease',
            transform: sidebarState.isCollapsed ? 'translateX(0)' : 'translateX(0)',
            width: '100%'
          }}
        >
          <div className="mp-nav-container">
            <nav className="mp-nav-pills">
              <button
                className={`mp-nav-link ${activeTab === 'permissions' ? 'mp-active' : ''}`}
                onClick={() => setActiveTab('permissions')}
              >
                <i className="bi bi-shield-lock mp-nav-icon"></i>
                <div className="mp-nav-title">Role Permissions</div>
                <small className="mp-nav-subtitle">Manage role-based access</small>
              </button>

              <button
                className={`mp-nav-link ${activeTab === 'menu-management' ? 'mp-active' : ''}`}
                onClick={() => setActiveTab('menu-management')}
              >
                <i className="bi bi-list-ul mp-nav-icon"></i>
                <div className="mp-nav-title">Menu Management</div>
                <small className="mp-nav-subtitle">Add, edit, delete menus</small>
              </button>

              <button
                className={`mp-nav-link ${activeTab === 'roles-overview' ? 'mp-active' : ''}`}
                onClick={() => setActiveTab('roles-overview')}
              >
                <i className="bi bi-people-fill mp-nav-icon"></i>
                <div className="mp-nav-title">Roles Overview</div>
                <small className="mp-nav-subtitle">View all roles & stats</small>
              </button>

              <button
                className={`mp-nav-link ${activeTab === 'menu-tree' ? 'mp-active' : ''}`}
                onClick={() => setActiveTab('menu-tree')}
              >
                <i className="bi bi-diagram-3 mp-nav-icon"></i>
                <div className="mp-nav-title">Menu Structure</div>
                <small className="mp-nav-subtitle">Hierarchical view</small>
              </button>

              <button
                className={`mp-nav-link ${activeTab === 'settings' ? 'mp-active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <i className="bi bi-gear mp-nav-icon"></i>
                <div className="mp-nav-title">Settings</div>
                <small className="mp-nav-subtitle">System configuration</small>
              </button>
            </nav>
          </div>
        </div>

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show">
            <i className="bi bi-check-circle-fill me-2"></i>
            {successMessage}
            <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
          </div>
        )}

        {/* Add New Menu Item Modal */}
        {showAddMenuForm && (
          <div className="mp-modal-overlay">
            <div className="mp-modal-dialog">
              <div className="mp-modal-content">
                <div className="mp-modal-header">
                  <h5 className="mp-modal-title">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add New Menu Item
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={resetAddMenuForm}
                    disabled={addingMenu}
                  ></button>
                </div>
                <form onSubmit={handleAddMenuItem}>
                  <div className="mp-modal-body">
                    <div className="row g-3">

                      {/* Menu Name */}
                      <div className="col-md-6 mp-form-group">
                        <label className="mp-form-label">
                          <i className="bi bi-tag me-1"></i>
                          Menu Name *
                        </label>
                        <input
                          type="text"
                          className="mp-form-control form-control"
                          value={newMenuItem.name}
                          onChange={(e) => handleMenuInputChange('name', e.target.value)}
                          placeholder="e.g., User Management"
                          required
                        />
                      </div>

                      {/* Route Path */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-link me-1"></i>
                          Route Path *
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={newMenuItem.path}
                            onChange={(e) => handleMenuInputChange('path', e.target.value)}
                            placeholder="e.g., /users, ../admin/users, or # for parent menu"
                            required
                          />
                          <button
                            className="btn btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Path Templates
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li><h6 className="dropdown-header">Root Paths</h6></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '/')}>
                              <i className="bi bi-house me-2"></i>/ (Home/Root)
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '/dashboard')}>
                              <i className="bi bi-speedometer2 me-2"></i>/dashboard
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '#')}>
                              <i className="bi bi-folder me-2"></i># (Parent Menu - No Link)
                            </button></li>

                            <li><hr className="dropdown-divider" /></li>
                            <li><h6 className="dropdown-header">Admin Paths</h6></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '/admin')}>
                              <i className="bi bi-gear me-2"></i>/admin
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '/admin/users')}>
                              <i className="bi bi-people me-2"></i>/admin/users
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '/admin/settings')}>
                              <i className="bi bi-sliders me-2"></i>/admin/settings
                            </button></li>

                            <li><hr className="dropdown-divider" /></li>
                            <li><h6 className="dropdown-header">Relative Paths</h6></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '../')}>
                              <i className="bi bi-arrow-left me-2"></i>../ (Go Back One Level)
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '../../')}>
                              <i className="bi bi-arrow-left me-2"></i>../../ (Go Back Two Levels)
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', './subfolder')}>
                              <i className="bi bi-arrow-right me-2"></i>./subfolder (Current Level)
                            </button></li>

                            <li><hr className="dropdown-divider" /></li>
                            <li><h6 className="dropdown-header">Common Modules</h6></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '/reports')}>
                              <i className="bi bi-file-earmark-text me-2"></i>/reports
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '/analytics')}>
                              <i className="bi bi-graph-up me-2"></i>/analytics
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '/profile')}>
                              <i className="bi bi-person-circle me-2"></i>/profile
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('path', '/settings')}>
                              <i className="bi bi-gear-fill me-2"></i>/settings
                            </button></li>
                          </ul>
                        </div>
                        <div className="mt-2">
                          <div className="row g-2">
                            <div className="col-md-6">
                              <small className="text-muted">
                                <strong>Path Examples:</strong><br/>
                                • <code>/users</code> - Absolute from root<br/>
                                • <code>../admin</code> - Back one level<br/>
                                • <code>../../dashboard</code> - Back two levels<br/>
                                • <code>#</code> - Parent menu (no link)
                              </small>
                            </div>
                            <div className="col-md-6">
                              <small className="text-muted">
                                <strong>Current Location:</strong><br/>
                                <code>{window.location.pathname}</code><br/>
                                <strong>Preview:</strong><br/>
                                <code className="text-primary">{resolvePathPreview(newMenuItem.path)}</code>
                              </small>
                            </div>
                          </div>

                          {/* Path Builder Tools */}
                          <div className="mt-2">
                            <small className="text-muted">
                              <strong>Quick Path Builder:</strong>
                            </small>
                            <div className="btn-group btn-group-sm mt-1" role="group">
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleMenuInputChange('path', newMenuItem.path + '/')}
                                title="Add trailing slash"
                              >
                                <i className="bi bi-slash-lg"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleMenuInputChange('path', '../' + newMenuItem.path.replace(/^\.\.\//, ''))}
                                title="Add one level back"
                              >
                                <i className="bi bi-arrow-left"></i> ../
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleMenuInputChange('path', newMenuItem.path.replace(/^\//, ''))}
                                title="Make relative"
                              >
                                <i className="bi bi-link-45deg"></i> Rel
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleMenuInputChange('path', '/' + newMenuItem.path.replace(/^\//, ''))}
                                title="Make absolute"
                              >
                                <i className="bi bi-house"></i> Abs
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-palette me-1"></i>
                          Bootstrap Icon
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={newMenuItem.icon}
                            onChange={(e) => handleMenuInputChange('icon', e.target.value)}
                            placeholder="e.g., bi-people, bi-house"
                          />
                          <button
                            className="btn btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Common Icons
                          </button>
                          <ul className="dropdown-menu">
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('icon', 'bi-house')}>
                              <i className="bi bi-house me-2"></i>Home
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('icon', 'bi-people')}>
                              <i className="bi bi-people me-2"></i>Users
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('icon', 'bi-gear')}>
                              <i className="bi bi-gear me-2"></i>Settings
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('icon', 'bi-file-earmark-text')}>
                              <i className="bi bi-file-earmark-text me-2"></i>Reports
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('icon', 'bi-speedometer2')}>
                              <i className="bi bi-speedometer2 me-2"></i>Dashboard
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('icon', 'bi-shield-lock')}>
                              <i className="bi bi-shield-lock me-2"></i>Security
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('icon', 'bi-graph-up')}>
                              <i className="bi bi-graph-up me-2"></i>Analytics
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleMenuInputChange('icon', 'bi-chat-dots')}>
                              <i className="bi bi-chat-dots me-2"></i>Messages
                            </button></li>
                          </ul>
                        </div>
                        <small className="text-muted">
                          Visit <a href="https://icons.getbootstrap.com/" target="_blank" rel="noopener noreferrer">Bootstrap Icons</a> for more icons
                        </small>
                      </div>

                      {/* File Name */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-file-code me-1"></i>
                          Component File Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={newMenuItem.file_name}
                          onChange={(e) => handleMenuInputChange('file_name', e.target.value)}
                          placeholder="e.g., UserManagement.jsx"
                        />
                        <small className="text-muted">
                          React component file name (optional)
                        </small>
                      </div>

                      {/* Parent Menu */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-diagram-3 me-1"></i>
                          Parent Menu
                        </label>
                        <select
                          className="form-select"
                          value={newMenuItem.parent_id || ''}
                          onChange={(e) => handleMenuInputChange('parent_id', e.target.value ? parseInt(e.target.value) : null)}
                        >
                          <option value="">None (Root Menu)</option>
                          {permissionMatrix.menuItems
                            .filter(item => !item.parent_id) // Only show root menus as parent options
                            .map(item => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Sort Order */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-sort-numeric-up me-1"></i>
                          Sort Order
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={newMenuItem.sort_order}
                          onChange={(e) => handleMenuInputChange('sort_order', e.target.value)}
                          min="1"
                          placeholder="1"
                        />
                        <small className="text-muted">
                          Lower numbers appear first
                        </small>
                      </div>

                    </div>

                    {/* Existing Paths Reference */}
                    <div className="mt-3">
                      <h6>
                        <i className="bi bi-list-ul me-2"></i>
                        Existing Menu Paths (for reference):
                      </h6>
                      <div className="border rounded p-2 bg-light" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                        <div className="row g-1">
                          {permissionMatrix.menuItems
                            .filter(item => item.path && item.path !== '#')
                            .sort((a, b) => a.path.localeCompare(b.path))
                            .map(item => (
                              <div key={item.id} className="col-md-6">
                                <small className="d-flex align-items-center">
                                  <i className={`${item.icon} me-1`}></i>
                                  <code
                                    className="text-primary me-2"
                                    onClick={() => handleMenuInputChange('path', item.path)}
                                    title="Click to use this path"
                                    style={pathClickableStyle}
                                  >
                                    {item.path}
                                  </code>
                                  <span className="text-muted">({item.name})</span>
                                </small>
                              </div>
                            ))}
                        </div>
                        {permissionMatrix.menuItems.filter(item => item.path && item.path !== '#').length === 0 && (
                          <small className="text-muted">No existing paths found</small>
                        )}
                      </div>
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Click on any path above to use it as a template
                      </small>
                    </div>

                    {/* Enhanced Preview */}
                    <div className="mt-4">
                      <h6>
                        <i className="bi bi-eye me-2"></i>
                        Menu Preview:
                      </h6>
                      <div className="border rounded p-3 bg-light">
                        {/* Menu Item Preview */}
                        <div className="d-flex align-items-center mb-2">
                          {newMenuItem.icon && <i className={`${newMenuItem.icon} me-2 text-primary`}></i>}
                          <span className="fw-medium">{newMenuItem.name || 'Menu Name'}</span>
                          {newMenuItem.parent_id && (
                            <span className="badge bg-secondary ms-2">
                              Sub-menu of: {permissionMatrix.menuItems.find(item => item.id === newMenuItem.parent_id)?.name}
                            </span>
                          )}
                        </div>

                        {/* Path Information */}
                        <div className="row g-2 small">
                          <div className="col-md-6">
                            <strong>Original Path:</strong><br/>
                            <code className="text-primary">{newMenuItem.path || '/path'}</code>
                          </div>
                          <div className="col-md-6">
                            <strong>Resolved Path:</strong><br/>
                            <code className="text-success">{resolvePathPreview(newMenuItem.path)}</code>
                          </div>
                          <div className="col-12">
                            <strong>Path Type:</strong>
                            <span className="text-muted ms-1">{getPathTypeDescription(newMenuItem.path)}</span>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-2 pt-2 border-top">
                          <div className="row g-2 small text-muted">
                            <div className="col-md-4">
                              <strong>Sort Order:</strong> {newMenuItem.sort_order}
                            </div>
                            <div className="col-md-4">
                              <strong>Component:</strong> {newMenuItem.file_name || 'Not specified'}
                            </div>
                            <div className="col-md-4">
                              <strong>Type:</strong> {newMenuItem.parent_id ? 'Sub-menu' : 'Root menu'}
                            </div>
                          </div>
                        </div>

                        {/* Path Examples for Current Selection */}
                        {newMenuItem.path && newMenuItem.path.includes('../') && (
                          <div className="alert alert-info mt-2 mb-0">
                            <i className="bi bi-info-circle me-2"></i>
                            <strong>Relative Path Navigation:</strong><br/>
                            This path will navigate relative to the current location.
                            From <code>{window.location.pathname}</code>, this resolves to <code>{resolvePathPreview(newMenuItem.path)}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mp-modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetAddMenuForm}
                      disabled={addingMenu}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={addingMenu || !newMenuItem.name || !newMenuItem.path}
                    >
                      {addingMenu ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-circle me-2"></i>
                          Create Menu Item
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Menu Item Modal */}
        {showEditMenuForm && (
          <div className="mp-modal-overlay">
            <div className="mp-modal-dialog">
              <div className="mp-modal-content">
                <div className="mp-modal-header">
                  <h5 className="mp-modal-title">
                    <i className="bi bi-pencil-square me-2"></i>
                    Edit Menu Item: {editingMenu?.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={resetEditMenuForm}
                    disabled={updatingMenu}
                  ></button>
                </div>
                <form onSubmit={handleUpdateMenuItem}>
                  <div className="mp-modal-body">
                    <div className="row g-3">

                      {/* Menu Name */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-tag me-1"></i>
                          Menu Name *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editMenuItem.name}
                          onChange={(e) => handleEditMenuInputChange('name', e.target.value)}
                          placeholder="e.g., User Management"
                          required
                        />
                      </div>

                      {/* Route Path */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-link me-1"></i>
                          Route Path *
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={editMenuItem.path}
                            onChange={(e) => handleEditMenuInputChange('path', e.target.value)}
                            placeholder="e.g., /users, ../admin/users, or # for parent menu"
                            required
                          />
                          <button
                            className="btn btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Templates
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="dropdown-item" type="button" onClick={() => handleEditMenuInputChange('path', '/')}>
                              <i className="bi bi-house me-2"></i>/ (Root)
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleEditMenuInputChange('path', '#')}>
                              <i className="bi bi-folder me-2"></i># (Parent Menu)
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleEditMenuInputChange('path', '../')}>
                              <i className="bi bi-arrow-left me-2"></i>../ (Back One Level)
                            </button></li>
                          </ul>
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-palette me-1"></i>
                          Bootstrap Icon
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            value={editMenuItem.icon}
                            onChange={(e) => handleEditMenuInputChange('icon', e.target.value)}
                            placeholder="e.g., bi-people, bi-house"
                          />
                          <button
                            className="btn btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                          >
                            Icons
                          </button>
                          <ul className="dropdown-menu">
                            <li><button className="dropdown-item" type="button" onClick={() => handleEditMenuInputChange('icon', 'bi-house')}>
                              <i className="bi bi-house me-2"></i>Home
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleEditMenuInputChange('icon', 'bi-people')}>
                              <i className="bi bi-people me-2"></i>Users
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleEditMenuInputChange('icon', 'bi-gear')}>
                              <i className="bi bi-gear me-2"></i>Settings
                            </button></li>
                            <li><button className="dropdown-item" type="button" onClick={() => handleEditMenuInputChange('icon', 'bi-file-earmark-text')}>
                              <i className="bi bi-file-earmark-text me-2"></i>Reports
                            </button></li>
                          </ul>
                        </div>
                      </div>

                      {/* File Name */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-file-code me-1"></i>
                          Component File Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={editMenuItem.file_name}
                          onChange={(e) => handleEditMenuInputChange('file_name', e.target.value)}
                          placeholder="e.g., UserManagement.jsx"
                        />
                      </div>

                      {/* Parent Menu */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-diagram-3 me-1"></i>
                          Parent Menu
                        </label>
                        <select
                          className="form-select"
                          value={editMenuItem.parent_id || ''}
                          onChange={(e) => handleEditMenuInputChange('parent_id', e.target.value ? parseInt(e.target.value) : null)}
                        >
                          <option value="">None (Root Menu)</option>
                          {permissionMatrix.menuItems
                            .filter(item => !item.parent_id && item.id !== editMenuItem.id) // Exclude self and only show root menus
                            .map(item => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      {/* Sort Order */}
                      <div className="col-md-6">
                        <label className="form-label">
                          <i className="bi bi-sort-numeric-up me-1"></i>
                          Sort Order
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={editMenuItem.sort_order}
                          onChange={(e) => handleEditMenuInputChange('sort_order', e.target.value)}
                          min="1"
                          placeholder="1"
                        />
                      </div>

                      {/* Active Status */}
                      <div className="col-md-12">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="editMenuActive"
                            checked={editMenuItem.is_active}
                            onChange={(e) => handleEditMenuInputChange('is_active', e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="editMenuActive">
                            <i className="bi bi-toggle-on me-1"></i>
                            Menu Item is Active
                          </label>
                          <small className="text-muted d-block">
                            Inactive menu items will not appear in the navigation
                          </small>
                        </div>
                      </div>

                    </div>

                    {/* Enhanced Preview for Edit */}
                    <div className="mt-4">
                      <h6>
                        <i className="bi bi-eye me-2"></i>
                        Updated Preview:
                      </h6>
                      <div className="border rounded p-3 bg-light">
                        <div className="d-flex align-items-center mb-2">
                          {editMenuItem.icon && <i className={`${editMenuItem.icon} me-2 text-primary`}></i>}
                          <span className="fw-medium">{editMenuItem.name || 'Menu Name'}</span>
                          {editMenuItem.parent_id && (
                            <span className="badge bg-secondary ms-2">
                              Sub-menu of: {permissionMatrix.menuItems.find(item => item.id === editMenuItem.parent_id)?.name}
                            </span>
                          )}
                          <span className={`badge ms-2 ${editMenuItem.is_active ? 'bg-success' : 'bg-danger'}`}>
                            {editMenuItem.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>

                        <div className="row g-2 small">
                          <div className="col-md-6">
                            <strong>Path:</strong><br/>
                            <code className="text-primary">{editMenuItem.path || '/path'}</code>
                          </div>
                          <div className="col-md-6">
                            <strong>Resolved Path:</strong><br/>
                            <code className="text-success">{resolvePathPreview(editMenuItem.path)}</code>
                          </div>
                          <div className="col-md-4">
                            <strong>Sort Order:</strong> {editMenuItem.sort_order}
                          </div>
                          <div className="col-md-4">
                            <strong>Component:</strong> {editMenuItem.file_name || 'Not specified'}
                          </div>
                          <div className="col-md-4">
                            <strong>Type:</strong> {editMenuItem.parent_id ? 'Sub-menu' : 'Root menu'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mp-modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetEditMenuForm}
                      disabled={updatingMenu}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updatingMenu || !editMenuItem.name || !editMenuItem.path}
                    >
                      {updatingMenu ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Update Menu Item
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-content">
          {/* Tab Content */}
          {activeTab === 'permissions' && (
            <div className="row g-4">
            
            {/* Role Selection */}
            <div className="col-lg-3">
              <div className="mp-professional-table">
                <div className="mp-card-body">
                  <h6 className="mp-card-title">
                    <i className="bi bi-people-fill me-2"></i>
                    Select Role
                    <span className="badge bg-primary ms-2">{permissionMatrix.roles.length}</span>
                  </h6>

                  {permissionMatrix.roles.length === 0 ? (
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      No roles found. Please contact your administrator.
                    </div>
                  ) : (
                    <div className="mp-role-list">
                      {permissionMatrix.roles.map(role => (
                        <button
                          key={role.role_id}
                          className={`mp-role-item ${selectedRole === role.role_id ? 'mp-active' : ''}`}
                          onClick={() => setSelectedRole(role.role_id)}
                        >
                          <i className="bi bi-person-badge me-2"></i>
                          <div className="flex-grow-1">
                            <div className="fw-medium">{role.role_name}</div>
                            <small className="text-muted">Role ID: {role.role_id}</small>
                          </div>
                          {selectedRole === role.role_id && (
                            <i className="bi bi-check-circle-fill text-success"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Role Management Actions */}
                  <div className="mt-3 d-grid gap-2">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={fetchPermissionMatrix}
                      disabled={loading}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Refresh Roles
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions Matrix */}
            <div className="col-lg-9">
              <div className="mp-professional-table">
                <div className="mp-card-body">
                  <h6 className="mp-card-title">
                    <i className="bi bi-shield-lock me-2"></i>
                    Menu Permissions for {permissionMatrix.roles.find(r => r.role_id === selectedRole)?.role_name}
                  </h6>

                  {selectedRole && (
                    <>
                      {/* Search Controls for Permissions */}
                      <div className="card mb-3">
                        <div className="card-body p-3">
                          <div className="row g-3">
                            {/* Search Input */}
                            <div className="col-md-8">
                              <div className="input-group">
                                <span className="input-group-text">
                                  <i className="bi bi-search"></i>
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search menu permissions by name, path, or file..."
                                  value={permissionsSearchTerm}
                                  onChange={(e) => setPermissionsSearchTerm(e.target.value)}
                                />
                                {permissionsSearchTerm && (
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setPermissionsSearchTerm('')}
                                    title="Clear search"
                                  >
                                    <i className="bi bi-x"></i>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Permission Filter Buttons */}
                            <div className="col-md-4">
                              <div className="d-flex gap-1 flex-wrap">
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => {
                                    // Filter to show only items with view permission
                                    const itemsWithView = permissionMatrix.menuItems.filter(item => {
                                      const permission = permissionMatrix.permissions.find(p =>
                                        p.role_id === selectedRole && p.menu_item_id === item.id
                                      );
                                      return permission?.can_view;
                                    });
                                    console.log('Items with view permission:', itemsWithView);
                                  }}
                                  title="Show items with view permission"
                                >
                                  <i className="bi bi-eye me-1"></i>
                                  View
                                </button>
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => {
                                    // Filter to show only items with edit permission
                                    const itemsWithEdit = permissionMatrix.menuItems.filter(item => {
                                      const permission = permissionMatrix.permissions.find(p =>
                                        p.role_id === selectedRole && p.menu_item_id === item.id
                                      );
                                      return permission?.can_edit;
                                    });
                                    console.log('Items with edit permission:', itemsWithEdit);
                                  }}
                                  title="Show items with edit permission"
                                >
                                  <i className="bi bi-pencil me-1"></i>
                                  Edit
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => {
                                    // Filter to show only items with delete permission
                                    const itemsWithDelete = permissionMatrix.menuItems.filter(item => {
                                      const permission = permissionMatrix.permissions.find(p =>
                                        p.role_id === selectedRole && p.menu_item_id === item.id
                                      );
                                      return permission?.can_delete;
                                    });
                                    console.log('Items with delete permission:', itemsWithDelete);
                                  }}
                                  title="Show items with delete permission"
                                >
                                  <i className="bi bi-trash me-1"></i>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Search Results Summary */}
                          {permissionsSearchTerm && (
                            <div className="mt-2">
                              <small className="text-muted">
                                <i className="bi bi-funnel me-1"></i>
                                Showing {getFilteredPermissionsItems().length} of {permissionMatrix.menuItems.length} menu items
                                matching "{permissionsSearchTerm}"
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedRole && (
                    <div className="table-responsive">
                      <table className="mp-permission-table table table-striped">
                        <thead>
                          <tr>
                            <th>Menu Item</th>
                            <th>View</th>
                            <th>Create</th>
                            <th>Edit</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredPermissionsItems().map(menuItem => (
                            <tr key={menuItem.id}>
                              <td>
                                <div className="mp-menu-item">
                                  <i className={`${menuItem.icon} mp-menu-icon`}></i>
                                  <div className="mp-menu-details">
                                    <div className="mp-menu-name">{menuItem.name}</div>
                                    <small className="mp-menu-meta mp-text-muted">
                                      {menuItem.path}
                                      {menuItem.parent_id && ' • Sub-menu'}
                                      {menuItem.file_name && ` • ${menuItem.file_name}`}
                                    </small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {renderPermissionCheckbox(menuItem, 'can_view', 'View')}
                              </td>
                              <td>
                                {renderPermissionCheckbox(menuItem, 'can_create', 'Create')}
                              </td>
                              <td>
                                {renderPermissionCheckbox(menuItem, 'can_edit', 'Edit')}
                              </td>
                              <td>
                                {renderPermissionCheckbox(menuItem, 'can_delete', 'Delete')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Roles Summary */}
            <div className="col-12">
              <div className="mp-info-card mb-4">
                <div className="mp-card-body">
                  <h6 className="mp-card-title">
                    <i className="bi bi-people-fill me-2"></i>
                    All Roles Summary
                  </h6>
                  <div className="row">
                    {permissionMatrix.roles.map(role => {
                      const rolePermissions = permissionMatrix.permissions.find(p => p.role_id === role.role_id);
                      const totalMenuItems = permissionMatrix.menuItems.length;
                      const accessibleItems = rolePermissions ? rolePermissions.menuPermissions.filter(p => p.can_view === 1).length : 0;

                      return (
                        <div key={role.role_id} className="col-md-4 mb-3">
                          <div className={`card h-100 ${selectedRole === role.role_id ? 'border-primary' : ''}`}>
                            <div className="card-body">
                              <h6 className="card-title d-flex align-items-center">
                                <i className="bi bi-person-badge me-2"></i>
                                {role.role_name}
                                {selectedRole === role.role_id && (
                                  <span className="badge bg-primary ms-2">Selected</span>
                                )}
                              </h6>
                              <p className="card-text">
                                <small className="text-muted">Role ID: {role.role_id}</small>
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted">Menu Access:</span>
                                <span className="fw-bold">{accessibleItems}/{totalMenuItems}</span>
                              </div>
                              <div className="progress mt-2" style={{ height: '4px' }}>
                                <div
                                  className="progress-bar"
                                  style={{ width: `${totalMenuItems > 0 ? (accessibleItems / totalMenuItems) * 100 : 0}%` }}
                                ></div>
                              </div>
                              <button
                                className={`btn btn-sm mt-2 w-100 ${selectedRole === role.role_id ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setSelectedRole(role.role_id)}
                              >
                                {selectedRole === role.role_id ? 'Currently Selected' : 'Select Role'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Permission Guidelines */}
            <div className="col-12">
              <div className="mp-info-card">
                <div className="mp-card-body">
                  <h6 className="mp-card-title">
                    <i className="bi bi-info-circle me-2"></i>
                    Permission Guidelines
                  </h6>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="permission-guide">
                        <strong>View:</strong>
                        <p className="small text-muted">Allows access to view the menu item and its content.</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="permission-guide">
                        <strong>Create:</strong>
                        <p className="small text-muted">Allows creating new records or content in this section.</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="permission-guide">
                        <strong>Edit:</strong>
                        <p className="small text-muted">Allows modifying existing records or content.</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="permission-guide">
                        <strong>Delete:</strong>
                        <p className="small text-muted">Allows removing records or content permanently.</p>
                      </div>
                    </div>
                  </div>
                  <div className="alert alert-info mt-3">
                    <i className="bi bi-lightbulb me-2"></i>
                    <strong>Note:</strong> View permission must be enabled to access other permissions. 
                    Changes take effect immediately after saving and may require users to refresh their browser.
                  </div>
                </div>
              </div>
            </div>

          </div>
          )}

          {/* Menu Management Tab */}
          {activeTab === 'menu-management' && (
            <div className="row g-4">
              <div className="col-12">
                <div className="mp-professional-table">
                  <div className="mp-card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="card-title mb-0">
                        <i className="bi bi-list-ul me-2"></i>
                        Menu Items Management
                      </h5>
                      <button
                        className="btn btn-success"
                        onClick={() => setShowAddMenuForm(true)}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Menu
                      </button>
                    </div>

                    {/* Search and Filter Controls for Menu List */}
                    <div className="card mb-3">
                      <div className="card-body p-3">
                        <div className="row g-3">
                          {/* Search Input */}
                          <div className="col-md-8">
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="bi bi-search"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search menu items by name, path, file, or icon..."
                                value={menuListSearchTerm}
                                onChange={(e) => setMenuListSearchTerm(e.target.value)}
                              />
                              {menuListSearchTerm && (
                                <button
                                  className="btn btn-outline-secondary"
                                  type="button"
                                  onClick={() => setMenuListSearchTerm('')}
                                  title="Clear search"
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Quick Filter Buttons */}
                          <div className="col-md-4">
                            <div className="d-flex gap-2 flex-wrap">
                              <button
                                className={`btn btn-sm ${searchFilters.parentFilter === 'root' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setSearchFilters(prev => ({
                                  ...prev,
                                  parentFilter: prev.parentFilter === 'root' ? 'all' : 'root'
                                }))}
                              >
                                <i className="bi bi-diagram-3 me-1"></i>
                                Root Items
                              </button>
                              <button
                                className={`btn btn-sm ${searchFilters.parentFilter === 'child' ? 'btn-info' : 'btn-outline-info'}`}
                                onClick={() => setSearchFilters(prev => ({
                                  ...prev,
                                  parentFilter: prev.parentFilter === 'child' ? 'all' : 'child'
                                }))}
                              >
                                <i className="bi bi-arrow-return-right me-1"></i>
                                Child Items
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Search Results Summary */}
                        {(menuListSearchTerm || searchFilters.parentFilter !== 'all') && (
                          <div className="mt-2">
                            <small className="text-muted">
                              <i className="bi bi-funnel me-1"></i>
                              Showing {getFilteredMenuListItems().length} of {permissionMatrix.menuItems.length} menu items
                              {menuListSearchTerm && ` matching "${menuListSearchTerm}"`}
                            </small>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Menu Item</th>
                            <th>Path</th>
                            <th>Parent</th>
                            <th>Order</th>
                            <th>File</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getFilteredMenuListItems().map(menuItem => (
                            <tr key={menuItem.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <i className={`${menuItem.icon} me-2`}></i>
                                  <div>
                                    <div className="fw-medium">{menuItem.name}</div>
                                    <small className="text-muted">ID: {menuItem.id}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <code className="text-primary">{menuItem.path}</code>
                              </td>
                              <td>
                                {menuItem.parent_id ? (
                                  <span className="badge bg-secondary">
                                    {permissionMatrix.menuItems.find(p => p.id === menuItem.parent_id)?.name || 'Unknown'}
                                  </span>
                                ) : (
                                  <span className="badge bg-primary">Root</span>
                                )}
                              </td>
                              <td>
                                <span className="badge bg-info">{menuItem.sort_order}</span>
                              </td>
                              <td>
                                {menuItem.file_name ? (
                                  <code className="text-success">{menuItem.file_name}</code>
                                ) : (
                                  <span className="text-muted">-</span>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${menuItem.is_active ? 'bg-success' : 'bg-danger'}`}>
                                  {menuItem.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-primary"
                                    title="Edit Menu Item"
                                    onClick={() => handleEditMenu(menuItem)}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button className="btn btn-outline-danger" title="Delete">
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Roles Overview Tab */}
          {activeTab === 'roles-overview' && (
            <div className="row g-4">
              {permissionMatrix.roles.map(role => {
                const rolePermissions = permissionMatrix.permissions.find(p => p.role_id === role.role_id);
                const totalMenuItems = permissionMatrix.menuItems.length;
                const accessibleItems = rolePermissions ? rolePermissions.menuPermissions.filter(p => p.can_view === 1).length : 0;
                const createPermissions = rolePermissions ? rolePermissions.menuPermissions.filter(p => p.can_create === 1).length : 0;
                const editPermissions = rolePermissions ? rolePermissions.menuPermissions.filter(p => p.can_edit === 1).length : 0;
                const deletePermissions = rolePermissions ? rolePermissions.menuPermissions.filter(p => p.can_delete === 1).length : 0;

                return (
                  <div key={role.role_id} className="col-lg-4">
                    <div className="mp-professional-table h-100">
                      <div className="mp-card-body">
                        <div className="d-flex align-items-center mb-3">
                          <i className="bi bi-person-badge fs-3 text-primary me-3"></i>
                          <div>
                            <h5 className="card-title mb-1">{role.role_name}</h5>
                            <small className="text-muted">Role ID: {role.role_id}</small>
                          </div>
                        </div>

                        <div className="row g-3">
                          <div className="col-6">
                            <div className="text-center">
                              <div className="fs-4 fw-bold text-primary">{accessibleItems}</div>
                              <small className="text-muted">View Access</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center">
                              <div className="fs-4 fw-bold text-success">{createPermissions}</div>
                              <small className="text-muted">Create Access</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center">
                              <div className="fs-4 fw-bold text-warning">{editPermissions}</div>
                              <small className="text-muted">Edit Access</small>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="text-center">
                              <div className="fs-4 fw-bold text-danger">{deletePermissions}</div>
                              <small className="text-muted">Delete Access</small>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted">Overall Access:</span>
                            <span className="fw-bold">{accessibleItems}/{totalMenuItems}</span>
                          </div>
                          <div className="progress" style={{ height: '8px' }}>
                            <div
                              className="progress-bar bg-primary"
                              style={{ width: `${totalMenuItems > 0 ? (accessibleItems / totalMenuItems) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="mt-3 d-grid gap-2">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              setSelectedRole(role.role_id);
                              setActiveTab('permissions');
                            }}
                          >
                            <i className="bi bi-gear me-2"></i>
                            Manage Permissions
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setActiveTab('menu-management')}
                          >
                            <i className="bi bi-list-ul me-2"></i>
                            View All Menus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Menu Structure Tab */}
          {activeTab === 'menu-tree' && (
            <div className="row g-4">
              <div className="col-12">
                <div className="mp-professional-table">
                  <div className="mp-card-body">
                    <h5 className="mp-card-title mb-4">
                      <i className="bi bi-diagram-3 me-2"></i>
                      Menu Hierarchical Structure
                    </h5>

                    <div className="mp-tree-container">
                      {/* Header with Search and Controls */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0">Menu Hierarchy</h6>
                        <div className="btn-group">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              console.log('🔄 Manual refresh triggered');
                              forceRefreshHierarchy();
                            }}
                            disabled={loading}
                          >
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            {loading ? 'Refreshing...' : 'Refresh'}
                          </button>
                          {process.env.NODE_ENV === 'development' && (
                            <button
                              className="btn btn-outline-info btn-sm"
                              onClick={() => {
                                console.log('🔍 Debug: Current menu items:', permissionMatrix.menuItems);
                                console.log('🔍 Debug: Root items:', permissionMatrix.menuItems.filter(item => !item.parent_id));
                                console.log('🔍 Debug: Child items:', permissionMatrix.menuItems.filter(item => item.parent_id));
                                if (editingMenu) {
                                  debugMenuVisibility(editingMenu.id);
                                }
                              }}
                              title="Debug Menu Visibility"
                            >
                              <i className="bi bi-bug"></i>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Search and Filter Controls */}
                      <div className="card mb-3">
                        <div className="card-body p-3">
                          <div className="row g-3">
                            {/* Search Input */}
                            <div className="col-md-6">
                              <div className="input-group">
                                <span className="input-group-text">
                                  <i className="bi bi-search"></i>
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search menus by name, path, file, or icon..."
                                  value={hierarchySearchTerm}
                                  onChange={(e) => setHierarchySearchTerm(e.target.value)}
                                />
                                {hierarchySearchTerm && (
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={() => setHierarchySearchTerm('')}
                                    title="Clear search"
                                  >
                                    <i className="bi bi-x"></i>
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Filter Controls */}
                            <div className="col-md-6">
                              <div className="d-flex gap-2 flex-wrap">
                                {/* Status Filter */}
                                <div className="btn-group" role="group">
                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name="statusFilter"
                                    id="statusAll"
                                    checked={!searchFilters.showActiveOnly && !searchFilters.showInactiveOnly}
                                    onChange={() => setSearchFilters(prev => ({
                                      ...prev,
                                      showActiveOnly: false,
                                      showInactiveOnly: false
                                    }))}
                                  />
                                  <label className="btn btn-outline-secondary btn-sm" htmlFor="statusAll">
                                    All
                                  </label>

                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name="statusFilter"
                                    id="statusActive"
                                    checked={searchFilters.showActiveOnly}
                                    onChange={() => setSearchFilters(prev => ({
                                      ...prev,
                                      showActiveOnly: true,
                                      showInactiveOnly: false
                                    }))}
                                  />
                                  <label className="btn btn-outline-success btn-sm" htmlFor="statusActive">
                                    Active
                                  </label>

                                  <input
                                    type="radio"
                                    className="btn-check"
                                    name="statusFilter"
                                    id="statusInactive"
                                    checked={searchFilters.showInactiveOnly}
                                    onChange={() => setSearchFilters(prev => ({
                                      ...prev,
                                      showActiveOnly: false,
                                      showInactiveOnly: true
                                    }))}
                                  />
                                  <label className="btn btn-outline-danger btn-sm" htmlFor="statusInactive">
                                    Inactive
                                  </label>
                                </div>

                                {/* Parent Filter */}
                                <select
                                  className="form-select form-select-sm"
                                  style={{ width: 'auto' }}
                                  value={searchFilters.parentFilter}
                                  onChange={(e) => setSearchFilters(prev => ({
                                    ...prev,
                                    parentFilter: e.target.value
                                  }))}
                                >
                                  <option value="all">All Items</option>
                                  <option value="root">Root Only</option>
                                  <option value="child">Children Only</option>
                                </select>

                                {/* Clear Filters */}
                                {(hierarchySearchTerm || searchFilters.showActiveOnly || searchFilters.showInactiveOnly || searchFilters.parentFilter !== 'all') && (
                                  <button
                                    className="btn btn-outline-warning btn-sm"
                                    onClick={clearAllSearchFilters}
                                    title="Clear all filters"
                                  >
                                    <i className="bi bi-funnel-fill me-1"></i>
                                    Clear
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Search Results Summary */}
                          {(hierarchySearchTerm || searchFilters.showActiveOnly || searchFilters.showInactiveOnly || searchFilters.parentFilter !== 'all') && (
                            <div className="mt-2">
                              <small className="text-muted">
                                <i className="bi bi-funnel me-1"></i>
                                Showing {getFilteredHierarchyItems().length} of {permissionMatrix.menuItems.length} menu items
                                {hierarchySearchTerm && ` matching "${hierarchySearchTerm}"`}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Debug info */}
                      <div className="alert alert-info mb-3">
                        <div className="row">
                          <div className="col-md-8">
                            <small>
                              <strong>Status:</strong> Total menu items: {permissionMatrix.menuItems.length} |
                              Root items: {permissionMatrix.menuItems.filter(item => !item.parent_id).length} |
                              Child items: {permissionMatrix.menuItems.filter(item => item.parent_id).length}
                            </small>
                          </div>
                          <div className="col-md-4 text-end">
                            <small className="text-muted">
                              Last updated: {new Date().toLocaleTimeString()}
                            </small>
                          </div>
                        </div>
                        {editingMenu && (
                          <div className="mt-2">
                            <small className="text-warning">
                              <i className="bi bi-pencil me-1"></i>
                              Currently editing: <strong>{editingMenu.name}</strong>
                            </small>
                          </div>
                        )}
                      </div>

                      {(() => {
                        const filteredItems = getFilteredHierarchyItems();
                        const rootItems = filteredItems
                          .filter(item => !item.parent_id)
                          .sort((a, b) => a.sort_order - b.sort_order);

                        // If searching, show all matching items in a flat list
                        if (hierarchySearchTerm.trim()) {
                          return filteredItems
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map(item => (
                              <div key={`search-${item.id}-${item.name}`} className="mp-tree-item">
                                <div className={`mp-tree-${item.parent_id ? 'child' : 'root'}`}>
                                  {item.parent_id && <i className="bi bi-arrow-return-right me-2 text-muted"></i>}
                                  <i className={`${item.icon} me-2 ${item.parent_id ? 'text-secondary' : 'text-primary'}`}></i>
                                  <div className="flex-grow-1">
                                    <div className={item.parent_id ? '' : 'fw-bold'}>{item.name}</div>
                                    <small className="text-muted">
                                      {item.path} • Order: {item.sort_order}
                                      {item.file_name && ` • ${item.file_name}`}
                                      {item.parent_id && (
                                        <span className="text-info">
                                          {' • Child of: '}
                                          {permissionMatrix.menuItems.find(p => p.id === item.parent_id)?.name || 'Unknown'}
                                        </span>
                                      )}
                                    </small>
                                  </div>
                                  <span className={`badge ${item.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                                    {item.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => {
                                      console.log('🖊️ Editing search result item:', item);
                                      handleEditMenu(item);
                                    }}
                                    title="Edit Menu Item"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                </div>
                              </div>
                            ));
                        }

                        // Normal hierarchical view
                        return rootItems.map(rootItem => {
                          const childItems = filteredItems
                            .filter(item => item.parent_id === rootItem.id)
                            .sort((a, b) => a.sort_order - b.sort_order);

                          return (
                            <div key={`root-${rootItem.id}-${rootItem.name}`} className="mp-tree-item">
                              <div className="mp-tree-root">
                                <i className={`${rootItem.icon} me-2 text-primary`}></i>
                                <div className="flex-grow-1">
                                  <div className="fw-bold">{rootItem.name}</div>
                                  <small className="text-muted">
                                    {rootItem.path} • Order: {rootItem.sort_order}
                                    {rootItem.file_name && ` • ${rootItem.file_name}`}
                                  </small>
                                </div>
                                <span className={`badge ${rootItem.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                                  {rootItem.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <button
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => {
                                    console.log('🖊️ Editing root item:', rootItem);
                                    console.log('🔍 Before edit - Total items:', permissionMatrix.menuItems.length);
                                    handleEditMenu(rootItem);
                                  }}
                                  title="Edit Menu Item"
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>
                              </div>

                              {/* Child Items */}
                              <div className="mp-tree-children">
                                {childItems.map(childItem => (
                                  <div key={`child-${childItem.id}-${childItem.name}-${childItem.parent_id}`} className="mp-tree-child">
                                    <i className="bi bi-arrow-return-right me-2 text-muted"></i>
                                    <i className={`${childItem.icon} me-2 text-secondary`}></i>
                                    <div className="flex-grow-1">
                                      <div>{childItem.name}</div>
                                      <small className="text-muted">
                                        {childItem.path} • Order: {childItem.sort_order}
                                        {childItem.file_name && ` • ${childItem.file_name}`}
                                      </small>
                                    </div>
                                    <span className={`badge ${childItem.is_active ? 'bg-success' : 'bg-danger'} me-2`}>
                                      {childItem.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <button
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => {
                                        console.log('🖊️ Editing child item:', childItem);
                                        console.log('🔍 Before edit - Total items:', permissionMatrix.menuItems.length);
                                        console.log('🔍 Before edit - Parent exists:', permissionMatrix.menuItems.some(item => item.id === childItem.parent_id));
                                        handleEditMenu(childItem);
                                      }}
                                      title="Edit Menu Item"
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        });
                      })()}

                      {/* Show orphaned items (items with parent_id that doesn't exist) */}
                      {(() => {
                        const orphanedItems = permissionMatrix.menuItems.filter(item =>
                          item.parent_id && !permissionMatrix.menuItems.some(parent => parent.id === item.parent_id)
                        );

                        if (orphanedItems.length > 0) {
                          return (
                            <div className="mt-3">
                              <div className="alert alert-warning">
                                <h6 className="alert-heading">
                                  <i className="bi bi-exclamation-triangle me-2"></i>
                                  Orphaned Menu Items
                                </h6>
                                <p className="mb-2">The following items have invalid parent references:</p>
                                {orphanedItems.map(item => (
                                  <div key={item.id} className="d-flex align-items-center justify-content-between mb-2">
                                    <div>
                                      <strong>{item.name}</strong> (Parent ID: {item.parent_id})
                                    </div>
                                    <button
                                      className="btn btn-outline-primary btn-sm"
                                      onClick={() => handleEditMenu(item)}
                                      title="Fix this menu item"
                                    >
                                      <i className="bi bi-pencil"></i> Fix
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mp-professional-table">
                  <div className="mp-card-body">
                    <h6 className="mp-card-title">
                      <i className="bi bi-database me-2"></i>
                      System Statistics
                    </h6>
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="mp-stats-card">
                          <div className="mp-stats-number mp-text-primary">{permissionMatrix.menuItems.length}</div>
                          <div className="mp-stats-label">Total Menus</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mp-stats-card">
                          <div className="mp-stats-number mp-text-success">{permissionMatrix.roles.length}</div>
                          <div className="mp-stats-label">Total Roles</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mp-stats-card">
                          <div className="mp-stats-number text-info">
                            {permissionMatrix.menuItems.filter(item => !item.parent_id).length}
                          </div>
                          <div className="mp-stats-label">Root Menus</div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="mp-stats-card">
                          <div className="mp-stats-number text-warning">
                            {permissionMatrix.menuItems.filter(item => item.parent_id).length}
                          </div>
                          <div className="mp-stats-label">Sub Menus</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mp-professional-table">
                  <div className="mp-card-body">
                    <h6 className="mp-card-title">
                      <i className="bi bi-tools me-2"></i>
                      Quick Actions
                    </h6>
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-outline-primary"
                        onClick={fetchPermissionMatrix}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh All Data
                      </button>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => setShowAddMenuForm(true)}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add New Menu Item
                      </button>
                      <button
                        className="btn btn-outline-info"
                        onClick={() => setActiveTab('menu-tree')}
                      >
                        <i className="bi bi-diagram-3 me-2"></i>
                        View Menu Structure
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="mp-info-card">
                  <div className="mp-card-body">
                    <h6 className="mp-card-title">
                      <i className="bi bi-info-circle me-2"></i>
                      System Information
                    </h6>
                    <div className="row">
                      <div className="col-md-3">
                        <strong>Menu Permission System</strong>
                        <p className="small text-muted">
                          Manage role-based access control for menu items. Control who can view, create, edit, and delete content.
                        </p>
                      </div>
                      <div className="col-md-3">
                        <strong>Hierarchical Menus</strong>
                        <p className="small text-muted">
                          Support for parent-child menu relationships with unlimited nesting levels and custom sorting.
                        </p>
                      </div>
                      <div className="col-md-3">
                        <strong>Dynamic Routing</strong>
                        <p className="small text-muted">
                          Flexible path configuration supporting absolute, relative, and custom routing patterns.
                        </p>
                      </div>
                      <div className="col-md-3">
                        <strong>Sidebar Integration</strong>
                        <p className="small text-muted">
                          Real-time layout adaptation based on sidebar state. Current state:
                          <span className={`badge ms-1 ${sidebarState.isCollapsed ? 'bg-warning' : 'bg-info'}`}>
                            {sidebarState.isCollapsed ? 'Collapsed' : 'Expanded'}
                          </span>
                        </p>
                        <div className="mt-2">
                          <small className="text-muted">
                            <strong>Sidebar Width:</strong> {sidebarState.sidebarWidth}px<br/>
                            <strong>Content Margin:</strong> {sidebarState.mainContentMargin}px<br/>
                            <strong>Screen Width:</strong> {window.innerWidth}px
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default MenuPermissions;
