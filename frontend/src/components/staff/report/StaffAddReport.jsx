
import Axios from "axios";
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faFileWord, faFileImage, faFileAlt, faPaperclip } from "@fortawesome/free-solid-svg-icons";
// import '../../../assets/css/planform.css';

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

  // State for file attachments
  const [attachments, setAttachments] = useState([]);

  // State to handle form submission status
  const [responseMessage, setResponseMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false); // For popup visibility
  const [popupType, setPopupType] = useState(''); // Popup type (success/error)
  const [showPreview, setShowPreview] = useState(false);

  // Update state when form fields change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change for attachments
  const handleFileChange = (e) => {
    // Convert FileList into an array and append to attachments state
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  // Function to render appropriate icon based on file extension
  const renderAttachmentIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FontAwesomeIcon icon={faFilePdf} style={{ color: "#d9534f" }} />;
    if (ext === 'doc' || ext === 'docx') return <FontAwesomeIcon icon={faFileWord} style={{ color: "#0275d8" }} />;
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return <FontAwesomeIcon icon={faFileImage} style={{ color: "#5cb85c" }} />;
    return <FontAwesomeIcon icon={faFileAlt} style={{ color: "#f0ad4e" }} />;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Get JWT token from localStorage
    if (!token) {
      alert('You must be logged in to submit a report.');
      return;
    }
    try {
      // Prepare form data for submission (if attachments need to be sent, use FormData)
      const submissionData = new FormData();
      for (const key in formData) {
        submissionData.append(key, formData[key]);
      }
      // Append attachments if any
      attachments.forEach((file, index) => {
        submissionData.append(`attachment_${index}`, file);
      });
      // Send the request to submit the plan using Axios
      const response = await Axios.post("http://localhost:5000/api/plans", submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.data && response.data.plan_id) {
        setResponseMessage(`Report submitted successfully with ID: ${response.data.plan_id}`);
        setPopupType('success');
      } else {
        setResponseMessage(`Error: ${response.data.message}`);
        setPopupType('error');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setResponseMessage('An error occurred while submitting the report.');
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
        {/* File Attachments Section */}
        <div className="file-attachment-section" style={{ margin: "20px 0" }}>
          <label style={{ display: "block", marginBottom: "8px" }}>
            <FontAwesomeIcon icon={faPaperclip} style={{ marginRight: "5px", color: "#5bc0de" }} />
            Attach Files:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            style={{ display: "block" }}
          />
        </div>
        <button type="button" onClick={togglePreview}>Preview</button>
        <button type="submit">ይመዝግቡ</button>
      </form>

      {/* Preview Section */}
      {showPreview && (
        <div className="preview-container">
          <h3>ክለሳ</h3>
          <p><strong>ግብ:</strong> {formData.objective}</p>
          <p><strong>ዓላማ:</strong> {formData.goal}</p>
          <p><strong>ዝርዝር:</strong> {formData.details}</p>
          <p><strong>ማሳኪያ:</strong> {formData.measurement}</p>
          <p><strong>መነሻ የነበረው:</strong> {formData.baseline}</p>
          <p><strong>እቅድ የነበረው:</strong> {formData.plan}</p>
          <p><strong>የተገ��ው ውጤት:</strong> {formData.outcome}</p>
          <p><strong>ፐርሰንት:</strong> {formData.execution_percentage}%</p>
          <p><strong>መግለጫ:</strong> {formData.description}</p>
          <p><strong>አመት:</strong> {formData.year}</p>
          <p><strong>ሩብ አመት:</strong> {formData.quarter}</p>
          {/* Display Attached Files with Categorized Icons */}
          {attachments.length > 0 && (
            <div className="attached-files" style={{ marginTop: "15px" }}>
              <h4>Attached Files:</h4>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {attachments.map((file, index) => (
                  <li key={index} style={{ marginBottom: "5px", display: "flex", alignItems: "center" }}>
                    {renderAttachmentIcon(file.name)}
                    <span style={{ marginLeft: "8px" }}>{file.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
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