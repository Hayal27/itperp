import React from 'react';

const CeoDashboard = () => {
  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>CEO Dashboard</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active">CEO Dashboard</li>
          </ol>
        </nav>
      </div>

      <section className="section dashboard">
        <div className="row">
          {/* Left Column: Departmental Reports */}
          <div className="col-lg-8">
            <div className="row">
              {/* Department Plans Card */}
              <div className="col-md-6">
                <div className="card info-card">
                  <div className="filter">
                    <a className="icon" href="#" data-bs-toggle="dropdown">
                      <i className="bi bi-three-dots" />
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                      <li><a className="dropdown-item" href="#">Filter by Department</a></li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Department Plans</h5>
                    <p>Summary of ongoing plans across departments.</p>
                    <h6>Current Plans: 14</h6>
                    <span className="text-success">+15%</span> increase in activity
                  </div>
                </div>
              </div>

              {/* Plan Reports Card */}
              <div className="col-md-6">
                <div className="card info-card">
                  <div className="filter">
                    <a className="icon" href="#" data-bs-toggle="dropdown">
                      <i className="bi bi-three-dots" />
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                      <li><a className="dropdown-item" href="#">Today</a></li>
                      <li><a className="dropdown-item" href="#">This Month</a></li>
                      <li><a className="dropdown-item" href="#">This Year</a></li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">Plan Reports</h5>
                    <h6>Completed plans: 8</h6>
                    <span className="text-info">Ongoing: 5</span>
                  </div>
                </div>
              </div>

              {/* Performance Overview */}
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Departmental Performance</h5>
                    <p>Monitor performance metrics across departments.</p>
                    {/* Performance Chart */}
                    <div id="performanceChart" style={{ height: '250px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recent Activities and Announcements */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recent Activity</h5>
                <div className="activity">
                  <div className="activity-item d-flex">
                    <div className="activity-label">10 min</div>
                    <i className="bi bi-circle-fill activity-badge text-success" />
                    <div className="activity-content">
                      IT Department submitted Q3 project report.
                    </div>
                  </div>
                  <div className="activity-item d-flex">
                    <div className="activity-label">30 min</div>
                    <i className="bi bi-circle-fill activity-badge text-info" />
                    <div className="activity-content">
                      HR updated employee engagement plan.
                    </div>
                  </div>
                  <div className="activity-item d-flex">
                    <div className="activity-label">1 hr</div>
                    <i className="bi bi-circle-fill activity-badge text-primary" />
                    <div className="activity-content">
                      Finance reviewed budget for Q4.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Announcements</h5>
                <ul>
                  <li>Company-wide meeting scheduled for next week.</li>
                  <li>End-of-year report submission deadline: December 15th.</li>
                  <li>Employee feedback survey now available.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CeoDashboard;
