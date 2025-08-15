import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 for popups

const PlansTable = ({ plans, handleSorting, sortConfig }) => {
  const [loading, setLoading] = useState(false);
  const [planDetail, setPlanDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to fetch plan details.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching plan details.');
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
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
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
            Swal.fire('Deleted!', 'The plan has been deleted.', 'success');
            // Optionally, you can refresh the plans or call a parent method to update the table.
          } else {
            Swal.fire('Error!', 'Failed to delete the plan.', 'error');
          }
        } catch (error) {
          console.error(error);
          Swal.fire('Error!', 'An error occurred while deleting the plan.', 'error');
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th onClick={() => handleSorting("Department")}>Department {getSortIcon("Department")}</th>
            <th onClick={() => handleSorting("Year")}>Year {getSortIcon("Year")}</th>
            <th>Quarter</th>
            <th onClick={() => handleSorting("Goal")}>Goal {getSortIcon("Goal")}</th>
            <th onClick={() => handleSorting("Objective")}>Objective {getSortIcon("Objective")}</th>
            <th onClick={() => handleSorting("SpecificObjective")}>Specific Objective {getSortIcon("SpecificObjective")}</th>
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
                  <Link to={`update/${plan.Plan_ID}`} className="btn btn-primary btn-sm me-1">Update</Link>
                  <button onClick={() => handleDelete(plan.Plan_ID)} className="btn btn-danger btn-sm me-1">Delete</button>
                  <Link to={`add-report/${plan.Plan_ID}`} className="btn btn-info btn-sm me-1">Add Report</Link>
                  <button onClick={() => fetchPlanDetail(plan.Plan_ID)} className="btn btn-secondary btn-sm">Details</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No plans found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showDetail && planDetail && (
        <div className="plan-detail-box">
          <h3>Plan Details</h3>
          <p><strong>Department:</strong> {planDetail.Department}</p>
          <p><strong>ግብ:</strong> {planDetail.Goal_Name}</p>
          <p><strong>አላማ:</strong> {planDetail.Objective_Name}</p>
          <p><strong>የ አላማው ውጤት </strong> {planDetail.Specific_Objective_Name}</p>
          <p><strong>Specific Objective Detail:</strong> {planDetail.Specific_Objective_Detail}</p>
          <p><strong>Details:</strong> {planDetail.Details}</p>
          <p><strong>Measurement:</strong> {planDetail.Measurement}</p>
          <p><strong>Baseline:</strong> {planDetail.Baseline}</p>
          <p><strong>Plan:</strong> {planDetail.Plan}</p>
          <p><strong>Description:</strong> {planDetail.Description}</p>
          <p><strong>Status:</strong> {planDetail.Status}</p>
          <p><strong>Comment:</strong> {planDetail.Comment}</p>
          <p><strong>Created At:</strong> {new Date(planDetail.Created_At).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(planDetail.Updated_At).toLocaleString()}</p>
          <p><strong>Year:</strong> {planDetail.Year}</p>
          <p><strong>ሩብ አመት:</strong> {planDetail.Quarter}</p>
          <p><strong>Created By:</strong> {planDetail.Created_By}</p>
          <p><strong>Progress:</strong> {planDetail.Progress}</p>
          <p><strong>Deadline:</strong> {planDetail.Deadline}</p>

          <button onClick={closePlanDetails} className="btn btn-primary">Close</button>
        </div>
      )}

      {loading && <div>Loading...</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
    </div>
  );
};

export default PlansTable;
