// src/components/StyleOption.jsx
import React from 'react';
import { Button, HTMLSelect, NumericInput } from '@blueprintjs/core';
import { ColorPicker } from './ColorPicker';
import { PaddingPicker } from './PaddingPicker';
import { BorderRadiusPicker } from './BorderRadiusPicker';
import { ContentInput } from './ContentInput';

export const StyleOption = ({ property, value, onChange, onRemove }) => {
  const handleChange = (newValue) => {
    onChange(property, newValue);
  };

  const renderStylePicker = () => {
    if (property.includes('color') || property === 'before-color' || property === 'after-color') {
      return <ColorPicker value={value} onChange={handleChange} />;
    } else if (['font-weight', 'font-style', 'text-decoration', 'text-decoration-style', 'border-style'].includes(property)) {
      return (
        <HTMLSelect
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          options={getOptionsForProperty(property)}
          fill={true}
        />
      );
    } else if (property === 'padding') {
      return <PaddingPicker value={value} onChange={handleChange} />;
    } else if (property === 'border-radius') {
      return <BorderRadiusPicker value={value} onChange={handleChange} />;
    } else if (property === 'border-width') {
      return (
        <NumericInput
          value={parseInt(value, 10) || 0}
          onValueChange={(valueAsNumber) => handleChange(`${valueAsNumber}px`)}
          min={0}
          stepSize={1}
          majorStepSize={5}
          fill={true}
        />
      );
    } else if (property === 'before' || property === 'after') {
      return <ContentInput value={value} onChange={handleChange} />;
    }
    // For other properties, use a NumericInput
    return (
      <NumericInput
        value={parseInt(value, 10) || 0}
        onValueChange={(valueAsNumber) => handleChange(`${valueAsNumber}px`)}
        min={0}
        stepSize={1}
        majorStepSize={10}
        fill={true}
      />
    );
  };

  return (
    <div className="bp3-form-group" style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="bp3-label" style={{ marginRight: '10px', minWidth: '100px', flexShrink: 0 }}>
          {property}
        </label>
        <div style={{ flexGrow: 1, minWidth: 0 }}>
          {renderStylePicker()}
        </div>
        <Button icon="trash" minimal={true} small={true} onClick={() => onRemove(property)} style={{ marginLeft: '5px' }} />
      </div>
    </div>
  );
};

const getOptionsForProperty = (property) => {
  switch (property) {
    case 'font-weight':
      return ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
    case 'font-style':
      return ['normal', 'italic', 'oblique'];
    case 'text-decoration':
      return ['none', 'underline', 'overline', 'line-through'];
    case 'text-decoration-style':
      return ['solid','double','dotted','dashed', 'wavy'];
    case 'border-style':
      return ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];
    default:
      return [];
  }
};