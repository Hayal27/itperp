import React from 'react';
import BarChartComponent1 from './BarChartComponent1';

/**
 * TripleBarChartComponent
 *
 * This component expects an array of three valid chart configurations (configs) and renders
 * three independent Bar charts side by side in a 3-column grid layout. Each chart uses the
 * BarChartComponent1 to ensure consistency in style and functionality.
 *
 * Props:
 * - configs: Array of exactly three configuration objects, each with:
 *      data: Object      // Data object for the chart.
 *      options: Object   // (Optional) Chart configuration options.
 */
const TripleBarChartComponent = ({ configs }) => {
  if (!configs || configs.length !== 3) {
    return <div>Please provide exactly 3 valid chart configurations.</div>;
  }

  // Container styles using CSS grid to display three columns with spacing
  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    justifyItems: 'center',
    padding: '20px'
  };

  return (
    <div style={containerStyle}>
      {configs.map((config, index) => (
        <BarChartComponent1 key={index} config={config} />
      ))}
    </div>
  );
};

export default TripleBarChartComponent;