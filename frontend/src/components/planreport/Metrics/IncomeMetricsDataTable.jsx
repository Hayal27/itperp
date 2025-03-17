
import React from "react";
import DataTableComponent from "./DataTableComponent";

const IncomeMetricsDataTable = ({ data }) => {
  if (
    !data ||
    !data.primary ||
    !data.primary.combined_ETB ||
    !data.primary.breakdown ||
    !data.primary.breakdown.ETB ||
    !data.primary.breakdown.USD
  ) {
    return <div>No sufficient income data available.</div>;
  }

  const categories = [
    {
      name: "Combined ETB",
      plan: data.primary.combined_ETB.plan || 0,
      outcome: data.primary.combined_ETB.outcome || 0,
      difference: data.primary.combined_ETB.difference || 0
    },
    {
      name: "ETB",
      plan: data.primary.breakdown.ETB.plan || 0,
      outcome: data.primary.breakdown.ETB.outcome || 0,
      difference: data.primary.breakdown.ETB.difference || 0
    },
    {
      name: "USD (Original)",
      plan: data.primary.breakdown.USD.plan || 0,
      outcome: data.primary.breakdown.USD.outcome || 0,
      difference: data.primary.breakdown.USD.difference || 0
    },
    {
      name: "USD (Converted)",
      plan: data.primary.breakdown.USD.plan_in_ETB || 0,
      outcome: data.primary.breakdown.USD.outcome_in_ETB || 0,
      difference: (data.primary.breakdown.USD.plan_in_ETB - data.primary.breakdown.USD.outcome_in_ETB) || 0
    }
  ];

  return <DataTableComponent categories={categories} />;
};

export default IncomeMetricsDataTable;