import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

/**
 * Dynamic Bar Chart Component.
 *
 * This component supports rendering a Bar Chart dynamically.
 * It accepts either a full Chart.js configuration in the prop `chartConfig`
 * OR accepts a `chartData` prop (with labels and datasets) to automatically build a basic chart configuration.
 *
 * The component will update/refresh the chart when new data is received.
 *
 * Props:
 *  - chartConfig: A complete Chart.js configuration object.
 *  - chartData: An object containing the data for the bar chart.
 *      Expected format:
 *      {
 *        labels: ["Label1", "Label2", ...],
 *        datasets: [{
 *          label: "Dataset Label",
 *          data: [val1, val2, ...],
 *          backgroundColor: "rgba(75, 192, 192, 0.6)"
 *        }, ...] // You can add more datasets as needed (for two candles or more).
 *      }
 *  - options: Optional Chart.js options (if using chartData).
 */
const BarChartComponent = ({ chartConfig, chartData, options }) => {
  const barChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Do nothing if no configuration or data is provided.
    if (!chartConfig && !chartData) return;

    // Destroy previous chart instance if it exists.
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = barChartRef.current.getContext("2d");

    // If a full chartConfig is provided, use it. Otherwise, build a basic configuration using chartData.
    const config = chartConfig
      ? chartConfig
      : {
          type: "bar",
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            // Merge any additional options passed as prop.
            ...options,
          },
        };

    // Initialize the chart.
    chartInstance.current = new Chart(ctx, config);

    // Cleanup function on component unmount or update.
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartConfig, chartData, options]);

  return (
    <div style={{ width: "100%", height: "400px", marginBottom: "2rem" }}>
      <canvas ref={barChartRef} style={{ width: "100%", height: "100%" }}></canvas>
    </div>
  );
};

export default BarChartComponent;