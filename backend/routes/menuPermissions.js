const express = require('express');
const router = express.Router();
const con = require("../models/db");

// Test endpoint to verify database connection and menu items
router.get('/test', async (req, res) => {
  try {
    console.log('🧪 API: Testing database connection...');

    // Test basic connection
    con.query('SELECT 1 as test', (err, connectionTest) => {
      if (err) {
        console.error('💥 API: Database connection failed:', err);
        return res.status(500).json({
          success: false,
          message: 'Database connection failed',
          error: err.message
        });
      }

      console.log('✅ API: Database connection successful:', connectionTest);

      // Test menu_items table
      con.query('SELECT COUNT(*) as count FROM menu_items', (err, menuItemsTest) => {
        if (err) {
          console.error('💥 API: Menu items query failed:', err);
          return res.status(500).json({
            success: false,
            message: 'Menu items query failed',
            error: err.message
          });
        }

        console.log('✅ API: Menu items count:', menuItemsTest[0].count);

        // Test role_permissions table
        con.query('SELECT COUNT(*) as count FROM role_permissions', (err, permissionsTest) => {
          if (err) {
            console.error('💥 API: Role permissions query failed:', err);
            return res.status(500).json({
              success: false,
              message: 'Role permissions query failed',
              error: err.message
            });
          }

          console.log('✅ API: Role permissions count:', permissionsTest[0].count);

          // Test specific role permissions
          con.query('SELECT COUNT(*) as count FROM role_permissions WHERE role_id = 1', (err, roleTest) => {
            if (err) {
              console.error('💥 API: Admin role query failed:', err);
              return res.status(500).json({
                success: false,
                message: 'Admin role query failed',
                error: err.message
              });
            }

            console.log('✅ API: Admin role permissions count:', roleTest[0].count);

            res.json({
              success: true,
              message: 'Database test successful',
              data: {
                connection: 'OK',
                menuItems: menuItemsTest[0].count,
                rolePermissions: permissionsTest[0].count,
                adminPermissions: roleTest[0].count
              }
            });
          });
        });
      });
    });
  } catch (error) {
    console.error('💥 API: Database test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message
    });
  }
});



// Get user menu permissions based on role_id
router.get('/user-permissions/:roleId', async (req, res) => {
  try {
    const { roleId } = req.params;

    console.log('🔍 API: Fetching menu permissions for role_id:', roleId);

    const query = `
      SELECT
        mi.id,
        mi.name,
        mi.path,
        mi.icon,
        mi.parent_id,
        mi.sort_order,
        rp.can_view,
        rp.can_create,
        rp.can_edit,
        rp.can_delete
      FROM menu_items mi
      LEFT JOIN role_permissions rp ON mi.id = rp.menu_item_id AND rp.role_id = ?
      WHERE mi.is_active = 1 AND (rp.can_view = 1 OR rp.can_view IS NULL)
      ORDER BY mi.sort_order ASC, mi.name ASC
    `;

    console.log('🔍 API: Executing query:', query);
    console.log('🔍 API: Query parameters:', [roleId]);

    con.query(query, [roleId], (err, results) => {
      if (err) {
        console.error('💥 API: Database query failed:', err);
        return res.status(500).json({
          success: false,
          message: 'Database query failed',
          error: err.message,
          roleId: roleId
        });
      }

      console.log('📊 API: Raw query results:', results);
      console.log('📊 API: Number of results:', results.length);

      // Organize menu items into hierarchical structure
      const menuItems = [];
      const menuMap = new Map();

      console.log('🔧 API: Processing results into hierarchical structure...');

      // First pass: create all menu items
      results.forEach(item => {
        console.log('🔧 API: Processing item:', item);
        const menuItem = {
          id: item.id,
          name: item.name,
          path: item.path,
          icon: item.icon,
          parent_id: item.parent_id,
          sort_order: item.sort_order,
          permissions: {
            can_view: item.can_view || 0,
            can_create: item.can_create || 0,
            can_edit: item.can_edit || 0,
            can_delete: item.can_delete || 0
          },
          children: []
        };
        menuMap.set(item.id, menuItem);
      });

      console.log('🔧 API: Created menu map with', menuMap.size, 'items');

      // Second pass: organize hierarchy
      menuMap.forEach(item => {
        if (item.parent_id === null) {
          menuItems.push(item);
          console.log('🔧 API: Added root item:', item.name);
        } else {
          const parent = menuMap.get(item.parent_id);
          if (parent) {
            parent.children.push(item);
            console.log('🔧 API: Added child item:', item.name, 'to parent:', parent.name);
          } else {
            console.warn('⚠️ API: Parent not found for item:', item.name, 'parent_id:', item.parent_id);
          }
        }
      });

      console.log('✅ API: Final menu structure created with', menuItems.length, 'root items');
      console.log('✅ API: Sending response:', { success: true, data: menuItems });

      res.json({
        success: true,
        data: menuItems
      });
    });
  } catch (error) {
    console.error('💥 API: Error fetching user permissions:', error);
    console.error('💥 API: Error message:', error.message);
    console.error('💥 API: Error stack:', error.stack);
    console.error('💥 API: Role ID that caused error:', req.params.roleId);

    res.status(500).json({
      success: false,
      message: 'Failed to fetch user permissions',
      error: error.message,
      roleId: req.params.roleId
    });
  }
});

// Get all menu items
router.get('/menu-items', async (req, res) => {
  try {
    const query = `
      SELECT id, name, path, icon, parent_id, sort_order, is_active, file_name
      FROM menu_items
      ORDER BY sort_order ASC, name ASC
    `;
    
    con.query(query, (err, results) => {
      if (err) {
        console.error('💥 API: Menu items query failed:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch menu items',
          error: err.message
        });
      }

      res.json({
        success: true,
        data: results
      });
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items',
      error: error.message
    });
  }
});

// Get all roles with their permissions
router.get('/roles-permissions', async (req, res) => {
  try {
    const rolesQuery = `
      SELECT role_id, role_name, status
      FROM roles
      WHERE status = 1
      ORDER BY role_name ASC
    `;
    
    con.query(rolesQuery, (err, roles) => {
      if (err) {
        console.error('💥 API: Roles query failed:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch roles',
          error: err.message
        });
      }

      const permissionsQuery = `
        SELECT
          rp.role_id,
          rp.menu_item_id,
          rp.can_view,
          rp.can_create,
          rp.can_edit,
          rp.can_delete,
          mi.name as menu_name,
          mi.path as menu_path,
          mi.icon as menu_icon
        FROM role_permissions rp
        JOIN menu_items mi ON rp.menu_item_id = mi.id
        WHERE mi.is_active = 1
        ORDER BY rp.role_id, mi.sort_order
      `;

      con.query(permissionsQuery, (err, permissions) => {
        if (err) {
          console.error('💥 API: Permissions query failed:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch permissions',
            error: err.message
          });
        }

        // Group permissions by role
        const rolesWithPermissions = roles.map(role => ({
          ...role,
          permissions: permissions.filter(p => p.role_id === role.role_id)
        }));

        res.json({
          success: true,
          data: rolesWithPermissions
        });
      });
    });
  } catch (error) {
    console.error('Error fetching roles permissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch roles permissions',
      error: error.message
    });
  }
});

// Update role permissions
router.put('/role-permissions/:roleId', (req, res) => {
  const { roleId } = req.params;
  const { permissions } = req.body;

  console.log('🔄 API: Updating role permissions for role:', roleId);
  console.log('📝 API: Permissions data:', permissions);

  // Start transaction
  con.query('START TRANSACTION', (err) => {
    if (err) {
      console.error('💥 API: Failed to start transaction:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to start transaction',
        error: err.message
      });
    }

    // Delete existing permissions for this role
    con.query('DELETE FROM role_permissions WHERE role_id = ?', [roleId], (err) => {
      if (err) {
        console.error('💥 API: Failed to delete existing permissions:', err);
        // Rollback transaction
        con.query('ROLLBACK', () => {});
        return res.status(500).json({
          success: false,
          message: 'Failed to delete existing permissions',
          error: err.message
        });
      }

      // Insert new permissions
      if (permissions && permissions.length > 0) {
        const insertQuery = `
          INSERT INTO role_permissions (role_id, menu_item_id, can_view, can_create, can_edit, can_delete)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        let hasError = false;

        const insertPermission = (index) => {
          if (index >= permissions.length) {
            // All permissions inserted successfully, commit transaction
            con.query('COMMIT', (err) => {
              if (err) {
                console.error('💥 API: Failed to commit transaction:', err);
                return res.status(500).json({
                  success: false,
                  message: 'Failed to commit transaction',
                  error: err.message
                });
              }

              console.log('✅ API: Role permissions updated successfully');
              res.json({
                success: true,
                message: 'Role permissions updated successfully'
              });
            });
            return;
          }

          if (hasError) return;

          const permission = permissions[index];
          con.query(insertQuery, [
            roleId,
            permission.menu_item_id,
            permission.can_view ? 1 : 0,
            permission.can_create ? 1 : 0,
            permission.can_edit ? 1 : 0,
            permission.can_delete ? 1 : 0
          ], (err) => {
            if (err) {
              console.error('💥 API: Failed to insert permission:', err);
              hasError = true;
              // Rollback transaction
              con.query('ROLLBACK', () => {});
              return res.status(500).json({
                success: false,
                message: 'Failed to insert permission',
                error: err.message
              });
            }

            insertPermission(index + 1);
          });
        };

        insertPermission(0);
      } else {
        // No permissions to insert, just commit
        con.query('COMMIT', (err) => {
          if (err) {
            console.error('💥 API: Failed to commit transaction:', err);
            return res.status(500).json({
              success: false,
              message: 'Failed to commit transaction',
              error: err.message
            });
          }

          console.log('✅ API: Role permissions updated successfully (no permissions)');
          res.json({
            success: true,
            message: 'Role permissions updated successfully'
          });
        });
      }
    });
  });
});

// Add new menu item
router.post('/menu-items', (req, res) => {
  const { name, path, icon, parent_id, sort_order, file_name } = req.body;

  console.log('➕ API: Creating new menu item:', { name, path, icon, parent_id, sort_order, file_name });

  // Validation
  if (!name || !path) {
    return res.status(400).json({
      success: false,
      message: 'Name and path are required fields'
    });
  }

  const query = `
    INSERT INTO menu_items (name, path, icon, parent_id, sort_order, file_name)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  con.query(query, [
    name,
    path,
    icon || '',
    parent_id || null,
    sort_order || 1,
    file_name || null
  ], (err, result) => {
    if (err) {
      console.error('💥 API: Failed to create menu item:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to create menu item',
        error: err.message
      });
    }

    console.log('✅ API: Menu item created successfully with ID:', result.insertId);
    res.json({
      success: true,
      message: 'Menu item created successfully',
      data: {
        id: result.insertId,
        name: name,
        path: path,
        icon: icon,
        parent_id: parent_id,
        sort_order: sort_order,
        file_name: file_name
      }
    });
  });
});

// Update menu item
router.put('/menu-items/:id', (req, res) => {
  const { id } = req.params;
  const { name, path, icon, parent_id, sort_order, is_active, file_name } = req.body;

  console.log('🔄 API: Updating menu item:', { id, name, path, icon, parent_id, sort_order, is_active, file_name });

  // Prepare parameters: when a field is not provided, pass null so COALESCE() keeps the existing column value
  const isActiveParam = typeof is_active === 'undefined' ? null : (is_active ? 1 : 0);
  const parentIdParam = typeof parent_id === 'undefined' ? null : parent_id;
  const sortOrderParam = typeof sort_order === 'undefined' ? null : sort_order;

  const query = `
    UPDATE menu_items
    SET name = COALESCE(?, name),
        path = COALESCE(?, path),
        icon = COALESCE(?, icon),
        parent_id = COALESCE(?, parent_id),
        sort_order = COALESCE(?, sort_order),
        is_active = COALESCE(?, is_active),
        file_name = COALESCE(?, file_name)
    WHERE id = ?
  `;

  con.query(query, [
    name || null,
    path || null,
    icon || null,
    parentIdParam,
    sortOrderParam,
    isActiveParam,
    file_name || null,
    id
  ], (err) => {
    if (err) {
      console.error('💥 API: Failed to update menu item:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to update menu item',
        error: err.message
      });
    }

    console.log('✅ API: Menu item updated successfully');
    res.json({
      success: true,
      message: 'Menu item updated successfully'
    });
  });
});

// Delete menu item
router.delete('/menu-items/:id', (req, res) => {
  const { id } = req.params;

  console.log('🗑️ API: Deleting menu item with ID:', id);

  // Check if menu item has children
  con.query('SELECT COUNT(*) as count FROM menu_items WHERE parent_id = ?', [id], (err, children) => {
    if (err) {
      console.error('💥 API: Failed to check for children:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to check for children',
        error: err.message
      });
    }

    if (children[0].count > 0) {
      console.log('⚠️ API: Cannot delete menu item with children');
      return res.status(400).json({
        success: false,
        message: 'Cannot delete menu item with children. Please delete children first.'
      });
    }

    // Delete menu item (this will also delete related permissions due to foreign key constraint)
    con.query('DELETE FROM menu_items WHERE id = ?', [id], (err, result) => {
      if (err) {
        console.error('💥 API: Failed to delete menu item:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to delete menu item',
          error: err.message
        });
      }

      console.log('✅ API: Menu item deleted successfully');
      res.json({
        success: true,
        message: 'Menu item deleted successfully'
      });
    });
  });
});

// Get permission matrix (all roles vs all menu items)
router.get('/permission-matrix', (req, res) => {
    const menuQuery = `
      SELECT id, name, path, icon, parent_id, sort_order, file_name
      FROM menu_items
      WHERE is_active = 1
      ORDER BY sort_order ASC, name ASC
    `;
    
    const rolesQuery = `
      SELECT role_id, role_name
      FROM roles
      WHERE status = 1
      ORDER BY role_name ASC
    `;
    
    const permissionsQuery = `
      SELECT role_id, menu_item_id, can_view, can_create, can_edit, can_delete
      FROM role_permissions
    `;
    
    con.query(menuQuery, (err, menuItems) => {
      if (err) {
        console.error('💥 API: Menu items query failed:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch menu items',
          error: err.message
        });
      }

      con.query(rolesQuery, (err, roles) => {
        if (err) {
          console.error('💥 API: Roles query failed:', err);
          return res.status(500).json({
            success: false,
            message: 'Failed to fetch roles',
            error: err.message
          });
        }

        con.query(permissionsQuery, (err, permissions) => {
          if (err) {
            console.error('💥 API: Permissions query failed:', err);
            return res.status(500).json({
              success: false,
              message: 'Failed to fetch permissions',
              error: err.message
            });
          }

          // Create permission lookup map
          const permissionMap = new Map();
          permissions.forEach(p => {
            permissionMap.set(`${p.role_id}-${p.menu_item_id}`, p);
          });

          // Build matrix
          const matrix = {
            menuItems,
            roles,
            permissions: roles.map(role => ({
              role_id: role.role_id,
              role_name: role.role_name,
              menuPermissions: menuItems.map(menu => {
                const key = `${role.role_id}-${menu.id}`;
                const permission = permissionMap.get(key);
                return {
                  menu_item_id: menu.id,
                  menu_name: menu.name,
                  can_view: permission ? permission.can_view : 0,
                  can_create: permission ? permission.can_create : 0,
                  can_edit: permission ? permission.can_edit : 0,
                  can_delete: permission ? permission.can_delete : 0
                };
              })
            }))
          };

          res.json({
            success: true,
            data: matrix
          });
        });
      });
    });
});

module.exports = router;
