import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const BarChartVisualization = ({ data }) => {
  return (
    <div className="border rounded shadow bg-light p-3">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#343a40" />
          <YAxis stroke="#343a40" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#007bff" name="Value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartVisualization;