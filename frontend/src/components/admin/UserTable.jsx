import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import './AdminComponents.css';

const UserTable = () => {
  // State for users, roles, departments, and supervisors
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    role_id: '',
    supervisor_id: ''
  });

  // Enhanced pagination and searching state
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Bulk actions state
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    fname: true,
    lname: true,
    user_name: true,
    phone: true,
    role: true,
    department: true,
    supervisor: true,
    status: true
  });

  // Enhanced fetch users function with loading and error handling
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Axios.get("http://localhost:5000/api/users");
      console.log("Fetched users data:", response.data);
      setUsers(response.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles from backend
  const fetchRoles = () => {
    Axios.get("http://localhost:5000/api/roles")
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
    Axios.get("http://localhost:5000/api/departments")
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
    Axios.get("http://localhost:5000/api/supervisors")
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
      const response = await fetch(`http://localhost:5000/api/users/${user_id}/status`, {
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
      const response = await Axios.put(`http://localhost:5000/api/updateUser/${selectedUser.user_id}`, updateData);
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

  // Enhanced filtering function
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      user.fname?.toLowerCase().includes(searchLower) ||
      user.lname?.toLowerCase().includes(searchLower) ||
      user.user_name?.toLowerCase().includes(searchLower)
    );

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && user.status === 1) ||
      (statusFilter === 'inactive' && user.status === 0);

    const matchesDepartment = departmentFilter === 'all' ||
      user.department_id === parseInt(departmentFilter);

    const matchesRole = roleFilter === 'all' ||
      user.role_id === parseInt(roleFilter);

    return matchesSearch && matchesStatus && matchesDepartment && matchesRole;
  });

  // Bulk action functions
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.user_id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleBulkStatusChange = async (newStatus) => {
    try {
      const promises = selectedUsers.map(userId =>
        Axios.put(`http://localhost:5000/api/${userId}/status`, { status: newStatus })
      );
      await Promise.all(promises);

      setModalMessage(`Successfully updated ${selectedUsers.length} users`);
      setShowModal(true);
      setSelectedUsers([]);
      setSelectAll(false);
      fetchUsers();
    } catch (error) {
      console.error('Error updating users:', error);
      setModalMessage('Error updating users');
      setShowModal(true);
    }
  };

  // Export function
  const handleExportData = () => {
    const csvContent = [
      ['Name', 'Username', 'Phone', 'Role', 'Department', 'Status'],
      ...filteredUsers.map(user => [
        `${user.fname} ${user.lname}`,
        user.user_name,
        user.phone,
        roleLookup[user.role_id] || 'N/A',
        departmentLookup[user.department_id] || 'N/A',
        user.status === 1 ? 'Active' : 'Inactive'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // Column toggle function
  const toggleColumn = (columnName) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnName]: !prev[columnName]
    }));
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
              <h1>User Management</h1>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/">Admin</a></li>
                  <li className="breadcrumb-item">User Management</li>
                  <li className="breadcrumb-item active">Manage Accounts</li>
                </ol>
              </nav>
            </div>
            <div className="dashboard-actions">
              <button className="btn btn-success btn-sm" onClick={handleExportData}>
                <i className="bi bi-download me-2"></i>
                Export Data
              </button>
            </div>
          </div>

          <div className="dashboard-content">
          {/* Enhanced Filters and Controls */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                {/* Search */}
                <div className="col-md-3">
                  <label className="form-label">Search</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by name or username..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="col-md-2">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Department Filter */}
                <div className="col-md-2">
                  <label className="form-label">Department</label>
                  <select
                    className="form-select"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.department_id} value={dept.department_id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Role Filter */}
                <div className="col-md-2">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    {roles.map(role => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Items per page */}
                <div className="col-md-2">
                  <label className="form-label">Show</label>
                  <select
                    className="form-select"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                  >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="col-md-1">
                  <label className="form-label">&nbsp;</label>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handleExportData}
                      title="Export Data"
                    >
                      <i className="bi bi-download"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <div className="row mt-3">
                  <div className="col-12">
                    <div className="alert alert-info d-flex justify-content-between align-items-center">
                      <span>
                        <i className="bi bi-check-square me-2"></i>
                        {selectedUsers.length} user(s) selected
                      </span>
                      <div className="btn-group">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleBulkStatusChange(1)}
                        >
                          <i className="bi bi-check-circle me-1"></i>
                          Activate
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleBulkStatusChange(0)}
                        >
                          <i className="bi bi-x-circle me-1"></i>
                          Deactivate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Enhanced Table */}
          <div className="row">
            <div className="col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">
                      Users Table ({filteredUsers.length} total)
                    </h5>

                    {/* Column Visibility Toggle */}
                    <div className="dropdown">
                      <button
                        className="btn btn-outline-secondary btn-sm dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                      >
                        <i className="bi bi-columns-gap me-1"></i>
                        Columns
                      </button>
                      <ul className="dropdown-menu">
                        {Object.entries(visibleColumns).map(([column, visible]) => (
                          <li key={column}>
                            <label className="dropdown-item">
                              <input
                                type="checkbox"
                                checked={visible}
                                onChange={() => toggleColumn(column)}
                                className="me-2"
                              />
                              {column.charAt(0).toUpperCase() + column.slice(1).replace('_', ' ')}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-striped table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th style={{ width: '40px' }}>
                            <input
                              type="checkbox"
                              checked={selectAll}
                              onChange={handleSelectAll}
                              className="form-check-input"
                            />
                          </th>
                          <th style={{ width: '60px' }}>No</th>
                          {visibleColumns.fname && (
                            <th
                              onClick={() => handleSort('fname')}
                              style={{ cursor: 'pointer' }}
                              className="sortable"
                            >
                              First Name
                              {sortConfig.key === 'fname' && (
                                <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                              )}
                            </th>
                          )}
                          {visibleColumns.lname && (
                            <th
                              onClick={() => handleSort('lname')}
                              style={{ cursor: 'pointer' }}
                              className="sortable"
                            >
                              Last Name
                              {sortConfig.key === 'lname' && (
                                <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                              )}
                            </th>
                          )}
                          {visibleColumns.user_name && (
                            <th
                              onClick={() => handleSort('user_name')}
                              style={{ cursor: 'pointer' }}
                              className="sortable"
                            >
                              Username
                              {sortConfig.key === 'user_name' && (
                                <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                              )}
                            </th>
                          )}
                          {visibleColumns.phone && (
                            <th
                              onClick={() => handleSort('phone')}
                              style={{ cursor: 'pointer' }}
                              className="sortable"
                            >
                              Phone
                              {sortConfig.key === 'phone' && (
                                <i className={`bi bi-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'} ms-1`}></i>
                              )}
                            </th>
                          )}
                          {visibleColumns.role && <th>Role</th>}
                          {visibleColumns.department && <th>Department</th>}
                          {visibleColumns.supervisor && <th>Supervisor</th>}
                          {visibleColumns.status && <th>Status</th>}
                          <th style={{ width: '120px' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.map((user, i) => (
                        <tr key={user.user_id} className={selectedUsers.includes(user.user_id) ? 'table-active' : ''}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedUsers.includes(user.user_id)}
                              onChange={() => handleSelectUser(user.user_id)}
                              className="form-check-input"
                            />
                          </td>
                          <td>{currentPage * itemsPerPage + i + 1}</td>
                          {visibleColumns.fname && <td>{user.fname}</td>}
                          {visibleColumns.lname && <td>{user.lname}</td>}
                          {visibleColumns.user_name && <td>{user.user_name}</td>}
                          {visibleColumns.phone && <td>{user.phone || 'N/A'}</td>}
                          {visibleColumns.role && <td>{roleLookup[user.role_id] || "N/A"}</td>}
                          {visibleColumns.department && <td>{departmentLookup[user.department_id] || "N/A"}</td>}
                          {visibleColumns.supervisor && <td>{supervisorLookup[user.supervisor_id] || "N/A"}</td>}
                          {visibleColumns.status && (
                            <td>
                              <span className={`badge ${user.status === 1 ? 'bg-success' : 'bg-warning'}`}>
                                {user.status === 1 ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          )}
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                onClick={() => openUpdateModal(user)}
                                className="btn btn-primary btn-sm"
                                title="Edit User"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                onClick={() => changeStatus(user.status === 1 ? 0 : 1, user.user_id)}
                                className={`btn btn-sm ${user.status === 1 ? 'btn-warning' : 'btn-success'}`}
                                title={user.status === 1 ? 'Deactivate' : 'Activate'}
                              >
                                <i className={`bi bi-${user.status === 1 ? 'x-circle' : 'check-circle'}`}></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {paginatedUsers.length === 0 && (
                        <tr>
                          <td colSpan={Object.values(visibleColumns).filter(Boolean).length + 3} className="text-center py-4">
                            <div className="text-muted">
                              <i className="bi bi-inbox fs-1"></i>
                              <p className="mt-2">No users found matching your criteria</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  </div>

                  {/* Enhanced Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted">
                        Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                      </div>

                      <nav aria-label="Table pagination">
                        <ul className="pagination pagination-sm mb-0">
                          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={goToPrevious}
                              disabled={currentPage === 0}
                            >
                              <i className="bi bi-chevron-left"></i>
                            </button>
                          </li>

                          {/* Page numbers */}
                          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = index;
                            } else if (currentPage < 3) {
                              pageNum = index;
                            } else if (currentPage > totalPages - 4) {
                              pageNum = totalPages - 5 + index;
                            } else {
                              pageNum = currentPage - 2 + index;
                            }

                            return (
                              <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                <button
                                  className="page-link"
                                  onClick={() => goToPage(pageNum)}
                                >
                                  {pageNum + 1}
                                </button>
                              </li>
                            );
                          })}

                          <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={goToNext}
                              disabled={currentPage === totalPages - 1}
                            >
                              <i className="bi bi-chevron-right"></i>
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

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