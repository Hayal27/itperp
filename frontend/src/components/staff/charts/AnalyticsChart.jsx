import React from "react";
import { Bar, Pie } from "react-chartjs-2";

const AnalyticsChart = ({ title, chartData, chartOptions }) => {
  return (
    <div className="row my-3">
      <div className="col-md-6">
        <h5>{title} Bar Chart</h5>
        <div style={{ height: "150px" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      <div className="col-md-6">
        <h5>{title} Pie Chart</h5>
        <div style={{ height: "150px" }}>
          <Pie data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;


