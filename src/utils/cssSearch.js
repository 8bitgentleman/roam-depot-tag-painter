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
  'text-decoration-style',
  'padding',
  'before',
  'after',
  'before-color',
  'after-color'
];

export const searchCSSProperties = (term) => {
  const lowerTerm = term.toLowerCase();
  return CSS_PROPERTIES.filter(prop => prop.toLowerCase().includes(lowerTerm));
};