import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const IncomeChart = ({ data }) => {
  const chartRef = useRef(null);
  let chartInstance = useRef(null);

  useEffect(() => {
    // Clean up previous instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Combined ETB", "ETB", "USD"],
        datasets: [
          {
            label: "እቅድ በ %" ,
            data: [
              data.combined_ETB.plan,
              data.breakdown.ETB.plan,
              data.breakdown.USD.plan,
            ],
            backgroundColor: "#003f5c",
          },
          {
            label: "ክንዉን",
            data: [
              data.combined_ETB.outcome,
              data.breakdown.ETB.outcome,
              data.breakdown.USD.outcome,
            ],
            backgroundColor: "#58508d",
          },
          {
            label: "Difference",
            data: [
              data.combined_ETB.difference,
              data.breakdown.ETB.difference,
              data.breakdown.USD.difference,
            ],
            backgroundColor: "#bc5090",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Income Plan vs Outcome",
          },
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    });

    // Cleanup function to destroy the chart instance on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} height="75"></canvas>;
};

export default IncomeChart;