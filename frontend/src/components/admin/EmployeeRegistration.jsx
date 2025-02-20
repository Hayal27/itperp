import Axios from "axios";
import React, { useEffect, useState } from "react";

const EmployeeRegistration = () => {
  // State for roles, departments, supervisors, success message, error message, and form data
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    name: "",
    role_id: "",
    department_id: "", // Optional
    supervisor_id: "", // Optional
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

  // Handle form data change
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // Submit form data to register employee
  const submit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios.post("http://localhost:5000/api/addEmployee", data);
      console.log(response.data);
      if (response.data.message) {
        setErrorMessage(response.data.message);
        setSuccessMessage("");
      } else {
        setSuccessMessage("Employee SUCCESSFULLY Registered");
        setErrorMessage("");
        setData({
          name: "",
          role_id: "",
          department_id: "", // Reset optional fields
          supervisor_id: "", // Reset optional fields
          fname: "",
          lname: "",
          email: "",
          phone: "",
          sex: "",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An error occurred during registration.");
      setSuccessMessage("");
    }
  };

  return (
    <main id="main" className="main" style={{ width: "100%" }}>
      <div className="pagetitle">
        {/* <h1>Employee Registration</h1> */}
      </div>
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Employee Registration</h5>
                <div className="card">
                  <div className="card-body">
                    {successMessage && <h3 className="text-success">{successMessage}</h3>}
                    {errorMessage && <h3 className="text-danger">{errorMessage}</h3>}
                    <form onSubmit={submit}>
                      <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">First Name</label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            name="fname"
                            value={data.fname}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Last Name</label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            name="lname"
                            value={data.lname}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Email</label>
                        <div className="col-sm-10">
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Phone</label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={data.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Sex</label>
                        <div className="col-sm-10">
                          <select
                            name="sex"
                            className="form-select"
                            value={data.sex}
                            onChange={handleChange}
                            required
                          >
                            <option value="" disabled>Select sex</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            
                          </select>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Employee Name</label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Department field - Optional */}
                      <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Department</label>
                        <div className="col-sm-10">
                          <select
                            name="department_id"
                            className="form-select"
                            value={data.department_id}
                            onChange={handleChange}
                          >
                            <option value="">Select a department (Optional)</option>
                            {departments.map((department) => (
                              <option key={department.department_id} value={department.department_id}>
                                {department.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Role field */}
                      <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Role</label>
                        <div className="col-sm-10">
                          <select
                            name="role_id"
                            className="form-select"
                            value={data.role_id}
                            onChange={handleChange}
                            required
                          >
                            <option value="" disabled>Select a role</option>
                            {roles.map((role) => (
                              <option key={role.role_id} value={role.role_id}>
                                {role.role_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Supervisor field - Optional */}
                      <div className="row mb-3">
                        <label className="col-sm-4 col-form-label">Supervisor</label>
                        <div className="col-sm-10">
                          <select
                            name="supervisor_id"
                            className="form-select"
                            value={data.supervisor_id}
                            onChange={handleChange}
                          >
                            <option value="">Select a supervisor (Optional)</option>
                            {supervisors.map((supervisor) => (
                              <option key={supervisor.employee_id} value={supervisor.employee_id}>
                                {supervisor.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-sm-10">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EmployeeRegistration;
