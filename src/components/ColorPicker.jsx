import React, { useState, useCallback } from 'react';
import { Button, Popover, Classes } from '@blueprintjs/core';
import { ChromePicker } from 'react-color';

export const ColorPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = useCallback((color) => {
    onChange(color.hex);
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
        <div className={Classes.POPOVER_CONTENT} style={{ zIndex: 1000 }}>
          <ChromePicker
            color={value || '#000000'}
            onChange={handleColorChange}
            onChangeComplete={handleClose}
            disableAlpha={true}
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
        style={{ backgroundColor: value || '#000000' }}
        className={Classes.BUTTON}
        onClick={handleClick}
      />
    </Popover>
  );
};