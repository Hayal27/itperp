import React, { useEffect, useState } from "react";
import BarChartComponent from "./BarChartComponent";

const IncomeMetricsBarchart = ({ data }) => {
  const [chartConfig, setChartConfig] = useState(null);

  useEffect(() => {
    if (
      !data ||
      !data.primary ||
      !data.primary.combined_ETB ||
      !data.primary.breakdown ||
      !data.primary.breakdown.ETB ||
      !data.primary.breakdown.USD
    ) {
      setChartConfig(null);
      return;
    }

    const barLabels = ["Combined ETB", "ETB", "USD (Original)", "USD (Converted)"];

    const planData = [
      data.primary.combined_ETB.plan || 0,
      data.primary.breakdown.ETB.plan || 0,
      data.primary.breakdown.USD.plan || 0,
      data.primary.breakdown.USD.plan_in_ETB || 0
    ];

    const outcomeData = [
      data.primary.combined_ETB.outcome || 0,
      data.primary.breakdown.ETB.outcome || 0,
      data.primary.breakdown.USD.outcome || 0,
      data.primary.breakdown.USD.outcome_in_ETB || 0
    ];

    const differenceData = [
      data.primary.combined_ETB.difference || 0,
      data.primary.breakdown.ETB.difference || 0,
      data.primary.breakdown.USD.difference || 0,
      (data.primary.breakdown.USD.plan_in_ETB - data.primary.breakdown.USD.outcome_in_ETB) || 0
    ];

    const config = {
      type: "bar",
      data: {
        labels: barLabels,
        datasets: [
          {
            label: "እቅድ በ %" ,
            data: planData,
            backgroundColor: "#003f5c"
          },
          {
            label: "ክንዉን",
            data: outcomeData,
            backgroundColor: "#58508d"
          },
          {
            label: "Difference",
            data: differenceData,
            backgroundColor: "#bc5090"
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Income Plan vs Outcome"
          }
        },
        scales: {
          x: { stacked: true },
          y: { stacked: true }
        }
      }
    };

    setChartConfig(config);
  }, [data]);

  return (
    <div>
      {chartConfig ? (
        <BarChartComponent chartConfig={chartConfig} />
      ) : (
        <div>Insufficient income data available.</div>
      )}
    </div>
  );
};

export default IncomeMetricsBarchart;