/**
 * Metrics Utilities
 * Helper functions for safe data access in metric components
 */

/**
 * Safely extracts a value from data object with fallback handling
 * @param {Object} data - The data object to extract from
 * @param {string} key - Primary key to look for
 * @param {string} nestedKey - Secondary key to look for in data.extra
 * @param {*} defaultValue - Default value if not found (default: 0)
 * @returns {*} The extracted value or default
 */
export const safeGetValue = (data, key, nestedKey = null, defaultValue = 0) => {
  // Check if data exists first
  if (!data) {
    console.warn(`safeGetValue: No data provided for key '${key}'`);
    return defaultValue;
  }

  // Try directly on data first
  if (data[key] !== undefined && data[key] !== null) {
    return data[key];
  }

  // Check data.extra
  if (data.extra && data.extra[key] !== undefined && data.extra[key] !== null) {
    return data.extra[key];
  }

  // Check nested key in data.extra
  if (nestedKey && data.extra && data.extra[nestedKey] !== undefined && data.extra[nestedKey] !== null) {
    return data.extra[nestedKey];
  }

  console.warn(`safeGetValue: Key '${key}' not found in data, returning default:`, defaultValue);
  return defaultValue;
};

/**
 * Safely extracts nested object properties
 * @param {Object} data - The data object
 * @param {string} path - Dot notation path (e.g., 'extra.compareCostPlanOutcome.total_cost_plan')
 * @param {*} defaultValue - Default value if not found
 * @returns {*} The extracted value or default
 */
export const safeGetNestedValue = (data, path, defaultValue = 0) => {
  if (!data || !path) {
    return defaultValue;
  }

  const keys = path.split('.');
  let current = data;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      console.warn(`safeGetNestedValue: Path '${path}' not found in data, returning default:`, defaultValue);
      return defaultValue;
    }
  }

  return current !== undefined && current !== null ? current : defaultValue;
};

/**
 * Validates if data object has required properties
 * @param {Object} data - The data object to validate
 * @param {Array<string>} requiredKeys - Array of required keys
 * @returns {boolean} True if all required keys exist
 */
export const validateDataStructure = (data, requiredKeys = []) => {
  if (!data) {
    console.warn('validateDataStructure: No data provided');
    return false;
  }

  const missingKeys = requiredKeys.filter(key => {
    const hasDirectKey = data[key] !== undefined && data[key] !== null;
    const hasExtraKey = data.extra && data.extra[key] !== undefined && data.extra[key] !== null;
    return !hasDirectKey && !hasExtraKey;
  });

  if (missingKeys.length > 0) {
    console.warn('validateDataStructure: Missing required keys:', missingKeys);
    return false;
  }

  return true;
};

/**
 * Creates a placeholder component for when data is not available
 * @param {string} chartType - Type of chart (bar, pie, table)
 * @param {string} message - Custom message to display
 * @returns {Object} Placeholder configuration object
 */
export const createDataPlaceholder = (chartType = 'chart', message = 'No data available') => {
  const getIcon = () => {
    switch (chartType.toLowerCase()) {
      case 'bar':
        return 'bi-bar-chart';
      case 'pie':
        return 'bi-pie-chart';
      case 'table':
        return 'bi-table';
      default:
        return 'bi-graph-up';
    }
  };

  return {
    type: 'placeholder',
    icon: getIcon(),
    message: message,
    subMessage: 'Please check your data source or try refreshing the page.'
  };
};

/**
 * Safely extracts comparison data for plan vs outcome charts
 * @param {Object} data - The data object
 * @param {string} planKey - Key for plan data
 * @param {string} outcomeKey - Key for outcome data
 * @param {string} extraKey - Key in data.extra for comparison object
 * @returns {Object} Object with plan and outcome values
 */
export const safeGetComparisonData = (data, planKey = 'total_cost_plan', outcomeKey = 'total_cost_outcome', extraKey = 'compareCostPlanOutcome') => {
  if (!data) {
    console.warn('safeGetComparisonData: No data provided');
    return { plan: 0, outcome: 0 };
  }

  // Try direct properties first
  if (data[planKey] !== undefined && data[outcomeKey] !== undefined) {
    return {
      plan: data[planKey] || 0,
      outcome: data[outcomeKey] || 0
    };
  }

  // Try extra object
  if (data.extra && data.extra[extraKey]) {
    const comparisonData = data.extra[extraKey];
    return {
      plan: comparisonData[planKey] || 0,
      outcome: comparisonData[outcomeKey] || 0
    };
  }

  console.warn('safeGetComparisonData: Comparison data not found, returning zeros');
  return { plan: 0, outcome: 0 };
};

/**
 * Formats numeric values for display
 * @param {number} value - The numeric value
 * @param {Object} options - Formatting options
 * @returns {string} Formatted value
 */
export const formatValue = (value, options = {}) => {
  const {
    decimals = 2,
    currency = false,
    percentage = false,
    locale = 'en-US'
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  if (percentage) {
    return `${Number(value).toFixed(decimals)}%`;
  }

  if (currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Logs data structure for debugging
 * @param {Object} data - The data object to log
 * @param {string} componentName - Name of the component for logging
 */
export const debugDataStructure = (data, componentName = 'Component') => {
  console.group(`${componentName} - Data Structure Debug`);
  console.log('Raw data:', data);
  
  if (data) {
    console.log('Direct properties:', Object.keys(data).filter(key => key !== 'extra'));
    if (data.extra) {
      console.log('Extra properties:', Object.keys(data.extra));
    }
  } else {
    console.warn('No data provided');
  }
  
  console.groupEnd();
};

/**
 * Default chart configuration for consistent styling
 */
export const getDefaultChartConfig = () => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
          family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: '#0c7c92',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)'
      },
      ticks: {
        font: {
          size: 11
        }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          size: 11
        }
      }
    }
  }
});

export default {
  safeGetValue,
  safeGetNestedValue,
  validateDataStructure,
  createDataPlaceholder,
  safeGetComparisonData,
  formatValue,
  debugDataStructure,
  getDefaultChartConfig
};
