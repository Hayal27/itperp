import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../components/Auths/AuthContex';

export const useMenuPermissions = () => {
  const [menuPermissions, setMenuPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useAuth();

  useEffect(() => {
    const fetchMenuPermissions = async () => {
      try {
        if (state.user && state.role_id && state.isAuthenticated) {
          console.log('🔐 MenuPermissions: Fetching permissions for role:', state.role_id);
          setLoading(true);
          setError(null);
          
          const response = await axios.get(
            `http://localhost:5000/api/menu-permissions/user-permissions/${state.role_id}`
          );
          
          if (response.data && response.data.success) {
            console.log('✅ MenuPermissions: Permissions loaded:', response.data.data);
            setMenuPermissions(response.data.data);
          } else {
            console.error('❌ MenuPermissions: Failed to load permissions');
            setError('Failed to load menu permissions');
          }
        } else {
          console.warn('⚠️ MenuPermissions: User not authenticated or missing role_id');
          setMenuPermissions([]);
        }
      } catch (err) {
        console.error('💥 MenuPermissions: Error fetching permissions:', err);
        setError('Error fetching menu permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuPermissions();
  }, [state.user, state.role_id, state.isAuthenticated]);

  // Helper: determine if a menu path matches a route path
  const pathMatches = (menuPath, routePath) => {
    if (!menuPath || !routePath) return false;

    // Normalize: remove trailing slashes
    const normalize = (p) => p.replace(/\/$/, '');
    const m = normalize(menuPath);
    const r = normalize(routePath);

    // Exact match
    if (m === r) return true;

    // If menuPath contains params (e.g. :planId), try regex match and also prefix match
    if (m.includes(':')) {
      // Build a regex where ":param" becomes "[^/]+"
      const escaped = m.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regexString = '^' + escaped.replace(/\\:\w+/g, '[^/]+') + '$';
      try {
        const re = new RegExp(regexString);
        if (re.test(r)) return true;
      } catch (e) {
        // ignore regex errors
      }

      // Also allow matching when the route omits the param entirely, e.g. menu '/a/:id' matches route '/a'
      const prefix = m.replace(/\/:[^/]+/g, '');
      if (r === prefix || r.startsWith(prefix + '/')) return true;
    }

    // If menuPath is a placeholder like '#' or './' treat it as non-routable
    if (m === '#' || m === './') return false;

    // Prefix match: allow menu paths that are prefixes of the route (useful for nested routes)
    if (m !== '' && r.startsWith(m)) return true;

    return false;
  };

  // Helper function to check if user has permission to view a specific path
  const hasViewPermission = (path) => {
    if (!menuPermissions || menuPermissions.length === 0) {
      console.log('🔍 MenuPermissions: No permissions loaded yet for path:', path);
      return false;
    }

    // Recursive function to check permissions in nested menu structure
    const checkPermissionInItems = (items) => {
      for (const item of items) {
        // Use flexible path matching
        if (pathMatches(item.path, path) && item.permissions && item.permissions.can_view === 1) {
          console.log('✅ MenuPermissions: View permission granted for path:', path, 'matched menuPath:', item.path);
          return true;
        }
        
        // Check children if they exist
        if (item.children && item.children.length > 0) {
          if (checkPermissionInItems(item.children)) {
            return true;
          }
        }
      }
      return false;
    };

    const hasPermission = checkPermissionInItems(menuPermissions);
    
    if (!hasPermission) {
      console.log('❌ MenuPermissions: View permission denied for path:', path);
    }
    
    return hasPermission;
  };

  // Helper function to get all accessible paths
  const getAccessiblePaths = () => {
    const paths = [];
    
    const extractPaths = (items) => {
      items.forEach(item => {
        if (item.permissions && item.permissions.can_view === 1 && item.path !== '#') {
          paths.push(item.path);
        }
        if (item.children && item.children.length > 0) {
          extractPaths(item.children);
        }
      });
    };

    extractPaths(menuPermissions);
    return paths;
  };

  // Helper function to check specific permission types
  const hasPermission = (path, permissionType = 'can_view') => {
    const checkPermissionInItems = (items) => {
      for (const item of items) {
        if (pathMatches(item.path, path) && item.permissions && item.permissions[permissionType] === 1) {
          return true;
        }
        if (item.children && item.children.length > 0) {
          if (checkPermissionInItems(item.children)) {
            return true;
          }
        }
      }
      return false;
    };

    return checkPermissionInItems(menuPermissions);
  };

  return {
    menuPermissions,
    loading,
    error,
    hasViewPermission,
    hasPermission,
    getAccessiblePaths
  };
};
