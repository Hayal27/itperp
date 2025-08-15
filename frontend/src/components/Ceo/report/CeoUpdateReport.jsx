import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import sad from "../../../../assets/img/sad.gif";
import happy from "../../../../assets/img/happy.gif";

const CeoUpdateReport = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({
    Objective: "",
    Goal: "",
    Details: "",
    Measurement: "",
    Baseline: "",
    Plan: "",
    Description: "",
    Year: "",
    ሩብ_አመት: "የመጀመሪያ ሩብ አመት", // Default value
    Progress: "planned", // Default value
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // State for toggling preview
  const [errors, setErrors] = useState({});

  // Fetch report details
  useEffect(() => {
    const token = localStorage.getItem("token");
    Axios.get(`http://localhost:5000/api/reportget/${reportId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setReport(res.data.report);
        setFormData({
          Objective: res.data.report.Objective || "",
          Goal: res.data.report.Goal || "",
          Details: res.data.report.Details || "",
          Measurement: res.data.report.Measurement || "",
          Baseline: res.data.report.Baseline || "",
          Plan: res.data.report.Plan || "",
          Description: res.data.report.Description || "",
          Year: res.data.report.Year || "",
          ሩብ_አመት: res.data.report.ሩብ_አመት || "የመጀመሪያ ሩብ አመት",
          Progress: res.data.report.Progress || "planned",
        });
      })
      .catch((err) => {
        console.error("Error fetching report details:", err.response || err.message);
        setResponseMessage("Failed to fetch report details.");
        setPopupType("error");
        setShowPopup(true);
      });
  }, [reportId]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate the form fields
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Check if required fields are empty
    Object.keys(formData).forEach((key) => {
      if (formData[key] === "" && key !== "Details") {
        formErrors[key] = `${key} is required`;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  // Submit the form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      setResponseMessage("ባዶ ቦታዎችን ይሙሉ");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    const updatedData = {
        objective: formData.Objective,
        goal: formData.Goal,
        details: formData.Details,
        measurement: formData.Measurement,
        baseline: formData.Baseline,
        plan: formData.Plan,
        description: formData.Description,
        year: parseInt(formData.Year, 10),
        ሩብ_አመት: formData.ሩብ_አመት,
        progress: formData.Progress,
    };

    const token = localStorage.getItem("token");

    Axios.put(`http://localhost:5000/api/reportupdate/${reportId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
    })
        .then(() => {
            setResponseMessage("በተገቢዉ ዘምኗል!");
            setPopupType("success");
            setShowPopup(true);
        })
        .catch((err) => {
            setResponseMessage("Error updating the report. Please try again.");
            setPopupType("error");
            setShowPopup(true);
        });
  };

  // Toggle preview visibility
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="form-container-10">
      <h2> ሪፖርቶን ያዘምኑ</h2>
      {report ? (
        <>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <div className="mb-3">
              <label>ግብ</label>
              <input
                type="text"
                name="Objective"
                value={formData.Objective}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              {errors.Objective && <small className="text-danger">{errors.Objective}</small>}
            </div>
            <div className="mb-3">
              <label>አላማ</label>
              <input
                type="text"
                name="Goal"
                value={formData.Goal}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              {errors.Goal && <small className="text-danger">{errors.Goal}</small>}
            </div>
            <div className="mb-3">
              <label>የሚከናወኑ ዝርዝር ሥራዎች</label>
              <textarea
                name="Details"
                value={formData.Details}
                onChange={handleInputChange}
                className="form-control"
              ></textarea>
            </div>
            <div className="mb-3">
              <label>መለኪያ</label>
              <input
                type="text"
                name="Measurement"
                value={formData.Measurement}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>መነሻ</label>
              <input
                type="text"
                name="Baseline"
                value={formData.Baseline}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>እቅድ</label>
              <input
                type="text"
                name="Plan"
                value={formData.Plan}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>መግለጫ</label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                className="form-control"
              ></textarea>
            </div>
            <div className="mb-3">
              <label>አመት</label>
              <input
                type="text"
                name="Year"
                value={formData.Year}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              {errors.Year && <small className="text-danger">{errors.Year}</small>}
            </div>
            <div className="mb-3">
              <label>ሩብ_አመት</label>
              <select
                name="ሩብ_አመት"
                value={formData.ሩብ_አመት}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="የመጀመሪያ ሩብ አመት">የመጀመሪያ ሩብ አመት</option>
                <option value="ሁለተኝ ሩብ አመት">ሁለተኝ ሩብ አመት</option>
                <option value="ሶስተኝ ሩብ አመት">ሶስተኝ ሩብ አመት</option>
                <option value="አራተኛ ሩብ አመት">አራተኛ ሩብ አመት</option>
              </select>
              {errors.ሩብ_አመት && <small className="text-danger">{errors.ሩብ_አመት}</small>}
            </div>
            <div className="mb-3">
              <label>ሂደት</label>
              <select
                name="የ እቅዱ ሂደት"
                value={formData.Progress}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="በ እቅድ ላይ">በ እቅድ ላይ</option>
                <option value="በ ሂደት ላይ">በ ሂደት ላይ</option>
                <option value="የተጠናቀቀ">የተጠናቀቀ</option>
                
              </select>
              {errors.Progress && <small className="text-danger">{errors.Progress}</small>}
            </div>
            <button type="submit" className="btn btn-primary">
              ያዘምኑ
            </button>
          </form>

          {/* Preview Section */}
          <button className="btn btn-secondary" onClick={togglePreview}>
            {showPreview ? "ክለሳውን አንሳ" : "ክለሳውን አሳይ"}
          </button>
          {showPreview && (
            <div className="preview-container">
              <h3>የ እቅዶ ክለሳ</h3>
              <p><strong>ግብ:</strong> {formData.Objective}</p>
              <p><strong>አላማ:</strong> {formData.Goal}</p>
              <p><strong>የሚከናወኑ ዝርዝር ሥራዎች:</strong> {formData.Details}</p>
              <p><strong>መለኪያ:</strong> {formData.Measurement}</p>
              <p><strong>መነሻ:</strong> {formData.Baseline}</p>
              <p><strong>እቅድ:</strong> {formData.Plan}</p>
              <p><strong>መግለጫ:</strong> {formData.Description}</p>
              <p><strong>አመት:</strong> {formData.Year}</p>
              <p><strong>ሩብ_አመት:</strong> {formData.ሩብ_አመት}</p>
              <p><strong>ሂደት:</strong> {formData.Progress}</p>
            </div>
          )}
        </>
      ) : (
        <p>Loading report details...</p>
      )}

      {/* Popup for success/error messages */}
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
    </div>
  );
};

export default CeoUpdateReport;
