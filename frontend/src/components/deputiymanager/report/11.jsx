import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import Axios from "axios";
import "../../../assets/css/view.css";
import happy from "../../../assets/img/happy.gif";
import sad from "../../../assets/img/sad.gif";
import debounce from "lodash.debounce";

const DeputiymanagerViewOrgReport = () => {
  const [reports,setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState({
    year: "", // Default year set to 2024
    quarter: "",
    department: "",
    objective: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
const [showDetail, setShowDetail] = useState(false); // For toggling plan details viewInitialize reportDetail state
  const [selectedPlan, setSelectedReport] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set to 10 items per page

const token = localStorage.getItem("token");
const [reportDetail,setReportDetail] = useState(null);  // This was missing

  // Fetch plans based on filters and pagination
  const fetchPlans = async () => {
    if (!token) {
      setErrorMessage("You must be logged in to view plans.");
      return;
    }

    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value)
    );

    if (Object.keys(validFilters).length === 1) {
      setErrorMessage("Please select at least one filter.");
      return;
    }

    try {
      setLoading(true);
      const response = await Axios.get("http://localhost:5000/api/reportorg", {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...validFilters, page: currentPage, limit: itemsPerPage },
      });

      if (response.data.success) {
       setReports(response.data.plans);
        setErrorMessage("");
      } else {
        setErrorMessage("No plans found.");
      }
    } catch (error) {
      setErrorMessage("no plans found.");
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
  const sortedPlans = reports.sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Handle plan deletion
  const handleDelete = async (reportId) => {
    if (!token) {
      alert("You must be logged in to delete reports.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await Axios.delete(`http://localhost:5000/api/plandelete/${reportId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
       setReports((prevPlans) => prevPlans.filter((plan) => plan.ID !== reportId));
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

  const fetchReportDetail = async (reportId) => {
    console.log("Fetching report details for ID:", reportId);
  
    if (!reportId) {
      console.error("Report ID is missing or invalid.");
      setErrorMessage("Invalid report ID.");
      return;
    }
  
    try {
      setLoading(true);
  
      console.log("Token is being sent with the request.");
      console.log("Request URL:", `http://localhost:5000/api/reportorgd/${reportId}`);
  
      const response = await Axios.get(`http://localhost:5000/api/reportorgd/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("API Response:", response.data);
  
      if (response.data && response.data.success && Array.isArray(response.data.plans)) {
        const report = response.data.plans[0]; // Extract the first plan
        if (report) {
          setReportDetail(report);
          setShowDetail(true);
  
          console.log("Report details set:", report);
          console.log("Show detail set to:", true);
        } else {
          console.error("No report found in the response.");
          setErrorMessage("Report details not found.");
        }
      } else {
        console.error("Invalid API response structure:", response.data);
        setErrorMessage("Report details not found.");
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setErrorMessage("Failed to fetch report details.");
    } finally {
      setLoading(false);
      console.log("Loading finished.");
    }
  };
  
  
  const handleDetailClick = (reportId) => {
    if (reportId) {
      fetchReportDetail(reportId);
    } else {
      console.error("report ID is undefined or invalid");
    }
  };


  // Close the details view
  const closeReportDetails = () => {
    setSelectedReport(false);
    setShowDetail(false); // If using a separate variable
  };




  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Deputiymanager</Link>
            </li>
            <li className="breadcrumb-item active">Orginazational report </li>
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
                <h5 className="card-title">የ አይቲ ፓርክ በ CEO የጸደቁ እቅዶች</h5>
                {loading ? (
                  <p>Loading reports...</p>
                ) : errorMessage ? (
                  <p className="text-danger">{errorMessage}</p>
                ) : sortedPlans.length ? (
                  <table className="table datatable">
                    <thead>
                      <tr>
                        <th onClick={() => handleSorting("Objective")}>
                          ግብ{" "}
                          {sortConfig.key === "Objective" ? (
                            sortConfig.direction === "asc" ? (
                              <span>&#9650;</span>
                            ) : (
                              <span>&#9660;</span>
                            )
                          ) : null}
                        </th>
                        <th onClick={() => handleSorting("Goal")}>
                          አላማ{" "}
                          {sortConfig.key === "Goal" ? (
                            sortConfig.direction === "asc" ? (
                              <span>&#9650;</span>
                            ) : (
                              <span>&#9660;</span>
                            )
                          ) : null}
                        </th>
                        <th onClick={() => handleSorting("Details")}>
                          ዝርዝር አላማ{" "}
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
                        <th>Quarter</th> {/* Added Quarter Column */}
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
                          <td>{plan.Quarter}</td> {/* Added Quarter Data */}
                          <td>
                   

                         


                            
                     


                            
                          <button
                            onClick={() => {
                              if (plan.ID) {
                                handleDetailClick(plan.ID);
                              } else {
                                console.error("Plan ID is undefined or invalid");
                                setErrorMessage("Plan ID is missing or invalid for this entry.");
                              }
                            }}
                            className="btn btn-secondary"
                          >
                            Detail
                          </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No re found.</p>
                )}

                {/* Pagination Controls with Arrows */}
                <div className="pagination-controls">
                  <button onClick={prevPage} disabled={currentPage === 1}>
                    &#8592; {/* Left arrow */}
                  </button>
                  <button onClick={nextPage}>
                    &#8594; {/* Right arrow */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Outlet />

{/* Display the report details in a large box (toggleable) */}

      {showDetail && reportDetail && (
  <div className="plan-detail-box">
    <h3>Plan Details</h3>
    <p><strong>Department:</strong> {reportDetail.Department}</p>
    <p><strong>አላማ:</strong> {reportDetail.Objective}</p>
    <p><strong>ግብ:</strong> {reportDetail.Goal}</p>
    <p><strong>Row No:</strong> {reportDetail.Row_No}</p>
    <p><strong>Details:</strong> {reportDetail.Details}</p>
    <p><strong>Measurement:</strong> {reportDetail.Measurement}</p>
    <p><strong>Baseline:</strong> {reportDetail.Baseline}</p>
    <p><strong>Plan:</strong> {reportDetail.Plan}</p>
    <p><strong>ክንውን:</strong>   {reportDetail.Outcome}</p>
    <p><strong>ክንውን በ%:</strong> {reportDetail.Execution_Percentage}%</p>
    <p><strong>Description:</strong> {reportDetail.Description}</p>
    <p><strong>Status:</strong> {reportDetail.Status}</p>
    <p><strong>Comment:</strong> {reportDetail.Comment}</p>
    <p><strong>Created At:</strong> {new Date(reportDetail.Created_At).toLocaleString()}</p>
    <p><strong>Updated At:</strong> {new Date(reportDetail.Updated_At).toLocaleString()}</p>
    <p><strong>Year:</strong> {reportDetail.Year}</p>
    <p><strong>ሩብ አመት:</strong> {reportDetail.Quarter}</p>
    <p><strong>Created By:</strong> {reportDetail.Created_By}</p>
    <p><strong>Progress On:</strong> {reportDetail.Progress}</p>

    <button onClick={closeReportDetails} className="btn btn-primary">Close</button>
  </div>
)}
    </main>
  );
};

export default DeputiymanagerViewOrgReport;
