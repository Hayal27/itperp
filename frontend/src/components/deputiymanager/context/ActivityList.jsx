// src/components/ActivityList.js
import React from "react";

const ActivityList = ({ activities }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Recent Activities</h5>
        <div className="activity">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="activity-item d-flex">
                <div className="activite-label">{activity.time}</div>
                <i
                  className={`bi bi-circle-fill activity-badge ${
                    activity.status === "completed" ? "text-success" : "text-warning"
                  } align-self-start`}
                />
                <div className="activity-content">
                  <a href="#" className="fw-bold text-dark">
                    {activity.title}
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p>No activities available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
