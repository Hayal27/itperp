import React from "react";
import styles from "./StaffDashboard.module.css";

const NotificationDisplay = () => {
  return (
    <div className={styles.sidebarSection}>
      <h3>Notifications</h3>
      <ul>
        <li>New report available.</li>
        <li>Meeting scheduled at 3 PM.</li>
        <li>Data update completed.</li>
      </ul>
    </div>
  );
};

export default NotificationDisplay;