// src/components/DropShadowPicker.jsx
import React from 'react';
import { NumericInput, Switch } from '@blueprintjs/core';
import { ColorPicker } from './ColorPicker';

export const DropShadowPicker = ({ value, onChange }) => {
  const parseBoxShadow = (boxShadow) => {
    const parts = boxShadow.split(' ');
    const isInset = parts[0] === 'inset';
    const [hOffset, vOffset, blur, spread, color] = isInset ? parts.slice(1) : parts;
    return {
      isInset,
      hOffset: parseInt(hOffset, 10) || 0,
      vOffset: parseInt(vOffset, 10) || 0,
      blur: parseInt(blur, 10) || 0,
      spread: parseInt(spread, 10) || 0,
      color
    };
  };

  const { isInset, hOffset, vOffset, blur, spread, color } = parseBoxShadow(value);

  const handleChange = (property, newValue) => {
    const updatedShadow = {
      isInset,
      hOffset,
      vOffset,
      blur,
      spread,
      color,
      [property]: newValue
    };

    const shadowString = `${updatedShadow.isInset ? 'inset ' : ''}${updatedShadow.hOffset}px ${updatedShadow.vOffset}px ${updatedShadow.blur}px ${updatedShadow.spread}px ${updatedShadow.color}`;
    onChange(shadowString.trim());
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
        {['hOffset', 'vOffset', 'blur', 'spread'].map((prop) => (
          <NumericInput
            key={prop}
            placeholder={prop.charAt(0).toUpperCase() + prop.slice(1)}
            value={eval(prop)}
            onValueChange={(valueAsNumber) => handleChange(prop, valueAsNumber)}
            min={prop === 'blur' || prop === 'spread' ? 0 : undefined}
            stepSize={1}
            majorStepSize={10}
            fill={true}
          />
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Switch
          checked={isInset}
          label="Inset"
          onChange={(e) => handleChange('isInset', e.target.checked)}
        />
        <ColorPicker
          value={color}
          onChange={(newColor) => handleChange('color', newColor)}
        />
      </div>
    </div>
  );
};