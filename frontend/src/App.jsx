import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./components/Auths/AuthContex";
import Login from "./components/login/Login";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProfilePictureUpload from "./components/header/profile/ProfilePictureUpload.jsx";

// Import professional admin styles
import './components/admin/AdminComponents.css';
import './components/admin/Sidebar.css';
import './components/header/Header.css';
import { initializeSidebar } from './components/admin/sidebarUtils';
import ProtectedRoute from './components/ProtectedRoute';

// Core Components
import Sidebar from "./components/admin/Sidebar";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

// Admin Components
import Dashboard from "./components/admin/Dashboard";
import UserRegistration from "./components/admin/UserRegistration";
import UserTable from "./components/admin/UserTable";
import EmployeeRegistration from './components/admin/employeeRegistration';
import ReportsAnalytics from "./components/admin/reports/ReportsAnalytics";
import ExportData from "./components/admin/reports/ExportData";
import Settings from "./components/admin/Settings";
import MenuPermissions from "./components/admin/MenuPermissions";

// CEO Components
import CeoDashboard from "./components/Ceo/CeoDashboard";
import CeoSubmittedViewPlan from "./components/Ceo/addplan/CeoSubmittedViewPlan";
import CeoViewOrgPlan from "./components/Ceo/addplan/CeoViewOrgPlan";
import CeoUpdatePlan from "./components/Ceo/addplan/view/CeoUpdatePlan";
import CeoViewDeclinedPlan from "./components/Ceo/addplan/CeoViewDeclinedPlan";
import CeoViewReport from "./components/Ceo/report/CeoViewReport";
import CeoViewOrgReport from "./components/Ceo/report/CeoViewOrgReport";
import CeoViewDeclinedReport from "./components/Ceo/report/CeoViewDeclinedReport";

// Planreport Components
import PPlanSteps from "./components/planreport/addplan/PPlanSteps";

// Team Leader Components
import TeamleaderDashboard from "./components/teamleader/TeamleaderDashboard";
import TeamleaderSubmittedViewPlan from "./components/teamleader/addplan/TeamleaderSubmittedViewPlan";
import TeamleaderViewOrgPlan from "./components/teamleader/addplan/TeamleaderViewOrgPlan";
import TeamleaderUpdatePlan from "./components/teamleader/addplan/view/TeamleaderUpdatePlan";
import TeamleaderViewDeclinedPlan from "./components/teamleader/addplan/TeamleaderViewDeclinedPlan";
import TeamleaderViewOrgReport from "./components/teamleader/report/TeamleaderViewOrgReport";
import TeamleaderSubmittedViewReport from "./components/teamleader/report/TeamleaderSubmittedViewReport";
import TeamleaderViewDeclinedReport from "./components/teamleader/report/TeamleaderViewDeclinedReport";

// ============================================================================
// STAFF COMPONENTS - Professional Module Organization
// ============================================================================

// Staff Planning Module - Core Components
import StaffViewPlan from "./components/staff/plan/StaffViewPlan";
import StaffViewDeclinedPlan from "./components/staff/plan/StaffViewDeclinedPlan";
import UpdatePlan from "./components/staff/plan/view/UpdatePlan";
import PlanDetail from "./components/staff/plan/view/PlanDetail";
import StafPlanSteps from "./components/staff/plan/addplan/StafPlanSteps";

// Staff Reporting Module - Core Components
import StaffViewReport from "./components/staff/report/StaffViewReport";
import StaffAddReport from "./components/staff/report/StaffAddReport";
import StaffEditReport from "./components/staff/report/StaffEditReport";
import UpdateReport from "./components/staff/report/view/UpdateReport";

// Legacy Import (to be refactored)
import StafAddReport from "./components/staff/plan/view/StafAddReport";



function App() {
  const { state } = useAuth();

  // Initialize sidebar functionality when component mounts
  useEffect(() => {
    initializeSidebar();
  }, []);

  console.log('🚀 App: Rendering with auth state:', state.isAuthenticated);
  console.log('🚀 App: User role:', state.role_id);

  return (
    <>
      <BrowserRouter>
        {state.isAuthenticated ? (
          <>
            <Header />

            <Sidebar />

            <Routes>
              {/* Profile Route - Available to all authenticated users */}
              <Route path="/ProfilePictureUpload" element={
                <ProtectedRoute path="/ProfilePictureUpload">
                  <ProfilePictureUpload />
                </ProtectedRoute>
              } />

              {/* Dashboard Routes */}
              <Route path="/" element={
                <ProtectedRoute path="/">
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/UserForm" element={
                <ProtectedRoute path="/UserForm">
                  <UserRegistration />
                </ProtectedRoute>
              } />

              <Route path="/UserTable" element={
                <ProtectedRoute path="/UserTable">
                  <UserTable />
                </ProtectedRoute>
              } />

              <Route path="/EmployeeForm" element={
                <ProtectedRoute path="/EmployeeForm">
                  <EmployeeRegistration />
                </ProtectedRoute>
              } />

              {/* Reports Routes */}
              <Route path="/reports/analytics" element={
                <ProtectedRoute path="/reports/analytics">
                  <ReportsAnalytics />
                </ProtectedRoute>
              } />

              <Route path="/reports/export" element={
                <ProtectedRoute path="/reports/export">
                  <ExportData />
                </ProtectedRoute>
              } />

              {/* Settings Routes */}
              <Route path="/settings" element={
                <ProtectedRoute path="/settings">
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="/menu-permissions" element={
                <ProtectedRoute path="/menu-permissions">
                  <MenuPermissions />
                </ProtectedRoute>
              } />

              {/* CEO Routes */}
              <Route path="/ceo/dashboard" element={
                <ProtectedRoute path="/ceo/dashboard">
                  <CeoDashboard />
                </ProtectedRoute>
              } />

              {/* Plan Routes */}
              <Route path="/plan/View" element={
                <ProtectedRoute path="/plan/View">
                  <CeoSubmittedViewPlan />
                </ProtectedRoute>
              } />

              <Route path="/plan/View_myplan" element={
                <ProtectedRoute path="/plan/View_myplan">
                  <StaffViewPlan />
                </ProtectedRoute>
              } />

              <Route path="/plan/PlanSteps/Add" element={
                <ProtectedRoute path="/plan/PlanSteps/Add">
                  <StafPlanSteps />
                </ProtectedRoute>
              } />

              <Route path="/plan/ViewOrgPlan" element={
                <ProtectedRoute path="/plan/ViewOrgPlan">
                  <CeoViewOrgPlan />
                </ProtectedRoute>
              } />

              <Route path="/plan/CeoViewDeclinedPlan" element={
                <ProtectedRoute path="/plan/CeoViewDeclinedPlan">
                  <CeoViewDeclinedPlan />
                </ProtectedRoute>
              } />

              <Route path="/plan/StaffViewDeclinedPlan" element={
                <ProtectedRoute path="/plan/StaffViewDeclinedPlan">
                  <StaffViewDeclinedPlan />
                </ProtectedRoute>
              } />

              {/* Report Routes */}
              <Route path="/report/Viewapprovedreport" element={
                <ProtectedRoute path="/report/Viewapprovedreport">
                  <TeamleaderSubmittedViewReport />
                </ProtectedRoute>
              } />

              <Route path="/report/View_myreport" element={
                <ProtectedRoute path="/report/View_myreport">
                  <CeoViewReport />
                </ProtectedRoute>
              } />

              <Route path="/report/ViewOrgReport" element={
                <ProtectedRoute path="/report/ViewOrgReport">
                  <CeoViewOrgReport />
                </ProtectedRoute>
              } />

              <Route path="/report/CeoViewDeclinedReport" element={
                <ProtectedRoute path="/report/CeoViewDeclinedReport">
                  <CeoViewDeclinedReport />
                </ProtectedRoute>
              } />

              <Route path="/report/Add" element={
                <ProtectedRoute path="/report/Add">
                  <StaffAddReport />
                </ProtectedRoute>
              } />

              <Route path="/report/Edit" element={
                <ProtectedRoute path="/report/Edit">
                  <StaffEditReport />
                </ProtectedRoute>
              } />

              <Route path="/report/View" element={
                <ProtectedRoute path="/report/View">
                  <StaffViewReport />
                </ProtectedRoute>
              } />

              {/* Dynamic Routes with Parameters */}
              <Route path="/report/view/update/:reportId" element={
                <ProtectedRoute path="/report/view/update">
                  <UpdateReport />
                </ProtectedRoute>
              } />

              <Route path="/plan/view/add-report/:planId" element={
                <ProtectedRoute path="/plan/view/add-report">
                  <StafAddReport />
                </ProtectedRoute>
              } />

              <Route path="/plan/view/update/:planId" element={
                <ProtectedRoute path="/plan/view/update">
                  <UpdatePlan />
                </ProtectedRoute>
              } />

              <Route path="/plan/view/detail/:planId" element={
                <ProtectedRoute path="/plan/view/detail">
                  <PlanDetail />
                </ProtectedRoute>
              } />

              {/* Team Leader Routes */}
              <Route path="/team/dashboard" element={
                <ProtectedRoute path="/team/dashboard">
                  <TeamleaderDashboard />
                </ProtectedRoute>
              } />

              {/* Messages and Communication */}
              <Route path="/messages" element={
                <ProtectedRoute path="/messages">
                  <div className="container mt-4">
                    <h2>Messages</h2>
                    <p>Messages functionality coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/notifications" element={
                <ProtectedRoute path="/notifications">
                  <div className="container mt-4">
                    <h2>Notifications</h2>
                    <p>Notifications functionality coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />

              {/* Finance Routes */}
              <Route path="/finance/budget" element={
                <ProtectedRoute path="/finance/budget">
                  <div className="container mt-4">
                    <h2>Budget Planning</h2>
                    <p>Budget planning functionality coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/finance/resources" element={
                <ProtectedRoute path="/finance/resources">
                  <div className="container mt-4">
                    <h2>Resource Allocation</h2>
                    <p>Resource allocation functionality coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />

              {/* Help Routes */}
              <Route path="/help/docs" element={
                <ProtectedRoute path="/help/docs">
                  <div className="container mt-4">
                    <h2>Documentation</h2>
                    <p>Documentation coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/help/tickets" element={
                <ProtectedRoute path="/help/tickets">
                  <div className="container mt-4">
                    <h2>Support Tickets</h2>
                    <p>Support ticket system coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />

              {/* System Administration Routes */}
              <Route path="/admin/logs" element={
                <ProtectedRoute path="/admin/logs">
                  <div className="container mt-4">
                    <h2>System Logs</h2>
                    <p>System logs functionality coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />

              <Route path="/admin/backup" element={
                <ProtectedRoute path="/admin/backup">
                  <div className="container mt-4">
                    <h2>Backup & Restore</h2>
                    <p>Backup and restore functionality coming soon...</p>
                  </div>
                </ProtectedRoute>
              } />

              {/* Catch-all route for undefined paths */}
              <Route path="*" element={
                <div className="container mt-4">
                  <div className="alert alert-warning">
                    <h4>Page Not Found</h4>
                    <p>The page you're looking for doesn't exist or you don't have permission to access it.</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => window.history.back()}
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              } />
            </Routes>

            <Footer />
          </>
        ) : (
          <Login />
        )}
      </BrowserRouter>
    </>
  );
}

export default App;