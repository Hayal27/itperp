import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';

const TeamleaderAddReport = () => {
  const { planId } = useParams();  // Get planId from the URL parameters
  const navigate = useNavigate();

  const [reportData, setReportData] = useState({
    Objective: "",
    Goal: "",
    Specific_Objective_Name: "",
    Specific_Objective_Detail: "",
    Measurement: "",
    Baseline: "",
    Plan: "",
    outcome: "", // This will be filled based on a calculation
    execution_percentage: "",
    Description: "",
    Year: "",
    Quarter: "", // Default value
    Progress: "", // Default value




    
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility
  const [popupType, setPopupType] = useState(''); // Type of the popup (success or error)
  const [showPreview, setShowPreview] = useState(false);
  const token = localStorage.getItem("token");

  // Log to check if planId is retrieved correctly
  console.log("Received planId:", planId);

  // Fetch plan data based on the planId
  useEffect(() => {
    if (!planId) return; // If planId is not available, do nothing
    
    const fetchPlanData = async () => {
      try {
        const response = await Axios.get(`http://localhost:5000/api/pland/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const plan = response.data.plan;
          // Pre-fill the report fields with plan data
          setReportData({
            Goal: response.data.plan.Goal_Name || "",
            Objective: response.data.plan.Objective_Name || "",
            Specific_Objective_Name: response.data.plan.Specific_Objective_Name || "",
            Specific_Objective_Detail: response.data.plan.Specific_Objective_Detail || "",
            Measurement: response.data.plan.Measurement || "",
            Baseline: response.data.plan.Baseline || "",
            Plan: response.data.plan.Plan || "",
            outcome: calculateOutcome(response.data.plan),
            execution_percentage: "",
            Description: response.data.plan.Description || "",
            Year: response.data.plan.Year || "",
            Quarter: response.data.plan.Quarter || "",
            Progress: response.data.plan.Progress || "",
          });
          
        } else {
          setResponseMessage("Failed to fetch plan data.");
        }
      } catch (error) {
        console.error(error);
        setResponseMessage("An error occurred while fetching the plan data.");
      }
    };

    fetchPlanData();
  }, [planId, token]);

  // Function to calculate the outcome (if required)
  const calculateOutcome = (plan) => {
    // Example outcome calculation (this logic can be customized)
    
  };

  // Function to calculate execution percentage based on baseline, plan, and outcome

  const calculateExecutionPercentage = () => {
    const baseline = parseFloat(reportData.Baseline);
    const plan = parseFloat(reportData.Plan);
    const outcome = parseFloat(reportData.outcome);
  
    // Handle invalid or missing values
    if (isNaN(baseline) || isNaN(plan) || isNaN(outcome)) {
      setReportData((prevData) => ({ ...prevData, execution_percentage: "" }));
      return;
    }
  
    // Calculate the theoretical maximum outcome (baseline + plan)
    const theoreticalMax = baseline + plan;
  
    // Calculate execution percentage based on outcome relative to baseline and theoretical max
    let executionPercentage;
    if (outcome >= baseline) {
      executionPercentage = ((outcome - baseline) / (theoreticalMax - baseline)) * 100;
    } else {
      executionPercentage = ((outcome - baseline) / baseline) * 100;
    }
  
    // Round to two decimal places and update the state
    setReportData((prevData) => ({
      ...prevData,
      execution_percentage: `${executionPercentage.toFixed(2)}%`,
    }));
  };
  


  useEffect(() => {
    // Recalculate execution percentage when baseline, plan, or outcome changes
    calculateExecutionPercentage();
  }, [reportData.Baseline, reportData.Plan, reportData.outcome]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!token) {
      setResponseMessage("You must be logged in to add a report.");
      return;
    }
  
    try {
      setLoading(true);
  
      // Log the planId and the report data before submitting
      console.log("Submitting report data:", { ...reportData, planId });
  
      // Include planId in the payload
      const payload = { ...reportData, planId };
  
      // Log the payload being sent to the backend
      console.log("Payload being sent:", payload);
  
      const response = await Axios.post(
        `http://localhost:5000/api/reportadd/${planId}`,  // Fixed URL format
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Log the response from the backend for better debugging
      console.log("Backend response:", response);
  
      if (response.data.success) {
        setResponseMessage(`ሪፖርቶ ተመዝግበዋል 📝👏`);
        setPopupType('success');
      } else {
        setResponseMessage(`ሪፖርቶ ተመዝግበዋል 📝👏`);
        setPopupType('success');
      }
    } catch (error) {
      console.error("Error adding report:", error);
      setResponseMessage('🤦‍♂️ሂደቱ ተደናቅፏል! ቅጹን ይሙሉ');
      // Detailed error handling
      if (error.response) {
        // Backend responded with a status code other than 2xx
        console.error("Backend error response:", error.response.data);
        setResponseMessage(
          `Error: ${error.response.data.message || "Something went wrong."}`
        );
      } else if (error.request) {
        // Request was made but no response was received
        console.error("No response received from backend:", error.request);
        setResponseMessage("Error: No response from the server. Please try again later.");
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        setResponseMessage(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };



  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
  };


  return (
    <main className="form-container-10">
      <div className="pagetitle">
        <h1>ሪፖርት ማድረጊያ ቅጽ</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="">
              <a href="/teamleader">Teamleader</a>
            </li>
            <li className="">
              <a href="/teamleader/view-plan">Plan Management</a>
            </li>
            <li className="">Add Report</li>
          </ol>
        </nav>
      </div>
  
      <section>
        <div>
          <div className="">
            <div className="">
              
              
              <div className="card-body">
                <h5 className="card-title">Report Details</h5>
  
                {responseMessage && (
                  <div
                    className={`alert ${
                      responseMessage.includes("success")
                        ? "alert-success"
                        : "alert-danger"
                    }`}
                  >
                    {responseMessage}
                  </div>
                )}
  
                <form onSubmit={handleSubmit}>
                
                  <div className="">
                    <label htmlFor="goal" className="">
                      Goal
                    </label>
                    <input
                      type="text"
                      id="goal"
                      name="Goal_Name"
                      value={reportData.Goal}
                      onChange={handleChange}
                      className=""
                      required
                      readOnly
                    />


                  </div>
                  <div>
                    <label htmlFor="Objective">Objective</label>
                    <input
                      type="text"
                      id="objective"
                      name="objective"
                      value={reportData.Objective}
                      onChange={handleChange}
                      className=""
                      required
                      readOnly
                    />
                  </div>


                  <div>
                    <label htmlFor="Objective">ውጤት</label>
                    <input
                      type="text"
                      id="objective"
                      name="objective"
                      value={reportData.Specific_Objective_Name}
                      onChange={handleChange}
                      className=""
                      required
                      readOnly
                    />
                  </div>



                  <div>
                    <label htmlFor="Objective">የ ውጤቱ ዝርዝር ተግባር</label>
                    <input
                      type="text"
                      id="objective"
                      name="objective"
                      value={reportData.Specific_Objective_Detail}
                      onChange={handleChange}
                      className=""
                      required
                      readOnly
                    />
                  </div>

               
  
                  <div className="">
                    <label htmlFor="measurement" className="">
                      Measurement
                    </label>
                    <input
                      type="text"
                      id="measurement"
                      name="measurement"
                      value={reportData.Measurement}
                      onChange={handleChange}
                      className=""
                      required
                    />
                  </div>
  
                  <div className="">
                    <label htmlFor="baseline" className="">
                      Baseline
                    </label>
                    <input
                      type="text"
                      id="baseline"
                      name="baseline"
                      value={reportData.Baseline}
                      onChange={handleChange}
                      className=""
                    />
                  </div>
  
                  <div className="">
                    <label htmlFor="plan" className="">
                      Plan
                    </label>
                    <input
                      type="text"
                      id="plan"
                      name="plan"
                      value={reportData.Plan}
                      onChange={handleChange}
                      className=""
                      readOnly
                    />
                  </div>
  
                  <div className="">
                    <label htmlFor="outcome" className="">
                      Outcome
                    </label>
                    <input
                      type="text"
                      id="outcome"
                      name="outcome"
                      value={reportData.outcome}
                      onChange={handleChange}
                      className=""
                      required
                    />
                  </div>
  
                  <div className="">
                    <label htmlFor="execution_percentage" className="">
                      Execution Percentage
                    </label>
                    <input
                      type="text"
                      id="execution_percentage"
                      name="execution_percentage"
                      value={reportData.execution_percentage}
                      onChange={handleChange}
                      className=""
                      required
                      readOnly
                    />
                  </div>
  
                  <div className="">
                    <label htmlFor="description" className="">
                      Description
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="Description"
                      value={reportData.Description}
                      onChange={handleChange}
                      className=""
                      required
                    />
                  </div>
  
                  <div className="">
                    <label htmlFor="progress" className="">
                      Progress
                    </label>
                    <select
                      id="progress"
                      name="progress"
                      value={reportData.Progress}
                      onChange={handleChange}
                      className=""
                    >
                      <option value="planned">Planned</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
  
                  <div className="">
                    <label htmlFor="year" className="">
                      Year
                    </label>
                    <input
                      type="text"
                      id="year"
                      name="year"
                      value={reportData.year}
                      onChange={handleChange}
                      className=""
                      required
                      readOnly
                    />
                  </div>
  
                  <div className="">
                    <label htmlFor="quarter" className="">
                      Quarter
                    </label>
                    <select
                      id="quarter"
                      name="quarter"
                      value={reportData.quarter}
                      onChange={handleChange}
                      className=""
                      readOnly
                    >
                      <option value="Q1">Q1</option>
                      <option value="Q2">Q2</option>
                      <option value="Q3">Q3</option>
                      <option value="Q4">Q4</option>
                    </select>
                  </div>
  
          
  
                  <button type="button" onClick={togglePreview}>
                    ክለሳ
                  </button>
                 
                  <button type="submit" className="">
                  ይመዝግቡ
                  </button>
                </form>
      
                {showPreview && (
  <div className="preview-container">
    <h3>ክለሳ</h3>
    <p><strong>ግብ:</strong> {reportData.Objective}</p>
    <p><strong>ዓላማ:</strong> {reportData.Goal}</p>
    <p><strong>ተ ቁ:</strong> {reportData.row_no}</p>
    <p><strong>ዝርዝር:</strong> {reportData.details}</p>
    <p><strong>ማሳኪያ:</strong> {reportData.Measurement}</p>
    <p><strong>መነሻ:</strong> {reportData.Baseline}</p>
    <p><strong>እቅድ:</strong> {reportData.Plan}</p>
    <p><strong>ውጤት:</strong> {reportData.outcome}</p>
    <p><strong>ፐርሰንት:</strong> {reportData.execution_percentage}</p>
    <p><strong>መግለጫ:</strong> {reportData.Description}</p>
    <p><strong>አመት:</strong> {reportData.Year}</p>
    <p><strong>ሩብ አመት:</strong> {reportData.Quarter}</p>
    <button onClick={togglePreview}>ክለሳውን ይዝጉት</button>
  </div>
)}

  
                {showPopup && (
                  <div className={`popup ${popupType}`}>
                    <div className="popup-content">
                      {popupType === 'success' ? (
                        <img
                          src={happy} // Use imported happy GIF
                          alt="Clapping Hands"
                          className="emoji"
                          style={{ width: '100px', height: '100px' }}
                        />
                      ) : (
                        <img
                          src={sad} // Use imported sad GIF
                          alt="Sad Face"
                          className="emoji"
                          style={{ width: '100px', height: '100px' }}
                        />
                      )}
                      <p>{responseMessage}</p>
                      <button onClick={closePopup}>ይዝጉት</button>
                    </div>
                  </div>
                )}
              </div>




              
            </div>
          </div>
        </div>
      </section>
    </main>
  );
  
};

export default TeamleaderAddReport;
