// src/components/BorderRadiusPicker.jsx
import React from 'react';
import { NumericInput } from '@blueprintjs/core';

export const BorderRadiusPicker = ({ value, onChange }) => {
  const numericValue = parseInt(value, 10) || 0;

  return (
    <NumericInput
      value={numericValue}
      onValueChange={(valueAsNumber) => onChange(`${valueAsNumber}px`)}
      min={0}
      stepSize={1}
      majorStepSize={10}
      placeholder="Border Radius"
      fill={true}
    />
  );
};