import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * PieChartComponent1 renders a pie chart based on the provided configuration.
 * The configuration object should have the following structure:
 * {
 *   type: "pie",
 *   data: {
 *     labels: [...],
 *     datasets: [{
 *       data: [...],
 *       backgroundColor: [...]
 *     }]
 *   },
 *   options: { ... }
 * }
 *
 * This component uses the 'react-chartjs-2' library to render the chart.
 *
 * Props:
 * - config: The chart configuration object.
 * - width (optional): Chart width in pixels (default is 300).
 * - height (optional): Chart height in pixels (default is 300).
 */
const PieChartComponent1 = ({ config, width = 300, height = 300 }) => {
  if (!config || !config.data) {
    return <div>No chart configuration provided.</div>;
  }

  return (
    <div style={{ width, height }}>
      <Pie data={config.data} options={config.options} width={width} height={height} />
    </div>
  );
};

export default PieChartComponent1;