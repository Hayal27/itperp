import Axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserTable = () => {
  // State for users, roles, departments, and supervisors
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  // State for modal feedback (for status changes)
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // State for update modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateData, setUpdateData] = useState({
    fname: '',
    lname: '',
    user_name: '',
    phone: '',
    department_id: '',
    role_id: '', // Changed from role_name to role_id
    supervisor_id: '' // supervisor update field remains unchanged
  });

  // Pagination and searching state
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting state: key and direction ("asc" or "desc")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Fetch users from backend
  const fetchUsers = () => {
    Axios.get("http://192.168.56.1:5000/api/users")
      .then((res) => {
        console.log("Fetched users data:", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  };

  // Fetch roles from backend
  const fetchRoles = () => {
    Axios.get("http://192.168.56.1:5000/api/roles")
      .then((res) => {
        console.log("Fetched roles data:", res.data);
        setRoles(res.data);
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
      });
  };

  // Fetch departments from backend
  const fetchDepartments = () => {
    Axios.get("http://192.168.56.1:5000/api/departments")
      .then((res) => {
        console.log("Fetched departments data:", res.data);
        setDepartments(res.data);
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
      });
  };

  // Fetch supervisors from backend
  const fetchSupervisors = () => {
    Axios.get("http://192.168.56.1:5000/api/supervisors")
      .then((res) => {
        console.log("Fetched supervisors data:", res.data);
        setSupervisors(res.data);
      })
      .catch((err) => {
        console.error("Error fetching supervisors:", err);
      });
  };

  // Change user status and log response/error to console
  const changeStatus = async (status, user_id) => {
    try {
      const response = await fetch(`http://192.168.56.1:5000/api/users/${user_id}/status`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      console.log('Change status response:', data);
      if (response.ok) {
        const action = status === 1 ? 'activated' : 'deactivated';
        setModalMessage(`User has been successfully ${action}.`);
        setShowModal(true);
        fetchUsers(); // Refresh users list
      } else {
        setModalMessage(data.message || 'Error changing user status. Please try again.');
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error changing status:", error);
      setModalMessage('Error changing user status. Please try again.');
      setShowModal(true);
    }
  };

  // Open update modal and pre-fill form with selected user's data
  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setUpdateData({
      fname: user.fname || '',
      lname: user.lname || '',
      user_name: user.user_name || '',
      phone: user.phone || '',
      department_id: user.department_id || '', // Optional update
      role_id: user.role_id || '', // Updated to use role_id from user object
      supervisor_id: user.supervisor_id || '' // Added supervisor update field
    });
    setShowUpdateModal(true);
  };

  // Handle update form field changes
  const handleUpdateChange = (e) => {
    setUpdateData({ ...updateData, [e.target.name]: e.target.value });
  };

  // Submit updated user data
  const submitUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const response = await Axios.put(`http://192.168.56.1:5000/api/updateUser/${selectedUser.user_id}`, updateData);
      console.log("Update response:", response.data);
      setModalMessage(response.data.message || "User updated successfully.");
      setShowModal(true);
      setShowUpdateModal(false);
      fetchUsers(); // Refresh users list
    } catch (error) {
      console.error("Error updating user:", error);
      setModalMessage("Error updating user. Please try again.");
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
    fetchSupervisors();
  }, []);

  // Create lookup object for roles and departments for easy display
  const roleLookup = {};
  roles.forEach(role => {
    roleLookup[role.role_id] = role.role_name;
  });

  const departmentLookup = {};
  departments.forEach(dept => {
    departmentLookup[dept.department_id] = dept.name;
  });

  // Create lookup object for supervisors
  const supervisorLookup = {};
  supervisors.forEach((supervisor) =>  {
    supervisorLookup[supervisor.employee_id] = supervisor.name;
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Reset to first page on search change
  };

  // Handle sorting of the table columns
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter users based on search term (searching fname, lname, and user_name)
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.fname.toLowerCase().includes(searchLower) ||
      user.lname.toLowerCase().includes(searchLower) ||
      user.user_name.toLowerCase().includes(searchLower)
    );
  });

  // Sort the filtered users
  const sortedUsers = React.useMemo(() => {
    if (sortConfig.key) {
      const sorted = [...filteredUsers].sort((a, b) => {
        let aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
        let bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
      return sorted;
    }
    return filteredUsers;
  }, [filteredUsers, sortConfig]);

  // Determine paginated users
  const paginatedUsers = sortedUsers.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  // Pagination handlers
  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  return (
    <>
      <main id="main" className="main">
        <div className="pagetitle">
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="index.html">Admin</a></li>
              <li className="breadcrumb-item">User Management</li>
              <li className="breadcrumb-item active">Manage Accounts</li>
            </ol>
          </nav>
        </div>
        <section className="section">
          <div className="row mb-3">
            <div className="col-lg-4">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by name or username…" 
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Users Table</h5>
                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th onClick={() => handleSort('fname')} style={{ cursor: 'pointer' }}>First Name {sortConfig.key === 'fname' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                        <th onClick={() => handleSort('lname')} style={{ cursor: 'pointer' }}>Last Name {sortConfig.key === 'lname' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                        <th onClick={() => handleSort('user_name')} style={{ cursor: 'pointer' }}>User Name {sortConfig.key === 'user_name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                        <th onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>Phone {sortConfig.key === 'phone' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Supervisor</th>
                        <th>Status</th>
                        <th>Action</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user, i) => (
                        <tr key={user.user_id}>
                          <td>{currentPage * itemsPerPage + i + 1}</td>
                          <td>{user.fname}</td>
                          <td>{user.lname}</td>
                          <td>{user.user_name}</td>
                          <td>{user.phone}</td>
                          <td>{roleLookup[user.role_id] || "N/A"}</td>
                          <td>{departmentLookup[user.department_id] || "N/A"}</td>
                          <td>{supervisorLookup[user.supervisor_id] || "N/A"}</td>
                          <td>
                            {user.status === 1 
                              ? <span className='text-success'>Active</span> 
                              : <span className='text-warning'>Deactivated</span>
                            }
                          </td>
                          <td>
                            {user.status === 1 ? (
                              <button onClick={() => changeStatus(0, user.user_id)} className="btn btn-warning">Deactivate</button>
                            ) : (
                              <button onClick={() => changeStatus(1, user.user_id)} className="btn btn-success">Activate</button>
                            )}
                          </td>
                          <td>
                            <button onClick={() => openUpdateModal(user)} className="btn btn-primary">Edit</button>
                          </td>
                        </tr>
                      ))}
                      {paginatedUsers.length === 0 && (
                        <tr>
                          <td colSpan="11" className="text-center">No users found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {/* Pagination Controls */}
                  <div className="d-flex justify-content-between align-items-center">
                    <button onClick={goToPrevious} className="btn btn-secondary" disabled={currentPage === 0}>Previous</button>
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <button onClick={goToNext} className="btn btn-secondary" disabled={currentPage === totalPages - 1 || totalPages === 0}>Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal for user status feedback */}
        {showModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Status Update</h5>
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
        )}

        {/* Modal for updating user */}
        {showUpdateModal && (
          <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <form onSubmit={submitUpdate}>
                  <div className="modal-header">
                    <h5 className="modal-title">Update User</h5>
                    <button type="button" className="close" onClick={() => setShowUpdateModal(false)} aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
                      <label>First Name</label>
                      <input type="text" name="fname" value={updateData.fname} onChange={handleUpdateChange} className="form-control" required/>
                    </div>
                    <div className="form-group">
                      <label>Last Name</label>
                      <input type="text" name="lname" value={updateData.lname} onChange={handleUpdateChange} className="form-control" required/>
                    </div>
                    <div className="form-group">
                      <label>User Name</label>
                      <input type="text" name="user_name" value={updateData.user_name} onChange={handleUpdateChange} className="form-control" required/>
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="text" name="phone" value={updateData.phone} onChange={handleUpdateChange} className="form-control" required/>
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <select name="department_id" value={updateData.department_id} onChange={handleUpdateChange} className="form-control">
                        <option value="">Select Department (Optional)</option>
                        {departments.map(dept => (
                          <option key={dept.department_id} value={dept.department_id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
    <label>Role</label>
    <select name="role_id" value={updateData.role_id} onChange={handleUpdateChange} className="form-control" required>
      <option value="">Select Role</option>
      {roles.map(role => (
        <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
      ))}
    </select>
  </div>

                    <div className="form-group">
                      <label>Supervisor</label>
                      <select name="supervisor_id" value={updateData.supervisor_id} onChange={handleUpdateChange} className="form-control">
                        <option value="">Select Supervisor (Optional)</option>
                        {supervisors.map(sup => (
                          <option key={sup.employee_id} value={sup.employee_id}>{sup.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary">Update User</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default UserTable;