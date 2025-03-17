import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

/**
 * PieChartLayout is a presentational component that renders a Pie Chart using Chart.js.
 * It expects a `chartConfig` prop containing the Chart.js configuration.
 */
const PiChartComponent = ({ chartConfig }) => {
  const pieChartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartConfig) return;

    // Destroy previous chart instance if it exists.
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = pieChartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, chartConfig);

    // Cleanup on unmount.
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartConfig]);

  return (
    <div style={{ width: "100%", height: "300px", marginBottom: "2rem" }}>
      <canvas ref={pieChartRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default PiChartComponent;