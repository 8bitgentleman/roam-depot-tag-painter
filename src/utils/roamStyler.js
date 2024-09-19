// src/utils/roamStyler.js
export const applyStylesToTag = (tagName, styles) => {
  let styleEl = document.getElementById(`tag-painter-style-${tagName}`);

  if (Object.keys(styles).length === 0) {
    if (styleEl) {
      styleEl.remove();
    }
    return;
  }

  const mainRules = [];
  let beforeRule = '';
  let afterRule = '';

  Object.entries(styles).forEach(([property, value]) => {
    if (property === 'before' || property === 'after') {
      const pseudoRule = `span.rm-page-ref--tag[data-tag="${tagName}"]:${property} {
        content: ${value};
      }`;
      if (property === 'before') {
        beforeRule += pseudoRule;
      } else {
        afterRule += pseudoRule;
      }
    } else if (property === 'before-color' || property === 'after-color') {
      const pseudo = property.split('-')[0];
      const pseudoColorRule = `span.rm-page-ref--tag[data-tag="${tagName}"]:${pseudo} {
        color: transparent;
        text-shadow: 0 0 0 ${value};
      }`;
      if (pseudo === 'before') {
        beforeRule += pseudoColorRule;
      } else {
        afterRule += pseudoColorRule;
      }
    } else {
      mainRules.push(`${property}: ${value};`);
    }
  });

  const mainRule = `span.rm-page-ref--tag[data-tag="${tagName}"] {
    ${mainRules.join('\n    ')}
  }`;

  const cssRules = [mainRule, beforeRule, afterRule].filter(Boolean);
  const cssString = cssRules.join('\n\n');

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = `tag-painter-style-${tagName}`;
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = cssString;
};