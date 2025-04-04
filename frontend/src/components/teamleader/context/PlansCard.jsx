// src/components/PlansCard.js
import React from "react";

const PlansCard = ({ plans, activePlansCount }) => {
  return (
    <div className="col-xxl-4 col-md-6">
      <div className="card info-card plan-card">
        <div className="filter">
          <a className="icon" href="#" data-bs-toggle="dropdown">
            <i className="bi bi-three-dots" />
          </a>
          <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <li className="dropdown-header text-start">
              <h6>Filter</h6>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Active
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#">
                Completed
              </a>
            </li>
          </ul>
        </div>
        <div className="card-body">
          <h5 className="card-title">
            Plans <span>| Active</span>
          </h5>
          <div className="d-flex align-items-center">
            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
              <i className="bi bi-clipboard-check" />
            </div>
            <div className="ps-3">
              <h6>{activePlansCount} Active Plans</h6>
              <span className="text-success small pt-1 fw-bold">
                {activePlansCount * 5}%
              </span>{" "}
              <span className="text-muted small pt-2 ps-1">increase</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansCard;
