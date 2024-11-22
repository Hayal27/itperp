import React from 'react';

const StaffDashboard = () => {
  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <h1>Employee Dashboard</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="index.html">StaffDashboard</a></li>
              <li className="breadcrumb-item active">Dashboard</li>
            </ol>
          </nav>
        </div>{/* End Page Title */}
        
        <section className="section StaffDashboard">
          <div className="row">
            {/* Left side columns */}
            <div className="col-lg-8">
              <div className="row">
                {/* Plan Card */}
                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card plan-card">
                    <div className="filter">
                      <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                        <li className="dropdown-header text-start">
                          <h6>Filter</h6>
                        </li>
                        <li><a className="dropdown-item" href="#">Active</a></li>
                        <li><a className="dropdown-item" href="#">Completed</a></li>
                      </ul>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">Plans <span>| Active</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-clipboard-check" />
                        </div>
                        <div className="ps-3">
                          <h6>8 Plans</h6>
                          <span className="text-success small pt-1 fw-bold">15%</span> <span className="text-muted small pt-2 ps-1">increase</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{/* End Plan Card */}

                {/* Report Card */}
                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card report-card">
                    <div className="filter">
                      <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                        <li className="dropdown-header text-start">
                          <h6>Filter</h6>
                        </li>
                        <li><a className="dropdown-item" href="#">Daily</a></li>
                        <li><a className="dropdown-item" href="#">Weekly</a></li>
                        <li><a className="dropdown-item" href="#">Monthly</a></li>
                      </ul>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">Reports <span>| Weekly</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-file-earmark-pdf" />
                        </div>
                        <div className="ps-3">
                          <h6>5 Reports</h6>
                          <span className="text-warning small pt-1 fw-bold">8%</span> <span className="text-muted small pt-2 ps-1">decrease</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{/* End Report Card */}

                {/* Activity Card */}
                <div className="col-xxl-4 col-md-6">
                  <div className="card info-card activity-card">
                    <div className="filter">
                      <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                        <li className="dropdown-header text-start">
                          <h6>Filter</h6>
                        </li>
                        <li><a className="dropdown-item" href="#">Pending</a></li>
                        <li><a className="dropdown-item" href="#">Completed</a></li>
                      </ul>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">Activity <span>| In Progress</span></h5>
                      <div className="d-flex align-items-center">
                        <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                          <i className="bi bi-clock" />
                        </div>
                        <div className="ps-3">
                          <h6>7 Activities</h6>
                          <span className="text-danger small pt-1 fw-bold">10%</span> <span className="text-muted small pt-2 ps-1">decrease</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{/* End Activity Card */}

                {/* Report Section */}
                <div className="col-12">
                  <div className="card">
                    <div className="filter">
                      <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
                      <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                        <li className="dropdown-header text-start">
                          <h6>Filter</h6>
                        </li>
                        <li><a className="dropdown-item" href="#">This Week</a></li>
                        <li><a className="dropdown-item" href="#">This Month</a></li>
                      </ul>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title">Performance Reports <span>/Weekly</span></h5>
                      {/* Placeholder for Chart or Table */}
                      <div id="performanceChart" />
                    </div>
                  </div>
                </div>{/* End Report Section */}
              </div>
            </div>{/* End Left side columns */}

            {/* Right side columns */}
            <div className="col-lg-4">
              {/* Recent Activity */}
              <div className="card">
                <div className="filter">
                  <a className="icon" href="#" data-bs-toggle="dropdown"><i className="bi bi-three-dots" /></a>
                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                    <li className="dropdown-header text-start">
                      <h6>Filter</h6>
                    </li>
                    <li><a className="dropdown-item" href="#">Today</a></li>
                    <li><a className="dropdown-item" href="#">This Month</a></li>
                    <li><a className="dropdown-item" href="#">This Year</a></li>
                  </ul>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Recent Activities <span>| This Week</span></h5>
                  <div className="activity">
                    <div className="activity-item d-flex">
                      <div className="activite-label">32 min</div>
                      <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                      <div className="activity-content">
                        <a href="#" className="fw-bold text-dark">Completed task X</a>
                      </div>
                    </div>
                    {/* More activity items can go here */}
                  </div>
                </div>
              </div>{/* End Recent Activity */}
            </div>{/* End Right side columns */}
          </div>
        </section>
      </main>{/* End #main */}
    </>
  );
}

export default StaffDashboard;
