import React, { useState, useEffect } from "react";
import axios from "axios";
import Step1Goal from "./Step1Goal"; // Goal selection step
import Step2Objective from "./Step2Objective"; // Objective selection step
import Step3SpecificObjective from "./Step3SpecificObjective"; // Specific objective selection
import Step4SpecificObjectiveDetails from "./Step4SpecificObjectiveDetails"; // Specific objective details
import Step5Review from "./Step5Review"; // Review and submission step
import "../../../../assets/css/objective.css";
import Swal from "sweetalert2"; // SweetAlert2 for popups

const StafPlanSteps = () => {
  const [step, setStep] = useState(1); // Current step in the process
  const [goal, setGoal] = useState(null); // Holds selected goal
  const [objective, setObjective] = useState(null); // Holds selected objective
  const [specificObjective, setSpecificObjective] = useState(null); // Holds selected specific objective
  const [specificObjectiveDetails, setSpecificObjectiveDetails] = useState(null); // Holds selected specific objective details
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [successMessage, setSuccessMessage] = useState(""); // Success message after submission
  const token = localStorage.getItem("token"); // Get token from local storage

  // Sidebar state management
  const [sidebarState, setSidebarState] = useState({
    isCollapsed: false,
    sidebarWidth: 260,
    mainContentMargin: 260
  });

  // Listen for sidebar state changes from different sidebar types
  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      const { isCollapsed, sidebarWidth, mainContentMargin } = event.detail;

      // Debug logging
      console.log('🔄 StafPlanSteps: Sidebar state changed:', {
        isCollapsed,
        sidebarWidth,
        mainContentMargin,
        eventType: event.type
      });

      // Handle mobile responsiveness
      const isMobile = window.innerWidth <= 768;
      const adjustedMargin = isMobile ? 0 : mainContentMargin;

      setSidebarState({
        isCollapsed,
        sidebarWidth,
        mainContentMargin: adjustedMargin
      });
    };

    // Handle window resize for responsive behavior
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        setSidebarState(prev => ({
          ...prev,
          mainContentMargin: 0
        }));
      } else {
        // Restore sidebar margin on desktop
        setSidebarState(prev => ({
          ...prev,
          mainContentMargin: prev.isCollapsed ?
            (prev.sidebarWidth === 70 ? 70 : 60) :
            (prev.sidebarWidth === 280 ? 280 : 260)
        }));
      }
    };

    // Listen for admin sidebar changes
    window.addEventListener('sidebarStateChange', handleSidebarStateChange);

    // Listen for staff sidebar changes
    window.addEventListener('staffSidebarStateChange', handleSidebarStateChange);

    // Listen for CEO sidebar changes
    window.addEventListener('ceoSidebarStateChange', handleSidebarStateChange);

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    // Initial check for mobile
    handleResize();

    // Cleanup event listeners
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
      window.removeEventListener('staffSidebarStateChange', handleSidebarStateChange);
      window.removeEventListener('ceoSidebarStateChange', handleSidebarStateChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  // Calculate dynamic styles and classes based on sidebar state
  const containerStyle = {
    '--sidebar-margin': `${sidebarState.mainContentMargin}px`,
    '--sidebar-width': `${sidebarState.sidebarWidth}px`
  };

  // Determine CSS classes based on sidebar state
  const getContainerClasses = () => {
    let classes = "container mt-46";

    if (sidebarState.isCollapsed) {
      if (sidebarState.sidebarWidth === 70) {
        classes += " admin-sidebar-collapsed";
      } else {
        classes += " sidebar-collapsed";
      }
    } else {
      if (sidebarState.sidebarWidth === 280) {
        classes += " admin-sidebar-expanded";
      } else {
        classes += " sidebar-expanded";
      }
    }

    return classes;
  };

  return (
    <div
      className={getContainerClasses()}
      style={containerStyle}
    >
      {/* Professional Header */}
      <div className="plan-header">
        <div className="d-flex justify-content-between align-items-center">
          <h3>እቅድ ማስተዳደሪያ</h3>
          {/* Debug info - remove in production */}
          <small className="debug-info">
            Sidebar: {sidebarState.isCollapsed ? 'Collapsed' : 'Expanded'}
            ({sidebarState.sidebarWidth}px)
          </small>
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="step-content">
        <div className="content-wrapper">
          {renderStepContent()}

          {/* Debug: Add some content to test scrolling */}
        


        </div>
      </div>
    </div>
  );
};

export default StafPlanSteps;
