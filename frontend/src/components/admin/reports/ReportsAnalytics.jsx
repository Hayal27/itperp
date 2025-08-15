import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import '../AdminComponents.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const ReportsAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    departmentStats: [],
    roleDistribution: [],
    monthlyRegistrations: [],
    userActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [selectedMetric, setSelectedMetric] = useState('users');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API calls - replace with actual endpoints
      const [statsResponse, employeesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/employee-statistics'),
        axios.get('http://localhost:5000/api/employees')
      ]);

      // Process data for analytics
      const processedData = {
        userGrowth: generateUserGrowthData(),
        departmentStats: statsResponse.data.departmentStats || [],
        roleDistribution: statsResponse.data.roleStats || [],
        monthlyRegistrations: generateMonthlyData(),
        userActivity: generateActivityData()
      };

      setAnalyticsData(processedData);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Generate sample data - replace with actual data processing
  const generateUserGrowthData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      users: Math.floor(Math.random() * 50) + 20 + (index * 5)
    }));
  };

  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => ({
      month,
      registrations: Math.floor(Math.random() * 20) + 5,
      activations: Math.floor(Math.random() * 15) + 3
    }));
  };

  const generateActivityData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      logins: Math.floor(Math.random() * 100) + 20,
      actions: Math.floor(Math.random() * 200) + 50
    }));
  };

  // Chart configurations
  const userGrowthChartData = {
    labels: analyticsData.userGrowth.map(item => item.month),
    datasets: [
      {
        label: 'User Growth',
        data: analyticsData.userGrowth.map(item => item.users),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4
      }
    ]
  };

  const departmentChartData = {
    labels: analyticsData.departmentStats.map(dept => dept.department_name),
    datasets: [
      {
        label: 'Employees by Department',
        data: analyticsData.departmentStats.map(dept => dept.employee_count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ]
      }
    ]
  };

  const activityChartData = {
    labels: analyticsData.userActivity.map(item => item.day),
    datasets: [
      {
        label: 'Daily Logins',
        data: analyticsData.userActivity.map(item => item.logins),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
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
        text: 'Analytics Overview'
      }
    }
  };

  if (loading) {
    return (
      <main className="admin-main-content">
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
      <main className="admin-main-content">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="admin-main-content">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="page-title">
            <h1>Reports & Analytics</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Admin</a></li>
                <li className="breadcrumb-item">Reports</li>
                <li className="breadcrumb-item active">Analytics</li>
              </ol>
            </nav>
          </div>
          <div className="dashboard-actions">
            <select 
              className="form-select me-2" 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="lastyear">Last Year</option>
            </select>
            <button className="btn btn-primary btn-sm">
              <i className="bi bi-download me-2"></i>
              Export Report
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="row g-4">
            
            {/* Key Metrics Cards */}
            <div className="col-md-3">
              <div className="info-card sales-card">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-people"></i>
                    </div>
                    <div className="ps-3">
                      <h6>1,234</h6>
                      <span className="text-success small pt-1 fw-bold">+12%</span>
                      <span className="text-muted small pt-2 ps-1">vs last month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="info-card revenue-card">
                <div className="card-body">
                  <h5 className="card-title">Active Sessions</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-activity"></i>
                    </div>
                    <div className="ps-3">
                      <h6>856</h6>
                      <span className="text-success small pt-1 fw-bold">+8%</span>
                      <span className="text-muted small pt-2 ps-1">vs last month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="info-card customers-card">
                <div className="card-body">
                  <h5 className="card-title">New Registrations</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-person-plus"></i>
                    </div>
                    <div className="ps-3">
                      <h6>89</h6>
                      <span className="text-success small pt-1 fw-bold">+15%</span>
                      <span className="text-muted small pt-2 ps-1">this month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="info-card">
                <div className="card-body">
                  <h5 className="card-title">Avg. Session Time</h5>
                  <div className="d-flex align-items-center">
                    <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                      <i className="bi bi-clock"></i>
                    </div>
                    <div className="ps-3">
                      <h6>24m</h6>
                      <span className="text-success small pt-1 fw-bold">+5%</span>
                      <span className="text-muted small pt-2 ps-1">vs last month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="col-lg-8">
              <div className="chart-card">
                <div className="card-body">
                  <h5 className="card-title">User Growth Trend</h5>
                  <Line data={userGrowthChartData} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="chart-card">
                <div className="card-body">
                  <h5 className="card-title">Department Distribution</h5>
                  {analyticsData.departmentStats.length > 0 ? (
                    <Doughnut data={departmentChartData} options={{ responsive: true }} />
                  ) : (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-pie-chart fs-1"></i>
                      <p>No data available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="chart-card">
                <div className="card-body">
                  <h5 className="card-title">Daily Activity</h5>
                  <Bar data={activityChartData} options={chartOptions} />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="professional-table">
                <div className="card-body">
                  <h5 className="card-title">Top Performing Departments</h5>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th>Users</th>
                          <th>Growth</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.departmentStats.map((dept, index) => (
                          <tr key={index}>
                            <td>{dept.department_name}</td>
                            <td>{dept.employee_count}</td>
                            <td>
                              <span className="text-success">
                                <i className="bi bi-arrow-up"></i> {Math.floor(Math.random() * 20) + 5}%
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-success">Active</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default ReportsAnalytics;
