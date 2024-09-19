// src/components/PaddingPicker.jsx
import React from 'react';
import { NumericInput } from '@blueprintjs/core';

export const PaddingPicker = ({ value, onChange }) => {
  const [top, right, bottom, left] = value.split(' ').map(v => parseInt(v, 10) || 0);

  const handleChange = (side, newValue) => {
    const values = [top, right, bottom, left];
    const index = ['top', 'right', 'bottom', 'left'].indexOf(side);
    values[index] = newValue;
    onChange(values.map(v => `${v}px`).join(' '));
  };

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {['top', 'right', 'bottom', 'left'].map((side, index) => (
        <NumericInput
          key={side}
          placeholder={side.charAt(0).toUpperCase() + side.slice(1)}
          value={[top, right, bottom, left][index]}
          onValueChange={(valueAsNumber) => handleChange(side, valueAsNumber)}
          min={0}
          stepSize={1}
          majorStepSize={10}
          fill={true}
        />
      ))}
    </div>
  );
};