import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2 for popups

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
    planType: "",  // Plan Type
    costType: "",  // Cost Type
    incomeType: "", // Income Type
    incomeExchange: "", // Income Exchange (currency type)
    hrType: "", // HR Type
    employmentType: "", // Employment Type (full_time/contract)
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
        ? Number(value) // Ensure numbers are sent for numeric fields
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
    }));
  };

  const handleCostTypeChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      costType: value,
    }));
  };

  const handleIncomeTypeChange = (e) => {
    const { value } = e.target;
    setNewDetail((prevDetail) => ({
      ...prevDetail,
      incomeType: value,
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
    console.log("Payload:", {
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
          plan_type: newDetail.planType,
          cost_type: newDetail.costType,
          income_exchange: newDetail.incomeExchange,
          employment_type: newDetail.employmentType,
        },
      ],
    });

    const response = await axios.post(
      "http://localhost:5000/api/addspecificObjectiveDetail",
      {
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
            plan_type: newDetail.planType,
            cost_type: newDetail.costType,
            income_exchange: newDetail.incomeExchange,
            employment_type: newDetail.employmentType,
          },
        ],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Assuming the server responds with the created detail's ID
    const createdDetailId = response.data?.createdDetailId;

    console.log("Created detail ID:", createdDetailId);

    // Now, you can update your details array with the new detail including the ID
    setSpecificObjectiveDetails((prevDetails) => [
      ...prevDetails,
      { ...newDetail, id: createdDetailId }, // Include the created ID
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
      setError("");
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
            <label htmlFor="costType" className="block text-sm font-semibold mb-2">እቃ ወጪ አይነት</label>
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
  
        {newDetail.planType === "income" && (
          <div>
            <label htmlFor="incomeExchange" className="block text-sm font-semibold mb-2">ገቢ ምንዛሬ</label>
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
              <option value="full_time">ቀጣዩ</option>
              <option value="contract">በመንገዱ</option>
            </select>
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
    <option value="" >
    ⬇️ Select Measurement
    </option>
    <option value="present">Present</option>
    <option value="USD">USD</option>
    <option value="ETB">ETB</option>
    <option value="performance">Performance</option>
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

export default Step4SpecificObjectiveDetails;


 











import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 for popups

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
    priority: "አስፈላጊ",
    deadline: "",
  });
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
      [name]: name === "year" || name === "month" || name === "day" || name === "priority"
        ? Number(value) // Ensure numbers are sent for numeric fields
        : value,
    }));
  };

  const handleCreateDetail = async () => {
    if (!specificObjectiveId) {
      setError("A specific objective ID is required to create a detail.");
      return;
    }
  
    // Validate required fields
    const requiredFields = [
      "name", "description", "baseline", "plan", "measurement", "year", "month", "day", "priority", "deadline"
    ];
  
    for (const field of requiredFields) {
      if (!newDetail[field]?.toString().trim()) {
        setError(`Field "${field}" is required.`);
        return;
      }
    }
  
    // Validate that the deadline is later than the year
    const startYear = newDetail.year;
    const startMonth = newDetail.month - 1; // JS months are 0-indexed
    const startDay = newDetail.day;
  
    // Create a Date object for the start date
    const startDate = new Date(startYear, startMonth, startDay);
  
    // Get the deadline date
    const deadlineDate = new Date(newDetail.deadline);
  
    // Compare the two dates
    if (deadlineDate <= startDate) {
      setError("The deadline must be later than the start date.");
      return;
    }
  
    try {
      setIsLoading(true); // Indicate loading state
  
      // API request to create the new detail
      const response = await axios.post(
        "http://localhost:5000/api/addspecificObjectiveDetail",
        {
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
              priority: newDetail.priority.toString(),
              deadline: newDetail.deadline,
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const createdDetail = response.data;
      console.log("Created detail response:", createdDetail);
  
      const createdDetailId = createdDetail.insertIds?.[0];
      if (!createdDetailId) {
        throw new Error("Failed to retrieve the ID of the created detail.");
      }
  
      // Add the new detail to the list of details
      setSpecificObjectiveDetails((prevDetails) => [
        ...prevDetails,
        { ...newDetail, id: createdDetailId },
      ]);
  
      // Clear the form for new entries
      setNewDetail({
        name: "",
        description: "",
        baseline: "",
        plan: "",
        measurement: "",
        year: "",
        month: "",
        day: "",
        priority: "",
        deadline: "",
      });
  
      // Show success popup
      Swal.fire({
        title: "Specific Objective Detail Created",
        text: "Your new specific objective detail has been successfully created!",
        icon: "success",
        confirmButtonText: "OK",
      });
  
      setError(null); // Clear previous error
    } catch (err) {
      console.error("Error creating detail:", err);
      setError(err.response?.data?.message || "Failed to create specific objective detail.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };
  

  const handleNext = () => {
    console.log("Navigating to the next step with all details:", specificObjectiveDetails);

    if (specificObjectiveDetails.length > 0) {
      // Pass the entire array of details to the parent component
      onNext(specificObjectiveDetails);
    } else {
      setError("");
    }
  };

  return (
    <div className="bg-transparent p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-center mb-6">አዲስ የውጤቶ ተግባር ዝርዝር ይመዝግቡ</h3>

      {/* Form to create a new detail */}
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label htmlFor="measurement" className="block text-sm font-semibold mb-2">መለኪያ </label>
            <input
              id="measurement"
              type="text"
              name="measurement"
              placeholder="መለኪያ"
              value={newDetail.measurement}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md text-black bg-transparent focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
            <label htmlFor="priority" className="block text-sm font-semibold mb-2">Priority</label>
            <input
              id="priority"
              type="text"
              name="priority"
              placeholder="Priority"
              value={newDetail.priority}
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

        <div className="flex justify-between mt-6">
        

          <button
            type="button"
            onClick={handleCreateDetail}
            disabled={isLoading}
            className="px-6 py-2 bg-gradient-to-b from-[#2a3753] to-[#0C7C92] text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
          >
            {isLoading ? "Loading..." : "Create Detail"}
          </button>
        </div>
      </form>

      {successMessage && <p className="text-success mt-3">{successMessage}</p>}
      {error && <p className="text-danger mt-3">{error}</p>}

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 bg-gradient-to-b from-[#2a3753] to-[#0C7C92] text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 bg-gradient-to-b from-[#0C7C92] to-[#2a3753] text-white font-semibold rounded-lg shadow hover:opacity-90 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step4SpecificObjectiveDetails;
