import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

const EnhancedPieChartVisualization = ({ data }) => {
  const COLORS = [
    'url(#gradient1)',
    'url(#gradient2)',
    'url(#gradient3)'
  ];

  return (
    <div className="border rounded shadow-lg bg-light p-3">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#007bff', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#6610f2', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#fd7e14', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#dc3545', stopOpacity: 1 }} />
            </linearGradient>
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#28a745', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#20c997', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#007bff"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnhancedPieChartVisualization;