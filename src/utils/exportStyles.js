// src/utils/exportStyles.js

// Format property value based on its type
const formatPropertyValue = (property, value) => {
  // Properties that should have 'px' units if they're numbers
  const pxProperties = ['border-width', 'border-radius'];
  
  // Don't add px to these properties even if they're numbers
  const noUnitProperties = ['font-weight'];
  
  // If it's a px property and doesn't already have units
  if (pxProperties.includes(property) && /^\d+$/.test(value)) {
    return `${value}px`;
  }
  
  // Handle padding specially - ensure all values have px units
  if (property === 'padding') {
    return value.split(' ')
      .map(v => v.endsWith('px') ? v : `${v}px`)
      .join(' ');
  }
  
  // For other numeric properties (except those in noUnitProperties)
  if (!noUnitProperties.includes(property) && /^\d+$/.test(value)) {
    return `${value}px`;
  }
  
  return value;
};

// Generate a CSS string from the stored tag styles
export const generateTagStylesCSS = async (extensionAPI) => {
  const allSettings = await extensionAPI.settings.getAll();
  let cssContent = '/* Tag Painter Styles */\n\n';
  
  // Filter settings to only get tag styles
  const tagStyleEntries = Object.entries(allSettings)
    .filter(([key]) => key.startsWith('tagStyles-'));
  
  for (const [key, value] of tagStyleEntries) {
    if (!value) continue;
    
    const tagName = key.replace('tagStyles-', '');
    const styles = JSON.parse(value);
    
    // Main styles
    const mainRules = [];
    const pseudoElements = {
      before: { content: null, color: null },
      after: { content: null, color: null }
    };
    
    Object.entries(styles).forEach(([property, propertyValue]) => {
      // Handle pseudo-element properties
      if (property === 'before' || property === 'after') {
        pseudoElements[property].content = propertyValue;
      } else if (property === 'before-color') {
        pseudoElements.before.color = propertyValue;
      } else if (property === 'after-color') {
        pseudoElements.after.color = propertyValue;
      } else {
        // Format the value based on the property type
        const formattedValue = formatPropertyValue(property, propertyValue);
        mainRules.push(`  ${property}: ${formattedValue};`);
      }
    });
    
    // Generate main element styles
    if (mainRules.length > 0) {
      cssContent += `span.rm-page-ref--tag[data-tag="${tagName}"] {\n${mainRules.join('\n')}\n}\n\n`;
    }
    
    // Generate pseudo-element styles
    ['before', 'after'].forEach(pseudo => {
      const { content, color } = pseudoElements[pseudo];
      
      // Generate content rule if exists
      if (content) {
        cssContent += `span.rm-page-ref--tag[data-tag="${tagName}"]:${pseudo} {\n  content: ${content};\n}\n\n`;
      }
      
      // Generate color rule if exists (using text-shadow technique)
      if (color) {
        cssContent += `span.rm-page-ref--tag[data-tag="${tagName}"]:${pseudo} {\n  color: transparent;\n  text-shadow: 0 0 0 ${color};\n}\n\n`;
      }
    });
  }
  
  return cssContent;
};

// Export the CSS file
export const exportTagStyles = async (extensionAPI) => {
  try {
    const cssContent = await generateTagStylesCSS(extensionAPI);
    const blob = new Blob([cssContent], { type: 'text/css;charset=utf-8' });
    window.FileSaver.saveAs(blob, 'roam-tag-styles.css');
  } catch (error) {
    console.error('Error exporting tag styles:', error);
  }
};