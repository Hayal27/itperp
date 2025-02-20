import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const Step2Objective = ({ goalId, onNext, onBack }) => {
  const [objectives, setObjectives] = useState([]);
  const [filteredObjectives, setFilteredObjectives] = useState([]);
  const [selectedObjective, setSelectedObjective] = useState(null);
  const [newObjective, setNewObjective] = useState({ name: "", description: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/objectivesg?goal_id=${goalId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setObjectives(response.data);
        setFilteredObjectives(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching objectives:", err);
        setError("Failed to load objectives. Please try again.");
        setIsLoading(false);
      }
    };

    if (goalId && token) {
      fetchObjectives();
    } else {
      setError("Invalid goal or session. Please try again.");
      setIsLoading(false);
    }
  }, [goalId, token]);

  // Filter objectives by search query
  useEffect(() => {
    const filtered = objectives.filter((objective) =>
      objective.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredObjectives(filtered);
  }, [searchQuery, objectives]);

  // Handle input changes for new objective
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewObjective((prev) => ({ ...prev, [name]: value }));
  };

  // Handle objective selection
  const handleObjectiveSelect = (objective) => {
    setSelectedObjective(objective);
    Swal.fire({
      icon: "info",
      title: "የጠመረጠው አላም",
      text: `➡️🎯: ${objective.name}`,
      confirmButtonText: "OK",
    });
  };

  // Handle creating a new objective
  // Handle creating a new objective

  // Handle creating a new objective
const handleCreateObjective = async () => {
  if (!newObjective.name || !newObjective.description) {
    Swal.fire({
      title: "Incomplete Form",
      text: "Please fill in all fields to create a new objective.",
      icon: "warning",
      confirmButtonText: "OK",
    });
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/addobjective",
      { name: newObjective.name, description: newObjective.description, goal: goalId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Show success message
    Swal.fire({
      title: "Objective Created",
      text: "Your new objective has been successfully created!",
      icon: "success",
      confirmButtonText: "OK",
    });

    // Reset the form
    setNewObjective({ name: "", description: "" });

    // Refetch objectives to include the newly created one
    await fetchObjectives();
  } catch (err) {
    console.error("Error creating objective:", err);
    Swal.fire({
      title: "Error",
      text: "Failed to create objective. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

// Fetch objectives (moved to a reusable function for reuse)
const fetchObjectives = async () => {
  setIsLoading(true); // Show loading spinner while fetching
  try {
    const response = await axios.get(
      `http://localhost:5000/api/objectivesg?goal_id=${goalId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setObjectives(response.data);
    setFilteredObjectives(response.data);
  } catch (err) {
    console.error("Error fetching objectives:", err);
    setError("Failed to load objectives. Please try again.");
  } finally {
    setIsLoading(false); // Hide loading spinner
  }
};


// Fetch objectives (moved to a reusable function for reuse)


  // Handle proceeding to the next step
  const handleNext = () => {
    if (selectedObjective) {
      const objectiveData = {
        id: selectedObjective.objective_id,
        name: selectedObjective.name,
        description: selectedObjective.description,
        goal_id: selectedObjective.goal_id || goalId,
      };
      onNext(objectiveData);
    } else {
      Swal.fire({
        title: "No Objective Selected",
        text: "Please select an objective before proceeding.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">አላማ ይምረጡ</h2>

      {/* Back Button */}
      <button onClick={onBack} className="btn btn-secondary mb-3">
        Back
      </button>

      {/* Search Bar */}
      <div className="mb-3">
        <label htmlFor="search" className="form-label">Search Objectives:</label>
        <div className="input-group">
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            placeholder="Search by name"
          />
          <span className="input-group-text">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>

      {/* Loading or Error Messages */}
      {isLoading && (
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading objectives...</p>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Objectives Table */}
      {filteredObjectives.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th scope="col">ተ.ቁ</th>
                <th scope="col">የግቡ ስም</th>
                <th scope="col">ስለ ግቡ ማብራሪያ</th>
              </tr>
            </thead>
            <tbody>
              {filteredObjectives.map((objective, index) => (
                <tr
                  key={objective.id}
                  className={selectedObjective?.id === objective.id ? "table-primary" : ""}
                  onClick={() => handleObjectiveSelect(objective)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{objective.name}</td>
                  <td>{objective.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No Objectives Found */}
      {filteredObjectives.length === 0 && <p>No objectives found. Try creating a new objective.</p>}

      {/* Create New Objective */}
      <h4>አዲስ አላማ ይፍጠሩ⬇️</h4>
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={newObjective.name}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter objective name"
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="description" className="form-label">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={newObjective.description}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter objective description"
          />
        </div>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleCreateObjective}>
        Create Objective
      </button>

      {/* Next Button */}
      <div className="mt-3">
        <button className="btn btn-success" onClick={handleNext} disabled={!selectedObjective}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2Objective;
