import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import sad from "../../../../assets/img/sad.gif";
import happy from "../../../../assets/img/happy.gif";
import "../../../../assets/css/planform.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFilePdf, 
  faFileWord, 
  faFileImage, 
  faFileAlt, 
  faPaperclip 
} from "@fortawesome/free-solid-svg-icons";

// Utility function to calculate execution percentage.
// Updated to return the real floating point value, even if negative or decimal.
const calculateExecutionPercentage = (baseline, plan, outcome) => {
  const base = parseFloat(baseline);
  const p = parseFloat(plan);
  const o = parseFloat(outcome);
  if (isNaN(base) || isNaN(p) || isNaN(o) || (p - base) === 0) return 0;
  return ((o - base) / (p - base)) * 100;
};

// Utility function for CI execution percentage.
// Updated similarly to return the real value.
const CIcalculateExecutionPercentage = (CIbaseline, CIplan, CIoutcome) => {
  const cibase = parseFloat(CIbaseline);
  const cip = parseFloat(CIplan);
  const cio = parseFloat(CIoutcome);
  if (isNaN(cibase) || isNaN(cip) || isNaN(cio) || (cip - cibase) === 0) return 0;
  return ((cio - cibase) / (cip - cibase)) * 100;
};

// Helper function to render an icon based on file extension.
const renderFileIcon = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  if(ext === 'pdf') return <FontAwesomeIcon icon={faFilePdf} className="file-attachment-icon pdf-icon" />;
  if(ext === 'doc' || ext === 'docx') return <FontAwesomeIcon icon={faFileWord} className="file-attachment-icon word-icon" />;
  if(ext === 'jpg' || ext === 'jpeg' || ext === 'png') return <FontAwesomeIcon icon={faFileImage} className="file-attachment-icon image-icon" />;
  return <FontAwesomeIcon icon={faFileAlt} className="file-attachment-icon generic-icon" />;
};

const StafAddReport = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const hiddenFileInput = useRef(null);

  // State for plan details and form data.
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    goal: null,
    objective: null,
    specObjective: null,
    specific_objective_detailname: null,
    measurement: null,
    baseline: null,
    plan: null,
    description: null,
    year: null,
    Quarter: null,
    progress: null,
    plan_type: null,
    cost_type: null,
    costName: null,
    income_exchange: null,
    incomeName: null,
    employment_type: null,
    CIbaseline: null,
    CIplan: null,
    outcome: "",
    execution_percentage: "",
    CIoutcome: null,
    CIexecution_percentage: ""
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // "success" or "error"
  const [showPopup, setShowPopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]); // files selected to be uploaded
  const [uploadedFiles, setUploadedFiles] = useState([]); // list of files that have been uploaded

  // Fetch plan details on mount.
  useEffect(() => {
    if (!planId) {
      setResponseMessage("Invalid Plan ID");
      setPopupType("error");
      setShowPopup(true);
      return;
    }
    const token = localStorage.getItem("token");
    Axios.get(`http://localhost:5000/api/pland/${planId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        const p = res.data.plan;
        setPlan(p);
        setFormData((prev) => ({
          ...prev,
          goal: p.goal_name !== undefined ? p.goal_name : null,
          objective: p.objective_name !== undefined ? p.objective_name : null,
          specObjective: p.specific_objective_name !== undefined ? p.specific_objective_name : null,
          specific_objective_detailname: p.specific_objective_detailname !== undefined ? p.specific_objective_detailname : null,
          measurement: p.measurement !== undefined ? p.measurement : null,
          baseline: p.baseline !== undefined ? p.baseline : null,
          plan: p.plan !== undefined ? p.plan : null,
          description: p.details !== undefined ? p.details : null,
          year: p.year !== undefined ? p.year : null,
          Quarter: p.month !== undefined ? p.month : null,
          progress: p.progress !== undefined ? p.progress : null,
          plan_type: p.plan_type !== undefined ? p.plan_type : null,
          cost_type: p.cost_type !== undefined ? p.cost_type : null,
          costName: p.costName !== undefined ? p.costName : null,
          income_exchange: p.income_exchange !== undefined ? p.income_exchange : null,
          incomeName: p.incomeName !== undefined ? p.incomeName : null,
          employment_type: p.employment_type !== undefined ? p.employment_type : null,
          CIbaseline: (p.CIbaseline !== undefined && p.CIbaseline !== null) ? p.CIbaseline.toString() : null,
          CIplan: (p.CIplan !== undefined && p.CIplan !== null) ? p.CIplan.toString() : null,
          outcome: (p.outcome !== undefined && p.outcome !== null) ? p.outcome.toString() : "",
          execution_percentage: (p.execution_percentage !== undefined && p.execution_percentage !== null) ? p.execution_percentage.toString() : "",
          CIoutcome: (p.CIoutcome !== undefined && p.CIoutcome !== null) ? p.CIoutcome.toString() : null
        }));
      })
      .catch((err) => {
        console.error("Error fetching plan details:", err.response || err.message);
        setResponseMessage("Failed to fetch plan details.");
        setPopupType("error");
        setShowPopup(true);
      });
  }, [planId]);

  // Outcome change handler.
  const handleOutcomeChange = (e) => {
    const updatedOutcome = e.target.value;
    const computedPercentage = calculateExecutionPercentage(
      formData.baseline,
      formData.plan,
      updatedOutcome
    );
    setFormData((prev) => ({
      ...prev,
      outcome: updatedOutcome,
      execution_percentage: computedPercentage.toString()
    }));
  };

  // CI outcome change handler.
  const handleCIOutcomeChange = (e) => {
    const updatedCIOutcome = e.target.value;
    const computedCIPercentage = CIcalculateExecutionPercentage(
      formData.CIbaseline,
      formData.CIplan,
      updatedCIOutcome
    );
    setFormData((prev) => ({
      ...prev,
      CIoutcome: updatedCIOutcome,
      CIexecution_percentage: computedCIPercentage.toString()
    }));
  };

  // File input change handler for a single file.
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Append the selected file (single) to selectedFiles array.
      const file = e.target.files[0];
      setSelectedFiles(prev => [...prev, file]);
      // Reset the hidden file input value to allow re-selection.
      e.target.value = "";
    }
  };

  // Trigger hidden file input click.
  const handleAddFileClick = () => {
    if (hiddenFileInput && hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  // Submit handler with file attachment.
  const handleSubmit = (e) => {
    e.preventDefault();
    let localErrors = {};
    if (!formData.outcome || formData.outcome.trim() === "") {
      localErrors.outcome = "Outcome is required";
    }
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setResponseMessage("Please fill in the required outcome fields.");
      setPopupType("error");
      setShowPopup(true);
      return;
    }
    // Prepare FormData to include both text fields and files.
    const token = localStorage.getItem("token");
    const formPayload = new FormData();
    formPayload.append("outcome", formData.outcome);
    formPayload.append("execution_percentage", formData.execution_percentage);
    if (formData.plan_type !== "default") {
      formPayload.append("CIoutcome", formData.CIoutcome);
      formPayload.append("CIexecution_percentage", formData.CIexecution_percentage);
    }
    // Append each file from selectedFiles.
    selectedFiles.forEach(file => {
      formPayload.append("files", file);
    });
    
    Axios.put(`http://localhost:5000/api/addReport/${planId}`, formPayload, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    })
      .then((res) => {
        setResponseMessage("በተገቢው ሪፖርት አድርገዋል");
        setPopupType("success");
        setShowPopup(true);
        setUploadedFiles(selectedFiles);
        setSelectedFiles([]);
      })
      .catch((err) => {
        console.error("Update error:", err.response || err.message);
        setResponseMessage("Error updating the report. Please try again.");
        setPopupType("error");
        setShowPopup(true);
      });
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="stp-wrapper container d-flex justify-content-center mt-5 stp-container">
      <div className="card stp-card shadow w-100" style={{ maxWidth: "900px" }}>
        <div className="card-body stp-card-body">
          <h2 className="card-title stp-title text-center mb-4">የ እቅዶን ሩፖርት ያስገቡ</h2>
          {plan ? (
            <>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* Read-only Fields */}
                {formData.goal !== null && (
                  <div className="form-group stp-form-group mb-3">
                    <label className="form-label stp-label">ግብ</label>
                    <input type="text" name="goal" value={formData.goal} readOnly className="form-control stp-input" />
                  </div>
                )}
                {formData.objective !== null && (
                  <div className="form-group stp-form-group mb-3">
                    <label className="form-label stp-label">አላማ</label>
                    <input type="text" name="objective" value={formData.objective} readOnly className="form-control stp-input" />
                  </div>
                )}
                {formData.specObjective !== null && (
                  <div className="form-group stp-form-group mb-3">
                    <label className="form-label stp-label">ውጤት</label>
                    <input type="text" name="specObjective" value={formData.specObjective} readOnly className="form-control stp-input" />
                  </div>
                )}
                {formData.specific_objective_detailname !== null && (
                  <div className="form-group stp-form-group mb-3">
                    <label className="form-label stp-label">የ ውጤቱ ሚከናወን ዝርዝር ሥራ</label>
                    <input type="text" name="specific_objective_detailname" value={formData.specific_objective_detailname} readOnly className="form-control stp-input" />
                  </div>
                )}
                {formData.measurement !== null && (
                  <div className="form-group stp-form-group mb-3">
                    <label className="form-label stp-label">መለኪያ</label>
                    <input type="text" name="measurement" value={formData.measurement} readOnly className="form-control stp-input" />
                  </div>
                )}
                {formData.baseline !== null && (
                  <div className="form-group stp-form-group mb-3">
                    <label className="form-label stp-label">መነሻ</label>
                    <input type="text" name="baseline" value={formData.baseline} readOnly className="form-control stp-input" />
                  </div>
                )}
                {formData.plan !== null && (
                  <div className="form-group stp-form-group mb-3">
                    <label className="form-label stp-label">እቅድ</label>
                    <input type="text" name="plan" value={formData.plan} readOnly className="form-control stp-input" />
                  </div>
                )}
                {/* Editable Outcome Field */}
                <div className="form-group stp-form-group mb-3">
                  <label className="form-label stp-label">ክንውን</label>
                  <input
                    type="number"
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleOutcomeChange}
                    className="form-control stp-input"
                    placeholder="Enter outcome"
                  />
                  {errors.outcome && (<small className="text-danger">{errors.outcome}</small>)}
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">ክንውን በ%</label>
                  <input type="text" name="execution_percentage" value={formData.execution_percentage} readOnly className="form-control" placeholder="Auto-calculated" />
                </div>
                {/* File attachment with professional icon styling */}
                <div className="form-group stp-form-group mb-3">
                  <label className="form-label stp-label">Attach Files</label>
                  <div className="d-flex align-items-center stp-file-section">
                    <button type="button" className="btn btn-outline-secondary me-2 stp-file-add-btn" onClick={handleAddFileClick}>
                      <FontAwesomeIcon icon={faPaperclip} />
                    </button>
                    {/* Hidden file input */}
                    <input 
                      type="file" 
                      ref={hiddenFileInput}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="stp-selected-files mt-2">
                      <strong>Selected Files:</strong>
                      <ul className="stp-attachment-list">
                        {selectedFiles.map((file, index) => (
                          <li key={index} className="stp-attachment-item">
                            {renderFileIcon(file.name)}
                            <span className="ms-2">{file.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {formData.description !== null && (
                  <div className="form-group mb-3">
                    <label className="form-label">መግለጫ</label>
                    <textarea name="description" value={formData.description} readOnly className="form-control" rows="3"></textarea>
                  </div>
                )}
                {formData.year !== null && (
                  <div className="form-group mb-3">
                    <label className="form-label">የትግበራ አመት</label>
                    <input type="text" name="year" value={formData.year} readOnly className="form-control" />
                  </div>
                )}
                {formData.progress !== null && (
                  <div className="form-group mb-3">
                    <label className="form-label">ሂደት</label>
                    <input type="text" name="progress" value={formData.progress} readOnly className="form-control" />
                  </div>
                )}
                {/* Extended Read-only Fields Section */}
                {formData.plan_type !== null && (
                  <>
                    <h3 className="mt-4 mb-3 text-center">የወጪ አና ገቢ</h3>
                    <div className="form-group mb-3">
                      <label className="form-label">የ እቅዱ አይነት</label>
                      <input type="text" name="plan_type" value={formData.plan_type} readOnly className="form-control" />
                    </div>
                    {formData.plan_type === "cost" && (
                      <div>
                        {formData.cost_type !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">የወጪው አይነት</label>
                            <input type="text" name="cost_type" value={formData.cost_type} readOnly className="form-control" />
                          </div>
                        )}
                        {formData.costName !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">የወጪ ስም</label>
                            <input type="text" name="costName" value={formData.costName} readOnly className="form-control" />
                          </div>
                        )}
                        {formData.CIbaseline !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">መነሻ</label>
                            <input type="text" name="CIbaseline" value={formData.CIbaseline} readOnly className="form-control" />
                          </div>
                        )}
                        {formData.CIplan !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">እቅድ</label>
                            <input type="text" name="CIplan" value={formData.CIplan} readOnly className="form-control" />
                          </div>
                        )}
                      </div>
                    )}
                    {formData.plan_type === "income" && (
                      <div>
                        {formData.income_exchange !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">ምንዛሬ</label>
                            <input type="text" name="income_exchange" value={formData.income_exchange} readOnly className="form-control" />
                          </div>
                        )}
                        {formData.incomeName !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">የገቢው ስም</label>
                            <input type="text" name="incomeName" value={formData.incomeName} readOnly className="form-control" />
                          </div>
                        )}
                        {formData.CIbaseline !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">መነሻ</label>
                            <input type="text" name="CIbaseline" value={formData.CIbaseline} readOnly className="form-control" />
                          </div>
                        )}
                        {formData.CIplan !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">እቅድ</label>
                            <input type="text" name="CIplan" value={formData.CIplan} readOnly className="form-control" />
                          </div>
                        )}
                      </div>
                    )}
                    {formData.plan_type === "hr" && (
                      <div>
                        {formData.employment_type !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">የቅጥር አይነት</label>
                            <input type="text" name="employment_type" value={formData.employment_type} readOnly className="form-control" />
                          </div>
                        )}
                        {formData.CIbaseline !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">መነሻ</label>
                            <input type="text" name="CIbaseline" value={formData.CIbaseline} readOnly className="form-control" />
                          </div>
                        )}
                        {formData.CIplan !== null && (
                          <div className="form-group mb-3">
                            <label className="form-label">እቅድ</label>
                            <input type="text" name="CIplan" value={formData.CIplan} readOnly className="form-control" />
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
                {/* Editable CI Outcome fields for non-default plan types */}
                {formData.plan_type !== "default" && formData.CIoutcome !== null && (
                  <>
                    <div className="form-group mb-3">
                      <label className="form-label">ክንውን (CI)</label>
                      <input
                        type="number"
                        name="CIoutcome"
                        value={formData.CIoutcome}
                        onChange={handleCIOutcomeChange}
                        className="form-control"
                        placeholder="Enter CI Outcome"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="form-label">CI Execution Percentage</label>
                      <input
                        type="text"
                        name="CIexecution_percentage"
                        value={formData.CIexecution_percentage}
                        readOnly
                        className="form-control"
                        placeholder="Auto-calculated"
                      />
                    </div>
                  </>
                )}
                <button type="submit" className="btn btn-primary w-100 mt-3 stp-submit-btn">
                  ያዘምኑ
                </button>
              </form>
              {/* Toggle Preview Section */}
              <div className="toggle-btn text-center mt-4">
                <button className="btn btn-secondary stp-toggle-btn" onClick={togglePreview}>
                  {showPreview ? "ክለሳውን አንሳ" : "ክለሳውን አሳይ"}
                </button>
              </div>
              {showPreview && (
                <div className="stp-preview card mt-4 shadow-lg">
                  <div className="card-header stp-preview-header bg-gradient-primary text-white">
                    <h3 className="card-title mb-0">የእቅዶ ክለሳ</h3>
                  </div>
                  <div className="card-body stp-preview-body">
                    {formData.goal !== null && <p><strong>ግብ:</strong> {formData.goal}</p>}
                    {formData.objective !== null && <p><strong>አላማ:</strong> {formData.objective}</p>}
                    {formData.specObjective !== null && <p><strong>ውጤት:</strong> {formData.specObjective}</p>}
                    {formData.specific_objective_detailname !== null && <p><strong>የውጤቱ ሥራ:</strong> {formData.specific_objective_detailname}</p>}
                    {formData.measurement !== null && <p><strong>መለኪያ:</strong> {formData.measurement}</p>}
                    {formData.baseline !== null && <p><strong>መነሻ:</strong> {formData.baseline}</p>}
                    {formData.plan !== null && <p><strong>እቅድ:</strong> {formData.plan}</p>}
                    <p><strong>ክንውን:</strong> {formData.outcome}</p>
                    <p><strong>ክንውን በ%:</strong> {formData.execution_percentage}%</p>
                    {formData.description !== null && <p><strong>መግለጫ:</strong> {formData.description}</p>}
                    {formData.year !== null && <p><strong>አመት:</strong> {formData.year}</p>}
                    {formData.Quarter !== null && <p><strong>ሩብ አመት:</strong> {formData.Quarter}</p>}
                    {formData.progress !== null && <p><strong>ሂደት:</strong> {formData.progress}</p>}
                    <hr className="my-3" />
                    {formData.plan_type !== null && <p><strong>የእቅዱ አይነት:</strong> {formData.plan_type}</p>}
                    {formData.plan_type === "cost" && (
                      <>
                        {formData.cost_type !== null && <p><strong>የወጪው አይነት:</strong> {formData.cost_type}</p>}
                        {formData.costName !== null && <p><strong>የወጪ ስም:</strong> {formData.costName}</p>}
                        {formData.CIbaseline !== null && <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>}
                        {formData.CIplan !== null && <p><strong>እቅድ:</strong> {formData.CIplan}</p>}
                      </>
                    )}
                    {formData.plan_type === "income" && (
                      <>
                        {formData.income_exchange !== null && <p><strong>ምንዛሬ:</strong> {formData.income_exchange}</p>}
                        {formData.incomeName !== null && <p><strong>የገቢው ስም:</strong> {formData.incomeName}</p>}
                        {formData.CIbaseline !== null && <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>}
                        {formData.CIplan !== null && <p><strong>እቅድ:</strong> {formData.CIplan}</p>}
                      </>
                    )}
                    {formData.plan_type === "hr" && (
                      <>
                        {formData.employment_type !== null && <p><strong>የቅጥር አይነት:</strong> {formData.employment_type}</p>}
                        {formData.CIbaseline !== null && <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>}
                        {formData.CIplan !== null && <p><strong>እቅድ:</strong> {formData.CIplan}</p>}
                      </>
                    )}
                    {formData.plan_type !== "default" && formData.CIoutcome !== null && (
                      <>
                        <p><strong>ክንውን (CI):</strong> {formData.CIoutcome}</p>
                        <p><strong>CI Execution Percentage:</strong> {formData.CIexecution_percentage}%</p>
                      </>
                    )}
                    {/* Display uploaded files if any */}
                    {uploadedFiles.length > 0 && (
                      <>
                        <hr className="my-3" />
                        <h5 className="mb-2">Uploaded Files:</h5>
                        <ul className="stp-attachment-list">
                          {uploadedFiles.map((file, index) => (
                            <li key={index} className="stp-attachment-item">
                              {renderFileIcon(file.name)}
                              <span className="ms-2">{file.name}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-center">Loading plan details...</p>
          )}
        </div>
      </div>
      {/* Professional Bootstrap Modal Popup (without animation) */}
      {showPopup && (
        <div className="modal d-block stp-modal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered stp-modal-dialog" role="document">
            <div className="modal-content stp-modal-content">
              <div className="modal-header stp-modal-header">
                <h5 className="modal-title">{popupType === "success" ? "Success" : "Error"}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closePopup}></button>
              </div>
              <div className="modal-body text-center stp-modal-body">
                <img
                  src={popupType === "success" ? happy : sad}
                  alt={popupType === "success" ? "Success" : "Error"}
                  className="img-fluid mb-3"
                  style={{ maxWidth: "100px" }}
                />
                <p>{responseMessage}</p>
              </div>
              <div className="modal-footer justify-content-center stp-modal-footer">
                <button className="btn btn-primary" onClick={closePopup}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StafAddReport;
