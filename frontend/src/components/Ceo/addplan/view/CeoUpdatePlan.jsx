import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2";
import sad from "../../../../assets/img/sad.gif";
import happy from "../../../../assets/img/happy.gif"; 
import '../../../../assets/css/planform.css';

const CeoUpdatePlan = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  // State for plan details and form fields
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
    deadline: "",
    Quarter: "",
    progress: "on going",
    // Extended field for plan category; allowed values: "default", "cost", "income", "hr"
    plan_type: "default",
    // Cost-related fields
    cost_type: "",
    custom_cost_type: "",
    costName: "",
    attribute: "",
    // Income-related field
    income_exchange: "",
    incomeName: "",
    // HR-related field
    employment_type: "default",
    // Common CI fields (for cost, income & now hr details)
    CIbasiline: "",
    CIplan: ""
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch plan details on mount
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
        // Initialize the form with fetched plan details
        setFormData({
          goal: p.Goal_Name || "",
          objective: p.Objective_Name || "",
          specObjective: p.Specific_Objective_Name || "",
          specific_objective_detailname: p.Specific_Objective_NameDetail || "",
          measurement: p.Measurement || "",
          baseline: p.Baseline || "",
          plan: p.Plan || "",
          description: p.Description || "",
          deadline: p.deadline || "",
          Quarter: p.Quarter || "",
          progress: p.Progress || "on going",
          // Extended fields: fetched and displayed but not modifiable for plan_type
          plan_type: p.plan_type || "default",
          cost_type: p.cost_type || "default",
          custom_cost_type: "",
          costName: p.costName || "",
          attribute: p.attribute || "",
          income_exchange: p.income_exchange || "default",
          incomeName: p.incomeName || "",
          employment_type: p.employment_type || "default",
          CIbasiline: p.CIbasiline || "",
          CIplan: p.CIplan || ""
        });
      })
      .catch((err) => {
        console.error("Error fetching plan details:", err.response || err.message);
        setResponseMessage("Failed to fetch plan details.");
        setPopupType("error");
        setShowPopup(true);
      });
  }, [planId]);

  // Handle changes for input fields (both modifiable and for updating fetched data view)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form fields (only modifiable fields need validation)
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
    // Validate required modifiable fields.
    const requiredFields = [
      "specific_objective_detailname",
      "measurement",
      "baseline",
      "plan",
      "deadline",
      "የ እቅዱ ሂደት"
    ];
    requiredFields.forEach((key) => {
      if (!formData[key] || formData[key].trim() === "") {
        formErrors[key] = `${key} is required`;
        isValid = false;
      }
    });
    if (formData.plan_type === "cost") {
      if (!formData.cost_type || formData.cost_type.trim() === "") {
        formErrors.cost_type = "Cost Type is required";
        isValid = false;
      }
    }
    if (formData.plan_type === "income") {
      if (formData.income_exchange === "default") {
        formErrors.income_exchange = "Select a valid Income Exchange";
        isValid = false;
      }
    }
    // Additional validations can be added here.
    setErrors(formErrors);
    return isValid;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setResponseMessage("እባክዎ ባዶ ቦታዎችን ይሙሉ");
      setPopupType("error");
      setShowPopup(true);
      return;
    }
    // Prepare update payload. Note: goal, objective, specObjective (and related) are read-only.
    const updatedData = {
      goal: formData.goal,
      objective: formData.objective,
      specific_objective: formData.specObjective,
      Specific_Objective_NameDetail: formData.specific_objective_detailname,
      measurement: formData.measurement,
      baseline: formData.baseline,
      plan: formData.plan,
      description: formData.description,
      deadline: formData.deadline,
      Quarter: formData.Quarter,
      progress: formData.progress,
      plan_type: formData.plan_type,
      // Extended fields based on plan_type
      ...(formData.plan_type === "cost" && {
        cost_type: formData.cost_type === "custom" ? formData.custom_cost_type : formData.cost_type,
        costName: formData.costName,
        attribute: formData.attribute,
        CIbasiline: formData.CIbasiline,
        CIplan: formData.CIplan
      }),
      ...(formData.plan_type === "income" && {
        income_exchange: formData.income_exchange,
        incomeName: formData.incomeName,
        CIbasiline: formData.CIbasiline,
        CIplan: formData.CIplan
      }),
      ...(formData.plan_type === "hr" && {
        employment_type: formData.employment_type,
        // For HR plans, also include CI fields
        CIbasiline: formData.CIbasiline,
        CIplan: formData.CIplan
      })
    };

    const token = localStorage.getItem("token");
    Axios.put(`http://localhost:5000/api/planupdate/${planId}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setResponseMessage("በተገቢው ዘምኗል!");
        setPopupType("success");
        setShowPopup(true);
      })
      .catch((err) => {
        console.error("Update error:", err.response || err.message);
        if (
          err.response &&
          err.response.data &&
          err.response.data.error_code === "SUPERVISOR_REQUIRED"
        ) {
          setResponseMessage(
            "እዲያዘምኑት አልተፈቀደሎትም! እባክዎ ሱፐርቫይዘሮን ያግኙ።"
          );
        } else {
          setResponseMessage("Error updating the plan. Please try again.");
        }
        setPopupType("error");
        setShowPopup(true);
      });
  };

  // Toggle preview visibility
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Close the popup message
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
            {/* Default Read-Only Fields */}
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

            {/* Modifiable Field: Specific Objective Detail */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">
                የውጤቱ ሚከናወን ዝርዝር ሥራ
              </label>
              <input
                type="text"
                name="specific_objective_detailname"
                value={formData.specific_objective_detailname}
                onChange={handleInputChange}
                className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {errors.specific_objective_detailname && <small className="text-red-500">{errors.specific_objective_detailname}</small>}
            </div>

            {/* Other Default Modifiable Fields */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">መለኪያ</label>
              <select
                name="measurement"
                value={formData.measurement}
                onChange={handleInputChange}
                className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              >
                <option value="" disabled style={{ backgroundColor: "#f3f4f6", fontWeight: "bold" }}>
                  ⬇️ Select Measurement
                </option>
                <option value="present">Present</option>
                <option value="USD">USD</option>
                <option value="ETB">ETB</option>
                <option value="performance">Performance</option>
                <option value="number">Number</option>
              </select>
              {errors.measurement && <small className="text-red-500">{errors.measurement}</small>}
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">መነሻ</label>
              <input
                type="text"
                name="baseline"
                value={formData.baseline}
                onChange={handleInputChange}
                className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              {errors.baseline && <small className="text-red-500">{errors.baseline}</small>}
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">እቅድ</label>
              <input
                type="text"
                name="plan"
                value={formData.plan}
                onChange={handleInputChange}
                className="form-control w-full border border-gray-300 rounded-lg p-3 bg-gray-100"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">መግለጫ</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                rows="3"
              ></textarea>
            </div>

            {/* Deadline field with calendar picker */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">ሚጠናቀቅበት አመት</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              {errors.deadline && <small className="text-red-500">{errors.deadline}</small>}
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-700">ሂደት</label>
              <select
                name="የ እቅዱ ሂደት"
                value={formData.progress}
                onChange={handleInputChange}
                className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                required
              >
                <option value="started">started</option>
                <option value="on going">በሂደት ላይ</option>
                <option value="completed">የተጠናቀቀ</option>
              </select>
              {errors.progress && <small className="text-red-500">{errors.progress}</small>}
            </div>

            {/* Extended Fields Section */}
            <h3 className="text-2xl font-semibold mt-10 mb-6 text-center text-gray-800">
               የወጪ አና ገቢ ⬇️
            </h3>
            {/* Plan Category (read-only) */}
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

            {/* Conditional Rendering based on Plan Category */}
            {formData.plan_type === "cost" && (
              <div className="space-y-6">
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">Cost Type</label>
                  <select
                    name="cost_type"
                    value={formData.cost_type}
                    onChange={handleInputChange}
                    className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  >
                    <option value="regular_budget">መደበኛ ወጪ</option>
                    <option value="capital_project_budget">የካፒታል በጀት ወጪ</option>
                    <option value="custom">Custom</option>
                  </select>
                  {errors.cost_type && <small className="text-red-500">{errors.cost_type}</small>}
                </div>
                {formData.cost_type === "custom" && (
                  <div className="mb-6">
                    <label className="block mb-2 font-semibold text-gray-700">Custom Cost Type</label>
                    <input
                      type="text"
                      name="custom_cost_type"
                      value={formData.custom_cost_type}
                      onChange={handleInputChange}
                      placeholder="Enter custom cost type"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                    />
                    {errors.custom_cost_type && <small className="text-red-500">{errors.custom_cost_type}</small>}
                  </div>
                )}
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">Cost Name</label>
                  <input
                    type="text"
                    name="costName"
                    value={formData.costName}
                    onChange={handleInputChange}
                    placeholder="Enter cost name"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </div>
                {/* CI Related Fields for Cost */}
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Baseline</label>
                  <input
                    type="text"
                    name="CIbasiline"
                    value={formData.CIbasiline}
                    onChange={handleInputChange}
                    placeholder="Enter CI Baseline"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Plan</label>
                  <input
                    type="text"
                    name="CIplan"
                    value={formData.CIplan}
                    onChange={handleInputChange}
                    placeholder="Enter CI Plan"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                </div>
              </div>
            )}

            {formData.plan_type === "income" && (
              <div className="space-y-6">
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">Income Exchange</label>
                  <select
                    name="income_exchange"
                    value={formData.income_exchange}
                    onChange={handleInputChange}
                    className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  >
                    <option value="default">Default</option>
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                  </select>
                  {errors.income_exchange && <small className="text-red-500">{errors.income_exchange}</small>}
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">Income Name</label>
                  <input
                    type="text"
                    name="incomeName"
                    value={formData.incomeName}
                    onChange={handleInputChange}
                    placeholder="Enter income name"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                  {errors.incomeName && <small className="text-red-500">{errors.incomeName}</small>}
                </div>
                {/* CI Fields for Income */}
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Baseline</label>
                  <input
                    type="text"
                    name="CIbasiline"
                    value={formData.CIbasiline}
                    onChange={handleInputChange}
                    placeholder="Enter CI Baseline"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Plan</label>
                  <input
                    type="text"
                    name="CIplan"
                    value={formData.CIplan}
                    onChange={handleInputChange}
                    placeholder="Enter CI Plan"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                </div>
              </div>
            )}

            {formData.plan_type === "hr" && (
              <div className="space-y-6">
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">Employment Type</label>
                  <select
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleInputChange}
                    className="form-control w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  >
                    <option value="default">Default</option>
                    <option value="full_time">Full Time</option>
                    <option value="contract">Contract</option>
                  </select>
                  {errors.employment_type && <small className="text-red-500">{errors.employment_type}</small>}
                </div>
                {/* Updated HR section to also include CI Baseline and CI Plan like other plan types */}
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Baseline</label>
                  <input
                    type="text"
                    name="CIbasiline"
                    value={formData.CIbasiline}
                    onChange={handleInputChange}
                    placeholder="Enter CI Baseline"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold text-gray-700">CI Plan</label>
                  <input
                    type="text"
                    name="CIplan"
                    value={formData.CIplan}
                    onChange={handleInputChange}
                    placeholder="Enter CI Plan"
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  />
                </div>
              </div>
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
              <h3 className="text-2xl font-semibold mb-4">የ እቅዶ ክለሳ</h3>
              <p><strong>ግብ:</strong> {formData.goal}</p>
              <p><strong>አላማ:</strong> {formData.objective}</p>
              <p><strong>ውጤት:</strong> {formData.specObjective}</p>
              <p><strong>የውጤቱ ዝርዝር:</strong> {formData.specific_objective_detailname}</p>
              <p><strong>መለኪያ:</strong> {formData.measurement}</p>
              <p><strong>መነሻ:</strong> {formData.baseline}</p>
              <p><strong>እቅድ:</strong> {formData.plan}</p>
              <p><strong>መግለጫ:</strong> {formData.description}</p>
              <p><strong>የሚጠናቀቅበት አመት (Deadline):</strong> {formData.deadline}</p>
              <p><strong>ሩብ አመት:</strong> {formData.Quarter}</p>
              <p><strong>ሂደት:</strong> {formData.progress}</p>
              <hr className="my-4" />
              <p><strong>የ እቅዱ አይነት:</strong> {formData.plan_type}</p>
              {formData.plan_type === "cost" && (
                <>
                  <p>
                    <strong>የ ወጪው አይነት:</strong> {formData.cost_type === "custom" ? formData.custom_cost_type : formData.cost_type}
                  </p>
                  <p><strong>የ ወጪው ስም:</strong> {formData.costName}</p>
                  <p><strong>መነሻ:</strong> {formData.CIbasiline}</p>
                  <p><strong>እቅድ:</strong> {formData.CIplan}</p>
                </>
              )}
              {formData.plan_type === "income" && (
                <>
                  <p><strong>ምንዛሬ:</strong> {formData.income_exchange}</p>
                  <p><strong>የገቢው ስም:</strong> {formData.incomeName}</p>
                  <p><strong>መነሻ:</strong> {formData.CIbasiline}</p>
                  <p><strong>እቅድ:</strong> {formData.CIplan}</p>
                </>
              )}
              {formData.plan_type === "hr" && (
                <>
                  <p><strong>የቅጥር አይነት:</strong> {formData.employment_type}</p>
                  <p><strong>መነሻ:</strong> {formData.CIbasiline}</p>
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

export default CeoUpdatePlan;