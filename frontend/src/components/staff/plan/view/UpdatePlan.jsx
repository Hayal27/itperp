
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import sad from "../../../../assets/img/sad.gif";
import happy from "../../../../assets/img/happy.gif";
import "../../../../assets/css/planform.css";

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

const UpdatePlan = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  // State for the filtered plan details and form data.
  const [plan, setPlan] = useState(null);
  const [formData, setFormData] = useState({
    // Mapped read-only fields from backend.
    goal: "",
    objective: "",
    specObjective: "",
    specific_objective_detailname: "",
    measurement: "",
    // Editable fields:
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
    // CI fields for cost/income/hr: also editable
    CIbaseline: "",
    CIplan: "",
    // Editable outcome fields.
    outcome: "",
    execution_percentage: "",
    CIoutcome: "",
    CIexecution_percentage: ""
  });
  const [errors, setErrors] = useState({});
  const [previewVisible, setPreviewVisible] = useState(false);

  // Fetch plan details on mount.
  useEffect(() => {
    if (!planId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Invalid Plan ID"
      });
      return;
    }
    const token = localStorage.getItem("token");
    Axios.get(`http://localhost:5000/api/pland/${planId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        const p = res.data.plan;
        setPlan(p);
        // Map backend fields to local state with proper type conversion.
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
          year: (p.year || p.year === 0) ? p.year.toString() : "",
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
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch plan details."
        });
      });
  }, [planId]);

  // Event handlers for outcome changes.
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

  // Change handlers for editable fields in the main section.
  const handleBaselineChange = (e) => {
    const newBaseline = e.target.value;
    const computedPercentage = calculateExecutionPercentage(
      newBaseline,
      formData.plan,
      formData.outcome
    );
    setFormData((prev) => ({
      ...prev,
      baseline: newBaseline,
      execution_percentage: computedPercentage.toString()
    }));
  };

  const handlePlanFieldChange = (e) => {
    const newPlan = e.target.value;
    const computedPercentage = calculateExecutionPercentage(
      formData.baseline,
      newPlan,
      formData.outcome
    );
    setFormData((prev) => ({
      ...prev,
      plan: newPlan,
      execution_percentage: computedPercentage.toString()
    }));
  };

  const handleYearChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      year: e.target.value
    }));
  };

  // Change handlers for CI baseline and CI plan.
  const handleCIbaselineChange = (e) => {
    const newCIbaseline = e.target.value;
    const computedCIPercentage = CIcalculateExecutionPercentage(
      newCIbaseline,
      formData.CIplan,
      formData.CIoutcome
    );
    setFormData((prev) => ({
      ...prev,
      CIbaseline: newCIbaseline,
      CIexecution_percentage: computedCIPercentage.toString()
    }));
  };

  const handleCIplanChange = (e) => {
    const newCIplan = e.target.value;
    const computedCIPercentage = CIcalculateExecutionPercentage(
      formData.CIbaseline,
      newCIplan,
      formData.CIoutcome
    );
    setFormData((prev) => ({
      ...prev,
      CIplan: newCIplan,
      CIexecution_percentage: computedCIPercentage.toString()
    }));
  };

  // Submit handler: updating outcome (and CI outcome if applicable) along with new editable fields.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered", formData);
    let localErrors = {};

    // Validate main editable fields: baseline, plan, and year.
    if (!formData.baseline) {
      localErrors.baseline = "መነሻ is required";
    } else if (isNaN(parseFloat(formData.baseline))) {
      localErrors.baseline = "መነሻ must be a valid number";
    }

    if (!formData.plan) {
      localErrors.plan = "እቅድ is required";
    } else if (isNaN(parseFloat(formData.plan))) {
      localErrors.plan = "እቅድ must be a valid number";
    }

    if (!formData.year) {
      localErrors.year = "የትግበራ አመት is required";
    } else if (isNaN(parseFloat(formData.year))) {
      localErrors.year = "የትግበራ አመት must be a valid number";
    }

    // If plan type is not default, validate CI fields.
    if (Object.keys(localErrors).length > 0) {
      const firstError = Object.values(localErrors)[0];
      console.log("Validation errors found:", localErrors);
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: firstError
      });
      setErrors(localErrors);
      return;
    }

    // Build payload based on plan_type.
    const updatedData =
      formData.plan_type === "default"
        ? {
            baseline: formData.baseline,
            plan: formData.plan,
            year: formData.year,
            outcome: formData.outcome,
            execution_percentage: formData.execution_percentage
          }
        : {
            baseline: formData.baseline,
            plan: formData.plan,
            year: formData.year,
            outcome: formData.outcome,
            execution_percentage: formData.execution_percentage,
            CIbaseline: formData.CIbaseline,
            CIplan: formData.CIplan,
            CIoutcome: formData.CIoutcome,
            CIexecution_percentage: formData.CIexecution_percentage
          };

    console.log("Payload to be submitted:", updatedData);
    const token = localStorage.getItem("token");

    Axios.put(`http://localhost:5000/api/planupdate/${planId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        console.log("Update success response:", response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "በተገቢው ሪፖርት አድርገዋል"
        });
      })
      .catch((err) => {
        console.error("Update error:", err.response || err.message);
        Swal.fire({
          icon: "error",
          title: "Update Error",
          text: "Error updating the report. Please try again."
        });
      })
      .finally(() => {
        console.log("Axios PUT request completed");
      });
  };

  return (
    <div className="hayal min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl transition-all duration-500">
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          እቅዶን ያዘምኑ
        </h2>
        {plan ? (
          <>
            <form onSubmit={handleSubmit}>
              {formData.goal && (
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
              )}
              {formData.objective && (
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
              )}
              {formData.specObjective && (
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
              )}
              {formData.specific_objective_detailname && (
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
              )}
              {formData.measurement && (
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
              )}

              {/* Editable Main Fields */}
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">መነሻ</label>
                <input
                  type="number"
                  name="baseline"
                  value={formData.baseline}
                  onChange={handleBaselineChange}
                  className="form-control w-full border border-gray-300 rounded-lg p-3"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">እቅድ</label>
                <input
                  type="number"
                  name="plan"
                  value={formData.plan}
                  onChange={handlePlanFieldChange}
                  className="form-control w-full border border-gray-300 rounded-lg p-3"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-semibold text-gray-700">የትግበራ አመት</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleYearChange}
                  className="form-control w-full border border-gray-300 rounded-lg p-3"
                />
              </div>

              {formData.description && (
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
              )}
              {formData.Quarter && (
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">ሩብ አመት</label>
                  <input
                    type="text"
                    name="Quarter"
                    value={formData.Quarter}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              )}
              {formData.progress && (
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">ሂደት</label>
                  <input
                    type="text"
                    name="progress"
                    value={formData.progress}
                    readOnly
                    className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Extended Read-only Fields Section */}
              {formData.plan_type && (
                <>
                  <h3 className="text-2xl font-semibold mt-10 mb-6 text-center text-gray-800">
                    የወጪ አና ገቢ 
                  </h3>
                  <div className="mb-6">
                    <label className="block mb-2 font-semibold text-gray-700">የ እቅዱ አይነት</label>
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
                      {formData.cost_type && (
                        <div className="mb-6">
                          <label className="block mb-2 font-semibold text-gray-700">የወጪው አይነት</label>
                          <input
                            type="text"
                            name="cost_type"
                            value={formData.cost_type}
                            readOnly
                            className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                      )}
                      {formData.costName && (
                        <div className="mb-6">
                          <label className="block mb-2 text-gray-700">የወጪ ስም</label>
                          <input
                            type="text"
                            name="costName"
                            value={formData.costName}
                            readOnly
                            className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                      )}
                      {/* Always render CI baseline and CI plan fields */}
                      <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">መነሻ</label>
                        <input
                          type="number"
                          name="CIbaseline"
                          value={formData.CIbaseline}
                          onChange={handleCIbaselineChange}
                          className="form-control w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">እቅድ</label>
                        <input
                          type="number"
                          name="CIplan"
                          value={formData.CIplan}
                          onChange={handleCIplanChange}
                          className="form-control w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                    </div>
                  )}
                  {formData.plan_type === "income" && (
                    <div className="space-y-6">
                      {formData.income_exchange && (
                        <div className="mb-6">
                          <label className="block mb-2 font-semibold text-gray-700">ምንዛሬ</label>
                          <input
                            type="text"
                            name="income_exchange"
                            value={formData.income_exchange}
                            readOnly
                            className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                      )}
                      {formData.incomeName && (
                        <div className="mb-6">
                          <label className="block mb-2 font-semibold text-gray-700">የገቢው ስም</label>
                          <input
                            type="text"
                            name="incomeName"
                            value={formData.incomeName}
                            readOnly
                            className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                          />
                        </div>
                      )}
                      {/* Always render CI baseline and CI plan fields */}
                      <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">መነሻ</label>
                        <input
                          type="number"
                          name="CIbaseline"
                          value={formData.CIbaseline}
                          onChange={handleCIbaselineChange}
                          className="form-control w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">እቅድ</label>
                        <input
                          type="number"
                          name="CIplan"
                          value={formData.CIplan}
                          onChange={handleCIplanChange}
                          className="form-control w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                    </div>
                  )}
                  {formData.plan_type === "hr" && (
                    <div className="space-y-6">
                      {formData.employment_type && (
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
                      )}
                      {/* Always render CI baseline and CI plan fields */}
                      <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">መነሻ</label>
                        <input
                          type="number"
                          name="CIbaseline"
                          value={formData.CIbaseline}
                          onChange={handleCIbaselineChange}
                          className="form-control w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">እቅድ</label>
                        <input
                          type="number"
                          name="CIplan"
                          value={formData.CIplan}
                          onChange={handleCIplanChange}
                          className="form-control w-full border border-gray-300 rounded-lg p-3"
                        />
                      </div>
                    </div>
                  )}
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
                onClick={() => setPreviewVisible((prev) => !prev)}
              >
                {previewVisible ? "ክለሳውን አንሳ" : "ክለሳውን አሳይ"}
              </button>
            </div>
            {previewVisible && (
              <div className="preview-container mt-8 p-8 bg-white rounded-lg shadow-2xl">
                <h3 className="text-2xl font-semibold mb-4">የእቅዶ ክለሳ</h3>
                {formData.goal && <p><strong>ግብ:</strong> {formData.goal}</p>}
                {formData.objective && <p><strong>አላማ:</strong> {formData.objective}</p>}
                {formData.specObjective && <p><strong>ውጤት:</strong> {formData.specObjective}</p>}
                {formData.specific_objective_detailname && <p><strong>የ ውጤቱ ሚከናወን ዝርዝር ሥራ:</strong> {formData.specific_objective_detailname}</p>}
                {formData.measurement && <p><strong>መለኪያ:</strong> {formData.measurement}</p>}
                <p><strong>መነሻ:</strong> {formData.baseline}</p>
                <p><strong>እቅድ:</strong> {formData.plan}</p>
                {formData.outcome !== "" && <p><strong>ክንውን:</strong> {formData.outcome}</p>}
                {formData.execution_percentage !== "" && <p><strong>ክንውን በ%:</strong> {formData.execution_percentage}%</p>}
                {formData.description && <p><strong>መግለጫ:</strong> {formData.description}</p>}
                <p><strong>የትግበራ አመት:</strong> {formData.year}</p>
                {formData.Quarter && <p><strong>ሩብ አመት:</strong> {formData.Quarter}</p>}
                {formData.progress && <p><strong>ሂደት:</strong> {formData.progress}</p>}
                <hr className="my-4" />
                {formData.plan_type && <p><strong>የ እቅዱ አይነት:</strong> {formData.plan_type}</p>}
                {formData.plan_type === "cost" && (
                  <>
                    {formData.cost_type && <p><strong>የወጪው አይነት:</strong> {formData.cost_type}</p>}
                    {formData.costName && <p><strong>የወጪው ስም:</strong> {formData.costName}</p>}
                    <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>
                    <p><strong>እቅድ:</strong> {formData.CIplan}</p>
                  </>
                )}
                {formData.plan_type === "income" && (
                  <>
                    {formData.income_exchange && <p><strong>ምንዛሬ:</strong> {formData.income_exchange}</p>}
                    {formData.incomeName && <p><strong>የገቢው ስም:</strong> {formData.incomeName}</p>}
                    <p><strong>መነሻ:</strong> {formData.CIbaseline}</p>
                    <p><strong>እቅድ:</strong> {formData.CIplan}</p>
                  </>
                )}
                {formData.plan_type === "hr" && (
                  <>
                    {formData.employment_type && <p><strong>የቅጥር አይነት:</strong> {formData.employment_type}</p>}
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
      </div>
    </div>
  );
};

export default UpdatePlan;
