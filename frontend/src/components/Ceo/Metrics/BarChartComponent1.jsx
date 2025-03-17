import React from "react";
import { Bar } from "react-chartjs-2";
// Import internal versions of modules where applicable
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required Chart elements
Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

/**
 * Enhanced BarChartComponent1
 *
 * This component renders a Bar chart in a minimized container size while ensuring that the columns 
 * do not overlap and display independently. It uses default options for interactivity and merges them
 * with any user provided configuration.
 *
 * Props:
 * - config: {
 *     data: Object,       // Data object for the chart
 *     options: Object     // Chart configuration options. Merged with defaults if provided.
 *   }
 */
const BarChartComponent1 = ({ config }) => {
  // Verify configuration object before proceeding
  if (!config || !config.data) {
    return <div>No valid chart configuration provided.</div>;
  }

  // Define default options for an interactive and responsive chart with independent bar columns
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom sizing in the container
    plugins: {
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
      },
      legend: {
        display: true,
        position: "top",
      },
    },
    hover: {
      mode: "nearest",
      intersect: true,
    },
    scales: {
      x: {
        display: true,
        stacked: false, // Ensure bars are not stacked
        // Adjust bar width settings to prevent overlapping
        barPercentage: 0.8,
        categoryPercentage: 0.9,
        title: {
          display: false,
        },
      },
      y: {
        display: true,
        stacked: false,
        title: {
          display: false,
        },
      },
    },
  };

  // Merge user provided options with the default options
  const chartOptions = config.options ? { ...defaultOptions, ...config.options } : defaultOptions;

  // Container styles to minimize chart size and enhance layout attractiveness
  const containerStyle = {
    width: "300px",
    height: "500px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    margin: "auto",
  };

  return (
    <div style={containerStyle}>
      <Bar data={config.data} options={chartOptions} />
    </div>
  );
};

export default BarChartComponent1;