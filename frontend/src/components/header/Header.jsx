
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/img/android-chrome-512x512-1.png";
import { useAuth } from "../Auths/AuthContex";
import './Header.css';

const BACKEND_URL = "http://localhost:5000";

const Header = () => {
  const { state, dispatch } = useAuth();
  const token = localStorage.getItem("token");
  const [profilePic, setProfilePic] = useState("");
  const [role, setRole] = useState("");
  const [unreadPlans, setUnreadPlans] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fetchMessage, setFetchMessage] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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
    setFetchMessage("");
    setImageLoadFailed(true);
  };

  return (
    <>
      <header className="professional-header">
        <div className="header-container">
          {/* Logo and Brand */}
          <div className="header-brand">
            <Link to="/" className="brand-link">
              <img src={logo} alt="Logo" className="brand-logo" />
              <div className="brand-info">
                <span className="brand-title">Admin Panel</span>
                <span className="brand-subtitle">{role || "Loading..."}</span>
              </div>
            </Link>
          </div>

          {/* Header Center - Search and Time */}
          <div className="header-center">
            <div className="search-container">
              <div className="search-box">
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                />
              </div>
            </div>

            <div className="header-time">
              <i className="bi bi-clock time-icon"></i>
              <span className="time-text">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Header Right - Navigation */}
          <nav className="header-nav">
            <ul className="nav-list">

              {/* Notifications */}
              <li className="nav-item">
                <div
                  className="nav-link notification-trigger"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <i className="bi bi-bell nav-icon"></i>
                  {unreadPlans.length > 0 && (
                    <span className="notification-badge">
                      {unreadPlans.length}
                    </span>
                  )}
                </div>

                {showNotifications && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h6>Notifications</h6>
                      <span className="notification-count">
                        {unreadPlans.length} new
                      </span>
                    </div>

                    <div className="notification-list">
                      {unreadPlans.length > 0 ? (
                        unreadPlans.map((plan, index) => (
                          <div key={plan.plan_id} className="notification-item">
                            <div className="notification-icon">
                              <i className="bi bi-exclamation-circle"></i>
                            </div>
                            <div className="notification-content">
                              <h6 className="notification-title">
                                {plan.plan_subject}
                              </h6>
                              <p className="notification-text">
                                {plan.plan_description}
                              </p>
                              <span className="notification-time">
                                {new Date(plan.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-notifications">
                          <i className="bi bi-bell-slash"></i>
                          <p>No new notifications</p>
                        </div>
                      )}
                    </div>

                    {unreadPlans.length > 0 && (
                      <div className="notification-footer">
                        <button
                          className="mark-all-read-btn"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>

              {/* Messages */}
              <li className="nav-item">
                <Link to="/chat" className="nav-link">
                  <i className="bi bi-chat-dots nav-icon"></i>
                  <span className="message-badge">3</span>
                </Link>
              </li>

              {/* Profile */}
              <li className="nav-item profile-item">
                <div
                  className="profile-trigger"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                  <div className="profile-avatar">
                    {!imageLoadFailed && profilePic ? (
                      <img
                        src={profilePic}
                        alt="Profile"
                        className="avatar-image"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <i className="bi bi-person"></i>
                      </div>
                    )}
                  </div>

                  <div className="profile-info">
                    <span className="profile-name">
                      {state.name || "User"}
                    </span>
                    <span className="profile-role">
                      {role}
                    </span>
                  </div>

                  <i className="bi bi-chevron-down profile-arrow"></i>
                </div>

                {showProfileDropdown && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <div className="profile-dropdown-avatar">
                        {!imageLoadFailed && profilePic ? (
                          <img src={profilePic} alt="Profile" />
                        ) : (
                          <div className="avatar-placeholder">
                            <i className="bi bi-person"></i>
                          </div>
                        )}
                      </div>
                      <div className="profile-dropdown-info">
                        <h6>{`${state.name || ""} ${state.lname || ""}`}</h6>
                        <span>{state.user_name || ""}</span>
                      </div>
                    </div>

                    <div className="profile-dropdown-menu">
                      <Link to="/ProfilePictureUpload" className="dropdown-item">
                        <i className="bi bi-image"></i>
                        <span>Change Profile Picture</span>
                      </Link>
                      <Link to="/change-password" className="dropdown-item">
                        <i className="bi bi-lock"></i>
                        <span>Change Password</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout-item">
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Success/Error Messages */}
      {(fetchMessage || fetchError) && (
        <div className="message-container">
          {fetchMessage && (
            <div className="alert alert-success alert-dismissible">
              {fetchMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setFetchMessage("")}
              ></button>
            </div>
          )}
          {fetchError && (
            <div className="alert alert-danger alert-dismissible">
              {fetchError}
              <button
                type="button"
                className="btn-close"
                onClick={() => setFetchError("")}
              ></button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
