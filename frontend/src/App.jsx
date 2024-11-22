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
// import CeoAddPlan from "./components/Ceo/plan/CeoAddPlan";
// import CeoEditPlan from "./components/Ceo/plan/CeoEditPlan";
//                       //  Ceo report
// import CeoViewReport from "./components/Ceo/report/CeoViewPlan";
// import CeoAddReport from "./components/Ceo/report/CeoAddPlan";
// import CeoEditReport from "./components/Ceo/report/CeoEditReport";






// GeneralmanagerDashboard
import GeneralmanagerDashboard from "./components/generalmanager/GeneralmanagerDashboard";
import GeneralmanagerSidebar from "./components/generalmanager/GeneralmanagerSidebar";

                        // GeneralManagerplan  
import GeneralManagerViewPlan from "./components/generalmanager/plan/GeneralManagerViewPlan";
// import GeneralManagerAddPlan from "./components/generalmanager/plan/GeneralManagerAddPlan";
// import GeneralManagerEditPlan from "./components/generalmanager/plan/GeneralManagerEditPlan";
//                       //  GeneralManager report
// import GeneralManagerViewReport from "./components/generalmanager/report/GeneralManagerViewPlan";
// import GeneralManagerAddReport from "./components/generalmanager/report/GeneralManagerAddPlan";
// import GeneralManagerEditReport from "./components/generalmanager/report/GeneralManagerEditReport";

// DeputiyManager
import DeputiyManagerDashboard from "./components/deputiymanager/DeputiyManagerDashboard";
import DeputiyManagerSidebar from "./components/deputiymanager/DeputiyManagerSidebar";

//                        // DeputiyManager plan 
import DeputiyManagerViewPlan from "./components/deputiymanager/plan/DeputiyManagerViewPlan";
// import DeputiyManagerAddPlan from "./components/deputiymanager/plan/DeputiyManagerAddPlan";
// import DeputiyManagerEditPlan from "./components/deputiymanager/plan/DeputiyManagerEditPlan";
//                       //  DeputiyManager report
// import DeputiyManagerViewReport from "./components/deputiymanager/plan/DeputiyManagerViewPlan";
// import DeputiyManagerAddReport from "./components/deputiymanager/plan/DeputiyManagerAddPlan";
// import DeputiyManagerEditReport from "./components/deputiymanager/plan/DeputiyManagerEditReport";



// service head
import ServiceheadDashboard from "./components/servicehead/ServiceheadDashboard";
import ServiceheadSidebar from "./components/servicehead/ServiceheadSidebar";
import ServiceHeadViewPlan from "./components/servicehead/plan/ServiceHeadViewPlan";

// team leader
import TeamleaderDashboard from "./components/teamleader/TeamleaderDashboard";
import TeamleaderSidebar from "./components/teamleader/TeamleaderSidebar";

//                        // Teamleader plan 
import ViewPlan from "./components/teamleader/plan/ViewPlan";
// import AddPlan from "./components/teamleader/plan/TeamleaderAddPlan";
// import EditPlan from "./components/teamleader/plan/TeamleaderEditPlan";
//                       //  Teamleader report
// import TeamleaderViewReport from "./components/teamleader/report/TeamleaderViewPlan";
// import TeamleaderAddReport from "./components/teamleader/report/TeamleaderAddPlan";
// import TeamleaderEditReport from "./components/teamleader/report/TeamleaderEditReport";




// staff
import StaffDashboard from './components/staff/StaffDashboard';
import StaffSidebar from './components/staff/StaffSidebar';

// import ReportTable from './components/staff/ReportTable';
//                        // Staff plan 
// import StaffViewPlan from "./components/staff/plan/StaffViewPlan";
import StaffAddPlan from "./components/staff/plan/StaffAddPlan";
// import StaffEditPlan from "./components/staff/plan/StaffEditPlan";
//                       //  Staff report
// import StaffViewReport from "./components/staff/report/StaffViewPlan";
import StaffAddReport from "./components/staff/report/StaffAddReport";
// import StaffEditReport from "./components/staff/report/StaffEditReport";



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
          <ServiceheadSidebar/>
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
            <Route path="/" element ={<ServiceheadDashboard/>}/>
            <Route path="/plan/View" element={<ServiceHeadViewPlan/>} />

             {/* team leader */}
            </>:state.role_id==7?
            <>
            <Route path="/" element ={<TeamleaderDashboard/>}/>
            <Route path="/plan/View" element={<ViewPlan/>} />
           
           {/*                  plan
          <Route path="/plan/View" element={<ViewPlan/>} />
          <Route path="/plan/Add" element={<AddPlan/>} />
          <Route path="/plan/Edit" element={<EditPlan/>} />

                                report
          <Route path="/report/View" element={<TeamleaderViewReport/>} />
          <Route path="/report/Add" element={<TeamleaderAddReport/>} />
          <Route path="/report/Edit" element={<TeamleaderEditReport/>} /> */}

               {/* staff */}

               </>:state.role_id==8?<>
            <Route path="/" element ={<StaffDashboard/>}/>
            <Route path="/plan/Add" element={<StaffAddPlan/>} />
            <Route path="/report/Add" element={<StaffAddReport/>} />
            {/* // plan
// <Route path="/plan/View" element={<StaffViewPlan/>} />
// 
// <Route path="/plan/Edit" element={<StaffEditPlan/>} />

                       // report
// <Route path="/report/View" element={<StaffViewReport/>} />
// 
// <Route path="/report/Edit" element={<StaffEditReport/>} /> */}
 
            
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

