import React, { useState } from "react";
import axios from "axios";
import PlanStep1Goal from "./PlanStep1Goal"; // Goal selection step
import PlanStep2Objective from "./PlanStep2Objective"; // Objective selection step
import PlanStep3SpecificObjective from "./PlanStep3SpecificObjective"; // Specific objective selection
import PlanStep4SpecificObjectiveDetails from "./PlanStep4SpecificObjectiveDetails"; // Specific objective details
import PlanStep5Review from "./PlanStep5Review"; // Review and submission step
import "../../../assets/css/objective.css";
import Swal from "sweetalert2"; // SweetAlert2 for popups

const PPlanSteps = () => {
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
  
  
  
  
  
  
  

  // Render the correct step component
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <PlanStep1Goal
            onNext={handleGoalSelect}
            error={error}
            loading={isLoading}
          />
        );
      case 2:
        return (
          <PlanStep2Objective
            goalId={goal?.goal_id}
            onNext={handleObjectiveSelect}
            onBack={goToPreviousStep}
          />
        );
      case 3:
        return (
          <PlanStep3SpecificObjective
            objectiveId={objective?.id}
            token={token}
            onBack={goToPreviousStep}
            onNext={handleSpecificObjectiveSelect}
          />
        );
      case 4:
        return (
          <PlanStep4SpecificObjectiveDetails
            specificObjectiveId={specificObjective?.specific_objective_id}
            token={token}
            onBack={goToPreviousStep}
            onNext={handleSpecificObjectiveDetailsSelect}
          />
        );
      case 5:
        return (
          <PlanStep5Review
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
    <div className="container mt-46">
      <h3>እቅድ ማስተዳደሪያ</h3>
      <div className="step-content">{renderStepContent()}</div>
    </div>
  );
};

export default PPlanSteps;
