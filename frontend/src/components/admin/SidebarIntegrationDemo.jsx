import React from 'react';
import AdminLayout from './AdminLayout';

/**
 * SidebarIntegrationDemo - Demonstrates how sidebar state affects content layout
 */
const SidebarIntegrationDemo = ({ sidebarState }) => {
  return (
    <div className="p-4">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="bi bi-layout-sidebar me-2"></i>
            Sidebar Integration Demo
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <h6>Current Sidebar State:</h6>
              <div className="bg-light p-3 rounded">
                <div className="d-flex align-items-center mb-2">
                  <strong>Status:</strong>
                  <span className={`badge ms-2 ${sidebarState?.isCollapsed ? 'bg-warning' : 'bg-info'}`}>
                    <i className={`bi ${sidebarState?.isCollapsed ? 'bi-layout-sidebar-inset' : 'bi-layout-sidebar'} me-1`}></i>
                    {sidebarState?.isCollapsed ? 'Collapsed' : 'Expanded'}
                  </span>
                </div>
                <div className="small">
                  <div><strong>Sidebar Width:</strong> {sidebarState?.sidebarWidth || 280}px</div>
                  <div><strong>Content Margin:</strong> {sidebarState?.mainContentMargin || 280}px</div>
                  <div><strong>Screen Width:</strong> {window.innerWidth}px</div>
                  <div><strong>Is Mobile:</strong> {window.innerWidth <= 768 ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <h6>Layout Behavior:</h6>
              <div className="bg-light p-3 rounded">
                <div className="small">
                  <div className="mb-2">
                    <i className="bi bi-check-circle text-success me-1"></i>
                    Content automatically adjusts to sidebar changes
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-check-circle text-success me-1"></i>
                    Smooth transitions when toggling sidebar
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-check-circle text-success me-1"></i>
                    Mobile-responsive behavior
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-check-circle text-success me-1"></i>
                    Real-time state synchronization
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <hr />
          
          <div className="row g-3">
            <div className="col-12">
              <h6>Integration Instructions:</h6>
              <div className="bg-light p-3 rounded">
                <h6 className="small fw-bold">Method 1: Using AdminLayout (Recommended)</h6>
                <pre className="small mb-3"><code>{`import AdminLayout from './AdminLayout';
import MenuPermissions from './MenuPermissions';

function App() {
  return (
    <AdminLayout>
      <MenuPermissions />
    </AdminLayout>
  );
}`}</code></pre>
                
                <h6 className="small fw-bold">Method 2: Direct Integration</h6>
                <pre className="small"><code>{`import Sidebar from './Sidebar';
import MenuPermissions from './MenuPermissions';

function App() {
  const [sidebarState, setSidebarState] = useState({});
  
  return (
    <>
      <Sidebar onSidebarToggle={setSidebarState} />
      <MenuPermissions sidebarState={sidebarState} />
    </>
  );
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Complete demo page with AdminLayout
 */
const SidebarIntegrationDemoPage = () => {
  return (
    <AdminLayout>
      <SidebarIntegrationDemo />
    </AdminLayout>
  );
};

export default SidebarIntegrationDemoPage;
export { SidebarIntegrationDemo };
