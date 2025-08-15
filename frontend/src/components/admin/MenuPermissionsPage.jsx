import React from 'react';
import AdminLayout from './AdminLayout';
import MenuPermissions from './MenuPermissions';

/**
 * MenuPermissionsPage - Complete page component with sidebar integration
 * This demonstrates how to use MenuPermissions with the AdminLayout
 */
const MenuPermissionsPage = () => {
  return (
    <AdminLayout>
      <MenuPermissions />
    </AdminLayout>
  );
};

export default MenuPermissionsPage;
