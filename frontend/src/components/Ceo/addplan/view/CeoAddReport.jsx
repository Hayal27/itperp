import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import sad from "../../../../assets/img/sad.gif";
import happy from "../../../../assets/img/happy.gif";

// Utility function to calculate execution percentage.
// Standard formula: ((outcome - baseline) / (plan - baseline)) * 100, rounded.
const calculateExecutionPercentage = (baseline, plan, outcome) => {
  const base = parseFloat(baseline);
  const p = parseFloat(plan);
  const o = parseFloat(outcome);
  // Ensure values are numbers and avoid division by zero.
  if (isNaN(base) || isNaN(p) || isNaN(o) || (p - base) === 0) return 0;
  return Math.round(((o - base) / (p - base)) * 100);
};

// Utility function for CI execution percentage.
// It applies the same logic as calculateExecutionPercentage but for CI-related numbers.
const CIcalculateExecutionPercentage = (CIbaseline, CIplan, CIoutcome) => {
  const cibase = parseFloat(CIbaseline);
  const cip = parseFloat(CIplan);
  const cio = parseFloat(CIoutcome);
  // Validate and perform CI calculation.
  if (isNaN(cibase) || isNaN(cip) || isNaN(cio) || (cip - cibase) === 0) return 0;
  return Math.round(((cio - cibase) / (cip - cibase)) * 100);
};

const CeoAddReport = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  // State for plan details and form fields.
  // Fetched fields are read-only. Only outcome (and CI outcome for non-default plans) are editable.
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    // Read-only fields fetched from backend.
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
    // Editable outcome fields.
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
        // Initialize the formData with fetched plan details.
        setFormData((prev) => ({
          ...prev,
          goal: p.Goal_Name || "",
          objective: p.Objective_Name || "",
          specObjective: p.Specific_Objective_Name || "",
          specific_objective_detailname: p.Specific_Objective_NameDetail || "",
          measurement: p.Measurement || "",
          baseline: p.Baseline || "",
          plan: p.Plan || "",
          description: p.Description || "",
          year: p.year || "",
          Quarter: p.Quarter || "",
          progress: p.Progress || "",
          plan_type: p.plan_type || "",
          cost_type: p.cost_type || "",
          costName: p.costName || "",
          income_exchange: p.income_exchange || "",
          incomeName: p.incomeName || "",
          employment_type: p.employment_type || "",
          // Use appropriate checking so 0 is not treated as falsy.
          CIbaseline: p.CIBaseline ?? "",
          CIplan: p.CIplan || ""
          // outcome & CI outcome remain user inputs.
        }));
      })
      .catch((err) => {
        console.error("Error fetching plan details:", err.response || err.message);
        setResponseMessage("Failed to fetch plan details.");
        setPopupType("error");
        setShowPopup(true);
      });
  }, [planId]);

  // Handle change for outcome.
  // Users manually input outcome; the execution percentage is calculated automatically.
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

  // Handle change for CI outcome.
  // Users manually input CI outcome; the CI execution percentage is calculated automatically.
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

  // Submit handler: Only update outcome fields.
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

    // Build payload based on plan_type.
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
    <div className="form-container-10 mx-auto p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl transition-all duration-500">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        እቅዶን ያዘምኑ
      </h2>
      {plan ? (
        <>
          <form onSubmit={handleSubmit}>
            {/* Read-only fetched fields */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">ግብ</label>
              <input
                type="text"
                name="goal"
                value={formData.goal}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">አላማ</label>
              <input
                type="text"
                name="objective"
                value={formData.objective}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">ውጤት</label>
              <input
                type="text"
                name="specObjective"
                value={formData.specObjective}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                የ ውጤቱ ሚከናወን ዝርዝር ሥራ
              </label>
              <input
                type="text"
                name="specific_objective_detailname"
                value={formData.specific_objective_detailname}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">መለኪያ</label>
              <input
                type="text"
                name="measurement"
                value={formData.measurement}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">መነሻ</label>
              <input
                type="text"
                name="baseline"
                value={formData.baseline}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            {/* Plan field */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">እቅድ</label>
              <input
                type="text"
                name="plan"
                value={formData.plan}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            {/* Editable Outcome field */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Outcome</label>
              <input
                type="number"
                name="outcome"
                value={formData.outcome}
                onChange={handleOutcomeChange}
                className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter outcome"
              />
              {errors.outcome && <small className="text-red-500">{errors.outcome}</small>}
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                ክንውን በ%
              </label>
              <input
                type="text"
                name="execution_percentage"
                value={formData.execution_percentage}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100"
                placeholder="Auto-calculated"
              />
            </div>
            {/* Read-only remaining fields */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">መግለጫ</label>
              <textarea
                name="description"
                value={formData.description}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                rows="3"
              ></textarea>
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">የትግበራ አመት</label>
              <input
                type="text"
                name="year"
                value={formData.year}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Quarter</label>
              <input
                type="text"
                name="Quarter"
                value={formData.Quarter}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">ሂደት</label>
              <input
                type="text"
                name="የ እቅዱ ሂደት"
                value={formData.progress}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            {/* Extended Read-only Fields Section */}
            <h3 className="text-2xl font-semibold mt-10 mb-6 text-center text-gray-800">
               የወጪ አና ገቢ 
            </h3>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">Plan Category</label>
              <input
                type="text"
                name="plan_type"
                value={formData.plan_type}
                readOnly
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
              />
            </div>
            {formData.plan_type === "cost" && (
              <div className="space-y-6">
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">Cost Type</label>
                  <input
                    type="text"
                    name="cost_type"
                    value={formData.cost_type}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">Cost Name</label>
                  <input
                    type="text"
                    name="costName"
                    value={formData.costName}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Baseline</label>
                  <input
                    type="text"
                    name="CIbaseline"
                    value={formData.CIbaseline}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Plan</label>
                  <input
                    type="text"
                    name="CIplan"
                    value={formData.CIplan}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            )}
            {formData.plan_type === "income" && (
              <div className="space-y-6">
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">Income Exchange</label>
                  <input
                    type="text"
                    name="income_exchange"
                    value={formData.income_exchange}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">Income Name</label>
                  <input
                    type="text"
                    name="incomeName"
                    value={formData.incomeName}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Baseline</label>
                  <input
                    type="text"
                    name="CIbaseline"
                    value={formData.CIbaseline}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Plan</label>
                  <input
                    type="text"
                    name="CIplan"
                    value={formData.CIplan}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            )}
            {formData.plan_type === "hr" && (
              <div className="space-y-6">
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">Employment Type</label>
                  <input
                    type="text"
                    name="employment_type"
                    value={formData.employment_type}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                {/* Updated HR section to also include CI Baseline and CI Plan like other plan types */}
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Baseline</label>
                  <input
                    type="text"
                    name="CIbaseline"
                    value={formData.CIbaseline}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Plan</label>
                  <input
                    type="text"
                    name="CIplan"
                    value={formData.CIplan}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            )}
            {/* For non-default plan types, render CI Outcome fields */}
            {formData.plan_type !== "default" && (
              <>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Outcome</label>
                  <input
                    type="number"
                    name="CIoutcome"
                    value={formData.CIoutcome}
                    onChange={handleCIOutcomeChange}
                    className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    placeholder="Enter CI Outcome"
                  />
                  {errors.CIoutcome && <small className="text-red-500">{errors.CIoutcome}</small>}
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Execution Percentage</label>
                  <input
                    type="text"
                    name="CIexecution_percentage"
                    value={formData.CIexecution_percentage}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100"
                    placeholder="Auto-calculated"
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="btn btn-primary w-full py-3 mt-8 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold transition transform hover:scale-105"
            >
              ያዘምኑ
            </button>
          </form>

          {/* Preview Section */}
          <div className="mt-10 text-center">
            <button
              className="btn-position btn btn-secondary py-2 px-6 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition transform hover:scale-105"
              onClick={togglePreview}
            >
              {showPreview ? "ክለሳውን አንሳ" : "ክለሳውን አሳይ"}
            </button>
          </div>
          {showPreview && (
            <div className="preview-container mt-8 p-8 bg-white rounded-lg shadow-2xl">
              <h3 className="text-2xl font-semibold mb-4">የእቅዶ ክለሳ</h3>
              <p><strong>ግብ:</strong> {formData.goal}</p>
              <p><strong>አላማ:</strong> {formData.objective}</p>
              <p><strong>ውጤት:</strong> {formData.specObjective}</p>
              <p><strong>የውጤቱ ዝርዝር:</strong> {formData.specific_objective_detailname}</p>
              <p><strong>መለኪያ:</strong> {formData.measurement}</p>
              <p><strong>መነሻ:</strong> {formData.baseline}</p>
              <p><strong>እቅድ:</strong> {formData.plan}</p>
              <p><strong>ክንውን:</strong>   {formData.outcome}</p>
              <p><strong>ክንውን በ%:</strong> {formData.execution_percentage}%</p>
              {/* {formData.plan_type !== "default" && (
                <>
                  <p><strong>CI Outcome:</strong> {formData.CIoutcome}</p>
                  <p><strong>CI Execution Percentage:</strong> {formData.CIexecution_percentage}%</p>
                </>
              )} */}
              <hr className="my-4" />
              <p><strong>መግለጫ:</strong> {formData.description}</p>
              <p><strong>አመት:</strong> {formData.year}</p>
              <p><strong>ሩብ አመት:</strong> {formData.Quarter}</p>
              <p><strong>ሂደት:</strong> {formData.progress}</p>
              <hr className="my-4" />
              <p><strong>የ እቅዱ አይነት:</strong> {formData.plan_type}</p>
              {formData.plan_type === "cost" && (
                <>
                  <p><strong>የ ወጪው አይነት:</strong> {formData.cost_type}</p>
                  <p><strong>የ ወጪው ስም:</strong> {formData.costName}</p>
                  <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>
                  <p><strong>እቅድ:</strong> {formData.CIplan}</p>
                </>
              )}
              {formData.plan_type === "income" && (
                <>
                  <p><strong>ምንዛሬ:</strong> {formData.income_exchange}</p>
                  <p><strong>የገቢው ስም:</strong> {formData.incomeName}</p>
                  <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>
                  <p><strong>እቅድ:</strong> {formData.CIplan}</p>
                </>
              )}
              {formData.plan_type === "hr" && (
                <>
                  <p><strong>የቅጥር አይነት:</strong> {formData.employment_type}</p>
                  <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>
                  <p><strong>እቅድ:</strong> {formData.CIplan}</p>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-600">Loading plan details...</p>
      )}

      {/* Popup Message */}
      {showPopup && (
        <div className="popup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="popup-content bg-white p-8 rounded-lg shadow-lg text-center max-w-sm mx-auto">
            <img
              src={popupType === "success" ? happy : sad}
              alt={popupType === "success" ? "Success" : "Error"}
              className="emoji mx-auto mb-4"
              style={{ width: "100px", height: "100px" }}
            />
            <p className="mb-4">{responseMessage}</p>
            <button className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CeoAddReport;