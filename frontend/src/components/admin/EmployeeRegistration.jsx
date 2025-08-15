import Axios from "axios";
import React, { useEffect, useState } from "react";
import './AdminComponents.css';

const EmployeeRegistration = () => {
  // State for roles, departments, supervisors, success message, error message, and form data
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [data, setData] = useState({
    name: "",
    role_id: "",
    department_id: "",
    supervisor_id: "",
    fname: "",
    lname: "",
    email: "",
    phone: "",
    sex: "",
  });

  // Fetch roles, departments, and supervisors on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/api/roles");
        setRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/api/departments");
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
   
    const fetchSupervisors = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/api/supervisors");
        setSupervisors(response.data);
      } catch (error) {
        console.error("Error fetching supervisors:", error);
      }
    };

    fetchRoles();
    fetchDepartments();
    fetchSupervisors();
  }, []);

  // Form validation function
  const validateForm = () => {
    const errors = {};

    // Required field validations
    if (!data.fname.trim()) errors.fname = "First name is required";
    if (!data.lname.trim()) errors.lname = "Last name is required";
    if (!data.email.trim()) errors.email = "Email is required";
    if (!data.phone.trim()) errors.phone = "Phone number is required";
    if (!data.sex) errors.sex = "Gender is required";
    if (!data.role_id) errors.role_id = "Role is required";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Phone validation (basic)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (data.phone && !phoneRegex.test(data.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    // Name validation (no numbers)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (data.fname && !nameRegex.test(data.fname)) {
      errors.fname = "First name should only contain letters";
    }
    if (data.lname && !nameRegex.test(data.lname)) {
      errors.lname = "Last name should only contain letters";
    }

    return errors;
  };

  // Handle form data change with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    // Auto-generate name field
    if (name === 'fname' || name === 'lname') {
      setData(prev => ({
        ...prev,
        [name]: value,
        name: name === 'fname' ? `${value} ${prev.lname}`.trim() : `${prev.fname} ${value}`.trim()
      }));
    }

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Enhanced submit function with validation
  const submit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setErrorMessage("Please fix the errors below");
      setSuccessMessage("");
      return;
    }

    setLoading(true);
    setFormErrors({});

    try {
      const response = await Axios.post("http://localhost:5000/api/addEmployee", data);
      console.log(response.data);

      if (response.data.message && response.data.message.includes('error')) {
        setErrorMessage(response.data.message);
        setSuccessMessage("");
      } else {
        setSuccessMessage("Employee successfully registered! User account created with default credentials.");
        setErrorMessage("");

        // Reset form
        setData({
          name: "",
          role_id: "",
          department_id: "",
          supervisor_id: "",
          fname: "",
          lname: "",
          email: "",
          phone: "",
          sex: "",
        });

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An error occurred during registration. Please try again.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-main-content">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="page-title">
            <h1>Employee Registration</h1>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Admin</a></li>
                <li className="breadcrumb-item">Employee Management</li>
                <li className="breadcrumb-item active">Register Employee</li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="row justify-content-center">
            <div className="col-lg-10">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-person-plus me-2"></i>
                  Employee Registration Form
                </h5>
              </div>
              <div className="card-body">

                {/* Success/Error Messages */}
                {successMessage && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
                  </div>
                )}

                {errorMessage && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {errorMessage}
                    <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
                  </div>
                )}

                <form onSubmit={submit} noValidate>
                  <div className="row">
                    {/* Personal Information Section */}
                    <div className="col-md-6">
                      <h6 className="text-primary mb-3">
                        <i className="bi bi-person me-2"></i>
                        Personal Information
                      </h6>
                      {/* First Name */}
                      <div className="mb-3">
                        <label className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.fname ? 'is-invalid' : ''}`}
                          name="fname"
                          value={data.fname}
                          onChange={handleChange}
                          placeholder="Enter first name"
                        />
                        {formErrors.fname && (
                          <div className="invalid-feedback">{formErrors.fname}</div>
                        )}
                      </div>

                      {/* Last Name */}
                      <div className="mb-3">
                        <label className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${formErrors.lname ? 'is-invalid' : ''}`}
                          name="lname"
                          value={data.lname}
                          onChange={handleChange}
                          placeholder="Enter last name"
                        />
                        {formErrors.lname && (
                          <div className="invalid-feedback">{formErrors.lname}</div>
                        )}
                      </div>

                      {/* Email */}
                      <div className="mb-3">
                        <label className="form-label">
                          Email Address <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-envelope"></i>
                          </span>
                          <input
                            type="email"
                            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                          />
                        </div>
                        {formErrors.email && (
                          <div className="invalid-feedback">{formErrors.email}</div>
                        )}
                      </div>

                      {/* Phone */}
                      <div className="mb-3">
                        <label className="form-label">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-telephone"></i>
                          </span>
                          <input
                            type="tel"
                            className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                            name="phone"
                            value={data.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                          />
                        </div>
                        {formErrors.phone && (
                          <div className="invalid-feedback">{formErrors.phone}</div>
                        )}
                      </div>

                      {/* Gender */}
                      <div className="mb-3">
                        <label className="form-label">
                          Gender <span className="text-danger">*</span>
                        </label>
                        <select
                          name="sex"
                          className={`form-select ${formErrors.sex ? 'is-invalid' : ''}`}
                          value={data.sex}
                          onChange={handleChange}
                        >
                          <option value="">Select gender</option>
                          <option value="M">Male</option>
                          <option value="F">Female</option>
                        </select>
                        {formErrors.sex && (
                          <div className="invalid-feedback">{formErrors.sex}</div>
                        )}
                      </div>
                    </div>

                    {/* Work Information Section */}
                    <div className="col-md-6">
                      <h6 className="text-primary mb-3">
                        <i className="bi bi-briefcase me-2"></i>
                        Work Information
                      </h6>

                      {/* Full Name (Auto-generated) */}
                      <div className="mb-3">
                        <label className="form-label">Full Name (Auto-generated)</label>
                        <input
                          type="text"
                          className="form-control bg-light"
                          name="name"
                          value={data.name}
                          readOnly
                          placeholder="Will be generated from first and last name"
                          />
                      </div>

                      {/* Role */}
                      <div className="mb-3">
                        <label className="form-label">
                          Role <span className="text-danger">*</span>
                        </label>
                        <select
                          name="role_id"
                          className={`form-select ${formErrors.role_id ? 'is-invalid' : ''}`}
                          value={data.role_id}
                          onChange={handleChange}
                        >
                          <option value="">Select a role</option>
                          {roles.map((role) => (
                            <option key={role.role_id} value={role.role_id}>
                              {role.role_name}
                            </option>
                          ))}
                        </select>
                        {formErrors.role_id && (
                          <div className="invalid-feedback">{formErrors.role_id}</div>
                        )}
                      </div>

                      {/* Department */}
                      <div className="mb-3">
                        <label className="form-label">Department (Optional)</label>
                        <select
                          name="department_id"
                          className="form-select"
                          value={data.department_id}
                          onChange={handleChange}
                        >
                          <option value="">Select a department</option>
                          {departments.map((department) => (
                            <option key={department.department_id} value={department.department_id}>
                              {department.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Supervisor */}
                      <div className="mb-3">
                        <label className="form-label">Supervisor (Optional)</label>
                        <select
                          name="supervisor_id"
                          className="form-select"
                          value={data.supervisor_id}
                          onChange={handleChange}
                        >
                          <option value="">Select a supervisor</option>
                          {supervisors.map((supervisor) => (
                            <option key={supervisor.employee_id} value={supervisor.employee_id}>
                              {supervisor.fname} {supervisor.lname}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                          type="button"
                          className="btn btn-secondary me-md-2"
                          onClick={() => {
                            setData({
                              name: "",
                              role_id: "",
                              department_id: "",
                              supervisor_id: "",
                              fname: "",
                              lname: "",
                              email: "",
                              phone: "",
                              sex: "",
                            });
                            setFormErrors({});
                            setSuccessMessage("");
                            setErrorMessage("");
                          }}
                        >
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          Reset Form
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Registering...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-person-plus me-2"></i>
                              Register Employee
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EmployeeRegistration;
