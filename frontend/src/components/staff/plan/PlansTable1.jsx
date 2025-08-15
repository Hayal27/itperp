
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 for popups

const PlansTable = ({ plans, handleSorting, sortConfig }) => {
  const [loading, setLoading] = useState(false);
  const [planDetail, setPlanDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const fetchPlanDetail = async (planId) => {
    try {
      setLoading(true);
      const response = await Axios.get(`http://localhost:5000/api/pland/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setPlanDetail(response.data.plan);
        setShowDetail(true);
        setErrorMessage("");
      } else {
        setErrorMessage("Failed to fetch plan details.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching plan details.");
    } finally {
      setLoading(false);
    }
  };

  const closePlanDetails = () => {
    setShowDetail(false);
    setPlanDetail(null);
  };

  const handleDelete = async (planId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await Axios.delete(`http://localhost:5000/api/plandelete/${planId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            Swal.fire("Deleted!", "The plan has been deleted.", "success");
            // Optionally, refresh plans or call a parent method to update the table.
          } else {
            Swal.fire("Error!", "Failed to delete the plan.", "error");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error!", "An error occurred while deleting the plan.", "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Define the list of fields to display with their corresponding labels.
  // Only fields present in the backend response (i.e. with a value) will be rendered.
  const planFields = [


    { key: "created_by", label: "አቃጅ"  },

    { key: "goal_name", label: "ግብ"  },
,
    { key: "objective_name", label: "አላማ"  },

    { key: "specific_objective_name", label: "ውጤት"  },
    { key: "specific_objective_detailname", label: "ዝርዝር ተገባር"  },
    { key: "details", label: "ዝርዝር"  },
    { key: "baseline", label: "መነሻ በ %"  },
    { key: "plan", label: "እቅድ በ %"  },
    { key: "measurement", label: "መለኪያ በ %"  },
    { key: "execution_percentage", label: "ክንዉን በ %"  },
    { key: "created_at", label: "Created At" },
    { key: "updated_at", label: "Updated At" },
    { key: "year", label: "አመት" },
    { key: "month", label: "ወር"  },
    { key: "day", label: "Day" },
    { key: "deadline", label: "ማጠናቀቂያ ቀን" },,
    { key: "status", label: "Status" },
    { key: "priority", label: "ቅድሚያ" },
   
    { key: "department_name", label: "ስራ ክፍል" },
    { key: "outcome", label: "ክንዉን" },
    { key: "የ እቅዱ ሂደት", label: "የ እቅዱ ሂደት" },
    { key: "plan_type", label: "የ እቅዱ አይነት" },
    { key: "income_exchange", label: "ምናዘሬው" },
    { key: "cost_type", label: "የ ወጪው አይነት"},
    { key: "employment_type", label: "የ ቅጥር ሁኔታ" },
    { key: "incomeName", label: "የ ገቢው ስም" },
    { key: "costName", label: "የ ወጪው ስም" },
    { key: "CIbaseline", label: "መነሻ" },
    { key: "CIplan", label: "እቅድ" },
    { key: "CIoutcome", label: "CI Outcome" },

  ];

  // Helper to format dates if the field appears to be a date.
  const formatValue = (key, value) => {
    if (!value) return value;
    if (["created_at", "updated_at", "deadline"].includes(key)) {
      return new Date(value).toLocaleString();
    }
    return value;
  };

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSorting("Department")}>
              Department {getSortIcon("Department")}
            </th>
            <th onClick={() => handleSorting("Year")}>
              Year {getSortIcon("Year")}
            </th>
            <th>Quarter</th>
            <th onClick={() => handleSorting("Goal")}>
              Goal {getSortIcon("Goal")}
            </th>
            <th onClick={() => handleSorting("Objective")}>
              Objective {getSortIcon("Objective")}
            </th>
            <th onClick={() => handleSorting("SpecificObjective")}>
              Specific Objective {getSortIcon("SpecificObjective")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.length > 0 ? (
            plans.map((plan) => (
              <tr key={plan.Plan_ID}>
                <td>{plan.Department || "N/A"}</td>
                <td>{plan.Year || "N/A"}</td>
                <td>{plan.Quarter || "N/A"}</td>
                <td>{plan.Goal || "N/A"}</td>
                <td>{plan.Objective || "N/A"}</td>
                <td>{plan.SpecificObjective || "N/A"}</td>
                <td>
                  <Link
                    to={`update/${plan.Plan_ID}`}
                    className="btn btn-primary btn-sm me-1"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(plan.Plan_ID)}
                    className="btn btn-danger btn-sm me-1"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => fetchPlanDetail(plan.Plan_ID)}
                    className="btn btn-secondary btn-sm"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No plans found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showDetail && planDetail && (
        <div className="plan-detail-box">
          <h3>Plan Details</h3>
          {planFields.map(
            ({ key, label }) =>
              planDetail[key] !== undefined &&
              planDetail[key] !== "" && (
                <p key={key}>
                  <strong>{label}:</strong> {formatValue(key, planDetail[key])}
                </p>
              )
          )}
          <button onClick={closePlanDetails} className="btn btn-primary">
            Close
          </button>
        </div>
      )}

      {loading && <div>Loading...</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    </div>
  );
};

export default PlansTable;
