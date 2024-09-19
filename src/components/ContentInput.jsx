// src/components/ContentInput.jsx
import React from 'react';
import { InputGroup } from '@blueprintjs/core';

export const ContentInput = ({ value, onChange }) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(`"${newValue}"`);
  };

  // Remove surrounding quotes for display
  const displayValue = value.replace(/^"|"$/g, '');

  return (
    <InputGroup
      value={displayValue}
      onChange={handleChange}
      placeholder="Enter content"
      fill={true}
    />
  );
};