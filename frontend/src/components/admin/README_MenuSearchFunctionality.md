# Menu Permissions - Comprehensive Search Functionality

## Overview

I've added comprehensive search functionality to all three main sections of the Menu Permissions component:
1. **Menu Hierarchical Structure** - Search and filter menu hierarchy
2. **Menu Items Management** - Search and filter menu list
3. **Menu Permissions for Admin** - Search menu permissions

## 🔍 Search Features Implemented

### 1. **Menu Hierarchical Structure Search**

#### Search Capabilities:
- **Text Search**: Search by menu name, path, file name, or icon
- **Status Filter**: Filter by Active/Inactive status
- **Parent Filter**: Filter by Root items, Child items, or All items
- **Smart Display**: When searching, shows flat list with parent context

#### UI Components:
```jsx
// Search Input
<input
  type="text"
  className="form-control"
  placeholder="Search menus by name, path, file, or icon..."
  value={hierarchySearchTerm}
  onChange={(e) => setHierarchySearchTerm(e.target.value)}
/>

// Status Filter Radio Buttons
<div className="btn-group" role="group">
  <input type="radio" id="statusAll" checked={!showActiveOnly && !showInactiveOnly} />
  <label className="btn btn-outline-secondary btn-sm" htmlFor="statusAll">All</label>
  
  <input type="radio" id="statusActive" checked={showActiveOnly} />
  <label className="btn btn-outline-success btn-sm" htmlFor="statusActive">Active</label>
  
  <input type="radio" id="statusInactive" checked={showInactiveOnly} />
  <label className="btn btn-outline-danger btn-sm" htmlFor="statusInactive">Inactive</label>
</div>

// Parent Filter Dropdown
<select value={parentFilter} onChange={(e) => setSearchFilters(...)}>
  <option value="all">All Items</option>
  <option value="root">Root Only</option>
  <option value="child">Children Only</option>
</select>
```

#### Smart Search Display:
- **Normal View**: Shows hierarchical tree structure
- **Search Mode**: Shows flat list with parent context when searching
- **Parent Context**: Shows "Child of: Parent Name" for child items in search results

### 2. **Menu Items Management Search**

#### Search Capabilities:
- **Text Search**: Search by menu name, path, file name, or icon
- **Quick Filters**: Toggle buttons for Root items and Child items
- **Real-time Results**: Instant filtering as you type

#### UI Components:
```jsx
// Search Input with Clear Button
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
    <button onClick={() => setMenuListSearchTerm('')}>
      <i className="bi bi-x"></i>
    </button>
  )}
</div>

// Quick Filter Buttons
<button
  className={`btn btn-sm ${parentFilter === 'root' ? 'btn-primary' : 'btn-outline-primary'}`}
  onClick={() => toggleRootFilter()}
>
  <i className="bi bi-diagram-3 me-1"></i>
  Root Items
</button>

<button
  className={`btn btn-sm ${parentFilter === 'child' ? 'btn-info' : 'btn-outline-info'}`}
  onClick={() => toggleChildFilter()}
>
  <i className="bi bi-arrow-return-right me-1"></i>
  Child Items
</button>
```

### 3. **Menu Permissions for Admin Search**

#### Search Capabilities:
- **Text Search**: Search by menu name, path, or file name
- **Permission Filters**: Quick buttons to show items with specific permissions
- **Role-Specific**: Search within selected role's permissions

#### UI Components:
```jsx
// Search Input
<input
  type="text"
  className="form-control"
  placeholder="Search menu permissions by name, path, or file..."
  value={permissionsSearchTerm}
  onChange={(e) => setPermissionsSearchTerm(e.target.value)}
/>

// Permission Filter Buttons
<button
  className="btn btn-outline-success btn-sm"
  onClick={() => filterByPermission('can_view')}
  title="Show items with view permission"
>
  <i className="bi bi-eye me-1"></i>
  View
</button>

<button
  className="btn btn-outline-primary btn-sm"
  onClick={() => filterByPermission('can_edit')}
  title="Show items with edit permission"
>
  <i className="bi bi-pencil me-1"></i>
  Edit
</button>

<button
  className="btn btn-outline-danger btn-sm"
  onClick={() => filterByPermission('can_delete')}
  title="Show items with delete permission"
>
  <i className="bi bi-trash me-1"></i>
  Delete
</button>
```

## 🛠️ Technical Implementation

### State Management:
```javascript
// Search functionality states
const [hierarchySearchTerm, setHierarchySearchTerm] = useState('');
const [menuListSearchTerm, setMenuListSearchTerm] = useState('');
const [permissionsSearchTerm, setPermissionsSearchTerm] = useState('');
const [searchFilters, setSearchFilters] = useState({
  showActiveOnly: false,
  showInactiveOnly: false,
  parentFilter: 'all' // 'all', 'root', 'child'
});
```

### Filter Utility Function:
```javascript
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
```

### Specialized Filter Functions:
```javascript
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
```

## 🎯 Search Features by Section

### Menu Hierarchical Structure:
- ✅ **Text Search**: Name, path, file, icon
- ✅ **Status Filter**: Active/Inactive radio buttons
- ✅ **Parent Filter**: All/Root/Child dropdown
- ✅ **Smart Display**: Flat list when searching with parent context
- ✅ **Clear Filters**: One-click clear all filters
- ✅ **Results Count**: Shows filtered vs total count

### Menu Items Management:
- ✅ **Text Search**: Name, path, file, icon
- ✅ **Quick Filters**: Toggle buttons for Root/Child items
- ✅ **Clear Search**: X button to clear search term
- ✅ **Results Count**: Shows filtered vs total count
- ✅ **Table Integration**: Filtered results in table

### Menu Permissions for Admin:
- ✅ **Text Search**: Name, path, file
- ✅ **Permission Filters**: View/Edit/Delete permission buttons
- ✅ **Role-Specific**: Search within selected role
- ✅ **Clear Search**: X button to clear search term
- ✅ **Results Count**: Shows filtered vs total count

## 🔍 Search Behavior

### Text Search:
- **Case Insensitive**: Searches are not case-sensitive
- **Partial Match**: Matches partial strings anywhere in the field
- **Multiple Fields**: Searches across name, path, file_name, and icon
- **Real-time**: Results update as you type

### Filter Combinations:
- **Text + Status**: Can combine text search with status filters
- **Text + Parent**: Can combine text search with parent filters
- **Multiple Filters**: All filters work together

### Search Results Display:

#### Hierarchical Structure:
```javascript
// Normal hierarchical view
if (!hierarchySearchTerm.trim()) {
  return rootItems.map(rootItem => (
    <div key={`root-${rootItem.id}`}>
      {/* Root item */}
      <div className="mp-tree-root">{rootItem.name}</div>
      {/* Child items */}
      <div className="mp-tree-children">
        {childItems.map(child => (
          <div key={`child-${child.id}`}>{child.name}</div>
        ))}
      </div>
    </div>
  ));
}

// Flat search results with context
return filteredItems.map(item => (
  <div key={`search-${item.id}`}>
    {item.parent_id && <i className="bi bi-arrow-return-right"></i>}
    <div>{item.name}</div>
    {item.parent_id && (
      <small>Child of: {getParentName(item.parent_id)}</small>
    )}
  </div>
));
```

## 📊 Search Results Summary

Each search section includes a results summary:

```jsx
{(searchTerm || hasFilters) && (
  <div className="mt-2">
    <small className="text-muted">
      <i className="bi bi-funnel me-1"></i>
      Showing {filteredItems.length} of {totalItems.length} menu items
      {searchTerm && ` matching "${searchTerm}"`}
    </small>
  </div>
)}
```

## 🎨 UI/UX Features

### Professional Design:
- **Bootstrap Integration**: Uses Bootstrap classes for consistency
- **Icon Integration**: Bootstrap icons for visual clarity
- **Card Layout**: Search controls in professional card containers
- **Responsive Design**: Works on all screen sizes

### User Experience:
- **Instant Feedback**: Real-time search results
- **Clear Actions**: X buttons to clear searches
- **Visual Indicators**: Active filter states clearly shown
- **Context Information**: Parent relationships shown in search results

### Accessibility:
- **Proper Labels**: All inputs have proper labels
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and roles
- **Focus Management**: Proper focus indicators

## 🚀 Usage Examples

### Basic Text Search:
1. Navigate to any menu section
2. Type in the search box
3. Results filter instantly
4. Click X to clear search

### Combined Filters:
1. Enter text search term
2. Select status filter (Active/Inactive)
3. Choose parent filter (Root/Child)
4. Click "Clear" to reset all filters

### Permission Search:
1. Select a role in permissions tab
2. Search for specific menu items
3. Use permission filter buttons to find items with specific permissions
4. Results show only matching items for that role

## 🔧 Maintenance and Extension

### Adding New Search Fields:
```javascript
// Update the filter function
const filterMenuItems = (items, searchTerm, filters = {}) => {
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(searchLower) ||
      item.path.toLowerCase().includes(searchLower) ||
      item.file_name?.toLowerCase().includes(searchLower) ||
      item.icon?.toLowerCase().includes(searchLower) ||
      item.newField?.toLowerCase().includes(searchLower) // Add new field
    );
  }
  return filteredItems;
};
```

### Adding New Filters:
```javascript
// Update search filters state
const [searchFilters, setSearchFilters] = useState({
  showActiveOnly: false,
  showInactiveOnly: false,
  parentFilter: 'all',
  newFilter: 'default' // Add new filter
});

// Update filter function
if (filters.newFilter !== 'default') {
  filteredItems = filteredItems.filter(item => item.someProperty === filters.newFilter);
}
```

The search functionality is now fully integrated across all three menu management sections, providing users with powerful tools to quickly find and manage menu items efficiently.
