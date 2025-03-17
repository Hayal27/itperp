import React from 'react';

const buildDataset = (label, data = [], bgColor, borderColor) => ({
  label,
  data,
  backgroundColor: bgColor,
  borderColor: borderColor,
  borderWidth: 1,
});

const ChartDataProcessor = ({ analyticsData }) => {
  // Validate input data
  if (!analyticsData) {
    return {
      cost: { labels: [], datasets: [] },
      income: { labels: [], datasets: [] },
      hr: { labels: [], datasets: [] }
    };
  }

  const defaultQuarters = ["Q1", "Q2", "Q3", "Q4"];
  
  const safeGetDisplayData = (category, type) => {
    try {
      return analyticsData[category]?.display?.[type] || Array(4).fill(0);
    } catch (error) {
      console.error(`Error accessing ${category}.${type} data:`, error);
      return Array(4).fill(0);
    }
  };

  const chartData = {
    cost: {
      labels: defaultQuarters,
      datasets: [
        buildDataset(
          "Total Cost Planned", 
          safeGetDisplayData('cost', 'CIplan'),
          "#FF5733", 
          "#C70039"
        ),
        buildDataset(
          "Total Cost Outcome", 
          safeGetDisplayData('cost', 'CIoutcome'),
          "#FFC300", 
          "#FF5733"
        ),
      ],
    },
    income: {
      labels: defaultQuarters,
      datasets: [
        buildDataset(
          "Total Income Planned", 
          safeGetDisplayData('income', 'CIplan'),
          "#33FF57", 
          "#39C700"
        ),
        buildDataset(
          "Total Income Outcome", 
          safeGetDisplayData('income', 'CIoutcome'),
          "#DAF7A6", 
          "#33FF57"
        ),
      ],
    },
    hr: {
      labels: defaultQuarters,
      datasets: [
        buildDataset(
          "Total HR Planned", 
          safeGetDisplayData('hr', 'CIplan'),
          "#3357FF", 
          "#0039C7"
        ),
        buildDataset(
          "Total HR Outcome", 
          safeGetDisplayData('hr', 'CIoutcome'),
          "#A6C8FF", 
          "#3357FF"
        ),
      ],
    }
  };

  return chartData;
};

export default ChartDataProcessor;