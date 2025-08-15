# Professional Staff Layout System

## Overview

The Staff Layout System provides a professional, consistent, and responsive design framework for all staff-related components. It's designed to match the quality and professionalism of the admin sidebar while providing staff-specific functionality.

## Key Features

### 🎨 Professional Design
- **Modern UI**: Clean, professional interface with gradients and shadows
- **Consistent Styling**: Unified design language across all staff components
- **Brand Colors**: Custom color scheme with professional gradients
- **Typography**: Carefully chosen fonts and sizing for readability

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Collapsible Sidebar**: Smart sidebar that adapts to screen size
- **Touch-Friendly**: Mobile-optimized interactions and gestures
- **Breakpoint Management**: Automatic layout adjustments

### 🔧 Smart Layout System
- **Route-Based Layouts**: Automatically chooses the right layout based on URL
- **Context Passing**: Automatic prop passing to child components
- **State Management**: Centralized sidebar state management
- **Event Broadcasting**: Custom events for component communication

## Components

### 1. StaffLayout (Core Layout)
```jsx
import StaffLayout from './components/staff/layout/StaffLayout';

<StaffLayout title="Page Title" breadcrumbs={breadcrumbs} actions={actions}>
  <YourComponent />
</StaffLayout>
```

### 2. StaffPageWrapper (Simple Pages)
```jsx
import { StaffPageWrapper } from './components/staff/layout/StaffLayout';

<StaffPageWrapper title="My Page" breadcrumbs={breadcrumbs}>
  <div>Page content</div>
</StaffPageWrapper>
```

### 3. StaffModuleWrapper (Module Pages)
```jsx
import { StaffModuleWrapper } from './components/staff/layout/StaffLayout';

<StaffModuleWrapper 
  module="planning" 
  title="Plan Management" 
  icon="bi-clipboard-data"
>
  <div>Module content</div>
</StaffModuleWrapper>
```

### 4. StaffSidebar (Navigation)
- **Collapsible**: Toggle between expanded (260px) and collapsed (60px)
- **Role-Based Menu**: Staff-specific navigation items
- **Active States**: Visual indicators for current page
- **Submenu Support**: Hierarchical navigation with smooth animations

## Design System

### Color Palette
- **Primary Gradient**: `linear-gradient(90deg, #16284f 10%, #0c7c92 50%)`
- **Background**: `#f8f9fa` (Light gray)
- **Cards**: `#ffffff` (White)
- **Borders**: `#e0e0e0` (Light gray)
- **Text**: `#495057` (Dark gray)

### Typography
- **Font Family**: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- **Headings**: 600 weight, various sizes
- **Body Text**: 400 weight, 1rem base size
- **Small Text**: 0.875rem for secondary information

### Spacing
- **Base Unit**: 1rem (16px)
- **Card Padding**: 1.5rem
- **Button Padding**: 0.5rem 1rem
- **Gap Spacing**: 0.75rem standard

### Shadows & Effects
- **Card Shadow**: `0 2px 4px rgba(0, 0, 0, 0.1)`
- **Sidebar Shadow**: `2px 0 10px rgba(0, 0, 0, 0.1)`
- **Hover Effects**: Subtle transforms and color changes
- **Transitions**: 0.3s ease for layout, 0.2s ease for interactions

## Navigation Structure

### Staff Menu Items
```javascript
const staffMenuItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    path: '/staff/dashboard',
    icon: 'bi-speedometer2',
    type: 'single'
  },
  {
    id: 'planning',
    name: 'Planning',
    icon: 'bi-clipboard-data',
    type: 'submenu',
    children: [
      { name: 'View Plans', path: '/plan/view', icon: 'bi-eye' },
      { name: 'Add Plan', path: '/plan/PlanSteps/Add', icon: 'bi-plus-circle' },
      { name: 'Declined Plans', path: '/plan/declined', icon: 'bi-x-circle' },
      { name: 'Organization Plans', path: '/plan/org', icon: 'bi-building' }
    ]
  },
  {
    id: 'reporting',
    name: 'Reporting',
    icon: 'bi-file-earmark-text',
    type: 'submenu',
    children: [
      { name: 'View Reports', path: '/report/view', icon: 'bi-eye' },
      { name: 'Add Report', path: '/report/Add', icon: 'bi-plus-circle' },
      { name: 'Declined Reports', path: '/report/declined', icon: 'bi-x-circle' },
      { name: 'Organization Reports', path: '/report/org', icon: 'bi-building' }
    ]
  }
];
```

## Smart Layout Integration

The `SmartLayout` component in App.jsx automatically determines which layout to use:

```javascript
// Staff routes use StaffLayout
const isStaffRoute = location.pathname.startsWith('/staff') || 
                    location.pathname.startsWith('/plan') || 
                    location.pathname.startsWith('/report');

// Admin routes use AdminLayout  
const isAdminRoute = location.pathname.startsWith('/admin') || 
                     location.pathname.startsWith('/menu-permissions');
```

## CSS Classes

### Layout Classes
- `.staff-layout` - Main layout container
- `.staff-content-wrapper` - Content area wrapper
- `.staff-page-header` - Page header with gradient
- `.staff-main-content` - Main content area

### Component Classes
- `.staff-professional-card` - Standard card component
- `.staff-card-header` - Card header with background
- `.staff-card-body` - Card content area
- `.staff-action-btn` - Professional button styling

### Utility Classes
- `.staff-text-primary` - Primary text color
- `.staff-text-success` - Success text color
- `.staff-fade-in` - Fade in animation
- `.staff-slide-in` - Slide in animation

## Responsive Breakpoints

- **Desktop**: > 1200px (Full layout)
- **Tablet**: 768px - 1200px (Responsive adjustments)
- **Mobile**: < 768px (Collapsed sidebar, full-width content)

## Usage Examples

### Basic Staff Page
```jsx
import { StaffPageWrapper } from './components/staff/layout/StaffLayout';

function MyStaffPage() {
  const breadcrumbs = [
    { label: 'Staff', link: '/staff' },
    { label: 'My Page' }
  ];

  return (
    <StaffPageWrapper title="My Page" breadcrumbs={breadcrumbs}>
      <div className="staff-professional-card">
        <div className="staff-card-body">
          <h5>Page Content</h5>
          <p>Your content here...</p>
        </div>
      </div>
    </StaffPageWrapper>
  );
}
```

### Module Page with Actions
```jsx
import { StaffModuleWrapper } from './components/staff/layout/StaffLayout';

function PlanningModule() {
  const headerActions = (
    <button className="staff-action-btn btn-primary">
      <i className="bi bi-plus-circle me-2"></i>
      Add Plan
    </button>
  );

  return (
    <StaffModuleWrapper
      module="planning"
      title="Plan Management"
      icon="bi-clipboard-data"
      headerActions={headerActions}
    >
      <div className="staff-professional-card">
        <div className="staff-card-header">
          <h6 className="staff-card-title">Plans Overview</h6>
        </div>
        <div className="staff-card-body">
          {/* Your module content */}
        </div>
      </div>
    </StaffModuleWrapper>
  );
}
```

## Migration Guide

To update existing staff components to use the new layout system:

1. **Wrap components** with appropriate layout wrapper
2. **Update CSS classes** to use staff-prefixed classes
3. **Remove old sidebar** references and styling
4. **Test responsive behavior** on different screen sizes
5. **Update navigation paths** to match new structure

## Performance Considerations

- **CSS Transitions**: Optimized for 60fps animations
- **Lazy Loading**: Components load only when needed
- **Event Debouncing**: Resize events are debounced for performance
- **Memory Management**: Proper cleanup of event listeners

The new Staff Layout System provides a professional, maintainable, and scalable foundation for all staff-related components while ensuring consistency with the overall application design.
