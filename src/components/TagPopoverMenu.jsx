// src/TagPopoverMenu.jsx
import React, { useRef, useEffect } from 'react';
import { Popover, Menu, MenuItem } from '@blueprintjs/core';

export const TagPopoverMenu = ({ tagName, targetElement, onClose }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (wrapperRef.current && targetElement) {
      const rect = targetElement.getBoundingClientRect();
      wrapperRef.current.style.position = 'absolute';
      wrapperRef.current.style.left = `${rect.left}px`;
      wrapperRef.current.style.top = `${rect.top}px`;
      wrapperRef.current.style.width = `${rect.width}px`;
      wrapperRef.current.style.height = `${rect.height}px`;
    }
  }, [targetElement]);

  return (
    <div ref={wrapperRef} style={{ position: 'absolute' }}>
      <Popover
        content={
          <Menu>
            <MenuItem 
              icon="search" 
              text={`Search for "${tagName}"`} 
              onClick={() => console.log("[MenuItem] Clicked", { action: "search", tagName })}
            />
            <MenuItem 
              icon="graph" 
              text={`Show graph for "${tagName}"`} 
              onClick={() => console.log("[MenuItem] Clicked", { action: "graph", tagName })}
            />
            <MenuItem 
              icon="properties" 
              text={`Show properties for "${tagName}"`} 
              onClick={() => console.log("[MenuItem] Clicked", { action: "properties", tagName })}
            />
            <MenuItem 
              icon="edit" 
              text={`Edit "${tagName}"`} 
              onClick={() => console.log("[MenuItem] Clicked", { action: "edit", tagName })}
            />
          </Menu>
        }
        isOpen={true}
        onClose={onClose}
        placement="bottom-start"
        minimal={true}
      >
        <div style={{ width: '100%', height: '100%' }} />
      </Popover>
    </div>
  );
};