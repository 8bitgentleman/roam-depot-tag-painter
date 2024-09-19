import React, { useState } from 'react';
import { Button, Popover, Classes, InputGroup } from '@blueprintjs/core';

export const ColorPicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <Popover
      style={{ zIndex: 9999 }}
      isOpen={isOpen}
      onInteraction={(state) => setIsOpen(state)}
      content={
        <div className={Classes.POPOVER_CONTENT}>
          <InputGroup
            type="color"
            value={value || '#000000'}
            onChange={handleColorChange}
            rightElement={
              <Button
                minimal={true}
                onClick={() => setIsOpen(false)}
                text="Close"
              />
            }
          />
        </div>
      }
      placement="bottom"
    >
      <Button
        style={{ backgroundColor: value || '#000000' }}
        className={Classes.BUTTON}
        onClick={() => setIsOpen(!isOpen)}
      />
    </Popover>
  );
};