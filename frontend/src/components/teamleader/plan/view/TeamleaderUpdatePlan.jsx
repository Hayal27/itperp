import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import sad from "../../../../assets/img/sad.gif";
import happy from "../../../../assets/img/happy.gif";
import Swal from "sweetalert2"; // SweetAlert2 for popups


const TeamleaderUpdatePlan = () => {
  const { planId } = useParams();
  console.log("planId:", planId);
  


  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    Objective: "",
    Goal: "",
    Specific_Objective_Name: "",
    Specific_Objective_Detai: "",
    Details: "",
    Measurement: "",
    Baseline: "",
    Plan: "",
    Description: "",
    deadline: "",
    Quarter: "", // Default value
    Progress: "on going", // Default value
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false); // State for toggling preview
  const [errors, setErrors] = useState({});

  // Fetch plan details
  useEffect(() => {
    if (!planId) {
      setResponseMessage("Invalid Plan ID");
      setPopupType("error");
      setShowPopup(true);
      return;
    }
  
    const token = localStorage.getItem("token");
    Axios.get(`http://localhost:5000/api/pland/${planId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setPlan(res.data.plan);
        setFormData({
         
          Goal: res.data.plan.Goal_Name || "",
          Objective: res.data.plan.Objective_Name || "",
          Specific_Objective_Name: res.data.plan.Specific_Objective_Name || "",
          Specific_Objective_Detai: res.data.plan.Specific_Objective_Detail|| "",

          Measurement: res.data.plan.Measurement || "",
          Baseline: res.data.plan.Baseline || "",
          Plan: res.data.plan.Plan || "",
          Description: res.data.plan.Description || "",
          deadline: res.data.plan.deadline || "",
          Quarter: res.data.plan.Quarter || "",
          Progress: res.data.plan.Progress || "",
        });
      })
      .catch((err) => {
        console.error("Error fetching plan details:", err.response || err.message);
        setResponseMessage("Failed to fetch plan details.");
        setPopupType("error");
        setShowPopup(true);
      });
  }, [planId]);
  

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
      setResponseMessage("ባዶ ቦታዎችን ይሙሉ"); // Message for missing fields
      setPopupType("error");
      setShowPopup(true);
      return;
  }

    const updatedData = {
        goal: formData.Goal_Name,
        objective: formData.Objective_Name,
        specific_objective: formData.Specific_Objective_Name,
        specific_objective_detail_name: formData.Objective_Detail_Name,
       
        
        measurement: formData.Measurement,
        baseline: formData.Baseline,
        plan: formData.Plan,
        description: formData.Description,
        year: parseInt(formData.deadline, 10),
        Quarter: formData.Quarter,
        progress: formData.Progress,
    };

    const token = localStorage.getItem("token");

    Axios.put(`http://localhost:5000/api/planupdate/${planId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      setResponseMessage("በተገቢዉ ዘምኗል!"); // Success message
      setPopupType("success");
      setShowPopup(true);
  })
  .catch((err) => {
      setResponseMessage("Error updating the plan. Please try again.");
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
      <h2>እቅዶን ያዘምኑ</h2>
      {plan ? (
        <>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
            <div className="mb-3">
              <label>ግብ</label>
              <input
                type="text"
                name="Goal_Name"
                value={formData.Goal}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              {errors.Goal && <small className="text-danger">{errors.Objective}</small>}
            </div>
            <div className="mb-3">
              <label>አላማ</label>
              <input
                type="text"
                name="Objective_Name"
                value={formData.Objective}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              {errors.Objective && <small className="text-danger">{errors.Goal}</small>}
            </div>

         
            <div className="mb-3">
              <label>ውጤት</label>
              <input
                type="text"
                name="specific_objective_name"
                value={formData.Specific_Objective_Name}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              {errors.Specific_Objective_Name && <small className="text-danger">{errors.Goal}</small>}
            </div>

            <div className="mb-3">
              <label>የ ውጤቱ ሚከናወን ዝርዝር ሥራ</label>
              <textarea
                name="specific_objective_detail_name"
                value={formData.Specific_Objective_Detai}
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
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              {errors.deadline && <small className="text-danger">{errors.deadline}</small>}
            </div>
            <div className="mb-3">
              <label>Quarter</label>
             <input
             type="text"
                name="Quarter"
                value={formData.Quarter}
                onChange={handleInputChange}
                className="form-control"
                required
              />
              
              {errors.Quarter && <small className="text-danger">{errors.Quarter}</small>}
            </div>
            <div className="mb-3">
              <label>ሂደት</label>
              <select
                name="Progress"
                value={formData.Progress}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="started">started</option>
                <option value="on going">በ ሂደት ላይ</option>
                <option value="completed">የተጠናቀቀ</option>
                
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
              <p><strong>ግብ:</strong> {formData.Goal}</p>
              <p><strong>አላማ:</strong> {formData.Objective_Name}</p>
              <p><strong>ውጤት:</strong> {formData.Objective_Name}</p>
              <p><strong>የ ውጤቱ ሚከናወን ዝርዝር ሥራ:</strong> {formData.Specific_Objective_Detai}</p>
              <p><strong>መለኪያ:</strong> {formData.Measurement}</p>
              <p><strong>መነሻ:</strong> {formData.Baseline}</p>
              <p><strong>እቅድ:</strong> {formData.Plan}</p>
              <p><strong>መግለጫ:</strong> {formData.Description}</p>
              <p><strong>አመት:</strong> {formData.deadline}</p>
              <p><strong>Quarter:</strong> {formData.Quarter}</p>
              <p><strong>ሂደት:</strong> {formData.Progress}</p>
            </div>
          )}
        </>
      ) : (
        <p>Loading plan details...</p>
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

export default TeamleaderUpdatePlan;
