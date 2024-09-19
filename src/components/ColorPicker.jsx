import React, { useState, useCallback } from 'react';
import { Button, Popover, Classes } from '@blueprintjs/core';
import { ChromePicker } from 'react-color';

export const ColorPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = useCallback((color) => {
    // Include alpha in the color value
    const { r, g, b, a } = color.rgb;
    const rgba = `rgba(${r}, ${g}, ${b}, ${a})`;
    onChange(rgba);
  }, [onChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleClick = useCallback((event) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <Popover
      isOpen={isOpen}
      onInteraction={(state) => setIsOpen(state)}
      content={
        <div className={Classes.POPOVER_CONTENT} style={{ zIndex: 9000 }}>
          <ChromePicker
            color={value || 'rgba(0, 0, 0, 1)'}
            onChange={handleColorChange}
            onChangeComplete={handleClose}
            disableAlpha={false}
          />
        </div>
      }
      placement="bottom"
      modifiers={{ 
        preventOverflow: { enabled: false },
        offset: { enabled: true, offset: '0, 10' }
      }}
    >
      <Button
        style={{
          backgroundColor: value || 'rgba(0, 0, 0, 1)',
          width: '30px',
          height: '30px',
          border: '1px solid #ccc'
        }}
        className={Classes.BUTTON}
        onClick={handleClick}
      />
    </Popover>
  );
};