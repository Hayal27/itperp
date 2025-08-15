
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSort, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";

const Step1Goal = ({ onNext }) => {
  const [goals, setGoals] = useState([]);
  const [filteredGoals, setFilteredGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [isCreateVisible, setIsCreateVisible] = useState(true);
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    year: "",
    quarter: "",
  });

  const token = localStorage.getItem("token");

  // Fetch goals from the API
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/goalsg", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoals(response.data);
        setFilteredGoals(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching goals:", err);
        setError("Failed to load goals. Please try again.");
        setIsLoading(false);
      }
    };

    if (token) {
      fetchGoals();
    } else {
      setError("Authentication required. Please log in.");
      setIsLoading(false);
    }
  }, [token]);

  // Handle filter change for year and quarter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Filter goals based on year, quarter, and search query, then apply sorting
  useEffect(() => {
    let filtered = goals;

    if (newGoal.year) {
      filtered = filtered.filter((goal) => goal.year === parseInt(newGoal.year));
    }

    if (newGoal.quarter) {
      filtered = filtered.filter((goal) => parseInt(goal.quarter) === parseInt(newGoal.quarter));
    }

    if (searchQuery) {
      filtered = filtered.filter((goal) =>
        goal.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

    setFilteredGoals(filtered);
    setCurrentPage(1);
  }, [newGoal.year, newGoal.quarter, searchQuery, goals, sortField, sortOrder]);

  // Handle goal selection
  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    Swal.fire({
      icon: 'info',
      title: 'የመረጡት ግብ',
      text: `➡️🎯: ${goal.name}`,
      confirmButtonText: 'OK',
    });
  };

  // Handle input changes for new goal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle creation of a new goal
  const handleCreateGoal = async () => {
    if (!newGoal.name || !newGoal.year || !newGoal.quarter) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: "Please fill in all required fields to create a new goal.",
      });
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/addgoal",
        {
          name: newGoal.name,
          description: newGoal.description,
          year: parseInt(newGoal.year),
          quarter: parseInt(newGoal.quarter),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update goals list
      setGoals((prev) => [...prev, response.data]);
      setFilteredGoals((prev) => [...prev, response.data]);
      // Reset new goal form
      setNewGoal({
        name: "",
        description: "",
        year: "",
        quarter: "",
      });
      Swal.fire({
        icon: "success",
        title: "Goal Created",
        text: "Your new goal has been successfully created!",
      });
    } catch (err) {
      console.error("Error creating goal:", err);
      if (err.response && err.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Please check your inputs and try again.",
        });
      } else if (err.response && err.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Your session has expired. Please log in again.",
        });
      } else if (err.response && err.response.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Server Error",
          text: "An error occurred on the server. Please try again later.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Network Error",
          text: "Failed to connect to the server. Please check your connection.",
        });
      }
    }
  };

  // Handle next step
  const handleNext = () => {
    if (selectedGoal) {
      console.log("Passed goal:", selectedGoal);
      onNext(selectedGoal);
    } else {
      alert("Please select a goal or create a new one.");
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGoals = filteredGoals.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Toggle sort order
  const toggleSortOrder = (field) => {
    if (sortField === field) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const toggleCreateVisibility = () => {
    setIsCreateVisible(!isCreateVisible);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">ግብ ይምረጡ አልያም አዲስ ይፍጠሩ</h2>

      {/* Toggle Filter Section Button */}
      <button 
        className="btn btn-info mb-3" 
        onClick={toggleFilterVisibility}
        style={{ width: "17%" }}
      >
        <FontAwesomeIcon icon={isFilterVisible ? faArrowUp : faArrowDown} />
        {isFilterVisible ? " Hide " : " Show "}
      </button>

      {/* Filter Section */}
      {isFilterVisible && (
        <div className="filter-section mb-4">
          <div className="row">
            <div className="col-md-4">
              <label htmlFor="year">Year:</label>
              <input
                type="number"
                id="year"
                name="year"
                value={newGoal.year}
                onChange={handleFilterChange}
                placeholder="Enter year"
                className="form-control"
              />
            </div>

            <div className="col-md-4">
              <label htmlFor="quarter">Quarter:</label>
              <select
                id="quarter"
                name="quarter"
                value={newGoal.quarter}
                onChange={handleFilterChange}
                className="form-control"
              >
                <option value="">Select Quarter</option>
                <option value={1}>Quarter 1</option>
                <option value={2}>Quarter 2</option>
                <option value={3}>Quarter 3</option>
                <option value={4}>Quarter 4</option>
              </select>
            </div>

            <div className="col-md-4">
              <label htmlFor="search">Search:</label>
              <div className="input-group">
                <input
                  type="text"
                  id="search"
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                />
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display loading or error */}
      {isLoading && (
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading goals...</p>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Goals Table */}
      <div className="table-responsive">
        {currentGoals.length === 0 ? (
          <p>No goals found. Try adjusting your filters or create a new goal.</p>
        ) : (
          <table className="table table-striped table-hover table-bordered" style={{ backgroundColor: "#f8f9fa" }}>
            <thead className="table-dark">
              <tr>
                <th>
                  <button 
                    className="btn btn-sm btn-outline-light" 
                    onClick={() => toggleSortOrder("name")}
                  >
                    Goal Name <FontAwesomeIcon icon={faSort} />
                  </button>
                </th>
                <th>Year</th>
                <th>Quarter</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentGoals.map((goal) => (
                <tr 
                  key={goal.id} 
                  onClick={() => handleGoalSelect(goal)} 
                  style={{ cursor: "pointer" }}
                  className={selectedGoal?.id === goal.id ? "table-primary" : ""}
                >
                  <td>{goal.name}</td>
                  <td>{goal.year}</td>
                  <td>{goal.quarter}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-info"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSortOrder("name");
                      }}
                    >
                      <FontAwesomeIcon icon={faSort} /> Sort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filteredGoals.length > itemsPerPage && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            {Array.from(
              { length: Math.ceil(filteredGoals.length / itemsPerPage) },
              (_, index) => (
                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                  <button className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      )}

 
      {/* Navigation Button */}
      <div className="d-grid gap-2 mt-4">
        <button className="btn btn-success" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1Goal;
