/*
  File: src/styles/magicalStyles.js

  This module provides a base set of "magical" Tailwind CSS class names for different plan types,
  along with a deep generating utility function that creates extended style objects with additional
  variants, such as hover, border, and active states.

  The deepGenerateStyles function derives additional style variants by replacing parts of the base class strings.
  You can adjust the logic in the function to fit your project's design requirements.
*/

const baseMagicalStyles = {
  default: 'bg-gray-100 text-gray-900',
  cost: 'bg-red-100 text-red-900',
  income: 'bg-green-100 text-green-900',
  hr: 'bg-blue-100 text-blue-900',
};

/**
 * Generates deep style variations for each plan type.
 *
 * For each base style, this function creates:
 *  - base: the original style.
 *  - hover: a slightly darker variant (e.g., bg-100 becomes bg-200).
 *  - border: a variant used for border styling (e.g., bg- replaced with border- and 100 becomes 300).
 *  - active: a stronger variant (e.g., bg-100 becomes bg-300).
 *
 * Note: This is a simplistic conversion and may need adjustment for your specific Tailwind configurations.
 *
 * @returns {Object} deepStyles - An object with plan types as keys and their variant objects.
 */
function deepGenerateStyles() {
  const deepStyles = {};

  Object.keys(baseMagicalStyles).forEach((key) => {
    const baseStyle = baseMagicalStyles[key];
    
    // Generate hover state by replacing "100" with "200" if present.
    const hoverStyle = baseStyle.includes('100')
      ? baseStyle.replace(/100/g, '200')
      : baseStyle;
    
    // Generate active state by replacing "100" with "300" if present.
    const activeStyle = baseStyle.includes('100')
      ? baseStyle.replace(/100/g, '300')
      : baseStyle;
    
    // Generate border style by replacing the background prefix and number.
    // For example: 'bg-red-100' becomes 'border-red-300'
    const borderStyle = baseStyle.split(' ').map(cls => {
      if (cls.startsWith('bg-') && cls.includes('100')) {
        return cls.replace('bg-', 'border-').replace(/100/g, '300');
      }
      return cls;
    }).join(' ');

    deepStyles[key] = {
      base: baseStyle,
      hover: hoverStyle,
      active: activeStyle,
      border: borderStyle
    };
  });

  return deepStyles;
}

// Export both the static base styles and the deep generated styles
export { baseMagicalStyles, deepGenerateStyles };

export default baseMagicalStyles;