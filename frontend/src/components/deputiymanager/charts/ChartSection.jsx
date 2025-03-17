import React from 'react';
import AnalyticsChart from './AnalyticsChart';

const ChartSection = ({ title, chartData, chartOptions }) => {
  return (
    <section className="my-5">
      <h2>{title} Analysis</h2>
      <AnalyticsChart 
        title={title}
        chartData={chartData}
        chartOptions={chartOptions}
      />
    </section>
  );
};

export default ChartSection;

