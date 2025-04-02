
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/img/android-chrome-512x512-1.png";
import { useAuth } from "../Auths/AuthContex";
import '../../assets/css/magic-tooltip.css';

const BACKEND_URL = "http://192.168.56.1:5000";

const Header = () => {
  const { state, dispatch } = useAuth();
  const token = localStorage.getItem("token");
  // Remove defaultAvatar from initial state so that only the real image is used
  const [profilePic, setProfilePic] = useState("");
  const [role, setRole] = useState("");
  const [unreadPlans, setUnreadPlans] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fetchMessage, setFetchMessage] = useState("");
  const [fetchError, setFetchError] = useState("");
  // flag for image loading failure
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  useEffect(() => {
    console.log("Fetching user role...");
    axios
      .get(`${BACKEND_URL}/api/userrole`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        console.log("User role response:", res.data);
        if (res.data && res.data.role_name) {
          setRole(res.data.role_name);
        }
      })
      .catch((err) =>
        console.error("Error fetching role:", err.response ? err.response.data : err.message)
      );
  }, [token]);

  useEffect(() => {
    const userId =
      typeof state.user === "object" && state.user.user_id ? state.user.user_id : state.user;
    if (userId) {
      console.log("Fetching profile picture for user:", userId);
      axios
        .get(`${BACKEND_URL}/api/getprofile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          console.log("Backend profile picture response:", res.data);
          if (res.data && res.data.success) {
            let avatarUrl = res.data.avatarUrl;
            // Normalize URL: convert any backslashes to forward slashes
            avatarUrl = avatarUrl.replace(/\\/g, '/');
            // Ensure the image path is correct (check folder name)
            if (avatarUrl.includes("/uploads/")) {
              avatarUrl = avatarUrl.replace("/uploads/", "/uploads/"); // Fix the typo if necessary
            }
            console.log("Normalized avatarUrl:", avatarUrl);
            setProfilePic(avatarUrl);

            setFetchError("");
            setImageLoadFailed(false);
          } else {
            console.warn("No profile picture found in response.");
            setFetchError("No profile picture found.");
            setFetchMessage("");
          }
        })
        .catch((err) => {
          const errorMsg = err.response ? err.response.data : err.message;
          console.error("Error fetching profile picture:", errorMsg);
          setFetchMessage("");
        });
    } else {
      console.warn("User identifier is missing. Unable to fetch profile picture.");
    }
  }, [token, state.user]);

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

  // Handlers for image load events
  const handleImageLoad = () => {
    console.log("Profile picture rendered successfully in UI:", profilePic);
    setFetchError("");
    setImageLoadFailed(false);
  };

  const handleImageError = (e) => {
    const errorURL = e.target.src;
    console.error("Error rendering profile picture in UI for URL:", errorURL);
    setFetchError(`Profile picture failed to load. Please verify that the image exists and is publicly accessible: ${errorURL}`);
    setFetchMessage("");
    setImageLoadFailed(true);
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
            <li className="custom-nav-profile-wrapper">
              <a className="custom-nav-profile" href="#" data-toggle="dropdown" title="Profile">
                {/* Render image only if profilePic is available and imageLoadFailed is false */}
                {!imageLoadFailed && profilePic && (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="custom-profile-picture"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                )}
                <span className="custom-profile-welcome">
                  <h4> {state.name || "User"}</h4>
                </span>
              </a>
              <ul className="custom-dropdown-menu">
                <li className="custom-dropdown-header">
                  <h6>{`${state.name || ""} ${state.lname || ""}`}</h6>
                  <span>{state.user_name || ""}</span>
                </li>
                <li>
                  <Link className="custom-dropdown-item" to="/ProfilePictureUpload">
                    <i className="custom-icon-image"></i>
                    <span>Change Profile Picture</span>
                  </Link>
                </li>
                <li>
                  <Link className="custom-dropdown-item" to="/change-password">
                    <i className="custom-icon-lock"></i>
                    <span>Change Password</span>
                  </Link>
                </li>
                <li>
                  <a className="custom-dropdown-item" href="#" onClick={handleLogout}>
                    <i className="custom-icon-logout"></i>
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
      {/* Display success or error message */}
      <div className="container mt-2">
        {fetchMessage && <div className="alert alert-success">{fetchMessage}</div>}
        {fetchError && <div className="alert alert-danger">{fetchError}</div>}
      </div>
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Sidebar content */}
      </aside>
      <main className="main-content">
        {/* Modal for profile upload has been removed in favor of page redirection */}
      </main>
    </>
  );
};

export default Header;
