// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./components/Auths/AuthContex";
import Login from "./components/login/Login";
import 'bootstrap/dist/css/bootstrap.min.css';


//admin
import Sidebar from "./components/admin/Sidebar";
import { Header } from "./components/header/Header";
import Dashboard from "./components/admin/Dashboard";
import UserRegistration from "./components/admin/UserRegistration";
import UserTable from "./components/admin/UserTable";
import Footer from "./components/footer/Footer";
// import EmployeeRegistration 
import EmployeeRegistration from './components/admin/employeeRegistration';

// ceo
import CeoDashboard from "./components/Ceo/CeoDashboard";
import CeoSidebar from "./components/Ceo/CeoSidebar";

//                        // Ceo plan 
import CeoViewPlan from "./components/Ceo/plan/CeoViewPlan";



// GeneralmanagerDashboard
import GeneralmanagerDashboard from "./components/generalmanager/GeneralmanagerDashboard";
import GeneralmanagerSidebar from "./components/generalmanager/GeneralmanagerSidebar";

                        // GeneralManagerplan  
import GeneralManagerViewPlan from "./components/generalmanager/plan/GeneralManagerViewPlan";

 // DeputiyManager
import DeputiyManagerDashboard from "./components/deputiymanager/DeputiyManagerDashboard";
import DeputiyManagerSidebar from "./components/deputiymanager/DeputiyManagerSidebar";

                      // DeputiyManager plan 
import DeputiyManagerViewPlan from "./components/deputiymanager/plan/DeputiyManagerViewPlan";
// import DeputiyManagerAddPlan from "./components/deputiymanager/plan/DeputiyManagerAddPlan";
// import DeputiyManagerEditPlan from "./components/deputiymanager/plan/DeputiyManagerEditPlan";
//                       //  DeputiyManager report
// import DeputiyManagerViewReport from "./components/deputiymanager/plan/DeputiyManagerViewPlan";
// import DeputiyManagerAddReport from "./components/deputiymanager/plan/DeputiyManagerAddPlan";
// import DeputiyManagerEditReport from "./components/deputiymanager/plan/DeputiyManagerEditReport";



// service head

import DeputiyManagerDashboard from "./components/deputiyManager/DeputiyManagerDashboard";
import DeputiyManagerSidebar from "./components/deputiyManager/DeputiyManagerSidebar";


//                        // DeputiyManager plan 
import DeputiyManagerSubmittedViewPlan from "./components/deputiyManager/addplan/DeputiyManagerSubmittedViewPlan";
import DeputiyManagerViewPlan from "./components/deputiyManager/addplan/DeputiyManagerViewPlan";
import DeputiyManagerViewOrgPlan from "./components/deputiyManager/addplan/DeputiyManagerViewOrgPlan";
import DeputiyManagerUpdatePlan from "./components/deputiyManager/addplan/view/DeputiyManagerUpdatePlan";
import DeputiyManagerViewDeclinedPlan from "./components/deputiyManager/addplan/DeputiyManagerViewDeclinedPlan";


                     // report

import DeputiyManagerViewReport from "./components/deputiyManager/report/DeputiyManagerViewReport";
import DeputiyManagerUpdateReport from "./components/deputiyManager/report/view/DeputiyManagerUpdateReport";
import DeputiyManagerViewOrgReport from "./components/deputiyManager/report/DeputiyManagerViewOrgReport";
import DeputiyManagerSubmittedViewReport from "./components/deputiyManager/report/DeputiyManagerSubmittedViewReport";
import DeputiyManagerAddReport from "./components/deputiyManager/addplan/view/DeputiyManagerAddReport";
// import DeputiyManagerUpdateReport from "./components/deputiyManager/report/view/DeputiyManagerUpdateReport";
import DeputiyManagerViewDeclinedReport from "./components/deputiyManager/report/DeputiyManagerViewDeclinedReport";




// team leader
import TeamleaderDashboard from "./components/teamleader/TeamleaderDashboard";
import TeamleaderSidebar from "./components/teamleader/TeamleaderSidebar";

//                        // Teamleader plan 
import TeamleaderSubmittedViewPlan from "./components/teamleader/addplan/TeamleaderSubmittedViewPlan";
import TeamleaderViewPlan from "./components/teamleader/addplan/TeamleaderViewPlan";
import TeamleaderViewOrgPlan from "./components/teamleader/addplan/TeamleaderViewOrgPlan";
import TeamleaderUpdatePlan from "./components/teamleader/addplan/view/TeamleaderUpdatePlan";
import TeamleaderViewDeclinedPlan from "./components/teamleader/addplan/TeamleaderViewDeclinedPlan";


                     // report

import TeamleaderViewReport from "./components/teamleader/report/TeamleaderViewReport";
import TeamleaderUpdateReport from "./components/teamleader/report/view/TeamleaderUpdateReport";
import TeamleaderViewOrgReport from "./components/teamleader/report/TeamleaderViewOrgReport";
import TeamleaderSubmittedViewReport from "./components/teamleader/report/TeamleaderSubmittedViewReport";
import TeamleaderAddReport from "./components/teamleader/addplan/view/TeamleaderAddReport";
// import TeamleaderUpdateReport from "./components/teamleader/report/view/TeamleaderUpdateReport";
import TeamleaderViewDeclinedReport from "./components/teamleader/report/TeamleaderViewDeclinedReport";



// staff
import StaffDashboard from './components/staff/StaffDashboard';
import StaffSidebar from './components/staff/StaffSidebar';
import StaffViewPlan from "./components/staff/plan/StaffViewPlan";
import StaffViewDeclinedPlan from "./components/staff/plan/StaffViewDeclinedPlan";


// import StaffAddPlan from "./components/staff/plan/StaffAddPlan";


import UpdatePlan from "./components/staff/plan/view/UpdatePlan";
import AddReport from "./components/staff/plan/view/AddReport";
import PlanDetail from "./components/staff/plan/view/PlanDetail";
import StaffViewOrgPlan from "./components/staff/plan/StaffViewOrgPlan";
import PlanSteps from "./components/staff/plan/addplan/PlanSteps";
// import Step1Objective from "./components/staff/plan/addplan/Step1Objective";



//                       //  Staff report
import StaffViewReport from "./components/staff/report/StaffViewReport";
import StaffAddReport from "./components/staff/report/StaffAddReport";
import StaffEditReport from "./components/staff/report/StaffEditReport";
import UpdateReport from "./components/staff/report/view/UpdateReport";
import StaffViewOrgReport from "./components/staff/report/StaffViewOrgReport";
import StaffViewDeclinedReport from "./components/staff/report/StaffViewDeclinedReport";






function App() {
  const { state, dispatch } = useAuth();

  return (
    <>
      <BrowserRouter>
        {state.isAuthenticated ? 
        
           
          <>
          <Header />

          {state.role_id==1?
          <Sidebar/>         
           :
          
          state.role_id==2?
          <CeoSidebar/>

          :

          state.role_id==3?
          <GeneralmanagerSidebar/>
          :

          state.role_id==5?
          <DeputiyManagerSidebar/>
          :
          state.role_id==6?
          <DeputiyManagerSidebar/>
          :
          state.role_id==7?
          <TeamleaderSidebar/>

          :

          state.role_id==8?
          <StaffSidebar/>
          :


       <></>


          }



                <Routes>
              {/* admin */}

            {state.role_id==1?<>
            <Route path="/" element ={<Dashboard/>}/>
            <Route path="/" element ={<UserTable/>}/>
            <Route path="/UserForm" element ={<UserRegistration/>}/>
            <Route path="/UserTable" element ={<UserTable/>}/>
            <Route path="/EmployeeForm" element={<EmployeeRegistration/>} />
            

             {/* CEO */}
            </>:state.role_id==2?
            <>
            <Route path="/" element ={<CeoDashboard/>}/>
            <Route path="/plan/View" element={<CeoViewPlan/>} />
            {/* // plan */}
{/* // 
// <Route path="/plan/Add" element={<CeoAddPlan/>} />
// <Route path="/plan/Edit" element={<CeoEditPlan/>} />

                       // report
// <Route path="/report/View" element={<CeoViewReport/>} />
// <Route path="/report/Add" element={<CeoAddReport/>} />
// <Route path="/report/Edit" element={<CeoEditReport/>} /> */}

            {/* General manager */}

            </>:state.role_id==3?
            <>
            <Route path="/" element ={<GeneralmanagerDashboard/>}/>
            <Route path="/plan/View" element={<GeneralManagerViewPlan/>} />
            {/* // plan
// 
// <Route path="/plan/Add" element={<GeneralManagerAddPlan/>} />
// <Route path="/plan/Edit" element={<GeneralManagerEditPlan/>} />

                       // report
// <Route path="/report/View" element={<GeneralManagerViewReport/>} />
// <Route path="/report/Add" element={<GeneralManagerAddReport/>} />
// <Route path="/report/Edit" element={<GeneralManagerEditReport/>} /> */}

            {/* deputy manager */}

            </>:state.role_id==5?
            <>
            <Route path="/" element ={<DeputiyManagerDashboard/>}/>
            <Route path="/plan/View" element={<DeputiyManagerViewPlan/>} />
            {/* // plan
// 
// <Route path="/plan/Add" element={<DeputiyManagerAddPlan/>} />
// <Route path="/plan/Edit" element={<DeputiyManagerEditPlan/>} />

                       // report
// <Route path="/report/View" element={<DeputiyManagerViewReport/>} />
// <Route path="/report/Add" element={<DeputiyManagerAddReport/>} />
// <Route path="/report/Edit" element={<DeputiyManagerEditReport/>} /> */}
            {/* service Head */}

            </>:state.role_id==6?
            <>
           <Route path="/" element={<DeputiyManagerDashboard />} />
    <Route path="/plan/View" element={<DeputiyManagerSubmittedViewPlan />} />
    <Route path="/report/Viewapprovedreport" element={<DeputiyManagerSubmittedViewReport />} />
    <Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
    <Route path="/plan/View_myplan" element={<DeputiyManagerViewPlan />} />
    <Route path="/report/View_myreport" element={<DeputiyManagerViewReport />} />
    <Route path="/report/view/update/:reportId" element={<UpdateReport />} />
    <Route path="/plan/view/add-report/:planId" element={<AddReport />} />
    <Route path="/plan/ViewOrgPlan" element={<DeputiyManagerViewOrgPlan />} />
    <Route path="/report/ViewOrgReport" element={<DeputiyManagerViewOrgReport />} />
    <Route path="/report/DeputiyManagerViewDeclinedReport" element={<DeputiyManagerViewDeclinedReport />} />
    <Route path="/plan/DeputiyManagerViewDeclinedPlan" element={<DeputiyManagerViewDeclinedPlan/>} />
    <Route path="/plan/DeputiyManagerViewDeclinedPlan/view/update/:planId" element={<DeputiyManagerUpdatePlan />} />
    <Route path="/plan/View_myplan/add-report/:planId" element={<DeputiyManagerAddReport />} />

          {/* update the plan */}
    <Route path="/plan/View_myplan/update/:planId" element={<DeputiyManagerUpdatePlan />} />

          {/* 


             {/* team leader */}
            </>:state.role_id==7?
            <>
            <Route path="/" element={<TeamleaderDashboard />} />
    <Route path="/plan/View" element={<TeamleaderSubmittedViewPlan />} />
    <Route path="/report/Viewapprovedreport" element={<TeamleaderSubmittedViewReport />} />
    <Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
    <Route path="/plan/View_myplan" element={<TeamleaderViewPlan />} />
    <Route path="/report/View_myreport" element={<TeamleaderViewReport />} />
    <Route path="/report/view/update/:reportId" element={<UpdateReport />} />
    <Route path="/plan/view/add-report/:planId" element={<AddReport />} />
    <Route path="/plan/ViewOrgPlan" element={<TeamleaderViewOrgPlan />} />
    <Route path="/report/ViewOrgReport" element={<TeamleaderViewOrgReport />} />
    <Route path="/report/TeamleaderViewDeclinedReport" element={<TeamleaderViewDeclinedReport />} />
    <Route path="/plan/TeamleaderViewDeclinedPlan" element={<TeamleaderViewDeclinedPlan/>} />
    <Route path="/plan/TeamleaderViewDeclinedPlan/view/update/:planId" element={<TeamleaderUpdatePlan />} />
    <Route path="/plan/View_myplan/add-report/:planId" element={<TeamleaderAddReport />} />

          {/* update the plan */}
    <Route path="/plan/View_myplan/update/:planId" element={<TeamleaderUpdatePlan />} />

          {/* 


           
               {/* staff */}

               </>:state.role_id==8?<>
     <Route path="/" element={<StaffDashboard />} />
     <Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
    
    <Route path="/plan/StaffViewDeclinedPlan" element={<StaffViewDeclinedPlan/>} />
    <Route path="/plan/View" element={<StaffViewPlan />} />
    <Route path="/report/Add" element={<StaffAddReport />} />
    <Route path="/report/Edit" element={<StaffEditReport />} />
    <Route path="/report/View" element={<StaffViewReport />} />
    <Route path="/plan/StaffViewDeclinedPlan/view/update/:planId" element={<UpdatePlan />} />
    <Route path="/plan/view/update/:planId" element={<UpdatePlan />} />

    
    <Route path="/report/view/update/:reportId" element={<UpdateReport />} />
    <Route path="/plan/view/add-report/:planId" element={<AddReport />} />
    <Route path="/plan/view/detail/:planId" element={<PlanDetail />} />
    <Route path="/plan/ViewOrgPlan" element={<StaffViewOrgPlan />} />
    <Route path="/report/ViewOrgReport" element={<StaffViewOrgReport />} />
  
            </>:
            <>
            
          
           
            
            </>
            }
           
          </Routes>
          <Footer/>

          
          </>
              
              
             
          : 
          <Login />
        }
      </BrowserRouter>
    </>
  );
}

export default App;

