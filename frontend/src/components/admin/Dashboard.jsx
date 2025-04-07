import React, { useState } from 'react';

const Dashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Hayal Tamrat', email: 'Hayal@itpark.et', status: 'Active' },
    { id: 2, name: 'Henok Ahmed', email: 'Henok@itpark.et', status: 'Active' },
    { id: 3, name: 'Samuel ', email: 'samuel@itpark.et', status: 'inactive' },
    { id: 4, name: ' Nebyat ', email: 'Nebyat@itpark.et', status: 'Active' },
  ]);

  const [filter, setFilter] = useState('All');

  const filteredUsers = users.filter(user => 
    filter === 'All' || user.status === filter
  );

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>User Management</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
            <li className="breadcrumb-item active">User Management</li>
          </ol>
        </nav>
      </div>

      <section className="section dashboard">
        <div className="row">
          {/* User Filter */}
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Filter Users</h5>
                <div className="btn-group" role="group" aria-label="User Status Filter">
                  <button className={`btn ${filter === 'All' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleFilterChange('All')}>All</button>
                  <button className={`btn ${filter === 'Active' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleFilterChange('Active')}>Active</button>
                  <button className={`btn ${filter === 'I' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleFilterChange('Inacived')}>Inacived</button>
                  <button className={`btn ${filter === 'Pending' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => handleFilterChange('Pending')}>Pending</button>
                </div>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="col-12">
            <div className="card recent-sales overflow-auto">
              <div className="card-body">
                <h5 className="card-title">User List</h5>
                <table className="table table-borderless datatable">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}> 
                        <th scope="row">{user.id}</th>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td><span className={`badge ${user.status === 'Active' ? 'bg-success' : user.status === 'Inacived' ? 'bg-danger' : 'bg-warning'}`}>{user.status}</span></td>
                        <td>
                          <button className="btn btn-info btn-sm me-2">View</button>
                          <button className="btn btn-warning btn-sm">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Recent Activity <span>| Today</span></h5>
                <div className="activity">
                  <div className="activity-item d-flex">
                    <div className="activite-label">10 min</div>
                    <i className="bi bi-circle-fill activity-badge text-success align-self-start" />
                    <div className="activity-content">
                      User <a href="#" className="fw-bold text-dark">Hyal Tamrat</a> registered.
                    </div>
                  </div>
                  <div className="activity-item d-flex">
                    <div className="activite-label">30 min</div>
                    <i className="bi bi-circle-fill activity-badge text-danger align-self-start" />
                    <div className="activity-content">
                      User <a href="#" className="fw-bold text-dark">Henok Ahmed</a> Actived.
                    </div>
                  </div>
                  <div className="activity-item d-flex">
                    <div className="activite-label">1 hr</div>
                    <i className="bi bi-circle-fill activity-badge text-primary align-self-start" />
                    <div className="activity-content">
                      User <a href="#" className="fw-bold text-dark"> walelign </a> updated profile.
                    </div>
                  </div>
                  {/* Add more activity items as needed */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
