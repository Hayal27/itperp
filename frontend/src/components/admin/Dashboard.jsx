import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './AdminComponents.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [statistics, setStatistics] = useState({
    totalEmployees: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    recentRegistrations: 0,
    departmentStats: [],
    roleStats: [],
    genderStats: []
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch statistics, recent activities, and employees in parallel
      const [statsResponse, activitiesResponse, employeesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/employee-statistics'),
        axios.get('http://localhost:5000/api/recent-activities'),
        axios.get('http://localhost:5000/api/employees')
      ]);

      setStatistics(statsResponse.data);
      setRecentActivities(activitiesResponse.data);
      setEmployees(employeesResponse.data.slice(0, 5)); // Show only latest 5 employees

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const departmentChartData = {
    labels: statistics.departmentStats.map(dept => dept.department_name),
    datasets: [
      {
        label: 'Employees by Department',
        data: statistics.departmentStats.map(dept => dept.employee_count),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const genderChartData = {
    labels: statistics.genderStats.map(gender => gender.sex === 'M' ? 'Male' : 'Female'),
    datasets: [
      {
        data: statistics.genderStats.map(gender => gender.count),
        backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Employee Distribution'
      }
    }
  };

  if (loading) {
    return (
      <main id="main" className="main">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main id="main" className="main">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="admin-main-content">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="page-title">
              <h1>Admin Dashboard</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Home</a></li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </nav>
            </div>
            <div className="dashboard-actions">
              <button className="btn btn-primary btn-sm">
                <i className="bi bi-arrow-clockwise me-2"></i>
                Refresh
              </button>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="row g-4">

            {/* Statistics Cards */}
            <div className="col-xxl-3 col-md-6">
              <div className="card info-card sales-card">
                <div className="card-body">
                  <h5 className="card-title">Total Employees</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="ps-3">
                      <h6>{statistics.totalEmployees}</h6>
                      <span className="text-success small pt-1 fw-bold">
                        {statistics.recentRegistrations}
                      </span>
                      <span className="text-muted small pt-2 ps-1">new this month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-3 col-md-6">
              <div className="card info-card revenue-card">
                <div className="card-body">
                  <h5 className="card-title">Active Users</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-person-check"></i>
                    </div>
                    <div className="ps-3">
                      <h6>{statistics.activeUsers}</h6>
                      <span className="text-success small pt-1 fw-bold">
                        {statistics.totalEmployees > 0 ? ((statistics.activeUsers / statistics.totalEmployees) * 100).toFixed(1) : 0}%
                      </span>
                      <span className="text-muted small pt-2 ps-1">of total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-3 col-md-6">
              <div className="card info-card customers-card">
                <div className="card-body">
                  <h5 className="card-title">Inactive Users</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-person-x"></i>
                    </div>
                    <div className="ps-3">
                      <h6>{statistics.inactiveUsers}</h6>
                      <span className="text-danger small pt-1 fw-bold">
                        {statistics.totalEmployees > 0 ? ((statistics.inactiveUsers / statistics.totalEmployees) * 100).toFixed(1) : 0}%
                      </span>
                      <span className="text-muted small pt-2 ps-1">of total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xxl-3 col-md-6">
              <div className="card info-card">
                <div className="card-body">
                  <h5 className="card-title">Departments</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-building"></i>
                    </div>
                    <div className="ps-3">
                      <h6>{statistics.departmentStats.length}</h6>
                      <span className="text-muted small pt-2 ps-1">active departments</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="col-lg-8">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Employees by Department</h5>
                  {statistics.departmentStats.length > 0 ? (
                    <Bar data={departmentChartData} options={chartOptions} />
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-bar-chart-line fs-1"></i>
                      <p>No department data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Gender Distribution</h5>
                  {statistics.genderStats.length > 0 ? (
                    <Doughnut data={genderChartData} options={{ responsive: true }} />
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-pie-chart fs-1"></i>
                      <p>No gender data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Recent Activities</h5>
                  <div className="activity">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => (
                        <div key={index} className="activity-item d-flex">
                          <div className="activite-label">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </div>
                          <i className={`bi bi-circle-fill activity-badge ${
                            activity.status === '1' ? 'text-success' : 'text-warning'
                          } align-self-start`} />
                          <div className="activity-content">
                            Employee <a href="#" className="fw-bold text-dark">
                              {activity.fname} {activity.lname}
                            </a> {activity.activity_type === 'registration' ? 'registered' : 'updated'}.
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted py-4">
                        <i className="bi bi-clock-history fs-1"></i>
                        <p>No recent activities</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Employees */}
            <div className="col-lg-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Latest Employees</h5>
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Department</th>
                          <th scope="col">Role</th>
                          <th scope="col">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.length > 0 ? (
                          employees.map((employee) => (
                            <tr key={employee.employee_id}>
                              <td>{employee.fname} {employee.lname}</td>
                              <td>{employee.department_name || 'N/A'}</td>
                              <td>{employee.role_name || 'N/A'}</td>
                              <td>
                                <span className={`badge ${
                                  employee.user_status === '1' ? 'bg-success' : 'bg-warning'
                                }`}>
                                  {employee.user_status === '1' ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="text-center text-muted py-4">
                              <i className="bi bi-people fs-1"></i>
                              <p>No employees found</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Quick Actions</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <button className="btn btn-primary w-100 mb-2">
                        <i className="bi bi-person-plus me-2"></i>
                        Add Employee
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-info w-100 mb-2">
                        <i className="bi bi-table me-2"></i>
                        View All Users
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-success w-100 mb-2">
                        <i className="bi bi-file-earmark-excel me-2"></i>
                        Export Data
                      </button>
                    </div>
                    <div className="col-md-3">
                      <button className="btn btn-warning w-100 mb-2">
                        <i className="bi bi-gear me-2"></i>
                        Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
