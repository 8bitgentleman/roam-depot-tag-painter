// src/components/BorderStylePicker.jsx
import React from 'react';
import { Button, Menu, MenuItem, Popover } from '@blueprintjs/core';

const BORDER_STYLES = [
  'none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'
];

export const BorderStylePicker = ({ value, onChange }) => {
  return (
    <Popover
      content={
        <Menu>
          {BORDER_STYLES.map(style => (
            <MenuItem key={style} text={style} onClick={() => onChange(style)} />
          ))}
        </Menu>
      }
    >
      <Button small={true} text={value || 'Select'} />
    </Popover>
  );
};