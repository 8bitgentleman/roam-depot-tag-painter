// src/utils/cssSearch.js
export const CSS_PROPERTIES = [
  'background-color',
  'color',
  'border-style',
  'border-width',
  'border-color',
  'border-radius',
  'font-weight',
  'font-style',
  'text-decoration',
  'padding',
  // 'box-shadow',
  'before',
  'after'
  // Add more properties as needed
];

export const searchCSSProperties = (term) => {
  const lowerTerm = term.toLowerCase();
  return CSS_PROPERTIES.filter(prop => prop.toLowerCase().includes(lowerTerm));
};