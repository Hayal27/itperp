import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Outlet } from "react-router-dom";
import debounce from "lodash.debounce";
import Filters from "./Filters";
import PlansTable from "./PlansTableOrg";
import Pagination from "./Pagination";

const PlanreportViewPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filters, setFilters] = useState({
    year: "",
    quarter: "",
    department: "",
    objective: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const token = localStorage.getItem("token");

  const fetchPlans = async () => {
    if (!token) {
      setErrorMessage("You must be logged in to view plans.");
      return;
    }

    const validFilters = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value)
    );

    try {
      setLoading(true);
      const response = await Axios.get("http://localhost:5000/api/planorg", {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...validFilters, page: currentPage, limit: itemsPerPage },
      });

      if (response.data.success) {
        setPlans(response.data.plans);
        setErrorMessage("");
      } else {
        setErrorMessage("No plans found.");
      }
    } catch (error) {
      setErrorMessage("የተገኘ እቅድ ወይም ሪፖርት የለም");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchPlans = debounce(fetchPlans, 500);

  useEffect(() => {
    debouncedFetchPlans();
  }, [filters, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSorting = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
  };

  const sortedPlans = plans.sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleDelete = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await Axios.delete(`http://localhost:5000/api/plandelete/${planId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlans((prevPlans) => prevPlans.filter((plan) => plan.ID !== planId));
      } catch (error) {
        console.error("Failed to delete the plan.");
      }
    }
  };

  const nextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const prevPage = () => setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));

  return (
    <main id="main" className="main">
      <Filters filters={filters} handleFilterChange={handleFilterChange} applyFilters={debouncedFetchPlans} />
      
      <section className="section">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Plans Table</h5>
                {loading ? (
                  <p>Loading plans...</p>
                ) : errorMessage ? (
                  <p className="text-danger">{errorMessage}</p>
                ) : (
                  <PlansTable
                    plans={plans}
                    handleDelete={handleDelete}
                    handleSorting={handleSorting}
                    sortedPlans={sortedPlans}
                    sortConfig={sortConfig}
                    handleDetailClick={() => {}}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Pagination currentPage={currentPage} nextPage={nextPage} prevPage={prevPage} />

      <Outlet />
    </main>
  );
};

export default PlanreportViewPlan;
