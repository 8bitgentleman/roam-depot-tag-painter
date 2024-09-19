// src/components/FontStylePicker.jsx
import React from 'react';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';

const FONT_STYLES = ['normal', 'italic', 'oblique'];
const FONT_WEIGHTS = ['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

export const FontStylePicker = ({ property, value, onChange }) => {
  const options = property === 'font-style' ? FONT_STYLES : FONT_WEIGHTS;

  return (
    <Popover
      content={
        <Menu>
          {options.map(option => (
            <MenuItem key={option} text={option} onClick={() => onChange(option)} />
          ))}
        </Menu>
      }
    >
      <Button small={true} text={value || 'Select'} />
    </Popover>
  );
};