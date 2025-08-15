import React from 'react';
import { StaffPageWrapper, StaffModuleWrapper } from './layout/StaffLayout';

/**
 * StaffLayoutDemo - Demonstrates the new professional staff layout system
 */
const StaffLayoutDemo = () => {
  const breadcrumbs = [
    { label: 'Staff', link: '/staff' },
    { label: 'Dashboard', link: '/staff/dashboard' },
    { label: 'Layout Demo' }
  ];

  const headerActions = (
    <>
      <button className="staff-action-btn btn-primary">
        <i className="bi bi-plus-circle me-2"></i>
        New Action
      </button>
      <button className="staff-action-btn btn-secondary">
        <i className="bi bi-gear me-2"></i>
        Settings
      </button>
    </>
  );

  return (
    <StaffPageWrapper
      title="Professional Staff Layout Demo"
      breadcrumbs={breadcrumbs}
      actions={headerActions}
      className="staff-fade-in"
    >
      <div className="row g-4">
        {/* Layout Features Card */}
        <div className="col-12">
          <div className="staff-professional-card">
            <div className="staff-card-header">
              <h5 className="staff-card-title">
                <i className="bi bi-layout-three-columns me-2"></i>
                Professional Layout Features
              </h5>
            </div>
            <div className="staff-card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0">
                      <i className="bi bi-layout-sidebar text-primary fs-4"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="fw-bold">Smart Sidebar</h6>
                      <p className="text-muted small mb-0">
                        Collapsible sidebar with role-based navigation, smooth animations, and mobile responsiveness.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0">
                      <i className="bi bi-palette text-success fs-4"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="fw-bold">Professional Styling</h6>
                      <p className="text-muted small mb-0">
                        Consistent design system with gradients, shadows, and modern UI components.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4">
                  <div className="d-flex align-items-start">
                    <div className="flex-shrink-0">
                      <i className="bi bi-phone text-warning fs-4"></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h6 className="fw-bold">Mobile Ready</h6>
                      <p className="text-muted small mb-0">
                        Fully responsive design that adapts to all screen sizes with touch-friendly interactions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Module Examples */}
        <div className="col-md-6">
          <div className="staff-professional-card">
            <div className="staff-card-header">
              <h6 className="staff-card-title">
                <i className="bi bi-clipboard-data me-2"></i>
                Planning Module Example
              </h6>
            </div>
            <div className="staff-card-body">
              <p className="text-muted">
                The planning module provides comprehensive tools for creating, managing, and tracking plans.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-primary">View Plans</span>
                <span className="badge bg-success">Add Plan</span>
                <span className="badge bg-warning">Plan Steps</span>
                <span className="badge bg-danger">Declined Plans</span>
              </div>
              <div className="mt-3">
                <button className="staff-action-btn btn-primary btn-sm">
                  <i className="bi bi-arrow-right me-1"></i>
                  Go to Planning
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="staff-professional-card">
            <div className="staff-card-header">
              <h6 className="staff-card-title">
                <i className="bi bi-file-earmark-text me-2"></i>
                Reporting Module Example
              </h6>
            </div>
            <div className="staff-card-body">
              <p className="text-muted">
                The reporting module enables efficient report creation, editing, and management workflows.
              </p>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge bg-info">View Reports</span>
                <span className="badge bg-success">Add Report</span>
                <span className="badge bg-secondary">Edit Reports</span>
                <span className="badge bg-warning">Organization Reports</span>
              </div>
              <div className="mt-3">
                <button className="staff-action-btn btn-success btn-sm">
                  <i className="bi bi-arrow-right me-1"></i>
                  Go to Reporting
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="col-12">
          <div className="staff-professional-card">
            <div className="staff-card-header">
              <h6 className="staff-card-title">
                <i className="bi bi-code-square me-2"></i>
                Implementation Guide
              </h6>
            </div>
            <div className="staff-card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <h6 className="fw-bold">Using StaffPageWrapper</h6>
                  <pre className="bg-light p-3 rounded small"><code>{`import { StaffPageWrapper } from './layout/StaffLayout';

function MyStaffPage() {
  return (
    <StaffPageWrapper
      title="My Page"
      breadcrumbs={breadcrumbs}
      actions={actions}
    >
      <div>Page content here</div>
    </StaffPageWrapper>
  );
}`}</code></pre>
                </div>
                
                <div className="col-md-6">
                  <h6 className="fw-bold">Using StaffModuleWrapper</h6>
                  <pre className="bg-light p-3 rounded small"><code>{`import { StaffModuleWrapper } from './layout/StaffLayout';

function PlanningModule() {
  return (
    <StaffModuleWrapper
      module="planning"
      title="Plan Management"
      icon="bi-clipboard-data"
    >
      <div>Module content here</div>
    </StaffModuleWrapper>
  );
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Statistics */}
        <div className="col-12">
          <div className="staff-professional-card">
            <div className="staff-card-header">
              <h6 className="staff-card-title">
                <i className="bi bi-graph-up me-2"></i>
                Layout Performance
              </h6>
            </div>
            <div className="staff-card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <div className="fs-4 fw-bold staff-text-primary">260px</div>
                    <div className="small text-muted">Sidebar Width</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <div className="fs-4 fw-bold staff-text-success">0.3s</div>
                    <div className="small text-muted">Transition Speed</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <div className="fs-4 fw-bold text-warning">768px</div>
                    <div className="small text-muted">Mobile Breakpoint</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <div className="fs-4 fw-bold text-info">100%</div>
                    <div className="small text-muted">Responsive</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StaffPageWrapper>
  );
};

/**
 * Module-specific demo using StaffModuleWrapper
 */
export const StaffPlanningDemo = () => {
  const headerActions = (
    <button className="staff-action-btn btn-success">
      <i className="bi bi-plus-circle me-2"></i>
      Add New Plan
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
        <div className="staff-card-body">
          <h5>Planning Module Content</h5>
          <p>This demonstrates how a specific module would look with the new layout system.</p>
        </div>
      </div>
    </StaffModuleWrapper>
  );
};

export default StaffLayoutDemo;
