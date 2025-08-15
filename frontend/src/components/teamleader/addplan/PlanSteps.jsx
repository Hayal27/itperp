import React, { useState } from "react";
import axios from "axios";
import Step1Goal from "./Step1Goal"; // Goal selection step
import Step2Objective from "./Step2Objective"; // Objective selection step
import Step3SpecificObjective from "./Step3SpecificObjective"; // Specific objective selection
import Step4SpecificObjectiveDetails from "./Step4SpecificObjectiveDetails"; // Specific objective details
import Step5Review from "./Step5Review"; // Review and submission step
import "./PlanSteps.css"; // Professional styling
import Swal from "sweetalert2"; // SweetAlert2 for popups

const PlanSteps = () => {
  const [step, setStep] = useState(1); // Current step in the process
  const [goal, setGoal] = useState(null); // Holds selected goal
  const [objective, setObjective] = useState(null); // Holds selected objective
  const [specificObjective, setSpecificObjective] = useState(null); // Holds selected specific objective
  const [specificObjectiveDetails, setSpecificObjectiveDetails] = useState(null); // Holds selected specific objective details
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [successMessage, setSuccessMessage] = useState(""); // Success message after submission
  const token = localStorage.getItem("token"); // Get token from local storage

  // Handle moving to the next step
  const goToNextStep = () => setStep((prev) => prev + 1);

  // Handle moving to the previous step
  const goToPreviousStep = () => setStep((prev) => (prev > 1 ? prev - 1 : 1));

  // Handle goal selection in Step 1
  const handleGoalSelect = (selectedGoal) => {
    if (selectedGoal?.goal_id) {
      setGoal(selectedGoal);
      setError(null); // Clear any previous error
      goToNextStep();
    } else {
      setError("Goal is missing. Please select a goal.");
    }
  };

  // Handle objective selection in Step 2
  const handleObjectiveSelect = (selectedObjective) => {
    if (selectedObjective?.id) {
      setObjective(selectedObjective);
      setError(null); // Clear any previous error
      goToNextStep();
    } else {
      setError("Invalid objective. Please select a valid objective.");
    }
  };

  // Handle specific objective selection in Step 3
  const handleSpecificObjectiveSelect = (specificObjective) => {
    console.log("Selected Specific Objective:", specificObjective);
    setSpecificObjective(specificObjective);
    console.log("Updated Specific Objective State:", specificObjective); // Log after setting state
    goToNextStep();
  };
  
  const handleSpecificObjectiveDetailsSelect = (details) => {
    console.log("Selected Specific Objective Details:", details);
    setSpecificObjectiveDetails(details);
    console.log("Updated Specific Objective Details State:", details); // Log after setting state
    goToNextStep();
  };
  

  // Handle form submission (Step 5)
  const handleFormSubmit = async () => {
    console.log("Submitting plan with the following details:");
    console.log("goal_id:", goal?.goal_id);
    console.log("objective_id:", objective?.id);
    console.log("specificObjective_id:", specificObjective?.specific_objective_id);
    console.log("specificObjectiveDetails:", specificObjectiveDetails); // Log the full details array
  
    try {
      setIsLoading(true);
  
      // Check required fields
      if (
        !goal?.goal_id ||
        !objective?.id ||
        !specificObjective?.specific_objective_id ||
        !specificObjectiveDetails?.length // Ensure details array is not empty
      ) {
        throw new Error("Missing required fields for submission.");
      }
  
      // Prepare payload
      const payload = {
        goal_id: goal.goal_id,
        objective_id: objective.id,
        specific_objective_id: specificObjective.specific_objective_id,
        specific_objective_details_id: specificObjectiveDetails.map((detail) => detail.id), // Include all IDs
      };
  
      console.log("Payload for submission:", payload); // Debugging payload
  
      const response = await axios.post("http://localhost:5000/api/addplan", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Show success popup
      Swal.fire({
        title: "እቅድ መመዝገቢያ!",
        text: " እቅዶ በተሳካ ሁኔታ ተመዝግቧል.",
        icon: "success",
        confirmButtonText: "OK",
      });
  
      setSuccessMessage("እቅዱ ስለተመዝገበ ወደ ሁዋል መመለስ አልያም መውጣት ይችላሉ!");
      setStep(5); // Move to review step
    } catch (err) {
      console.error("Error during submission:", err); // Log full error
  
      // Show error popup
      Swal.fire({
        title: "Submission Error",
        text: err.response?.data?.message || "An error occurred while submitting the form.",
        icon: "error",
        confirmButtonText: "OK",
      });
  
      setError(err.response?.data?.message || "An error occurred while submitting the form.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions for professional UI
  const getStepLabel = (stepNumber) => {
    const labels = {
      1: "Goal Selection",
      2: "Objective",
      3: "Specific Objective",
      4: "Details",
      5: "Review & Submit"
    };
    return labels[stepNumber];
  };

  const getStepIcon = (stepNumber) => {
    const icons = {
      1: "bi-bullseye",
      2: "bi-target",
      3: "bi-list-check",
      4: "bi-file-text",
      5: "bi-check-circle"
    };
    return icons[stepNumber];
  };

  const getStepTitle = (stepNumber) => {
    const titles = {
      1: "Select Your Goal",
      2: "Choose Objective",
      3: "Define Specific Objective",
      4: "Add Objective Details",
      5: "Review and Submit Plan"
    };
    return titles[stepNumber];
  };

  const getStepDescription = (stepNumber) => {
    const descriptions = {
      1: "Choose the primary goal for your plan from available options",
      2: "Select the objective that aligns with your chosen goal",
      3: "Pick a specific objective to focus your planning efforts",
      4: "Provide detailed information for your specific objective",
      5: "Review all your selections and submit the complete plan"
    };
    return descriptions[stepNumber];
  };

  // Render the correct step component
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1Goal
            onNext={handleGoalSelect}
            error={error}
            loading={isLoading}
          />
        );
      case 2:
        return (
          <Step2Objective
            goalId={goal?.goal_id}
            onNext={handleObjectiveSelect}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <Step3SpecificObjective
            objectiveId={objective?.id}
            token={token}
            onBack={goToPreviousStep}
            onNext={handleSpecificObjectiveSelect}
          />
        );
      case 4:
        return (
          <Step4SpecificObjectiveDetails
            specificObjectiveId={specificObjective?.specific_objective_id}
            token={token}
            onBack={goToPreviousStep}
            onNext={handleSpecificObjectiveDetailsSelect}
          />
        );
      case 5:
        return (
          <Step5Review
            goal={goal}
            objective={objective}
            specificObjective={specificObjective}
            specificObjectiveDetails={specificObjectiveDetails}
            onBack={goToPreviousStep}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            error={error}
            successMessage={successMessage}
          />
        );
      default:
        return <div className="done">Plan successfully submitted! 📝👍</div>;
    }
  };

  return (
    <main className="admin-main-content">
      <div className="plan-steps-container">
        {/* Professional Header */}
        <div className="plan-steps-header">
          <div className="header-content">
            <div className="page-title">
              <h1 className="main-title">
                <i className="bi bi-clipboard-check me-3"></i>
                እቅድ ማስተዳደሪያ
              </h1>
              <p className="subtitle">Professional Plan Management System</p>
            </div>
            <div className="header-actions">
              <div className="step-indicator">
                <span className="current-step">Step {step}</span>
                <span className="total-steps">of 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Progress Bar */}
        <div className="progress-section">
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(step / 5) * 100}%` }}
              ></div>
            </div>
            <div className="progress-steps">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`progress-step ${step >= stepNumber ? 'completed' : ''} ${step === stepNumber ? 'active' : ''}`}
                >
                  <div className="step-circle">
                    {step > stepNumber ? (
                      <i className="bi bi-check-lg"></i>
                    ) : (
                      <span>{stepNumber}</span>
                    )}
                  </div>
                  <div className="step-label">
                    {getStepLabel(stepNumber)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Professional Content Area */}
        <div className="plan-steps-content">
          <div className="content-card">
            <div className="card-header">
              <h3 className="card-title">
                <i className={`bi ${getStepIcon(step)} me-2`}></i>
                {getStepTitle(step)}
              </h3>
              <div className="card-subtitle">
                {getStepDescription(step)}
              </div>
            </div>
            <div className="card-body">
              {renderStepContent()}
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="plan-steps-footer">
          <div className="footer-content">
            <div className="footer-info">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Complete all steps to submit your plan
              </small>
            </div>
            <div className="footer-actions">
              {step > 1 && (
                <button
                  className="btn btn-outline-secondary me-2"
                  onClick={goToPreviousStep}
                  disabled={isLoading}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Previous
                </button>
              )}
              {step < 5 && (
                <button
                  className="btn btn-primary"
                  onClick={goToNextStep}
                  disabled={isLoading}
                >
                  Next
                  <i className="bi bi-arrow-right ms-2"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PlanSteps;
