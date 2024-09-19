// src/utils/roamStyler.js
export const applyStylesToTag = (tagName, styles) => {
  let styleEl = document.getElementById(`tag-painter-style-${tagName}`);

  if (Object.keys(styles).length === 0) {
    // If there are no styles, remove the style element if it exists
    if (styleEl) {
      styleEl.remove();
    }
    return;
  }
  const cssRules = [];

  // Generate the main tag rule
  let mainRule = `span.rm-page-ref--tag[data-tag="${tagName}"] {`;
  let beforeRule = '';
  let afterRule = '';

  Object.entries(styles).forEach(([property, value]) => {
    if (property === 'before' || property === 'after') {
      const pseudoRule = `span.rm-page-ref--tag[data-tag="${tagName}"]:${property} {
        content: ${value};
      }`;
      if (property === 'before') {
        beforeRule = pseudoRule;
      } else {
        afterRule = pseudoRule;
      }
    } else {
      mainRule += `${property}: ${value}; `;
    }
  });

  mainRule += '}';
  cssRules.push(mainRule);

  if (beforeRule) cssRules.push(beforeRule);
  if (afterRule) cssRules.push(afterRule);

  const cssString = cssRules.join('\n');

  // Create or update the style element
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = `tag-painter-style-${tagName}`;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = cssString;
};