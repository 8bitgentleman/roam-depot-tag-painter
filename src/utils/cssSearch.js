// src/utils/cssSearch.js
const CSS_PROPERTIES = [
    'background-color',
    'color',
    'border-style',
    'border-width',
    'border-color',
    'font-weight',
    'font-style',
    'text-decoration',
    'before',
    'after'
    // Add more properties as needed
  ];
  
  export const searchCSSProperties = (term) => {
    const lowerTerm = term.toLowerCase();
    return CSS_PROPERTIES.filter(prop => prop.toLowerCase().includes(lowerTerm));
  };