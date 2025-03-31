
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/img/android-chrome-512x512-1.png";
import defaultAvatar from "../../assets/img/user.png";
import { useAuth } from "../Auths/AuthContex";
import ProfilePictureUpload from "../header/profile/ProfilePictureUpload";

const BACKEND_URL = "http://192.168.100.134:5000";  // Base URL for backend

const Header = () => {
  const { state, dispatch } = useAuth();
  const token = localStorage.getItem("token");

  const [profilePic, setProfilePic] = useState(defaultAvatar);
  const [role, setRole] = useState("");
  const [user, setUser] = useState({});
  const [unreadPlans, setUnreadPlans] = useState([]);
  const [online, setOnline] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfileUpload, setShowProfileUpload] = useState(false);

  useEffect(() => {
    console.log("Fetching user role...");
    axios
      .get(`${BACKEND_URL}/api/userrole`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        console.log("User role response:", res.data);
        // Ensure role is set if response exists.
        if (res.data && res.data.role_name) {
          setRole(res.data.role_name);
        }
      })
      .catch((err) =>
        console.error("Error fetching role:", err.response ? err.response.data : err.message)
      );
  }, [token]);

  useEffect(() => {
    console.log("Fetching profile picture...");
    axios
      .get(`${BACKEND_URL}/api/getprofile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        console.log("Profile response:", res.data);
        setUser(res.data);
        if (res.data.avatar) {
          // If the avatar URL is relative, prefix it with the backend base url.
          const avatarUrl = res.data.avatar.startsWith("http")
            ? res.data.avatar
            : `${BACKEND_URL}${res.data.avatar}`;
          setProfilePic(avatarUrl);
        }
      })
      .catch((err) =>
        console.error("Error fetching profile:", err.response ? err.response.data : err.message)
      );
  }, [token]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    dispatch({ type: "LOGOUT" });
    try {
      await fetch(`${BACKEND_URL}/logout/${state.user}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = async () => {
    const planIds = unreadPlans.map((plan) => plan.plan_id);
    try {
      await axios.put(
        `${BACKEND_URL}/api/plan/update-read`, 
        { plan_ids: planIds, read_status: "1" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadPlans([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (e, plan_id) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BACKEND_URL}/api/plan/${plan_id}/update-read`, 
        { uid: state.user, value: "1" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error updating read status:", err);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleProfileUploadSuccess = (newImageUrl) => {
    // If newImageUrl is relative, prefix the backend's URL.
    const finalImageUrl = newImageUrl.startsWith("http")
      ? newImageUrl
      : `${BACKEND_URL}${newImageUrl}`;
    setProfilePic(finalImageUrl);
    setShowProfileUpload(false);
  };

  return (
    <>
      <header id="header" className="header fixed-top d-flex align-items-center">
        <div className="d-flex align-items-center justify-content-between">
          <a href="#" className="logo d-flex align-items-center">
            <img src={logo} alt="Logo" />
            <span className="d-none d-lg-flex" style={{ animation: "fadeIn 3.5s" }}>
              {role || "Loading Role..."}
            </span>
          </a>
        </div>
        <div className="header-time ms-auto me-3">
          <span style={{ fontSize: "14px", color: "#888", fontWeight: "bold" }}>
            {currentTime.toLocaleTimeString()}
          </span>
        </div>
        <nav className="header-nav ms-auto">
          <ul className="d-flex align-items-center">
            <li className="nav-item dropdown">
              <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown" title="Notifications">
                <i className="bi bi-bell" />
                {unreadPlans.length > 0 && (
                  <span className="badge bg-primary badge-number animate__animated animate__pulse">
                    {unreadPlans.length}
                  </span>
                )}
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                <li className="dropdown-header">
                  {unreadPlans.length > 0 ? (
                    <>
                      You have {unreadPlans.length} new notifications
                      <Link to="/manageplan">
                        <span className="badge rounded-pill bg-primary p-2 ms-2">View all</span>
                      </Link>
                    </>
                  ) : (
                    "You have no new notifications"
                  )}
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                {unreadPlans.map((plan, index) => (
                  <React.Fragment key={plan.plan_id}>
                    <li className="notification-item">
                      <i className="bi bi-exclamation-circle text-warning" />
                      <div>
                        <h4>
                          <a href="#" onClick={(e) => handleNotificationClick(e, plan.plan_id)}>
                            {plan.plan_subject}
                          </a>
                        </h4>
                        <p>{plan.plan_description}</p>
                        <p>{new Date(plan.created_at).toLocaleString()}</p>
                      </div>
                    </li>
                    {index < unreadPlans.length - 1 && <li><hr className="dropdown-divider" /></li>}
                  </React.Fragment>
                ))}
                <li className="dropdown-footer">
                  <a href="#" onClick={markAllAsRead} title="Mark all as read">
                    Mark all as read
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-icon" href="/chat" title="Chat">
                <i className="bi bi-chat-dots" />
                <span className="badge bg-success badge-number">3</span>
              </a>
            </li>
            <li className="nav-item dropdown pe-3">
              <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown" title="Profile">
                <img src={profilePic} alt="Profile" className="rounded-circle" style={{ width: "80px", height: "40px" }} />
                <span className="d-none d-md-block dropdown-toggle ps-2">
                  <h4>Welcome, {state.fname || "User"}</h4>
                </span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                  <h6>{`${state.fname || ""} ${state.lname || ""}`}</h6>
                  <span>{state.user_name || ""}</span>
                </li>
                <li>
                  <a 
                    className="dropdown-item d-flex align-items-center" 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowProfileUpload(true);
                    }}>
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
                  <a className="dropdown-item d-flex align-items-center" href="#" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right" />
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Sidebar content */}
      </aside>
      <main className="main-content">
        {showProfileUpload && (
          <ProfilePictureUpload 
            token={token}
            onUploadSuccess={handleProfileUploadSuccess}
            onCancel={() => setShowProfileUpload(false)}
          />
        )}
      </main>
    </>
  );
};

export default Header;
