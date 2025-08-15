import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import Axios from "axios";
import "../../../assets/css/view.css";
import happy from "../../../assets/img/happy.gif";
import sad from "../../../assets/img/sad.gif";
import debounce from "lodash.debounce";

const TeamleaderViewDeclinedReport = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState({
    year: "", // Default changed to empty to display plans for all years
    quarter: "",
    department: "",
    objective: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showDetail, setShowDetail] = useState(false); // For toggling plan details view
  const [selectedPlan, setSelectedPlan] = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set to 10 items per page

  const token = localStorage.getItem("token");
  // State for plan details
  const [planDetail, setPlanDetail] = useState(null);

  // Fetch plans based on filters and pagination
  const fetchPlans = async () => {
    if (!token) {
      setErrorMessage("You must be logged in to view plans.");
      return;
    }

    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value)
    );

    // Removed the check for no filters to allow fetching all plans by default
    try {
      setLoading(true);
      const response = await Axios.get("http://localhost:5000/api/plandeclined", {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...validFilters, page: currentPage, limit: itemsPerPage },
      });

      if (response.data.success) {
        setPlans(response.data.plans);
        setErrorMessage("");
      } else {
        setErrorMessage("No plans found.");
      }
    } catch (error) {
      setErrorMessage("No plans found.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change with debounced fetching
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, [name]: value };
      return newFilters;
    });
  };

  const debouncedFetchPlans = debounce(fetchPlans, 500);

  useEffect(() => {
    debouncedFetchPlans(); // Fetch plans whenever filters change or pagination changes
  }, [filters, currentPage]);

  // Handle sorting
  const handleSorting = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort plans based on the selected column
  const sortedPlans = plans.sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Handle plan deletion
  const handleDelete = async (planId) => {
    if (!token) {
      alert("You must be logged in to delete plans.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await Axios.delete(`http://localhost:5000/api/plandelete/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.ID !== planId));
        setPopupType("success");
        setResponseMessage("Plan deleted successfully.");
      } catch (error) {
        setPopupType("error");
        setResponseMessage("Failed to delete the plan.");
      } finally {
        setShowPopup(true);
      }
    }
  };

  // Close popup after success or error
  const closePopup = () => {
    setShowPopup(false);
  };

  // Handle pagination
  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  // Fetch plan details by ID
  const fetchPlanDetail = async (planId) => {
    try {
      setLoading(true);
      const response = await Axios.get(`http://localhost:5000/api/pland/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPlanDetail(response.data.plan);
        setShowDetail(true);
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to fetch plan details.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching plan details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = (planId) => {
    if (planId) {
      fetchPlanDetail(planId);
    } else {
      console.error("Plan ID is undefined or invalid");
    }
  };

  // Close the details view
  const closePlanDetails = () => {
    setSelectedPlan(false);
    setShowDetail(false);
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Teamleader</Link>
            </li>
            <li className="breadcrumb-item active">Plan Management</li>
          </ol>
        </nav>
      </div>

      {showPopup && (
        <div className={`popup ${popupType}`}>
          <div className="popup-content">
            <img
              src={popupType === "success" ? happy : sad}
              alt={popupType === "success" ? "Success" : "Error"}
              className="emoji"
              style={{ width: "100px", height: "100px" }}
            />
            <p>{responseMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">እቅዶን ይፈልጉ</h5>
                <div className="row">
                  <div className="col-md-3">
                    <input
                      type="number"
                      name="year"
                      value={filters.year}
                      onChange={handleFilterChange}
                      className="form-control"
                      placeholder="Enter Year"
                    />
                  </div>
                  <div className="col-md-3">
                    <select
                      name="quarter"
                      value={filters.quarter}
                      onChange={handleFilterChange}
                      className="form-control"
                    >
                      <option value=""> ⬇️ሩብ አመት ይምረጡ</option>
                      <option value="Q1">የጀመሪያ ሩብ አመት</option>
                      <option value="Q2">ሁለተኛ ሩብ አመት</option>
                      <option value="Q3">ሶስተኛ ሩብ አመት</option>
                      <option value="Q4">አራተኛ ሩብ አመት</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      name="department"
                      value={filters.department}
                      onChange={handleFilterChange}
                      className="form-control"
                    >
                      <option value="">⬇️ዲፓርትመንት ይምረጡ</option>
                      <option value="የ ቴክኖሎጂ ልማት አገልግሎት">የ ቴክኖሎጂ ልማት አገልግሎት</option>
                      <option value="የ አይሲቲ ኢንኩቬሽን አገልግሎት">የ አይሲቲ ኢንኩቬሽን አገልግሎት</option>
                      <option value="የ ኢንቨስትመንት ክትትልና ድጋፍ አገልግሎት">የ ኢንቨስትመንት ክትትልና ድጋፍ አገልግሎት</option>
                      <option value="ፋይናንስ እና አስተዳደር አገልግሎት">የህግ ጉዳዮች </option>
                      <option value="የመሬትና መሰረተ ልማት አገልግሎት ">የመሬትና መሰረተ ልማት አገልግሎት </option>
                      <option value="የፋሲሊቲ ማስፋፊያ እና ጥገና አገልግሎት">የፋሲሊቲ ማስፋፊያ እና ጥገና አገልግሎት</option>
                      <option value="የግንባታ ፕሮጀክቶች ክትትል እና ቁጥጥር አገልግሎት">የግንባታ ፕሮጀክቶች ክትትል እና ቁጥጥር አገልግሎት</option>
                      <option value="ኢንፎርሜሽን ቴክኖሎጂ ዘርፍ">ኢንፎርሜሽን ቴክኖሎጂ ዘርፍ</option>
                      <option value="የ ኮንስትራክሽን ማናጅመንት ዘርፍ">የ ኮንስትራክሽን ማናጅመንት ዘርፍ</option>
                    </select>
                  </div>
                </div>
                <button
                  className="btn btn-primary mt-3"
                  onClick={debouncedFetchPlans}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Plans Table</h5>
                {loading ? (
                  <p>Loading plans...</p>
                ) : errorMessage ? (
                  <p className="text-danger">{errorMessage}</p>
                ) : sortedPlans.length ? (
                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th onClick={() => handleSorting("Objective")}>
                          Objective{" "}
                          {sortConfig.key === "Objective" ? (
                            sortConfig.direction === "asc" ? (
                              <span>&#9650;</span>
                            ) : (
                              <span>&#9660;</span>
                            )
                          ) : null}
                        </th>
                        <th onClick={() => handleSorting("Goal")}>
                          Goal{" "}
                          {sortConfig.key === "Goal" ? (
                            sortConfig.direction === "asc" ? (
                              <span>&#9650;</span>
                            ) : (
                              <span>&#9660;</span>
                            )
                          ) : null}
                        </th>
                        <th onClick={() => handleSorting("Details")}>
                          Specific Goal{" "}
                          {sortConfig.key === "Details" ? (
                            sortConfig.direction === "asc" ? (
                              <span>&#9650;</span>
                            ) : (
                              <span>&#9660;</span>
                            )
                          ) : null}
                        </th>
                        <th onClick={() => handleSorting("Department")}>
                          Department{" "}
                          {sortConfig.key === "Department" ? (
                            sortConfig.direction === "asc" ? (
                              <span>&#9650;</span>
                            ) : (
                              <span>&#9660;</span>
                            )
                          ) : null}
                        </th>
                        <th onClick={() => handleSorting("Year")}>
                          Year{" "}
                          {sortConfig.key === "Year" ? (
                            sortConfig.direction === "asc" ? (
                              <span>&#9650;</span>
                            ) : (
                              <span>&#9660;</span>
                            )
                          ) : null}
                        </th>
                        <th>Quarter</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlans.map((plan) => (
                        <tr key={plan.ID}>
                          <td>{plan.Objective}</td>
                          <td>{plan.Goal}</td>
                          <td>{plan.Details}</td>
                          <td>{plan.Department}</td>
                          <td>{plan.Year}</td>
                          <td>{plan.Quarter}</td>
                          <td>
                            <Link to={`view/update/${plan.Plan_ID}`} className="btn btn-primary">
                              Update
                            </Link>
                            <button
                              onClick={() => handleDelete(plan.Plan_ID)}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                            <Link to={`add-report/${plan.Plan_ID}`} className="btn btn-info">
                              Add Report
                            </Link>
                            <button onClick={() => handleDetailClick(plan.Plan_ID)} className="btn btn-secondary">
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No plans found.</p>
                )}

                {/* Pagination Controls with Arrows */}
                <div className="pagination-controls">
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    &#8592;
                  </button>
                  <button onClick={nextPage}>
                    &#8594;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Outlet />

      {/* Display the plan details in a large box (toggleable) */}
      {showDetail && planDetail && (
        <div className="plan-detail-box">
          <h3>Plan Details</h3>
          <p><strong>Department:</strong> {planDetail.Department}</p>
          <p><strong>አላማ:</strong> {planDetail.Objective}</p>
          <p><strong>ግብ:</strong> {planDetail.Goal}</p>
          <p><strong>Row No:</strong> {planDetail.Row_No}</p>
          <p><strong>Details:</strong> {planDetail.Details}</p>
          <p><strong>Measurement:</strong> {planDetail.Measurement}</p>
          <p><strong>Baseline:</strong> {planDetail.Baseline}</p>
          <p><strong>Plan:</strong> {planDetail.Plan}</p>
          <p><strong>Description:</strong> {planDetail.Description}</p>
          <p><strong>Status:</strong> {planDetail.Status}</p>
          <p><strong>Comment:</strong> {planDetail.Comment}</p>
          <p><strong>Created At:</strong> {new Date(planDetail.Created_At).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(planDetail.Updated_At).toLocaleString()}</p>
          <p><strong>Year:</strong> {planDetail.Year}</p>
          <p><strong>ሩብ አመት:</strong> {planDetail.Quarter}</p>
          <p><strong>Created By:</strong> {planDetail.Created_By}</p>
          <p><strong>Progress On:</strong> {planDetail.Progress}</p>
          <button onClick={closePlanDetails} className="btn btn-primary">Close</button>
        </div>
      )}
    </main>
  );
};

export default TeamleaderViewDeclinedReport;