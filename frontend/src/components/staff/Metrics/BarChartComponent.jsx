import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

/**
 * Presentational component for rendering a Bar Chart.
 * Expects a prop `chartConfig` which contains the Chart.js configuration.
 */
const BarChartComponent = ({ chartConfig }) => {
  const barChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // If no configuration is provided, do nothing.
    if (!chartConfig) return;

    // Destroy previous instance if it exists.
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = barChartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, chartConfig);

    // Cleanup on unmount.
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartConfig]);

  return (
    <div style={{ width: "100%", height: "400px", marginBottom: "2rem" }}>
      <canvas ref={barChartRef} style={{ width: "100%", height: "100%" }}></canvas>
    </div>
  );
};

export default BarChartComponent;