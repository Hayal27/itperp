import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../../assets/css/Step4SpecificObjectiveDetails.css"; // Import external CSS styling

const Step4SpecificObjectiveDetails = ({ specificObjectiveId, token, onBack, onNext }) => {
  const [specificObjectiveDetails, setSpecificObjectiveDetails] = useState([]);
  const [newDetail, setNewDetail] = useState({
    name: "",
    description: "",
    baseline: "",
    plan: "",
    measurement: "",
    year: "",
    month: "",
    day: "",
    deadline: "",
    planType: "",
    costType: "",
    incomeType: "",
    incomeExchange: "",
    hrType: "",
    employmentType: "",
    costName: "",
    incomeName: "",
    CustomcostName: "",
    CIbaseline: "",
    CIplan: "",
    xzx: "",
    CItotalBaseline: "",
    CItotalPlan: "",
    CItotalExpectedOutcome: ""
  });
  
  const defaultDetailValues = {
    name: "",
    description: "",
    baseline: "",
    plan: "",
    measurement: "",
    year: "",
    month: "",
    day: "",
    deadline: "",
    planType: "",
    costType: "",
    incomeType: "",
    incomeExchange: "",
    hrType: "",
    employmentType: "",
  };

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Step 4 received specificObjectiveId:", specificObjectiveId);
  }, [specificObjectiveId]);

  console.log("Details array:", specificObjectiveDetails);
  console.log("Length of details array:", specificObjectiveDetails.length);

  // Compute inline error for deadline year validation
  const deadlineYearError =
    newDetail.deadline && newDetail.year && new Date(newDetail.deadline).getFullYear() < newDetail.year
      ? "Deadline's year must be greater than or equal to the specified year."
      : "";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      [name]: name === "year" || name === "month" || name === "day" ? Number(value) : value,
    }));
  };

  const handlePlanTypeChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      planType: value,
      costType: "",
      incomeType: "",
      hrType: "",
      costName: "",
      incomeName: ""
    }));
  };

  // Calculation function for expected outcome
  const calculateExpectedOutcome = (baseline, plan) => {
    const baselineNum = parseFloat(baseline) || 0;
    const planNum = parseFloat(plan) || 0;
    return planNum - baselineNum;
  };

  // Handler for CI fields
  const handleCIInputChange = (e) => {
    const { name, value } = e.target;
    setNewDetail((prev) => {
      const newValues = { ...prev, [name]: value };
      if (name === "CIbaseline" || name === "CIplan") {
        newValues.xzx = calculateExpectedOutcome(name === "CIbaseline" ? value : prev.CIbaseline, name === "CIplan" ? value : prev.CIplan);
      }
      return newValues;
    });
  };

  const handleCostNameChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      costName: value,
      CustomcostName: value !== "other" ? "" : prevDetail.CustomcostName
    }));
  };

  const handleincomeNameChange = (e) => {
    setNewDetail((prev) => ({
      ...prev,
      incomeName: e.target.value,
    }));
  };

  const handleCostTypeChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      costType: value,
      CustomcostName: value === "other" ? "" : value,
    }));
  };

  const handleIncomeTypeChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      incomeType: value,
      incomeName: value === "other" ? "" : value,
    }));
  };

  const handleHRTypeChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      hrType: value,
    }));
  };

  const handleIncomeExchangeChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      incomeExchange: value,
      incomeType: "",
      incomeName: "",
    }));
  };
  
  const handleEmploymentTypeChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      employmentType: value,
    }));
  };
  
  const handleCreateDetail = async () => {
    if (!specificObjectiveId) {
      Swal.fire("Error", "Specific objective ID is missing.", "error");
      return;
    }
    
    // Validate deadline's year on submit
    if (newDetail.deadline && newDetail.year) {
      const deadlineYear = new Date(newDetail.deadline).getFullYear();
      if (deadlineYear < newDetail.year) {
        Swal.fire("Error", "The deadline's year must be greater than or equal to the specified year.", "error");
        return;
      }
    }
  
    try {
      setIsLoading(true);
      const payload = {
        specific_objective: [
          {
            specific_objective_id: specificObjectiveId,
            specific_objective_detailname: newDetail.name,
            details: newDetail.description,
            baseline: newDetail.baseline.toString(),
            plan: newDetail.plan.toString(),
            measurement: newDetail.measurement.toString(),
            year: newDetail.year.toString(),
            month: newDetail.month.toString(),
            day: newDetail.day.toString(),
            deadline: newDetail.deadline,
            plan_type: newDetail.planType || "default_plan",
            cost_type: newDetail.costType,
            income_exchange: newDetail.incomeExchange,
            employment_type: newDetail.employmentType,
            costName: newDetail.costName === "other" 
              ? newDetail.CustomcostName 
              : newDetail.costName,
            incomeName: newDetail.incomeName,
            CIbaseline: newDetail.CIbaseline.toString(),
            CIplan: newDetail.CIplan,
            xzx: newDetail.xzx.toString()
          },
        ],
      };
  
      console.log("Payload:", payload);
  
      const response = await axios.post(
        "http://localhost:5000/api/addspecificObjectiveDetail",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("API Response:", response.data);
  
      const createdDetailId = response.data?.id || response.data?.insertIds?.[0];
  
      if (!createdDetailId) {
        console.error("Server response does not contain a valid ID:", response.data);
        Swal.fire("Error", "The server did not return a valid ID. Please check the server logs.", "error");
        return;
      }
  
      // Create the new updated array of details including the newly created detail.
      const updatedDetails = [
        ...specificObjectiveDetails,
        { ...newDetail, id: createdDetailId },
      ];
  
      setSpecificObjectiveDetails(updatedDetails);
  
      Swal.fire("Success", "Detail created successfully!", "success").then(() => {
        // Automatically move to the next step after successful creation
        onNext(updatedDetails);
      });
  
      // Reset the newDetail state to default values
      setNewDetail({ ...defaultDetailValues });
    } catch (err) {
      console.error("Error occurred:", err);
      Swal.fire("Error", err.response?.data?.message || "Failed to create detail.", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNext = () => {
    console.log("Navigating to the next step with all details:", specificObjectiveDetails);
    if (specificObjectiveDetails.length > 0) {
      onNext(specificObjectiveDetails);
    } else {
      setError("Please add at least one detail before proceeding.");
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">
        አዲስ የውጤቶ ተግባር ዝርዝር ይመዝግቡ
      </h3>
  
      <form className="form-fields">
        {/* Plan Type Select */}
        <div className="form-field">
          <label htmlFor="planType" className="form-label">
            የተግባሩ አይነት
          </label>
          <select
            id="planType"
            name="planType"
            value={newDetail.planType}
            onChange={handlePlanTypeChange}
            className="form-select"
          >
            <option value="">⬇️ Select Plan Type</option>
            <option value="cost">ወጪ</option>
            <option value="income">ገቢ</option>
            <option value="hr">ሰራተኞች</option>
          </select>
        </div>
  
        {/* Conditional Fields for Cost Type, Income Type, and Employment Type */}
        {newDetail.planType === "cost" && (
          <div className="form-field-group">
            <div className="form-field">
              <label htmlFor="costType" className="form-label">
                ወጪ አይነት
              </label>
              <select
                id="costType"
                name="costType"
                value={newDetail.costType}
                onChange={handleCostTypeChange}
                className="form-select"
              >
                <option value="">⬇️ Select Cost Type</option>
                <option value="regular_budget">መደበኛ ወጪ</option>
                <option value="capital_project_budget">ካፒታል ፕሮጀክት ወጪ</option>
              </select>
            </div>
  
            {newDetail.costType && (
              <div className="form-field">
                <label htmlFor="costName" className="form-label">
                  ወጪ ስም
                </label>
                <select
                  id="costName"
                  name="costName"
                  value={newDetail.costName}
                  onChange={handleCostNameChange}
                  className="form-select"
                >
                  <option value="">⬇️ Select Cost Name</option>
                  {newDetail.costType === "regular_budget" && (
                    <>
                      <option disabled className="group-header">regular_budget options</option>
                      <option value="Annual Leave Expense">Annual Leave Expense (511111)</option>
                      <option value="Basic Salary Expense">Basic Salary Expense (511101)</option>
                      <option value="Bonus">Bonus (511114)</option>
                      <option value="Building Insurance">Building Insurance (511351)</option>
                      <option value="Building Rent Expense">Building Rent Expense (511301)</option>
                      <option value="Cash Indemnity Allowance">Cash Indemnity Allowance (511107)</option>
                      <option value="Cash Indemnity Insurance">Cash Indemnity Insurance (511354)</option>
                      <option value="Chemical Material Expense">Chemical Material Expense (511453)</option>
                      <option value="Cleaning and Sanitation Service Expense">Cleaning and Sanitation Service Expense (511205)</option>
                      <option value="Consultants Services Expense">Consultants Services Expense (511207)</option>
                      <option value="Daily Labourers Fee">Daily Labourers Fee (511115)</option>
                      <option value="Food Items">Food Items (511454)</option>
                      <option value="Fuel Allowance">Fuel Allowance (511109)</option>
                      <option value="Fuel and Lubricants">Fuel and Lubricants (511402)</option>
                      <option value="Greenery Services Expense">Greenery Services Expense (511202)</option>
                      <option value="Hardship Allowance">Hardship Allowance (511113)</option>
                      <option value="Housing Allowance">Housing Allowance (511104)</option>
                      <option value="Janitorial and Cleaning Supplies">Janitorial and Cleaning Supplies (511455)</option>
                      <option value="Materials & Supplies">Materials & Supplies (511450)</option>
                      <option value="Medical and Hospitalization">Medical and Hospitalization (511208)</option>
                      <option value="Other Allowances">Other Allowances (511116)</option>
                      <option value="Other Communication Expenses">Other Communication Expenses (511553)</option>
                      <option value="Other Employee Benefits">Other Employee Benefits (511117)</option>
                      <option value="Other Insurance">Other Insurance (511355)</option>
                      <option value="Other Materials and Supplies">Other Materials and Supplies (511457)</option>
                      <option value="Overtime Pay Expense">Overtime Pay Expense (511103)</option>
                      <option value="Parking and Express Road Expense">Parking and Express Road Expense (511403)</option>
                      <option value="Pension Contribution 11%">Pension Contribution 11% (511110)</option>
                      <option value="Printed Materials">Printed Materials</option>
                      <option value="Responsibility and Acting Allowance">Responsibility and Acting Allowance (511106)</option>
                      <option value="Solid Waste Removal Services Expense">Solid Waste Removal Services Expense (511203)</option>
                      <option value="Sewage Line Cleaning Expense">Sewage Line Cleaning Expense (511201)</option>
                      <option value="Stationery and Office Supplies">Stationery and Office Supplies (511451)</option>
                      <option value="Telephone Allowance">Telephone Allowance (511108)</option>
                      <option value="Telephone, Fax, and Internet Expenses">Telephone, Fax, and Internet Expenses (511551)</option>
                      <option value="Transport Allowance">Transport Allowance (511105)</option>
                      <option value="Uniform">Uniform (511500-01)</option>
                      <option value="Uniform and Outfit Expense">Uniform and Outfit Expense (511501)</option>
                      <option value="Vehicle Inspection">Vehicle Inspection (511401)</option>
                      <option value="Vehicle Rent Expense">Vehicle Rent Expense (511302)</option>
                      <option value="Vehicle Running">Vehicle Running (511400-04)</option>
                      <option value="Workmen Compensation">Workmen Compensation (511112)</option>
                      <option value="Zero Liquid Discharge Operations and Management Expense">Zero Liquid Discharge Operations and Management Expense (511204)</option>
                    </>
                  )}
                  {newDetail.costType === "capital_project_budget" && (
                    <>
                      <option disabled className="group-header">capital_project_budget options</option>
                      <option value="Plant, Machinery and Equipment">Plant, Machinery and Equipment (122102)</option>
                      <option value="Office Furnitures, Equipment and Fixtures">Office Furnitures, Equipment and Fixtures (122103)</option>
                      <option value="ETP and STP Building and Structure">ETP and STP Building and Structure (122104)</option>
                      <option value="Power House">Power House (122105)</option>
                      <option value="ICT Equipments">ICT Equipments (122106)</option>
                      <option value="Vehicles and Vehicles Accessories">Vehicles and Vehicles Accessories (122107)</option>
                      <option value="Household Equipment">Household Equipment (122108)</option>
                      <option value="Laboratory Equipment">Laboratory Equipment (122109)</option>
                      <option value="Construction Equipment">Construction Equipment (122110)</option>
                      <option value="Bore Hole Station">Bore Hole Station (122111)</option>
                      <option value="Other Fixed Assets">Other Fixed Assets (122112)</option>
                      <option value="Property, Plant and Equipment - Clearing">Property, Plant and Equipment - Clearing (122113)</option>
                      <option value="Infrstructure Consultancy">Infrstructure Consultancy (122114)</option>
                      <option value="Right of use of Land (PPE)">Right of use of Land (PPE) (122115)</option>
                    </>
                  )}
                  <option disabled className="group-header">if NOT listed above, select "Other"</option>
                  <option value="other">Other</option>
                </select>
  
                {newDetail.costName === "other" && (
                  <div className="form-field">
                    <label htmlFor="CustomcostName" className="form-label">
                      አዲስ ወጪ ስም እንዲገቡ
                    </label>
                    <input
                      id="CustomcostName"
                      type="text"
                      name="CustomcostName"
                      placeholder="አዲስ ወጪ ስም ከዚህ ያስገቡ"
                      value={newDetail.CustomcostName}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                )}
  
                <div className="ci-fields">
                  <div className="form-field">
                    <label htmlFor="CIbaseline" className="form-label">Baseline</label>
                    <input
                      id="CIbaseline"
                      type="number"
                      name="CIbaseline"
                      value={newDetail.CIbaseline || ""}
                      onChange={(e) =>
                        setNewDetail((prev) => ({
                          ...prev,
                          CIbaseline: e.target.value,
                          xzx: e.target.value && newDetail.CIplan ? newDetail.CIplan - e.target.value : ""
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="CIplan" className="form-label">Plan</label>
                    <input
                      id="CIplan"
                      type="number"
                      name="CIplan"
                      value={newDetail.CIplan || ""}
                      onChange={(e) =>
                        setNewDetail((prev) => ({
                          ...prev,
                          CIplan: e.target.value,
                          xzx: newDetail.CIbaseline ? e.target.value - newDetail.CIbaseline : ""
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
  
        {newDetail.planType === "income" && (
          <div className="form-field-group">
            <div className="form-field">
              <label htmlFor="incomeExchange" className="form-label">
                ገቢ ምንዛሬ
              </label>
              <select
                id="incomeExchange"
                name="incomeExchange"
                value={newDetail.incomeExchange}
                onChange={handleIncomeExchangeChange}
                className="form-select"
              >
                <option value="">⬇️ Select Income Exchange</option>
                <option value="etb">በETB ምንዛሬ</option>
                <option value="usd">በUSD ምንዛሬ</option>
              </select>
            </div>
  
            {newDetail.incomeExchange && (
              <div className="form-field">
                <label htmlFor="incomeName" className="form-label">
                  ገቢ ስም
                </label>
                <select
                  id="incomeName"
                  name="incomeName"
                  value={newDetail.incomeType}
                  onChange={handleIncomeTypeChange}
                  className="form-select"
                >
                  <option value="">⬇️ Select Income Name</option>
                  <option value="ከህንጻ ኪራይ">ከህንጻ ኪራይ</option>
                  <option value="ከመሬት ንኡስ ሊዝ">ከመሬት ንዑስ ሊዝ</option>
                  <option value="other">Other</option>
                </select>
  
                {newDetail.incomeType === "other" && (
                  <div className="form-field">
                    <label htmlFor="incomeName" className="form-label">
                      አዲስ ገቢ ስም እንዲገቡ
                    </label>
                    <input
                      id="incomeName"
                      type="text"
                      name="incomeName"
                      placeholder="አዲስ ገቢ ስም ከዚህ ያስገቡ"
                      value={newDetail.incomeName}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                )}
  
                <div className="ci-fields">
                  <div className="form-field">
                    <label htmlFor="CIbaseline" className="form-label">Baseline</label>
                    <input
                      id="CIbaseline"
                      type="number"
                      name="CIbaseline"
                      value={newDetail.CIbaseline || ""}
                      onChange={(e) =>
                        setNewDetail((prev) => ({
                          ...prev,
                          CIbaseline: e.target.value,
                          xzx: e.target.value && newDetail.CIplan ? newDetail.CIplan - e.target.value : ""
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="CIplan" className="form-label">Plan</label>
                    <input
                      id="CIplan"
                      type="number"
                      name="CIplan"
                      value={newDetail.CIplan || ""}
                      onChange={(e) =>
                        setNewDetail((prev) => ({
                          ...prev,
                          CIplan: e.target.value,
                          xzx: newDetail.CIbaseline ? e.target.value - newDetail.CIbaseline : ""
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
  
        {newDetail.planType === "hr" && (
          <div className="form-field-group">
            <label htmlFor="employmentType" className="form-label">
              ሰራተኞች አይነት
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={newDetail.employmentType}
              onChange={handleEmploymentTypeChange}
              className="form-select"
            >
              <option value="">⬇️ Select Employment Type</option>
              <option value="full_time">ቋሚ</option>
              <option value="contract">ኮንትራት</option>
            </select>
            
            <div className="ci-fields">
              <div className="form-field">
                <label htmlFor="CIbaseline" className="form-label">Baseline</label>
                <input
                  id="CIbaseline"
                  type="number"
                  name="CIbaseline"
                  value={newDetail.CIbaseline || ""}
                  onChange={(e) =>
                    setNewDetail((prev) => ({
                      ...prev,
                      CIbaseline: e.target.value,
                      xzx: e.target.value && newDetail.CIplan ? newDetail.CIplan - e.target.value : ""
                    }))
                  }
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="CIplan" className="form-label">Plan</label>
                <input
                  id="CIplan"
                  type="number"
                  name="CIplan"
                  value={newDetail.CIplan || ""}
                  onChange={(e) =>
                    setNewDetail((prev) => ({
                      ...prev,
                      CIplan: e.target.value,
                      xzx: newDetail.CIbaseline ? e.target.value - newDetail.CIbaseline : ""
                    }))
                  }
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}
  
        {/* Common fields */}
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="name" className="form-label">
              የሚከናወን ተግባር
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="የሚከናወን ተግባር ከዚህ ያስገቡ"
              value={newDetail.name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
  
          <div className="form-field">
            <label htmlFor="measurement" className="form-label">
              መለኪያ
            </label>
            <select
              id="measurement"
              name="measurement"
              value={newDetail.measurement}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">⬇️ Select Measurement</option>
              <option value="present">Present</option>
              <option value="USD">USD</option>
              <option value="ETB">ETB</option>
              <option value="performance">Performance</option>
              <option value="number">Number</option>
            </select>
          </div>
  
          <div className="form-field">
            <label htmlFor="baseline" className="form-label">
              መነሻ
            </label>
            <input
              id="baseline"
              type="text"
              name="baseline"
              placeholder="መነሻ"
              value={newDetail.baseline}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
  
          <div className="form-field">
            <label htmlFor="plan" className="form-label">
              የታቀደው
            </label>
            <input
              id="plan"
              type="text"
              name="plan"
              placeholder="የታቀደው"
              value={newDetail.plan}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
  
          <div className="form-field">
            <label htmlFor="year" className="form-label">
              አመት የሚጀመርበት
            </label>
            <input
              id="year"
              type="number"
              name="year"
              placeholder="አመት የሚጀመርበት"
              value={newDetail.year}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
  
          <div className="form-field">
            <label htmlFor="month" className="form-label">
              ወር
            </label>
            <input
              id="month"
              type="number"
              name="month"
              placeholder="ወር"
              value={newDetail.month}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
  
          <div className="form-field">
            <label htmlFor="day" className="form-label">
              ቀን
            </label>
            <input
              id="day"
              type="number"
              name="day"
              placeholder="ቀን"
              value={newDetail.day}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
  
          <div className="form-field">
            <label htmlFor="deadline" className="form-label">
              ሥራው የሚፈጸምበት ጊዜ
            </label>
            <input
              id="deadline"
              type="date"
              name="deadline"
              placeholder="Deadline"
              value={newDetail.deadline}
              onChange={handleInputChange}
              className="form-input"
            />
            {deadlineYearError && (
              <div className="form-error">{deadlineYearError}</div>
            )}
          </div>
  
          <div className="form-field full-width">
            <label htmlFor="description" className="form-label">
              መግለጫ
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="መግለጫ"
              value={newDetail.description}
              onChange={handleInputChange}
              className="form-textarea"
            />
          </div>
        </div>
  
        <div className="form-button-group">
          <button
            type="button"
            onClick={handleCreateDetail}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? "እባኮትን ተጠባበቅ..." : "መዝግብ"}
          </button>
        </div>
      </form>
      <div className="form-button-group">
        <button
          onClick={onBack}
          className="btn btn-secondary"
        >
          ተመለስ
        </button>
        <button
          onClick={handleNext}
          disabled={specificObjectiveDetails.length === 0}
          className="btn btn-primary"
        >
          ቀጣይ እንዲሆን
        </button>
      </div>
      {error && <div className="form-error">{error}</div>}
      {successMessage && <div className="form-success">{successMessage}</div>}
    </div>
  );
};

export default Step4SpecificObjectiveDetails;