import React, { useState, useEffect } from "react";
import Axios from "axios";
import ChartSection from "./charts/ChartSection";
import ChartDataProcessor from "./charts/ChartDataProcessor";
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

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 5
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10
        }
      }
    }
  };

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
        const url = `http://localhost:5000/api/getAnalyticsData1?${queryParams}`;
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

  const chartData = ChartDataProcessor({ analyticsData });

  return (
    <main id="main" className="container my-4">
      <ChartSection 
        title="Cost"
        chartData={chartData.cost}
        chartOptions={chartOptions}
      />
      <ChartSection 
        title="Income"
        chartData={chartData.income}
        chartOptions={chartOptions}
      />
      <ChartSection 
        title="HR"
        chartData={chartData.hr}
        chartOptions={chartOptions}
      />
    </main>
  );
};

export default StaffDashboard;