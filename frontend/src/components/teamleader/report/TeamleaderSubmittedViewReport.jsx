
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tooltip as ReactTooltip } from "react-tooltip"; // Using react-tooltip v5 named import
import "../../../assets/css/viewplan.css";
import "../../../assets/css/magic-tooltip.css";

const TeamleaderSubmittedViewPlan = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/submitted_reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success && response.data.plans) {
        setPlans(response.data.plans);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Error fetching plans:", error.response?.data || error.message);
      setPlans([]);
    }
  };

  const handleApproveDecline = async (planId, action) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/supervisor/plans/approve",
        { plan_id: planId, status: action, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert(response.data.message);
        fetchPlans(); // Refresh the list of plans after the update
        setSelectedPlan(null);
        setComment("");
      } else {
        alert(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error updating plan:", error.response?.data || error.message);
      alert("Failed to update plan. Please try again.");
    }
  };

  const handleReviewClick = (plan) => {
    setSelectedPlan(plan);
  };

  // Mapping backend attribute keys to display labels.
  const fieldLabels = {
    created_by: "አቃጅ",
    department_name: "የስራ ክፍል",
    year: "የታቀደበት አመት",
    month: "ወር",
    day: "ቀን",
    deadline: "እስከ",
    priority: "Priority",
    goal_name: "ግብ",
    objective_name: "አላማ",
    specific_objective_name: "ውጤት",
    specific_objective_detailname: "ዝርዝር ተግባር",
    measurement: "ፐርፎርማንስ መለኪያ",
    baseline: "መነሻ %",
    plan: "የታቀደው %",
    outcome: "ክንውን",
    execution_percentage: "ክንውን በ %",
    plan_type: "የ እቅዱ አይነት",
    income_exchange: "ምንዛሬ",
    cost_type: "ወጪ አይነት",
    employment_type: "የቅጥር ሁኔታ",
    incomeName: "የገቢ ስም",
    costName: "የመጪው ስም",
    CIbaseline: "መነሻ በ ገንዘብ",
    CIplan: "እቅድ በ ገንዘብ",
    CIoutcome: "ክንውን በ ገንዘብ",
  };

  const renderPlanDetails = (plan) => {
    return Object.entries(fieldLabels).map(([key, label]) => {
      if (plan[key] !== undefined && plan[key] !== null && plan[key] !== "") {
        return (
          <p key={key}>
            <strong>{label}:</strong> {plan[key]}
          </p>
        );
      }
      return null;
    });
  };

  // Render a progress bar with tooltip
  const renderProgressBar = (percentage) => {
    let color;
    if (percentage <= 33) {
      color = "red";
    } else if (percentage <= 66) {
      color = "yellow";
    } else {
      color = "green";
    }

    return (
      <div className="progress-bar" style={{ width: "100%", backgroundColor: "#e0e0e0" }}>
        <div
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            height: "10px",
          }}
          data-tooltip-id="executionTooltip"
          data-tooltip-content={`${percentage}%`}
        ></div>
        <ReactTooltip id="executionTooltip" place="top" effect="solid" className="magical-tooltip" />
      </div>
    );
  };

  // Helper function to check if file exists (only used for non-image preview)
  const checkFileExists = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Component to display individual file with enhanced URL normalization, categorization, and professional style.
  const FileDisplay = ({ file }) => {
    const [error, setError] = useState("");
    // Support both camelCase and snake_case for file name and path.
    const name = file.file_name || file.fileName;
    const rawPath = file.file_path || file.filePath;
    if (!name || !rawPath) return null;

    // Normalize the path by replacing backslashes with forward slashes.
    let normalizedPath = rawPath.replace(/\\/g, "/");

    // Ensure the URL contains a slash after the domain and port.
    normalizedPath = normalizedPath.replace(/(https?:\/\/[^/]+)(uploads)/, "$1/uploads");

    const extension = name.split(".").pop().toLowerCase();
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const videoExtensions = ["mp4", "webm", "ogg"];
    const isImage = imageExtensions.includes(extension);
    const isVideo = videoExtensions.includes(extension);
    const isPdf = extension === "pdf";

    // Determine the file category for professional layout.
    let fileCategory = "Other";
    if (isImage) fileCategory = "Image";
    else if (isVideo) fileCategory = "Video";
    else if (isPdf) fileCategory = "PDF";

    const handleView = async () => {
      // For images and videos, you can use inline playback or open in a new tab.
      if (isImage || isVideo) {
        window.open(normalizedPath, "_blank");
      } else {
        const exists = await checkFileExists(normalizedPath);
        if (exists) {
          window.open(normalizedPath, "_blank");
        } else {
          setError(`Unable to load file from uploads folder. Check URL ${normalizedPath}`);
        }
      }
    };

    return (
      <div className="file-preview professional-file-preview" style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}>
        <h5 className="file-category" style={{ marginBottom: "5px", fontSize: "16px", color: "#555" }}>{fileCategory}</h5>
        <p className="file-name" style={{ fontWeight: "bold", marginBottom: "10px" }}>{name}</p>
        {isImage ? (
          <img
            src={normalizedPath}
            alt={name}
            style={{ maxWidth: "300px", cursor: "pointer", display: "block", border: "1px solid #ccc", padding: "5px", borderRadius: "4px" }}
            onClick={handleView}
            onError={() => setError(`Error loading image from uploads folder: ${normalizedPath}`)}
          />
        ) : isVideo ? (
          <div className="video-container" style={{ maxWidth: "300px", border: "1px solid #ccc", padding: "5px", borderRadius: "4px" }}>
            <video controls style={{ width: "100%" }}>
              <source src={normalizedPath} type={`video/${extension}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : isPdf ? (
          <div>
            <button onClick={handleView} style={{ marginRight: "5px", padding: "6px 12px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              View File
            </button>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = normalizedPath;
                link.download = name;
                link.click();
              }}
              style={{ padding: "6px 12px", backgroundColor: "#28A745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Download File
            </button>
          </div>
        ) : (
          <div>
            <button onClick={handleView} style={{ marginRight: "5px", padding: "6px 12px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
              Open File
            </button>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = normalizedPath;
                link.download = name;
                link.click();
              }}
              style={{ padding: "6px 12px", backgroundColor: "#28A745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              Download File
            </button>
          </div>
        )}
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    );
  };

  // Enhanced file rendering using the FileDisplay component.
  const renderFileEnhanced = (file, index) => {
    return <FileDisplay key={index} file={file} />;
  };

  return (
    <div className="supervisor-dashboard">
      <h2>በ ዲፓርትመንቱ የታቀዱ እቅዶች</h2>
      <div className="plan-list">
        {plans.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ዲፓርትመንቱ</th>
                <th>አቃጅ</th>
                <th>ግብ</th>
                <th>አላማ</th>
                <th>ውጤት</th>
                <th>የውጤቱ ዝርዝር ተግባር</th>
                <th>Status</th>
                <th>ክንውን በ %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.plan_id}>
                  <td>{plan.department_name}</td>
                  <td>{plan.created_by}</td>
                  <td>{plan.goal_name}</td>
                  <td>{plan.objective_name}</td>
                  <td>{plan.specific_objective_name}</td>
                  <td>{plan.specific_objective_detailname}</td>
                  <td>{plan.status || "N/A"}</td>
                  <td>{renderProgressBar(plan.execution_percentage || 0)}</td>
                  <td>
                    <button onClick={() => handleReviewClick(plan)}>Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No plans available.</p>
        )}
      </div>

      {selectedPlan && (
        <div className="modal model-h">
          <h3>Review Report</h3>
          <div className="plan-details">{renderPlanDetails(selectedPlan)}</div>
          {/* Render uploaded files if they exist */}
          {selectedPlan.files && selectedPlan.files.length > 0 && (
            <div className="file-section">
              <h4>Uploaded Files</h4>
              {selectedPlan.files.map((file, index) => renderFileEnhanced(file, index))}
            </div>
          )}
          <textarea
            placeholder="Add a comment here (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="modal-actions">
            <button onClick={() => handleApproveDecline(selectedPlan.plan_id, "Approved")}>
              Approve
            </button>
            <button onClick={() => handleApproveDecline(selectedPlan.plan_id, "Declined")}>
              Decline
            </button>
            <button onClick={() => setSelectedPlan(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamleaderSubmittedViewPlan;
