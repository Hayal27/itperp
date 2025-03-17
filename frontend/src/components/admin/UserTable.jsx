import Axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserTable = () => {
  // State for users and roles
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // API for changing user status
  const changeStatus = async (status, user_id) => {
    try {
      // Call the API to change the user's status
      await fetch(`http://192.168.56.1:5000/api/users/${user_id}/status`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ status }), // Use "status" for the body
      });
      // Refresh users after status change
      fetchUsers();
    } catch (error) {
      console.log("Error changing status:", error);
    }
  };

  // Fetch users and roles
  const fetchUsers = () => {
    Axios.get("http://192.168.56.1:5000/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log("Error fetching users:", err));
  };

  const fetchRoles = () => {
    Axios.get("http://192.168.56.1:5000/api/roles")
      .then((res) => setRoles(res.data))
      .catch((err) => console.log("Error fetching roles:", err));
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Create a lookup object for roles
  const roleLookup = {};
  roles.forEach(role => {
    roleLookup[role.role_id] = role.role_name;
  });

  return (
    <>
    <main id="main" className="main">
      <div className="pagetitle">
        {/* <h1>Tabs</h1> */}
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="index.html">Admin</a></li>
            <li className="breadcrumb-item">User Management</li>
            <li className="breadcrumb-item active">Manage Accounts</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Users Table</h5>
                {/* <p>All user information table here and you can manage all accounts on the table.</p> */}
                
                {/* Table with stripped rows */}
                <table className="table datatable">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>User Name</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th data-type="date" data-format="YYYY/DD/MM">Registered Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <tr key={user.user_id}>
                        <td>{i + 1}</td>
                        <td>{user.fname}</td>
                        <td>{user.lname}</td>
                        <td>{user.user_name}</td>
                        <td>{user.phone}</td>
                        <td>{roleLookup[user.role_id] || "N/A"}</td>
                        <td>{new Date(user.create_at).toLocaleDateString()}</td>
                        <td>{user.status === 1 ? <span className='text-success'>Active</span> : <span className='text-warning'>Deactivated</span>}</td>
                        <td>
                          {user.status === 1 ? (
                            <button onClick={() => changeStatus(0, user.user_id)} className="btn btn-warning">Deactivate</button>
                          ) : (
                            <button onClick={() => changeStatus(1, user.user_id)} className="btn btn-success">Activate</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* End Table with stripped rows */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for user status feedback */}
      <div className="modal fade" id="statusModal" tabIndex="-1" role="dialog" aria-labelledby="statusModalLabel" aria-hidden="true" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="statusModalLabel">Status Update</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {modalMessage}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>

    </main>
  </>
  );
};

export default UserTable;
