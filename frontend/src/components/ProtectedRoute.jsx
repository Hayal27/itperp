import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useMenuPermissions } from '../hooks/useMenuPermissions';
import { useAuth } from './Auths/AuthContex';

const ProtectedRoute = ({ children, path }) => {
  const { hasViewPermission, loading, error } = useMenuPermissions();
  const { state } = useAuth();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!state.isAuthenticated) {
    console.log('🔒 ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If permissions are still loading, show loading state
  if (loading) {
    console.log('⏳ ProtectedRoute: Loading permissions for path:', path || location.pathname);
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // If there's an error loading permissions, show error
  if (error) {
    console.error('💥 ProtectedRoute: Error loading permissions:', error);
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Permission Error</h4>
          <p>Unable to load user permissions. Please try refreshing the page.</p>
          <hr />
          <p className="mb-0">Error: {error}</p>
          <button 
            className="btn btn-outline-danger mt-2"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Check if user has permission to view this path
  const routePath = path || location.pathname;
  const hasPermission = hasViewPermission(routePath);

  if (!hasPermission) {
    console.log('🚫 ProtectedRoute: Access denied for path:', routePath);
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Access Denied</h4>
          <p>You don't have permission to access this page.</p>
          <hr />
          <p className="mb-0">
            <strong>Path:</strong> {routePath}<br />
            <strong>Role:</strong> {state.role_id}<br />
            <strong>User:</strong> {state.user_name || state.user}
          </p>
          <button 
            className="btn btn-outline-warning mt-2"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ ProtectedRoute: Access granted for path:', routePath);
  return children;
};

// Higher-order component to wrap routes with permission checking
export const withPermissionCheck = (Component, path) => {
  return (props) => (
    <ProtectedRoute path={path}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
