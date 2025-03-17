import { useEffect, useState } from "react";
import React from 'react';
import logo from "../../assets/img/android-chrome-512x512-1.png";
import avatar from "../../assets/img/user.png";
import { useAuth } from "../Auths/AuthContex";
import Axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
// const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar open state

export const Header = () => {
  const { state, dispatch } = useAuth();
  const userId = state.user;
  const navigate = useNavigate();

  const [unreadPlans, setUnreadPlans] = useState([]);
  const [role, setRole] = useState([]);
  const [user, setUser] = useState([]);
  const [online, setOnline] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    Axios.get("http://192.168.56.1:5000/getRole")
      .then((res) => setRole(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    Axios.get("http://192.168.56.1:5000/getUser")
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchUnreadPlans = async () => {
      try {
        const response = await Axios.get(`http://192.168.56.1:5000/api/plan/${state.user}/unread-count`);
        setUnreadPlans(response.data.results);
      } catch (error) {
        console.error("Error fetching unread plans:", error);
      }
    };

    fetchUnreadPlans();
  }, [state.user]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    dispatch({ type: 'LOGOUT' });
    try {
      await fetch(`http://192.168.56.1:5000/logout/${state.user}`, { method: "PUT", headers: { "Content-type": "application/json" } });
    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = () => {
    const planIds = unreadPlans.map(plan => plan.plan_id);
    Axios.put("http://192.168.56.1:5000/api/plan/update-read", { plan_ids: planIds, read_status: "1" })
      .then(() => setUnreadPlans([]))
      .catch((err) => console.log(err));
  };

  const handleNotificationClick = (e, plan_id) => {
    e.preventDefault();
    Axios.put(`http://192.168.56.1:5000/api/plan/${plan_id}/update-read`, { uid: userId, value: "1" })
      .then(() => navigate(`/details/${plan_id}`))
      .catch((err) => console.log('Error updating read status:', err));
  };

  const unreadCount = unreadPlans.length;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
       <style>
      {`
        /* Sidebar and main content styling with transition effects */
        .sidebar {
          transition: transform 0.3s ease;
          transform: ${isSidebarOpen ? 'translateX(0)' : 'translateX(-250px)'};
          width: 250px;
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          background-color: #f8f9fa;
          z-index: 1000;
          box-shadow: ${isSidebarOpen ? '2px 0 5px rgba(0,0,0,0.1)' : 'none'};
        }

        .main-content {
          margin-left: ${isSidebarOpen ? '250px' : '0'};
          transition: margin-left 0.3s ease;
        }
      `}
    </style>

      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <a href="#" className="logo d-flex align-items-center">
            <img src={logo} alt="Logo" />
            <span className="d-none d-lg-block" style={{ animation: "fadeIn 1.5s" }}>
              {role.map(roles => (roles.role_id === state.role_id ? roles.role_name : ""))}
            </span>
          </a>
          
        </div>



        
        {/* <CeoSidebar isOpen={isSidebarOpen} /> Passing the isSidebarOpen state as a prop */}



        {/* Real-time Clock */}
        <div className="header-time ms-auto me-3">
          <span style={{ fontSize: '14px', color: '#888', fontWeight: 'bold' }}>
            {currentTime.toLocaleTimeString()}
          </span>
        </div>

        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            {/* Notifications dropdown */}
            <li className="nav-item dropdown">
              <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown" title="Notifications">
                <i className="bi bi-bell" />
                {unreadCount > 0 && (
                  <span className="badge bg-primary badge-number animate__animated animate__pulse">
                    {unreadCount}
                  </span>
                )}
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                  {unreadCount > 0 ? (
                    <>
                      You have {unreadCount} new notifications
                      <Link to="/manageplan">
                        <span className="badge rounded-pill bg-primary p-2 ms-2">View all</span>
                      </Link>
                    </>
                  ) : (
                    <>You have no new notifications</>
                  )}
                </li>
                <li><hr className="dropdown-divider" /></li>
                {unreadPlans.map((plan, index) => (
                  <React.Fragment key={plan.plan_id}>
                    <li className="notification-item">
                      <i className="bi bi-exclamation-circle text-warning" />
                      <div>
                        <h4>
                          <a href={`/details/${plan.plan_id}`} onClick={(e) => handleNotificationClick(e, plan.plan_id)}>
                            {plan.plan_subject}
                          </a>
                        </h4>
                        <p>{plan.plan_description}</p>
                        <p>{new Date(plan.created_at).toLocaleString()}</p>
                      </div>
                    </li>
                    {index < unreadCount - 1 && <li><hr className="dropdown-divider" /></li>}
                  </React.Fragment>
                ))}
                <li className="dropdown-footer">
                  <a href="#" onClick={markAllAsRead} title="Mark all as read">Mark all as read</a>
                </li>
              </ul>
            </li>

{/* Chat icon */}
<li className="nav-item">
      <a className="nav-link nav-icon" href="/chat" title="Chat">
        <i className="bi bi-chat-dots" />
        <span className="badge bg-success badge-number">3</span> {/* Example badge */}
      </a>
    </li>


            {/* Profile dropdown */}
            <li className="nav-item dropdown pe-3">
              <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown" title="Profile">
                <img src={avatar} alt="Profile" className="rounded-circle" style={{ width: '40px', height: '40px' }} />
                <span className="d-none d-md-block dropdown-toggle ps-2">
                  <h4>Welcome, {state.fname}</h4>
                </span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>{`${state.fname} ${state.lname}`}</h6>
                  <span>{state.user_name}</span>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="/change-profile-picture">
                    <i className="bi bi-image" />
                    <span>Change Profile Picture</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" href="/change-password">
                    <i className="bi bi-lock" />
                    <span>Change Password</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right" />
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Sidebar content here */}
      </div>

      {/* Main content */}
      <div className="main-content">
        {/* Main content of the app here */}
      </div>
    </>
  );
};
