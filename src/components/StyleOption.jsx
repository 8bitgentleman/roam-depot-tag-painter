import React from 'react';
import { Button, FormGroup, HTMLSelect } from '@blueprintjs/core';
import { ColorPicker } from './ColorPicker';

export const StyleOption = ({ property, value, onChange, onRemove }) => {
  const renderStylePicker = () => {
    if (property.includes('color')) {
      return <ColorPicker value={value} onChange={(color) => onChange(property, color)} />;
    } else if (property === 'font-weight') {
      return (
        <HTMLSelect
          value={value}
          onChange={(e) => onChange(property, e.target.value)}
          options={['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']}
        />
      );
    } else if (property === 'font-style') {
      return (
        <HTMLSelect
          value={value}
          onChange={(e) => onChange(property, e.target.value)}
          options={['normal', 'italic', 'oblique']}
        />
      );
    } else if (property === 'text-decoration') {
      return (
        <HTMLSelect
          value={value}
          onChange={(e) => onChange(property, e.target.value)}
          options={['none', 'underline', 'overline', 'line-through']}
        />
      );
    } else if (property === 'border-style') {
      return (
        <HTMLSelect
          value={value}
          onChange={(e) => onChange(property, e.target.value)}
          options={['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']}
        />
      );
    }
    // For other properties, use a simple input
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(property, e.target.value)}
        className="bp3-input"
      />
    );
  };

  return (
    <FormGroup
      label={property}
      labelInfo={<Button icon="trash" minimal={true} small={true} onClick={() => onRemove(property)} />}
      className="bp3-form-group"
    >
      {renderStylePicker()}
    </FormGroup>
  );
};