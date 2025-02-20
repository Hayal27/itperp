import Axios from "axios";
import React, { useState } from 'react';
import '../../../assets/css/planform.css';

const StaffAddReport = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    objective: '',
    goal: '',
        details: '',
    measurement: '',
    baseline: '',
    plan: '',
    outcome: '',
    execution_percentage: '',
    description: '',
    year: '',
    quarter: 'Q1',
  });

  // State to handle form submission status
  const [responseMessage, setResponseMessage] = useState('');

    // States to handle form submission status and preview toggle
   
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
    const [popupType, setPopupType] = useState(''); // Type of the popup (success or error)
    const [showPreview, setShowPreview] = useState(false);

  // Update state when form fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Get the JWT token from localStorage

    if (!token) {
      alert('You must be logged in to submit a plan.');
      return;
    }

    try {
      // Send the request to submit the plan using Axios
      const response = await Axios.post("http://localhost:5000/api/plans", formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Ensure that your token is valid and sent correctly
        },
      });

      if (response.data && response.data.plan_id) {
        setResponseMessage(`Plan submitted successfully with ID: ${response.data.plan_id}`);
        setPopupType('success');
      } else {
        setResponseMessage(`Error: ${response.data.message}`);
        setPopupType('error');
      }
    } catch (error) {
      console.error('Error submitting plan:', error);
      setResponseMessage('An error occurred while submitting the plan.');
      setPopupType('error');
    } finally {
      setShowPopup(true); // Show the popup after submission attempt
    }
  };

  // Toggle preview visibility
  
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
  };


  return (
    <div className="form-container-10">
      <h2>የእቅዶን ሪፖርት ይመዝግቡ</h2>
      <form onSubmit={handleSubmit}>
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

    

        <label>የተከናወኑ ዝርዝር ሥራዎች:</label>
        <textarea
          name="details"
          value={formData.details}
          onChange={handleChange}
        />
        <br />

        <label>የውጤት ማሳኪያ ተግባራት ዝርዝር:</label>
        <input
          type="text"
          name="measurement"
          value={formData.measurement}
          onChange={handleChange}
        />
        <br />

        <label>መነሻ የነበረው:</label>
        <input
          type="text"
          name="baseline"
          value={formData.baseline}
          onChange={handleChange}
        />
        <br />

        <label>እቅድ የነበረው:</label>
        <textarea
          name="plan"
          value={formData.plan}
          onChange={handleChange}
        />
        <br />

        <label>የተገኝው ውጤት:</label>
        <textarea
          name="outcome"
          value={formData.outcome}
          onChange={handleChange}
        />
        <br />

        <label>ውጤቱ በ ፐርሰንት:</label>
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
          <option value="Q1">የጀመሪያ ሩብ አመት</option>
          <option value="Q2">ሁለተኛ ሩብ አመት</option>
          <option value="Q3">ሶስተኛ ሩብ አመት</option>
          <option value="Q4">አራተኛ ሩብ አመት</option>
        </select>
        <br />

        <button type="button" onClick={togglePreview}>Preview</button>
        <button type="submit">ይመዝግቡ</button>
      </form>

      {showPreview && (
        <div className="preview-container">
          <h3>ክለሳ</h3>
          <p><strong>ግብ:</strong> {formData.objective}</p>
          <p><strong>ዓላማ:</strong> {formData.goal}</p>
          <p><strong>ዝርዝር:</strong> {formData.details}</p>
          <p><strong>ማሳኪያ:</strong> {formData.measurement}</p>
          <p><strong>መነሻ የነበረው:</strong> {formData.baseline}</p>
          <p><strong>እቅድ የነበረው:</strong> {formData.plan}</p>
          <p><strong>የተገኝው ውጤት:</strong> {formData.outcome}</p>
          <p><strong>ፐርሰንት:</strong> {formData.execution_percentage}%</p>
          <p><strong>መግለጫ:</strong> {formData.description}</p>
          <p><strong>አመት:</strong> {formData.year}</p>
          <p><strong>ሩብ አመት:</strong> {formData.quarter}</p>
          <button onClick={togglePreview}>ክለሳውን ይዝጉት</button>
        </div>
      )}

    {/* Popup for success/error message */}
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

export default StaffAddReport;
