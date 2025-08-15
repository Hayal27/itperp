import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import sad from "../../../../assets/img/sad.gif";
import happy from "../../../../assets/img/happy.gif"; 
import "../../../../assets/css/update.css";

// Utility function to calculate execution percentage.
// Standard formula: ((outcome - baseline) / (plan - baseline)) * 100, rounded.
const calculateExecutionPercentage = (baseline, plan, outcome) => {
  const base = parseFloat(baseline);
  const p = parseFloat(plan);
  const o = parseFloat(outcome);
  if (isNaN(base) || isNaN(p) || isNaN(o) || (p - base) === 0) return 0;
  return Math.round(((o - base) / (p - base)) * 100);
};

// Utility function for CI execution percentage.
const CIcalculateExecutionPercentage = (CIbaseline, CIplan, CIoutcome) => {
  const cibase = parseFloat(CIbaseline);
  const cip = parseFloat(CIplan);
  const cio = parseFloat(CIoutcome);
  if (isNaN(cibase) || isNaN(cip) || isNaN(cio) || (cip - cibase) === 0) return 0;
  return Math.round(((cio - cibase) / (cip - cibase)) * 100);
};

const TeamleaderAddReport = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  // State for the filtered plan details and form data.
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    goal: "",
    objective: "",
    specObjective: "",
    specific_objective_detailname: "",
    measurement: "",
    baseline: "",
    plan: "",
    description: "",
    year: "",
    Quarter: "",
    progress: "",
    plan_type: "",
    cost_type: "",
    costName: "",
    income_exchange: "",
    incomeName: "",
    employment_type: "",
    CIbaseline: "",
    CIplan: "",
    outcome: "",
    execution_percentage: "",
    CIoutcome: "",
    CIexecution_percentage: ""
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [popupType, setPopupType] = useState(""); // "success" or "error"
  const [showPopup, setShowPopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

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
          goal: p.goal_name || "",
          objective: p.objective_name || "",
          specObjective: p.specific_objective_name || "",
          specific_objective_detailname: p.specific_objective_detailname || "",
          measurement: p.measurement || "",
          baseline: p.baseline || "",
          plan: p.plan || "",
          description: p.details || "",
          year: p.year || "",
          Quarter: p.month || "",
          progress: p.progress || "",
          plan_type: p.plan_type || "",
          cost_type: p.cost_type || "",
          costName: p.costName || "",
          income_exchange: p.income_exchange || "",
          incomeName: p.incomeName || "",
          employment_type: p.employment_type || "",
          CIbaseline: (p.CIbaseline || p.CIbaseline === 0) ? p.CIbaseline.toString() : "",
          CIplan: (p.CIplan || p.CIplan === 0) ? p.CIplan.toString() : "",
          outcome: (p.outcome || p.outcome === 0) ? p.outcome.toString() : "",
          execution_percentage: (p.execution_percentage || p.execution_percentage === 0) ? p.execution_percentage.toString() : ""
        }));
      })
      .catch((err) => {
        console.error("Error fetching plan details:", err.response || err.message);
        setResponseMessage("Failed to fetch plan details.");
        setPopupType("error");
        setShowPopup(true);
      });
  }, [planId]);

  // Event handler for outcome change.
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

  // Event handler for CI outcome change.
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

  // Submit handler.
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

    const updatedData =
      formData.plan_type === "default"
        ? {
            outcome: formData.outcome,
            execution_percentage: formData.execution_percentage
          }
        : {
            outcome: formData.outcome,
            execution_percentage: formData.execution_percentage,
            CIoutcome: formData.CIoutcome,
            CIexecution_percentage: formData.CIexecution_percentage
          };

    const token = localStorage.getItem("token");
    Axios.put(`http://localhost:5000/api/addReport/${planId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setResponseMessage("በተገቢው ሪፖርት አድርገዋል");
        setPopupType("success");
        setShowPopup(true);
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
    <div className="report-container">
      <h2 className="report-title">እቅዶን ያዘምኑ</h2>
      {plan ? (
        <>
          <form onSubmit={handleSubmit} className="report-form">
            {formData.goal && (
              <div className="form-field">
                <label className="field-label">ግብ</label>
                <input
                  type="text"
                  name="goal"
                  value={formData.goal}
                  readOnly
                  className="form-input read-only"
                />
              </div>
            )}
            {formData.objective && (
              <div className="form-field">
                <label className="field-label">አላማ</label>
                <input
                  type="text"
                  name="objective"
                  value={formData.objective}
                  readOnly
                  className="form-input read-only"
                />
              </div>
            )}
            {formData.specObjective && (
              <div className="form-field">
                <label className="field-label">ውጤት</label>
                <input
                  type="text"
                  name="specObjective"
                  value={formData.specObjective}
                  readOnly
                  className="form-input read-only"
                />
              </div>
            )}
            {formData.specific_objective_detailname && (
              <div className="form-field">
                <label className="field-label">የ ውጤቱ ሚከናወን ዝርዝር ሥራ</label>
                <input
                  type="text"
                  name="specific_objective_detailname"
                  value={formData.specific_objective_detailname}
                  readOnly
                  className="form-input read-only"
                />
              </div>
            )}
            {formData.measurement && (
              <div className="form-field">
                <label className="field-label">መለኪያ</label>
                <input
                  type="text"
                  name="measurement"
                  value={formData.measurement}
                  readOnly
                  className="form-input read-only"
                />
              </div>
            )}
            {formData.baseline && (
              <div className="form-field">
                <label className="field-label">መነሻ</label>
                <input
                  type="text"
                  name="baseline"
                  value={formData.baseline}
                  readOnly
                  className="form-input read-only"
                />
              </div>
            )}
            {formData.plan && (
              <div className="form-field">
                <label className="field-label">እቅድ</label>
                <input
                  type="text"
                  name="plan"
                  value={formData.plan}
                  readOnly
                  className="form-input read-only"
                />
              </div>
            )}
            <div className="form-field">
              <label className="field-label">ክንውን</label>
              <input
                type="number"
                name="outcome"
                value={formData.outcome}
                onChange={handleOutcomeChange}
                className="form-input editable"
                placeholder="Enter outcome"
              />
              {errors.outcome && (
                <small className="error-text">{errors.outcome}</small>
              )}
            </div>
            <div className="form-field">
              <label className="field-label">ክንውን በ%</label>
              <input
                type="text"
                name="execution_percentage"
                value={formData.execution_percentage}
                readOnly
                className="form-input read-only"
                placeholder="Auto-calculated"
              />
            </div>
            {formData.description && (
              <div className="form-field">
                <label className="field-label">መግለጫ</label>
                <textarea
                  name="description"
                  value={formData.description}
                  readOnly
                  className="form-textarea read-only"
                  rows="3"
                ></textarea>
              </div>
            )}
            {formData.year && (
              <div className="form-field">
                <label className="field-label">የትግበራ አመት</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  readOnly
                  className="form-input read-only"
                />
              </div>
            )}
            {formData.Quarter && (
              <div className="form-field">
                <label className="field-label">ሩብ አመት</label>
                <input
                  type="text"
                  name="Quarter"
                  value={formData.Quarter}
                  readOnly
                  className="form-input read-only"
                />
              </div>
            )}
            {formData.progress && (
              <div className="form-field">
                <label className="field-label">ሂደት</label>
                <input
                  type="text"
                  name="progress"
                  value={formData.progress}
                  readOnly
                  className="form-input read-only"
                />
              </div>
            )}
            {formData.plan_type && (
              <>
                <h3 className="section-title">የወጪ አና ገቢ</h3>
                <div className="form-field">
                  <label className="field-label">የ እቅዱ አይነት</label>
                  <input
                    type="text"
                    name="plan_type"
                    value={formData.plan_type}
                    readOnly
                    className="form-input read-only"
                  />
                </div>
                {formData.plan_type === "cost" && (
                  <div className="read-only-group">
                    {formData.cost_type && (
                      <div className="form-field">
                        <label className="field-label">የወጪው አይነት</label>
                        <input
                          type="text"
                          name="cost_type"
                          value={formData.cost_type}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                    {formData.costName && (
                      <div className="form-field">
                        <label className="field-label">የወጪ ስም</label>
                        <input
                          type="text"
                          name="costName"
                          value={formData.costName}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                    {formData.CIbaseline && (
                      <div className="form-field">
                        <label className="field-label">መነሻ</label>
                        <input
                          type="text"
                          name="CIbaseline"
                          value={formData.CIbaseline}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                    {formData.CIplan && (
                      <div className="form-field">
                        <label className="field-label">እቅድ</label>
                        <input
                          type="text"
                          name="CIplan"
                          value={formData.CIplan}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                  </div>
                )}
                {formData.plan_type === "income" && (
                  <div className="read-only-group">
                    {formData.income_exchange && (
                      <div className="form-field">
                        <label className="field-label">ምንዛሬ</label>
                        <input
                          type="text"
                          name="income_exchange"
                          value={formData.income_exchange}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                    {formData.incomeName && (
                      <div className="form-field">
                        <label className="field-label">የገቢው ስም</label>
                        <input
                          type="text"
                          name="incomeName"
                          value={formData.incomeName}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                    {formData.CIbaseline && (
                      <div className="form-field">
                        <label className="field-label">መነሻ</label>
                        <input
                          type="text"
                          name="CIbaseline"
                          value={formData.CIbaseline}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                    {formData.CIplan && (
                      <div className="form-field">
                        <label className="field-label">እቅድ</label>
                        <input
                          type="text"
                          name="CIplan"
                          value={formData.CIplan}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                  </div>
                )}
                {formData.plan_type === "hr" && (
                  <div className="read-only-group">
                    {formData.employment_type && (
                      <div className="form-field">
                        <label className="field-label">Employment Type</label>
                        <input
                          type="text"
                          name="employment_type"
                          value={formData.employment_type}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                    {formData.CIbaseline && (
                      <div className="form-field">
                        <label className="field-label">መነሻ</label>
                        <input
                          type="text"
                          name="CIbaseline"
                          value={formData.CIbaseline}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                    {formData.CIplan && (
                      <div className="form-field">
                        <label className="field-label">እቅድ</label>
                        <input
                          type="text"
                          name="CIplan"
                          value={formData.CIplan}
                          readOnly
                          className="form-input read-only"
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {formData.plan_type !== "default" && (
              <>
                <div className="form-field">
                  <label className="field-label">CI Outcome</label>
                  <input
                    type="number"
                    name="CIoutcome"
                    value={formData.CIoutcome}
                    onChange={handleCIOutcomeChange}
                    className="form-input editable"
                    placeholder="Enter CI Outcome"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">CI Execution Percentage</label>
                  <input
                    type="text"
                    name="CIexecution_percentage"
                    value={formData.CIexecution_percentage}
                    readOnly
                    className="form-input read-only"
                    placeholder="Auto-calculated"
                  />
                </div>
              </>
            )}
            <button type="submit" className="btn btn-primary">
              ያዘምኑ
            </button>
          </form>
          <div className="preview-section">
            <button className="btn btn-secondary" onClick={togglePreview}>
              {showPreview ? "ክለሳውን አንሳ" : "ክለሳውን አሳይ"}
            </button>
            {showPreview && (
              <div className="preview-container">
                <h3 className="preview-title">የእቅዶ ክለሳ</h3>
                {formData.goal && <p><strong>ግብ:</strong> {formData.goal}</p>}
                {formData.objective && <p><strong>አላማ:</strong> {formData.objective}</p>}
                {formData.specObjective && <p><strong>ውጤት:</strong> {formData.specObjective}</p>}
                {formData.specific_objective_detailname && <p><strong>የ ውጤቱ ሚከናወን ዝርዝር ሥራ:</strong> {formData.specific_objective_detailname}</p>}
                {formData.measurement && <p><strong>መለኪያ:</strong> {formData.measurement}</p>}
                {formData.baseline && <p><strong>መነሻ:</strong> {formData.baseline}</p>}
                {formData.plan && <p><strong>እቅድ:</strong> {formData.plan}</p>}
                <p><strong>ክንውን:</strong> {formData.outcome}</p>
                <p><strong>ክንውን በ%:</strong> {formData.execution_percentage}%</p>
                {formData.description && <p><strong>መግለጫ:</strong> {formData.description}</p>}
                {formData.year && <p><strong>አመት:</strong> {formData.year}</p>}
                {formData.Quarter && <p><strong>ሩብ አመት:</strong> {formData.Quarter}</p>}
                {formData.progress && <p><strong>ሂደት:</strong> {formData.progress}</p>}
                <hr />
                {formData.plan_type && <p><strong>የ እቅዱ አይነት:</strong> {formData.plan_type}</p>}
                {formData.plan_type === "cost" && (
                  <>
                    {formData.cost_type && <p><strong>የወጪው አይነት:</strong> {formData.cost_type}</p>}
                    {formData.costName && <p><strong>የወጪ ስም:</strong> {formData.costName}</p>}
                    {formData.CIbaseline && <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>}
                    {formData.CIplan && <p><strong>እቅድ:</strong> {formData.CIplan}</p>}
                  </>
                )}
                {formData.plan_type === "income" && (
                  <>
                    {formData.income_exchange && <p><strong>ምንዛሬ:</strong> {formData.income_exchange}</p>}
                    {formData.incomeName && <p><strong>የገቢው ስም:</strong> {formData.incomeName}</p>}
                    {formData.CIbaseline && <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>}
                    {formData.CIplan && <p><strong>እቅድ:</strong> {formData.CIplan}</p>}
                  </>
                )}
                {formData.plan_type === "hr" && (
                  <>
                    {formData.employment_type && <p><strong>የቅጥር አይነት:</strong> {formData.employment_type}</p>}
                    {formData.CIbaseline && <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>}
                    {formData.CIplan && <p><strong>እቅድ:</strong> {formData.CIplan}</p>}
                  </>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="loading-text">Loading plan details...</p>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <img
              src={popupType === "success" ? happy : sad}
              alt={popupType === "success" ? "Success" : "Error"}
              className="popup-emoji"
            />
            <p className="popup-message">{responseMessage}</p>
            <button className="btn btn-secondary popup-close" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamleaderAddReport;