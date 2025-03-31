import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const StaffDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Chart configuration with shorter height
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 5 // Reduce number of ticks for shorter appearance
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10 // Smaller legend items
        }
      }
    }
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("You must be logged in.");
        setLoading(false);
        return;
      }
      try {
        const queryParams = "filterType=goal_id&filterValue=1";
        const url = `http://192.168.100.134:5000/api/getAnalyticsData1?${queryParams}`;
        const response = await Axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          setAnalyticsData(response.data.data);
        } else {
          setErrorMessage("Failed to load analytics data.");
        }
      } catch (error) {
        setErrorMessage("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalyticsData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (errorMessage || !analyticsData) {
    return <div>{errorMessage || "No analytics data available."}</div>;
  }

  // Build dataset configuration
  const buildDataset = (label, data, bgColor, borderColor) => ({
    label,
    data,
    backgroundColor: bgColor,
    borderColor: borderColor,
    borderWidth: 1,
  });

  // Chart data configurations
  const costDisplayChart = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      buildDataset("Total Cost Planned", analyticsData.cost.display.CIplan, "#FF5733", "#C70039"),
      buildDataset("Total Cost Outcome", analyticsData.cost.display.CIoutcome, "#FFC300", "#FF5733"),
    ],
  };

  const incomeDisplayChart = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      buildDataset("Total Income Planned", analyticsData.income.display.CIplan, "#33FF57", "#39C700"),
      buildDataset("Total Income Outcome", analyticsData.income.display.CIoutcome, "#DAF7A6", "#33FF57"),
    ],
  };

  const hrDisplayChart = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      buildDataset("Total HR Planned", analyticsData.hr.display.CIplan, "#3357FF", "#0039C7"),
      buildDataset("Total HR Outcome", analyticsData.hr.display.CIoutcome, "#A6C8FF", "#3357FF"),
    ],
  };

  return (
    <main id="main" className="container my-4">
      {/* Cost Analysis Section */}
      <section className="my-5">
        <h2>Cost Analysis</h2>
        <div className="row my-3">
          <div className="col-md-6">
            <h5>Cost Bar Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Bar data={costDisplayChart} options={chartOptions} />
            </div>
          </div>
          <div className="col-md-6">
            <h5>Cost Pie Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Pie data={costDisplayChart} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </section>

      {/* Income Analysis Section */}
      <section className="my-5">
        <h2>Income Analysis</h2>
        <div className="row my-3">
          <div className="col-md-6">
            <h5>Income Bar Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Bar data={incomeDisplayChart} options={chartOptions} />
            </div>
          </div>
          <div className="col-md-6">
            <h5>Income Pie Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Pie data={incomeDisplayChart} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </section>

      {/* HR Analysis Section */}
      <section className="my-5">
        <h2>HR Analysis</h2>
        <div className="row my-3">
          <div className="col-md-6">
            <h5>HR Bar Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Bar data={hrDisplayChart} options={chartOptions} />
            </div>
          </div>
          <div className="col-md-6">
            <h5>HR Pie Chart</h5>
            <div style={{ height: "150px" }}> {/* Reduced height container */}
              <Pie data={hrDisplayChart} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StaffDashboard;









const con = require("../models/db");

// analytics.js

// 1.1.1 Display Total Cost
const displayTotalCost = () => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    con.query('SELECT SUM(CIplan) AS total_cost FROM specific_objective_details', (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject('Database query failed.');
      } else {
        resolve(rows[0]);
      }
      con.end();
    });
  });
};

// 1.1.2 Compare Cost CIplan and CIoutcome
const compareCostCIplanAndCIoutcome = (costType, startYear, endYear, startQuarter, endQuarter) => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    const query = `
      SELECT
        SUM(CIplan) AS total_CIplan,
        SUM(CIoutcome) AS total_CIoutcome
      FROM specific_objective_details
      WHERE cost_type = ?
        AND year BETWEEN ? AND ?
        AND quarter BETWEEN ? AND ?
    `;
    con.query(query, [costType, startYear, endYear, startQuarter, endQuarter], (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject('Database query failed.');
      } else {
        resolve(rows[0]);
      }
      con.end();
    });
  });
};

// 1.1.3 Compare Cost CIexecution_percentage
const compareCostCIexecutionPercentage = (costType, startYear, endYear, startQuarter, endQuarter) => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    const query = `
      SELECT
        SUM(CIexecution_percentage) AS total_execution_percentage
      FROM specific_objective_details
      WHERE cost_type = ?
        AND year BETWEEN ? AND ?
        AND quarter BETWEEN ? AND ?
    `;
    con.query(query, [costType, startYear, endYear, startQuarter, endQuarter], (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject('Database query failed.');
      } else {
        resolve(rows[0]);
      }
      con.end();
    });
  });
};

// 1.2.1 Display Total Income
const displayTotalIncome = () => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    con.query('SELECT SUM(CIplan) AS total_income FROM specific_objective_details', (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject('Database query failed.');
      } else {
        resolve(rows[0]);
      }
      con.end();
    });
  });
};

// 1.2.2 Compare Total Income CIplan and CIoutcome
const compareTotalIncomeCIplanAndCIoutcome = (incomeExchange, startYear, endYear, startQuarter, endQuarter) => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    const query = `
      SELECT
        SUM(CIplan) AS total_CIplan,
        SUM(CIoutcome) AS total_CIoutcome
      FROM specific_objective_details
      WHERE income_exchange = ?
        AND year BETWEEN ? AND ?
        AND quarter BETWEEN ? AND ?
    `;
    con.query(query, [incomeExchange, startYear, endYear, startQuarter, endQuarter], (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject('Database query failed.');
      } else {
        resolve(rows[0]);
      }
      con.end();
    });
  });
};

// 1.2.3 Compare Income CIplan and CIoutcome by Year and Quarter
const compareIncomeCIplanAndCIoutcomeByPeriod = (incomeExchange, year, quarter) => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    const query = `
      SELECT
        year,
        quarter,
        SUM(CIplan) AS total_CIplan,
        SUM(CIoutcome) AS total_CIoutcome
      FROM specific_objective_details
      WHERE income_exchange = ?
        AND year = ?
        AND quarter = ?
      GROUP BY year, quarter
    `;
    con.query(query, [incomeExchange, year, quarter], (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject('Database query failed.');
      } else {
        resolve(rows);
      }
      con.end();
    });
  });
};

// 1.3 Comparing Cost and Income
const compareCostAndIncome = () => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    const query = `
      SELECT
        SUM(CASE WHEN plan_type = 'cost' THEN CIplan ELSE 0 END) AS total_cost_CIplan,
        SUM(CASE WHEN plan_type = 'income' THEN CIplan ELSE 0 END) AS total_income_CIplan,
        SUM(CASE WHEN plan_type = 'cost' THEN CIoutcome ELSE 0 END) AS total_cost_CIoutcome,
        SUM(CASE WHEN plan_type = 'income' THEN CIoutcome ELSE 0 END) AS total_income_CIoutcome,
        SUM(CASE WHEN plan_type = 'cost' THEN CIexecution_percentage ELSE 0 END) AS total_cost_CIexecution_percentage,
        SUM(CASE WHEN plan_type = 'income' THEN CIexecution_percentage ELSE 0 END) AS total_income_CIexecution_percentage
      FROM specific_objective_details
    `;
    con.query(query, (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject('Database query failed.');
      } else {
        resolve(rows[0]);
      }
      con.end();
    });
  });
};

// 1.4.1 Display Total HR
const displayTotalHR = () => {
  return new Promise((resolve, reject) => {
    const con = createConnection();
    con.query('SELECT SUM(CIplan) AS total_hr FROM specific_objective_details', (err, rows) => {
      if (err) {
        console.error('Database query error:', err.message);
        reject('Database query failed.');
      } else {
        resolve(rows[0]);
      }
      con.end();
    });
  });
};

// 1.4.2 Compare Total HR CIplan and CIoutcome
const compareTotalHRCIplanAndCIoutcome = (hrExchange, startYear, endYear, startQuarter, endQuarter) => {
    return new Promise((resolve, reject) => {
        const con = createConnection();
        const query = `
        SELECT
            SUM(CIplan) AS total_CIplan,
            SUM(CIoutcome) AS total_CIoutcome
        FROM specific_objective_details
        WHERE hr_exchange = ?
            AND year BETWEEN ? AND ?
            AND quarter BETWEEN ? AND ?
        `;
        con.query(query, [hrExchange, startYear, endYear, startQuarter, endQuarter], (err, rows) => {
        if (err) {
            console.error('Database query error:', err.message);
            reject('Database query failed.');
        } else {
            resolve(rows[0]);
        }
        con.end();
        });
    });
    }




export default {
    displayTotalCost,
    compareCostCIplanAndCIoutcome,
    compareCostCIexecutionPercentage,
    displayTotalIncome,
    compareTotalIncomeCIplanAndCIoutcome,
    compareIncomeCIplanAndCIoutcomeByPeriod,
    compareCostAndIncome,
    displayTotalHR,
    compareTotalHRCIplanAndCIoutcome
};



const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { 
    displayTotalCost,
    compareCostCIplanAndCIoutcome,
    compareCostCIexecutionPercentage,
    displayTotalIncome,
    compareTotalIncomeCIplanAndCIoutcome,
    compareIncomeCIplanAndCIoutcomeByPeriod,
    compareCostAndIncome,
    displayTotalHR,
    compareTotalHRCIplanAndCIoutcome
} = require("../controllers/analytics");

router.get("/displayTotalCost", verifyToken, displayTotalCost); 
router.get("/compareCostCIplanAndCIoutcome", verifyToken, compareCostCIplanAndCIoutcome);
router.get("/compareCostCIexecutionPercentage", verifyToken, compareCostCIexecutionPercentage);
router.get("/displayTotalIncome", verifyToken, displayTotalIncome);
router.get("/compareTotalIncomeCIplanAndCIoutcome", verifyToken, compareTotalIncomeCIplanAndCIoutcome);
router.get("/compareIncomeCIplanAndCIoutcomeByPeriod", verifyToken, compareIncomeCIplanAndCIoutcomeByPeriod);
router.get("/compareCostAndIncome", verifyToken, compareCostAndIncome);
router.get("/displayTotalHR", verifyToken, displayTotalHR);
router.get("/compareTotalHRCIplanAndCIoutcome", verifyToken, compareTotalHRCIplanAndCIoutcome);

export default router;