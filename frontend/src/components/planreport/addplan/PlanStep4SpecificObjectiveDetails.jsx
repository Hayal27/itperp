import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2 for popups
// import { Card } from '@/components/ui/card';

const PlanStep4SpecificObjectiveDetails = ({ specificObjectiveId, token, onBack, onNext }) => {
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
    planType: "",  // Plan Type
    costType: "",  // Cost Type
    incomeType: "", // Income Type
    incomeExchange: "", // Income Exchange (currency type)
    hrType: "", // HR Type
    employmentType: "", // Employment Type (full_time/contract)
    costName: "", // Cost Name
    incomeName: "", // Income Name
    CustomcostName: "",
    CIbaseline: "",
    CIplan: "",
    xzx: "",
    CItotalBaseline: 0,
    CItotalPlan: 0,
    CItotalExpectedOutcome: 0
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      [name]: name === "year" || name === "month" || name === "day" 
        ? Number(value)
        : value,
    }));
  };

  const handlePlanTypeChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      planType: value,
      costType: "",  // Reset associated options when plan type changes
      incomeType: "",
      hrType: "",
      costName: "", // Reset when changing plan type
      incomeName: "" // Reset when changing plan type
    }));
  };

  // Add new calculation functions
  const calculateExpectedOutcome = (baseline, plan) => {
    const baselineNum = parseFloat(baseline) || 0;
    const planNum = parseFloat(plan) || 0;
    return planNum - baselineNum;
  };

  // Add handlers for CI fields
  const handleCIInputChange = (e) => {
    const { name, value } = e.target;
    setNewDetail((prev) => {
      const newValues = { ...prev, [name]: value };
      
      // Calculate expected outcome whenever baseline or plan changes
      if (name === "CIbaseline" || name === "CIplan") {
        newValues.xzx = calculateExpectedOutcome(
          name === "CIbaseline" ? value : prev.CIbaseline,
          name === "CIplan" ? value : prev.CIplan
        );
      }
      return newValues;
    });
  };

  const handleCostNameChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      costName: value,
      // Only reset CustomcostName when switching away from "other"
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
      CustomcostName: value === "other" ? "" : value, // If "other", allow custom input; reset when changing cost type
    }));
  };

  const handleIncomeTypeChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      incomeType: value,
      incomeName: value === "other" ? "" : value, // If "other", allow custom input
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
      incomeType: "", // Reset incomeType when currency changes
      incomeName: "", // Reset incomeName
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
            cost_type: newDetail.costType || "default_cost",
            income_exchange: newDetail.incomeExchange || "none",
            employment_type: newDetail.employmentType || "unknown",
            costName: newDetail.costName === "other" 
              ? newDetail.CustomcostName 
              : newDetail.costName || "default_cost",
            incomeName: newDetail.incomeName || "default_income",
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
  
      // Extract the created detail ID from the response
      const createdDetailId = response.data?.id || response.data?.insertIds?.[0];
  
      if (!createdDetailId) {
        console.error("Server response does not contain a valid ID:", response.data);
        Swal.fire("Error", "The server did not return a valid ID. Please check the server logs.", "error");
        return;
      }
  
      // Update state with the new detail
      setSpecificObjectiveDetails((prevDetails) => [
        ...prevDetails,
        { ...newDetail, id: createdDetailId },
      ]);
  
      Swal.fire("Success", "Detail created successfully!", "success");
  
      // Reset form fields
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
      // Pass the entire array of details to the parent component
      onNext(specificObjectiveDetails);
    } else {
      setError("Please add at least one detail before proceeding.");
    }
  };

  return (
    <div className="bg-transparent p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-center mb-6">አዲስ የውጤቶ ተግባር ዝርዝር ይመዝግቡ</h3>
  
      {/* Form to create a new detail */}
      <form className="space-y-4">
        {/* Plan Type Select */}
        <div>
          <label htmlFor="planType" className="block text-sm font-semibold mb-2">የተግባሩ አይነት</label>
          <select
            id="planType"
            name="planType"
            value={newDetail.planType}
            onChange={handlePlanTypeChange}
            className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">⬇️ Select plan Type</option>
            <option value="cost">ወጪ</option>
            <option value="income">ገቢ</option>
            <option value="hr">ሰራተኞች</option>
          </select>
        </div>
  
        {/* Conditional Fields for Cost Type, Income Type, and Employment Type */}
        {newDetail.planType === "cost" && (
          <div>
            <label htmlFor="costType" className="block text-sm font-semibold mb-2">
              ወጪ አይነት
            </label>
            <select
              id="costType"
              name="costType"
              value={newDetail.costType}
              onChange={handleCostTypeChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">⬇️ Select Cost Type</option>
              <option value="regular_budget">መደበኛ ወጪ</option>
              <option value="capital_project_budget">ካፒታል ፕሮጀክት ወጪ</option>
            </select>
          </div>
        )}
  
        {newDetail.planType === "cost" && newDetail.costType && (
          <div>
            <label htmlFor="costName" className="block text-sm font-semibold mb-2">
              ወጪ ስም
            </label>
            <select
              id="costName"
              name="costName"
              value={newDetail.costName}
              onChange={handleCostNameChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">⬇️ Select Cost Name</option>
              {newDetail.costType === "regular_budget" && (
                <>
                  <option disabled style={{ fontWeight: "bold", backgroundColor: "yellow" }}>
                    regular_budget options
                  </option>
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
                  <option value="Printed Materials">Printed Materials (511452)</option>
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
                  <option disabled style={{ fontWeight: "bold", backgroundColor: "yellow" }}>
                    capital_project_budget options
                  </option>
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
              <option disabled style={{ fontWeight: "bold", backgroundColor: "yellow" }}>
                if NOT listed above, select "Other"
              </option>
              <option value="other">Other</option>
            </select>

            {/* Conditionally render input for custom cost name */}
            {newDetail.costName === "other" && (
              <div className="mt-2">
                <label htmlFor="CustomcostName" className="block text-sm font-semibold mb-2">
                  አዲስ ወጪ ስም እንዲገቡ
                </label>
                <input
                  id="CustomcostName"
                  type="text"
                  name="CustomcostName" // Make sure this matches the state property name
                  placeholder="አዲስ ወጪ ስም ከዚህ ያስገቡ"
                  value={newDetail.CustomcostName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            {/* New Inputs for CIBaseline, CIPlan, and CIExpected Outcome */}
            <div className="mt-4">
              <label htmlFor="CIbaseline" className="block text-sm font-semibold mb-2">
                Baseline
              </label>
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
                className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="CIplan" className="block text-sm font-semibold mb-2">
                Plan
              </label>
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
                className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        {/* Income Type Select */}
        {newDetail.planType === "income" && (
          <div>
            <label htmlFor="incomeExchange" className="block text-sm font-semibold mb-2">
              ገቢ ምንዛሬ
            </label>
            <select
              id="incomeExchange"
              name="incomeExchange"
              value={newDetail.incomeExchange}
              onChange={handleIncomeExchangeChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">⬇️ Select Income Exchange</option>
              <option value="etb">በETB ምንዛሬ</option>
              <option value="usd">በUSD ምንዛሬ</option>
            </select>
          </div>
        )}

        {newDetail.planType === "income" && newDetail.incomeExchange && (
          <div>
            <label htmlFor="incomeName" className="block text-sm font-semibold mb-2">
              ገቢ ስም
            </label>
            <select
              id="incomeName"
              name="incomeName"
              value={newDetail.incomeType}
              onChange={handleIncomeTypeChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">⬇️ Select Income Name</option>
              <option value="ከህንጻ ኪራይ">ከህንጻ ኪራይ</option>
              <option value="ከመሬት ንኡስ ሊዝ">ከመሬት ንዑስ ሊዝ</option>
              <option value="other">Other</option>
            </select>

            {newDetail.incomeType === "other" && (
              <div className="mt-2">
                <label htmlFor="incomeName" className="block text-sm font-semibold mb-2">
                  አዲስ ገቢ ስም እንዲገቡ
                </label>
                <input
                  id="incomeName"
                  type="text"
                  name="incomeName"
                  placeholder="አዲስ ገቢ ስም ከዚህ ያስገቡ"
                  value={newDetail.incomeName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}

            {/* New Inputs for CIBaseline, CIPlan, and CIExpected Outcome */}
            <div className="mt-4">
              <label htmlFor="CIbaseline" className="block text-sm font-semibold mb-2">
                Baseline
              </label>
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
                className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="CIplan" className="block text-sm font-semibold mb-2">
                Plan
              </label>
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
                className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}

        {newDetail.planType === "hr" && (
          <div>
            <label htmlFor="employmentType" className="block text-sm font-semibold mb-2">ሰራተኞች አይነት</label>
            <select
              id="employmentType"
              name="employmentType"
              value={newDetail.employmentType}
              onChange={handleEmploymentTypeChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">⬇️ Select Employment Type</option>
              <option value="full_time">ቋሚ</option>
              <option value="contract">ኮንትራት</option>
            </select>
            
            {/* New Inputs for CIBaseline, CIPlan, and CIExpected Outcome */}
            <div className="mt-4">
              <label htmlFor="CIbaseline" className="block text-sm font-semibold mb-2">
                Baseline
              </label>
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
                className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="CIplan" className="block text-sm font-semibold mb-2">
                Plan
              </label>
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
                className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        )}
  
        {/* Common fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Common input fields */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2">የሚከናወን ተግባር</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="የሚከናወን ተግባር ከዚህ ያስገቡ"
              value={newDetail.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
  
          <div>
            <label htmlFor="measurement" className="block text-sm font-semibold mb-2">
              መለኪያ
            </label>
            <select
              id="measurement"
              name="measurement"
              value={newDetail.measurement}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">⬇️ Select Measurement</option>
              <option value="present">Present</option>
              <option value="USD">USD</option>
              <option value="ETB">ETB</option>
              <option value="performance">Performance</option>
              <option value="number">number</option>
            </select>
          </div>
  
          <div>
            <label htmlFor="baseline" className="block text-sm font-semibold mb-2">መነሻ</label>
            <input
              id="baseline"
              type="text"
              name="baseline"
              placeholder="መነሻ"
              value={newDetail.baseline}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
  
          <div>
            <label htmlFor="plan" className="block text-sm font-semibold mb-2">የታቀደው</label>
            <input
              id="plan"
              type="text"
              name="plan"
              placeholder="የታቀደው"
              value={newDetail.plan}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
  
          <div>
            <label htmlFor="year" className="block text-sm font-semibold mb-2">አመት የሚጀመርበት</label>
            <input
              id="year"
              type="number"
              name="year"
              placeholder="አመት የሚጀመርበት"
              value={newDetail.year}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
  
          <div>
            <label htmlFor="month" className="block text-sm font-semibold mb-2">ወር</label>
            <input
              id="month"
              type="number"
              name="month"
              placeholder="ወር"
              value={newDetail.month}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
  
          <div>
            <label htmlFor="day" className="block text-sm font-semibold mb-2">ቀን</label>
            <input
              id="day"
              type="number"
              name="day"
              placeholder="ቀን"
              value={newDetail.day}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
  
          <div>
            <label htmlFor="deadline" className="block text-sm font-semibold mb-2">ሥራው የሚፈጸምበት ጊዜ</label>
            <input
              id="deadline"
              type="date"
              name="deadline"
              placeholder="Deadline"
              value={newDetail.deadline}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
  
          <div>
            <label htmlFor="description" className="block text-sm font-semibold mb-2">መግለጫ</label>
            <textarea
              id="description"
              name="description"
              placeholder="መግለጫ"
              value={newDetail.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleCreateDetail}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-b from-[#2a3753] to-[#0C5C8A] text-white font-semibold rounded-md shadow-md hover:bg-[#005b8c]"
          >
            {isLoading ? "እባኮትን ተጠባበቅ..." : "መዝግብ"}
          </button>
        </div>
      </form>
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-[#e2e2e2] text-[#0C5C8A] font-semibold rounded-md shadow-md hover:bg-[#005b8c]"
        >
          ተመለስ
        </button>
        <button
          onClick={handleNext}
          disabled={specificObjectiveDetails.length === 0}
          className="px-6 py-2 bg-gradient-to-b from-[#2a3753] to-[#0C5C8A] text-white font-semibold rounded-md shadow-md hover:bg-[#005b8c]"
        >
          ቀጣይ እንዲሆን
        </button>
      </div>
      {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
      {successMessage && <div className="mt-4 text-green-500 text-sm">{successMessage}</div>}
    </div>
  );
};

export default PlanStep4SpecificObjectiveDetails;