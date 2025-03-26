import React, { useEffect, useState } from "react";
import PiChartComponent from "./PiChartComponent";

/**
 * IncomeMetricsPichart processes income-related data to build a Chart.js configuration
 * for a pie chart. It then renders the PieChartLayout (which provides the standard layout)
 * passing the configuration so that the chart is drawn accordingly.
 *
 * Expected `data` prop structure:
 * {
 *   primary: {
 *     breakdown: {
 *       ETB: { plan },
 *       USD: { plan }
 *     }
 *   }
 * }
 */
const IncomeMetricsPichart = ({ data }) => {
  const [chartConfig, setChartConfig] = useState(null);

  useEffect(() => {
    if (
      !data ||
      !data.primary ||
      !data.primary.breakdown ||
      !data.primary.breakdown.ETB ||
      !data.primary.breakdown.USD
    ) {
      setChartConfig(null);
      return;
    }

    const pieLabels = ["ETB Plan", "USD Plan"];
    const pieData = [
      data.primary.breakdown.ETB.plan || 0,
      data.primary.breakdown.USD.plan || 0
    ];

    const config = {
      type: "pie",
      data: {
        labels: pieLabels,
        datasets: [
          {
            data: pieData,
            backgroundColor: ["#00c9ff", "#ff9a9e", "#ffb199", "#92fe9d"]
          }
          
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Plan Distribution by Currency"
          }
        }
      }
    };

    setChartConfig(config);
  }, [data]);

  return chartConfig ? (
    <PiChartComponent chartConfig={chartConfig} />
  ) : (
    <div>Insufficient data for income metrics pie chart.</div>
  );
};

export default IncomeMetricsPichart;