import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";


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