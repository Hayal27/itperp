import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSort, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import Swal from "sweetalert2"; // Install SweetAlert2 for popups
const Step1Goal = ({ onNext }) => {


  
  const [goals, setgoals] = useState([]);
  const [filteredgoals, setFilteredgoals] = useState([]);
  const [selectedgoal, setSelectedgoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [isCreateVisible, setIsCreateVisible] = useState(true);
  const [newgoal, setNewgoal] = useState({
    name: "",
    description: "",
    year: "",
    quarter: "",
  });

  const token = localStorage.getItem("token");

  // Fetch goals from the API
  useEffect(() => {
    const fetchgoals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/goalsg", {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        });
        setgoals(response.data);
        setFilteredgoals(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching goals:", err);
        setError("Failed to load goals. Please try again.");
        setIsLoading(false);
      }
    };

    if (token) {
      fetchgoals();
    } else {
      setError("Authentication required. Please log in.");
      setIsLoading(false);
    }
  }, [token]);

  // Handle filter change for year and quarter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setNewgoal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Filter goals based on year, quarter, and search query
  useEffect(() => {
    let filtered = goals;

    if (newgoal.year) {
      filtered = filtered.filter(
        (goal) => goal.year === parseInt(newgoal.year)
      );
    }

    if (newgoal.quarter) {
      filtered = filtered.filter(
        (goal) => parseInt(goal.quarter) === parseInt(newgoal.quarter)
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((goal) =>
        goal.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

    setFilteredgoals(filtered);
  }, [newgoal.year, newgoal.quarter, searchQuery, goals, sortField, sortOrder]);

  // Handle goal selection
  const handlegoalSelect = (goal) => {
    setSelectedgoal(goal);
  
    // Show a Bootstrap alert with feedback
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
    setNewgoal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle creation of a new goal
  const handleCreategoal = async () => {
    if (!newgoal.name || !newgoal.year || !newgoal.quarter) {
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
          name: newgoal.name,
          description: newgoal.description,
          year: parseInt(newgoal.year),
          quarter: parseInt(newgoal.quarter),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Update goals list
      setgoals((prev) => [...prev, response.data]);
      setFilteredgoals((prev) => [...prev, response.data]);
  
      // Reset new goal form
      setNewgoal({
        name: "",
        description: "",
        year: "",
        quarter: "",
      });
  
      // Success feedback
      Swal.fire({
        icon: "success",
        title: "goal Created",
        text: "Your new goal has been successfully created!",
      });
    } catch (err) {
      console.error("Error creating goal:", err);
  
      // Check specific error types
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
    if (selectedgoal) {
      // Log the selected goal to the console
      console.log("Passed goal:", selectedgoal);
  
      // Call the onNext function to pass the selected goal to the next step
      onNext(selectedgoal);  
    } 
    
    else {
      alert("Please select an goal or create a new one.");
    }

    
  };
  

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentgoals = filteredgoals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

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
    <h2 className="text-center mb-4">ግብ ይምረጡ </h2>
  
    {/* Toggle Filter Section Button */}
    <button 
      className="btn btn-info mb-3" 
      onClick={toggleFilterVisibility}
      style={{ width: '17%' }}
    >
      <FontAwesomeIcon icon={isFilterVisible ? faArrowUp : faArrowDown} />
      {isFilterVisible ? ' Hide ' : ' Show '}
    </button>
  
    {/* Filter Section */}
    <div className={`filter-section ${isFilterVisible ? 'show' : ''}`}>
      <div className="row mb-4">
        <div className="col-md-4">
          <label htmlFor="year">Year:</label>
          <input
            type="number"
            id="year"
            name="year"
            value={newgoal.year}
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
            value={newgoal.quarter}
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
  
    {/* Display loading or error */}
    {isLoading && (
      <div className="text-center">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Loading goals...</p>
      </div>
    )}
    {error && <div className="alert alert-danger">{error}</div>}
  
    {/* List of goals */}
    <div>
  <h3>ያጣሩት ግብ</h3>
  {currentgoals.length === 0 ? (
    <p>No goals found. Try adjusting your filters or create a new goal.</p>
  ) : (
    <ul className="list-group">
      {currentgoals.map((goal) => (
        <li
          key={goal.id}
          className={`list-group-item ${selectedgoal?.id === goal.id ? "text-blue" : ""}`} 
          onClick={() => handlegoalSelect(goal)}
          style={{
            cursor: "arrow",
            transition: "background-color 0.3s ease, transform 0.3s ease",
          background: "linear-gradient(to right,rgb(223, 108, 14),rgb(31, 116, 185))"
          // bg for selected goal
      
          

        }}
        >
          <div className="d-flex justify-content-between">
            <span>{goal.name}</span>
            <button
              className="btn btn-sm btn-light"
              onClick={(e) => {
                e.stopPropagation();
                toggleSortOrder("name");
              }}
            >
              <FontAwesomeIcon icon={faSort} /> Sort
            </button>
          </div>
          <small className="text-muted">
            {`Year: ${goal.year}, Quarter: ${goal.quarter}`}
          </small>
        </li>
      ))}
    </ul>
  )}

  {filteredgoals.length > itemsPerPage && (
    <nav className="mt-3">
      <ul className="pagination justify-content-center">
        {Array.from(
          { length: Math.ceil(filteredgoals.length / itemsPerPage) },
          (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          )
        )}
      </ul>
    </nav>
  )}
</div>

  
    <div className="creat">
      {/* Toggle Create New goal Section */}
      <button 
        className="btn btn-info mt-4 mb-3" 
        onClick={toggleCreateVisibility}
        style={{ width: '17%' }}
      >
        <FontAwesomeIcon icon={isCreateVisible ? faArrowUp : faArrowDown} />
        {isCreateVisible ? ' Hide ' : ' Show '}
      </button>
  
      {/* Create new goal */}
      <div className={`create-section ${isCreateVisible ? 'show' : ''}`}>
        <div className=" mt-4">
          <h3>አዲስ ግብ እዝህ ይፍጠሩ⬇️</h3>
          <div className=" row">
            <div className="col-md-6">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newgoal.name}
                onChange={handleInputChange}
                placeholder="goal name"
                className="form-control"
              />
            </div>
  
            <div className="col-md-6">
              <label htmlFor="description">Description:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={newgoal.description}
                onChange={handleInputChange}
                placeholder="goal description"
                className="form-control"
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <label htmlFor="year-create">Year:</label>
              <input
                type="number"
                id="year-create"
                name="year"
                value={newgoal.year}
                onChange={handleInputChange}
                placeholder="Enter year"
                className="form-control"
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="quarter-create">Quarter:</label>
              <select
                id="quarter-create"
                name="quarter"
                value={newgoal.quarter}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="">Select Quarter</option>
                <option value={1}>Quarter 1</option>
                <option value={2}>Quarter 2</option>
                <option value={3}>Quarter 3</option>
                <option value={4}>Quarter 4</option>
              </select>
            </div>
          </div>
          <button
            className="btn btn-primary mt-3"
            onClick={handleCreategoal}
          >
            Create goal
          </button>
        </div>
      </div>
    </div>
  
    {/* Navigation buttons */}
    <div className="next">
      <button className="btn btn-success" onClick={handleNext}>
        Next
      </button>
    </div>
  </div>
  
  );
};

export default Step1Goal;

