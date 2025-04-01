// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./components/Auths/AuthContex";
import Login from "./components/login/Login";
import 'bootstrap/dist/css/bootstrap.min.css';


//admin
import Sidebar from "./components/admin/Sidebar";
import  Header from "./components/header/Header";
import Dashboard from "./components/admin/Dashboard";
import UserRegistration from "./components/admin/UserRegistration";
import UserTable from "./components/admin/UserTable";
import Footer from "./components/footer/Footer";
// import EmployeeRegistration 
import EmployeeRegistration from './components/admin/employeeRegistration';


// Ceo
import CeoDashboard from "./components/Ceo/CeoDashboard";
import CeoSidebar from "./components/Ceo/CeoSidebar";

//                        // Ceo plan 



import CeoSubmittedViewPlan from "./components/Ceo/addplan/CeoSubmittedViewPlan";
import CeoViewPlan from "./components/Ceo/addplan/CeoViewPlan";
import CeoViewOrgPlan from "./components/Ceo/addplan/CeoViewOrgPlan";
import CeoUpdatePlan from "./components/Ceo/addplan/view/CeoUpdatePlan";
import CeoViewDeclinedPlan from "./components/Ceo/addplan/CeoViewDeclinedPlan";


                     // report

import CeoViewReport from "./components/Ceo/report/CeoViewReport";
import CeoUpdateReport from "./components/Ceo/report/view/CeoUpdateReport";
import CeoViewOrgReport from "./components/Ceo/report/CeoViewOrgReport";
import CeoSubmittedViewReport from "./components/Ceo/report/CeoSubmittedViewReport";
import CeoAddReport from "./components/Ceo/addplan/view/CeoAddReport";
// import CeoUpdateReport from "./components/Ceo/report/view/CeoUpdateReport";
import CeoViewDeclinedReport from "./components/Ceo/report/CeoViewDeclinedReport";




// Planreport
import PlanreportDashboard from "./components/planreport/PlanreportDashboard";
import PlanreportSidebar from "./components/planreport/PlanreportSidebar";

//                        // Planreport plan 



import PlanreportSubmittedViewPlan from "./components/planreport/addplan/PlanreportSubmittedViewPlan";
import PlanreportViewPlan from "./components/planreport/addplan/PlanreportViewPlan";
import PlanreportViewOrgPlan from "./components/planreport/addplan/PlanreportViewOrgPlan";
import PlanreportUpdatePlan from "./components/planreport/addplan/view/PlanreportUpdatePlan";
import PlanreportViewDeclinedPlan from "./components/planreport/addplan/PlanreportViewDeclinedPlan";
import PPlanSteps from "./components/planreport/addplan/PPlanSteps.jsx";

                     // report

import PlanreportViewReport from "./components/planreport/report/PlanreportViewReport";
import PlanreportUpdateReport from "./components/planreport/report/view/PlanreportUpdateReport";
import PlanreportViewOrgReport from "./components/planreport/report/PlanreportViewOrgReport";
import PlanreportSubmittedViewReport from "./components/planreport/report/PlanreportSubmittedViewReport";
import PlanreportAddReport from "./components/planreport/addplan/view/PlanreportAddReport";
// import PlanreportUpdateReport from "./components/planreport/report/view/PlanreportUpdateReport";
import PlanreportViewDeclinedReport from "./components/planreport/report/PlanreportViewDeclinedReport";



// Generalmanager
import GeneralmanagerDashboard from "./components/generalmanager/GeneralmanagerDashboard";
import GeneralmanagerSidebar from "./components/generalmanager/GeneralmanagerSidebar";

//                        // Generalmanager plan 



import GeneralmanagerSubmittedViewPlan from "./components/generalmanager/addplan/GeneralmanagerSubmittedViewPlan";
import GeneralmanagerViewPlan from "./components/generalmanager/addplan/GeneralmanagerViewPlan";
import GeneralmanagerViewOrgPlan from "./components/generalmanager/addplan/GeneralmanagerViewOrgPlan";
import GeneralmanagerUpdatePlan from "./components/generalmanager/addplan/view/GeneralmanagerUpdatePlan";
import GeneralmanagerViewDeclinedPlan from "./components/generalmanager/addplan/GeneralmanagerViewDeclinedPlan";


                     // report

import GeneralmanagerViewReport from "./components/generalmanager/report/GeneralmanagerViewReport";
import GeneralmanagerUpdateReport from "./components/generalmanager/report/view/GeneralmanagerUpdateReport";
import GeneralmanagerViewOrgReport from "./components/generalmanager/report/GeneralmanagerViewOrgReport";
import GeneralmanagerSubmittedViewReport from "./components/generalmanager/report/GeneralmanagerSubmittedViewReport";
import GeneralmanagerAddReport from "./components/generalmanager/addplan/view/GeneralmanagerAddReport";
// import GeneralmanagerUpdateReport from "./components/generalmanager/report/view/GeneralmanagerUpdateReport";
import GeneralmanagerViewDeclinedReport from "./components/generalmanager/report/GeneralmanagerViewDeclinedReport";

 // DeputiyManager

 import DeputiyManagerDashboard from "./components/deputiyManager/DeputiyManagerDashboard";
 import DeputiyManagerSidebar from "./components/deputiyManager/DeputiyManagerSidebar";
 
 
 //                        // DeputiyManager plan 
 import DeputiyManagerSubmittedViewPlan from "./components/deputiyManager/addplan/DeputiyManagerSubmittedViewPlan";
 import DeputiyManagerViewPlan from "./components/deputiyManager/addplan/DeputiyManagerViewPlan";
 import DeputiyManagerViewOrgPlan from "./components/deputiyManager/addplan/DeputiyManagerViewOrgPlan";
 import DeputiyManagerUpdatePlan from "./components/deputiyManager/addplan/view/DeputiyManagerUpdatePlan";
 import DeputiyManagerViewDeclinedPlan from "./components/deputiyManager/addplan/DeputiyManagerViewDeclinedPlan";
 
 
                      // report
 
 import DeputiyManagerViewReport from "./components/deputiymanager/report/DeputiyManagerViewReport.jsx";
//  import DeputiyManagerUpdateReport from "./components/deputiyManager/report/view/DeputiyManagerUpdateReport";
 import DeputiyManagerViewOrgReport from "./components/deputiyManager/report/DeputiyManagerViewOrgReport";
 import DeputiyManagerSubmittedViewReport from "./components/deputiyManager/report/DeputiyManagerSubmittedViewReport";
 import DeputiyManagerAddReport from "./components/deputiyManager/addplan/view/DeputiyManagerAddReport";
 // import DeputiyManagerUpdateReport from "./components/deputiyManager/report/view/DeputiyManagerUpdateReport";
 import DeputiyManagerViewDeclinedReport from "./components/deputiyManager/report/DeputiyManagerViewDeclinedReport";
 

// service head

import ServiceHeadDashboard from "./components/serviceHead/ServiceHeadDashboard";
import ServiceHeadSidebar from "./components/serviceHead/ServiceHeadSidebar";


//                        // ServiceHead plan 
import ServiceHeadSubmittedViewPlan from "./components/ServiceHead/addplan/ServiceHeadSubmittedViewPlan";
import ServiceHeadViewPlan from "./components/ServiceHead/addplan/ServiceHeadViewPlan";
import ServiceHeadViewOrgPlan from "./components/ServiceHead/addplan/ServiceHeadViewOrgPlan";
import ServiceHeadUpdatePlan from "./components/ServiceHead/addplan/view/ServiceHeadUpdatePlan";
import ServiceHeadViewDeclinedPlan from "./components/ServiceHead/addplan/ServiceHeadViewDeclinedPlan";


                     // report

import ServiceHeadViewReport from "./components/ServiceHead/report/ServiceHeadViewReport";
import ServiceHeadUpdateReport from "./components/ServiceHead/report/view/ServiceHeadUpdateReport";
import ServiceHeadViewOrgReport from "./components/ServiceHead/report/ServiceHeadViewOrgReport";
import ServiceHeadSubmittedViewReport from "./components/ServiceHead/report/ServiceHeadSubmittedViewReport";
import ServiceHeadAddReport from "./components/ServiceHead/addplan/view/ServiceHeadAddReport";
// import ServiceHeadUpdateReport from "./components/ServiceHead/report/view/ServiceHeadUpdateReport";
import ServiceHeadViewDeclinedReport from "./components/ServiceHead/report/ServiceHeadViewDeclinedReport";




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
          state.role_id==9?
          <TeamleaderSidebar/>
          :

          state.role_id==3?
          <TeamleaderSidebar/>
          :

          state.role_id==5?
          <TeamleaderSidebar/>
          :
          state.role_id==6?
          <TeamleaderSidebar/>
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
<Route path="/" element={<TeamleaderDashboard />} />
<Route path="/plan/View" element={<CeoSubmittedViewPlan />} />
<Route path="/report/Viewapprovedreport" element={<TeamleaderSubmittedViewReport />} />
<Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
<Route path="/plan/View_myplan" element={<StaffViewPlan />} />
<Route path="/report/View_myreport" element={<CeoViewReport />} />
<Route path="/report/view/update/:reportId" element={<UpdateReport />} />
<Route path="/plan/view/add-report/:planId" element={<AddReport />} />
<Route path="/plan/ViewOrgPlan" element={<CeoViewOrgPlan />} />
<Route path="/report/ViewOrgReport" element={<CeoViewOrgReport />} />
<Route path="/report/CeoViewDeclinedReport" element={<CeoViewDeclinedReport />} />
<Route path="/plan/CeoViewDeclinedPlan" element={<CeoViewDeclinedPlan/>} />
<Route path="/plan/CeoViewDeclinedPlan/view/update/:planId" element={<CeoUpdatePlan />} />
<Route path="/plan/View_myplan/add-report/:planId" element={<CeoAddReport />} />

      {/* update the plan */}
<Route path="/plan/View_myplan/update/:planId" element={<CeoUpdatePlan />} />

      {/* 


            {/* Plan And report manager */}

            </>:state.role_id==9?
            <>
<Route path="/" element={<TeamleaderDashboard />} />
<Route path="/plan/View" element={<TeamleaderSubmittedViewPlan />} />
<Route path="/report/Viewapprovedreport" element={<TeamleaderSubmittedViewReport />} />
{/* <Route path="/addplan/addPlanSteps" element={<addPlanSteps/>} />
 */}
{/* <Route path="/addplan/PPlanSteps" element={<PPlanSteps/>} /> */}
<Route path="/plan/PlanSteps/Add" element={<PPlanSteps/>} />



<Route path="/plan/View_myplan" element={<StaffViewPlan />} />
<Route path="/report/View_myreport" element={<PlanreportViewReport />} />
<Route path="/report/view/update/:reportId" element={<UpdateReport />} />
<Route path="/plan/view/add-report/:planId" element={<AddReport />} />
<Route path="/plan/ViewOrgPlan" element={<PlanreportViewOrgPlan />} />
<Route path="/report/ViewOrgReport" element={<PlanreportViewOrgReport />} />
<Route path="/report/PlanreportViewDeclinedReport" element={<PlanreportViewDeclinedReport />} />
<Route path="/plan/PlanreportViewDeclinedPlan" element={<PlanreportViewDeclinedPlan/>} />
<Route path="/plan/PlanreportViewDeclinedPlan/view/update/:planId" element={<PlanreportUpdatePlan />} />
<Route path="/plan/View_myplan/add-report/:planId" element={<PlanreportAddReport />} />

      {/* update the plan */}
<Route path="/plan/View_myplan/update/:planId" element={<TeamleaderUpdatePlan />} />

      {/* 




            {/* General manager */}

            </>:state.role_id==3?
            <>
<Route path="/" element={<TeamleaderDashboard />} />
<Route path="/plan/View" element={<GeneralmanagerSubmittedViewPlan />} />
<Route path="/report/Viewapprovedreport" element={<GeneralmanagerSubmittedViewReport />} />
<Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
<Route path="/plan/View_myplan" element={<StaffViewPlan />} />
<Route path="/report/View_myreport" element={<GeneralmanagerViewReport />} />
<Route path="/report/view/update/:reportId" element={<UpdateReport />} />
<Route path="/plan/view/add-report/:planId" element={<AddReport />} />
<Route path="/plan/ViewOrgPlan" element={<GeneralmanagerViewOrgPlan />} />
<Route path="/report/ViewOrgReport" element={<GeneralmanagerViewOrgReport />} />
<Route path="/report/GeneralmanagerViewDeclinedReport" element={<GeneralmanagerViewDeclinedReport />} />
<Route path="/plan/GeneralmanagerViewDeclinedPlan" element={<GeneralmanagerViewDeclinedPlan/>} />
<Route path="/plan/GeneralmanagerViewDeclinedPlan/view/update/:planId" element={<GeneralmanagerUpdatePlan />} />
<Route path="/plan/View_myplan/add-report/:planId" element={<GeneralmanagerAddReport />} />

      {/* update the plan */}
<Route path="/plan/View_myplan/update/:planId" element={<TeamleaderUpdatePlan />} />

      {/* 

            {/* deputy manager */}

            </>:state.role_id==5?
            <>
          
          <Route path="/" element={<TeamleaderDashboard />} />
    <Route path="/plan/View" element={<DeputiyManagerSubmittedViewPlan />} />
    <Route path="/report/Viewapprovedreport" element={<TeamleaderSubmittedViewReport />} />
    <Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
    <Route path="/plan/View_myplan" element={<StaffViewPlan />} />
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
    <Route path="/plan/View_myplan/update/:planId" element={<TeamleaderUpdatePlan />} />

          




            </>:state.role_id==6?
            <>
           <Route path="/" element={<TeamleaderDashboard />} />
    <Route path="/plan/View" element={<ServiceHeadSubmittedViewPlan />} />
    
    <Route path="/report/Viewapprovedreport" element={<TeamleaderSubmittedViewReport />} />
    
    <Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
    <Route path="/plan/View_myplan" element={<StaffViewPlan />} />
    <Route path="/report/View_myreport" element={<ServiceHeadViewReport />} />
    <Route path="/report/view/update/:reportId" element={<UpdateReport />} />
    <Route path="/plan/view/add-report/:planId" element={<AddReport />} />
    <Route path="/plan/ViewOrgPlan" element={<ServiceHeadViewOrgPlan />} />
    <Route path="/report/ViewOrgReport" element={<ServiceHeadViewOrgReport />} />
    <Route path="/report/ServiceHeadViewDeclinedReport" element={<ServiceHeadViewDeclinedReport />} />
    <Route path="/plan/ServiceHeadViewDeclinedPlan" element={<ServiceHeadViewDeclinedPlan/>} />
    <Route path="/plan/ServiceHeadViewDeclinedPlan/view/update/:planId" element={<ServiceHeadUpdatePlan />} />
    <Route path="/plan/View_myplan/add-report/:planId" element={<ServiceHeadAddReport />} />

          {/* update the plan */}
    <Route path="/plan/View_myplan/update/:planId" element={<TeamleaderUpdatePlan />} />

          {/* 


             {/* team leader */}
            </>:state.role_id==7?
            <>
            <Route path="/" element={<TeamleaderDashboard />} />
    <Route path="/plan/View" element={<TeamleaderSubmittedViewPlan />} />
    <Route path="/report/Viewapprovedreport" element={<TeamleaderSubmittedViewReport />} />
    <Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
    <Route path="/plan/View_myplan" element={<StaffViewPlan />} />
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
     <Route path="/" element={<TeamleaderDashboard />} />
     <Route path="/plan/PlanSteps/Add" element={<PlanSteps/>} />
    
    <Route path="/plan/StaffViewDeclinedPlan" element={<StaffViewDeclinedPlan/>} />
    <Route path="/plan/View" element={<StaffViewPlan />} />
    <Route path="/report/Add" element={<StaffAddReport />} />
    <Route path="/report/Edit" element={<StaffEditReport />} />
    <Route path="/report/View" element={<StaffViewReport />} />
    <Route path="/plan/StaffViewDeclinedPlan/update/:planId" element={<UpdatePlan />} />
               
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

