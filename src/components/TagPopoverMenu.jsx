// /components/TagPopoverMenu.js
import React from 'react';
import { Popover, Menu, MenuItem } from '@blueprintjs/core';

export const TagPopoverMenu = ({ tagName, anchorElement, onClose }) => {
  return (
    <Popover
      content={
        <Menu>
          <MenuItem icon="search" text={`Search for "${tagName}"`} />
          <MenuItem icon="graph" text={`Show graph for "${tagName}"`} />
          <MenuItem icon="properties" text={`Show properties for "${tagName}"`} />
          <MenuItem icon="edit" text={`Edit "${tagName}"`} />
        </Menu>
      }
      target={anchorElement}
      isOpen={true}
      onClose={onClose}
    />
  );
};