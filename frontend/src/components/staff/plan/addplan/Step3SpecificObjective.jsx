import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faSearch } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2"; // SweetAlert2 for popups

const Step3SpecificObjective = ({ objectiveId, token, onBack, onNext }) => {
  const [specificObjectives, setSpecificObjectives] = useState([]);
  const [filteredSpecificObjectives, setFilteredSpecificObjectives] = useState([]);
  const [selectedSpecificObjective, setSelectedSpecificObjective] = useState(null);
  const [newSpecificObjective, setNewSpecificObjective] = useState({
    specific_objective_name: "",
    view: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  // Fetch Specific Objectives
  const fetchSpecificObjectives = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/spesificObjectivesg?objective_id=${objectiveId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSpecificObjectives(response.data);
      setFilteredSpecificObjectives(response.data);
    } catch (err) {
      setError("Failed to load specific objectives. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (objectiveId) {
      fetchSpecificObjectives();
    } else {
      setError("Invalid objective. Please try again.");
      setIsLoading(false);
    }
  }, [objectiveId]);

  // Filter Specific Objectives
  useEffect(() => {
    const filtered = specificObjectives.filter((obj) =>
      obj.specific_objective_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSpecificObjectives(filtered);
  }, [searchQuery, specificObjectives]);

  const handleSpecificObjectiveSelect = (specificObjective) => {
    setSelectedSpecificObjective(specificObjective);
    Swal.fire({
      title: "የተመረጠው የእቅድ ውጤት",
      text: `➡️🎯: ${specificObjective.specific_objective_name}`,
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  const handleNext = () => {
    if (selectedSpecificObjective) {
      onNext(selectedSpecificObjective);
    } else {
      Swal.fire({
        title: "No Selection",
        text: "Please select a specific objective before proceeding.",
        icon: "warning",
        confirmButtonText: "OK",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSpecificObjective((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateSpecificObjective = async () => {
    if (!newSpecificObjective.specific_objective_name || !newSpecificObjective.view) {
      Swal.fire({
        title: "Incomplete Form",
        text: "Please fill in all fields to create a new specific objective.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    if (isCreating) return; // Prevent multiple submissions
    setIsCreating(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/addSpecificObjective",
        {
          specific_objective_name: newSpecificObjective.specific_objective_name,
          view: newSpecificObjective.view,
          objective_id: objectiveId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        title: "Specific Objective Created",
        text: "Your new specific objective has been successfully created!",
        icon: "success",
        confirmButtonText: "OK",
      });

      // Reset form and refetch the updated list
      setNewSpecificObjective({ specific_objective_name: "", view: "" });
      fetchSpecificObjectives();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to create specific objective. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">የ አላምዉን ውጤት ይምረጡ</h2>
      <button onClick={onBack} className="btn btn-secondary mb-3">
        Back
      </button>

      {/* Search Bar */}
      <div className="mb-3">
        <label htmlFor="search">Search Specific Objectives:</label>
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

      {/* Loading and Error Messages */}
      {isLoading && (
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="2x" />
          <p>Loading specific objectives...</p>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Table of Specific Objectives */}
      <h4></h4>
      {filteredSpecificObjectives.length === 0 ? (
        <p>No specific objectives found. Try creating a new specific objective.</p>
      ) : (
        <table className="table table-bordered table-hover mt-3">
          <thead className="table-light">
            <tr>
              <th>የውጤቱ ስም</th>
              <th>እይታ</th>
            </tr>
          </thead>
          <tbody>
            {filteredSpecificObjectives.map((specificObjective) => (
              <tr
                key={specificObjective.specific_objective_id}
                className={
                  selectedSpecificObjective?.specific_objective_id ===
                  specificObjective.specific_objective_id
                    ? "table-success"
                    : ""
                }
                onClick={() => handleSpecificObjectiveSelect(specificObjective)}
                style={{ cursor: "pointer" }}
              >
                <td>{specificObjective.specific_objective_name}</td>
                <td>{specificObjective.view}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


      {/* Next Button */}
      <div className="mt-3">
        <button
          className="btn btn-success"
          onClick={handleNext}
          disabled={!selectedSpecificObjective}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3SpecificObjective;
