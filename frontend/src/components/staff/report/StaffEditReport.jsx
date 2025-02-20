import Axios from "axios";
import React, { useState, useEffect } from "react";
import "../../../assets/css/planform.css";

const StaffEditReport = ({ reportId }) => {
  const [formData, setFormData] = useState({
    objective: "",
    goal: "",
    row_no: "",
    details: "",
    measurement: "",
    baseline: "",
    plan: "",
    outcome: "",
    execution_percentage: "",
    description: "",
    year: "",
    quarter: "Q1",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");

  useEffect(() => {
    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  // Fetch the report by ID
  const fetchReport = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to view this report.");
      return;
    }

    try {
      const response = await Axios.get(`http://localhost:5000/api/plans/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  // Update state when form fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle updating the report
  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update the report.");
      return;
    }

    try {
      const response = await Axios.put(
        `http://localhost:5000/api/plans/${reportId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResponseMessage("Report updated successfully.");
      setPopupType("success");
    } catch (error) {
      console.error("Error updating report:", error);
      setResponseMessage("An error occurred while updating the report.");
      setPopupType("error");
    } finally {
      setShowPopup(true);
    }
  };

  // Handle deleting the report
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to delete the report.");
      return;
    }

    try {
      await Axios.delete(`http://localhost:5000/api/plans/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResponseMessage("Report deleted successfully.");
      setPopupType("success");
    } catch (error) {
      console.error("Error deleting report:", error);
      setResponseMessage("An error occurred while deleting the report.");
      setPopupType("error");
    } finally {
      setShowPopup(true);
    }
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="form-container-10">
      <h2>Manage Report</h2>
      <form onSubmit={handleUpdate}>
        <label>ግብ:</label>
        <input
          type="text"
          name="objective"
          value={formData.objective}
          onChange={handleChange}
          required
        />
        <br />

        <label>ዓላማ:</label>
        <input
          type="text"
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          required
        />
        <br />

        <label>ተ ቁ:</label>
        <input
          type="number"
          name="row_no"
          value={formData.row_no}
          onChange={handleChange}
        />
        <br />

        <label>ዝርዝር:</label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
        />
        <br />

        <label>ማሳኪያ:</label>
        <input
          type="text"
          name="measurement"
          value={formData.measurement}
          onChange={handleChange}
        />
        <br />

        <label>መነሻ:</label>
        <input
          type="text"
          name="baseline"
          value={formData.baseline}
          onChange={handleChange}
        />
        <br />

        <label>እቅድ:</label>
        <textarea
          name="plan"
          value={formData.plan}
          onChange={handleChange}
        />
        <br />

        <label>ውጤት:</label>
        <textarea
          name="outcome"
          value={formData.outcome}
          onChange={handleChange}
        />
        <br />

        <label>ፐርሰንት:</label>
        <input
          type="number"
          name="execution_percentage"
          value={formData.execution_percentage}
          onChange={handleChange}
          min="0"
          max="100"
        />
        <br />

        <label>መግለጫ:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <br />

        <label>አመት:</label>
        <input
          type="number"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
        />
        <br />

        <label>ሩብ አመት:</label>
        <select
          name="quarter"
          value={formData.quarter}
          onChange={handleChange}
        >
          <option value="Q1">የጀመሪያ ሩብ</option>
          <option value="Q2">ሁለተኛ ሩብ</option>
          <option value="Q3">ሶስተኛ ሩብ</option>
          <option value="Q4">አራተኛ ሩብ</option>
        </select>
        <br />

        <button type="submit">Update </button>
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      </form>

      {showPopup && (
        <div className={`popup ${popupType}`}>
          <div className="popup-content">
            <p>{responseMessage}</p>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffEditReport;
