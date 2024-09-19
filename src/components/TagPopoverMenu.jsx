import React, { useState, useEffect, useCallback } from 'react';
import { InputGroup, Button, Menu, MenuItem, Card, Divider } from '@blueprintjs/core';
import { StyleOption } from './StyleOption';
import { searchCSSProperties } from '../utils/cssSearch';
import { applyStylesToTag } from '../utils/roamStyler';

export const TagPopoverMenu = ({ tagName, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyles, setSelectedStyles] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    setSearchResults(searchCSSProperties(searchTerm));
  }, [searchTerm]);

  useEffect(() => {
    const applyStyles = async () => {
      setIsApplying(true);
      await applyStylesToTag(tagName, selectedStyles);
      setIsApplying(false);
    };

    if (Object.keys(selectedStyles).length > 0) {
      applyStyles();
    }
  }, [selectedStyles, tagName]);

  const handleStyleChange = useCallback((property, value) => {
    setSelectedStyles(prevStyles => ({
      ...prevStyles,
      [property]: value
    }));
  }, []);

  const handleRemoveStyle = useCallback((property) => {
    setSelectedStyles(prevStyles => {
      const newStyles = { ...prevStyles };
      delete newStyles[property];
      return newStyles;
    });
  }, []);

  const handleAddStyle = useCallback((property) => {
    setSelectedStyles(prevStyles => ({
      ...prevStyles,
      [property]: ''
    }));
    setSearchTerm('');
    setIsSearching(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearching(prev => !prev);
  }, []);

  return (
    <Card className="tag-popover-content bp3-popover-content" elevation={2}>
      <InputGroup
        placeholder="Search for styles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        rightElement={
          <Button
            icon={isSearching ? "cross" : "add"}
            minimal={true}
            onClick={toggleSearch}
          />
        }
        className="tag-popover-search"
      />
      <Divider />
      {isSearching ? (
        <Menu>
          {searchResults.map(property => (
            <MenuItem
              key={property}
              text={property}
              onClick={() => handleAddStyle(property)}
            />
          ))}
        </Menu>
      ) : (
        <>
          {Object.entries(selectedStyles).map(([property, value]) => (
            <StyleOption
              key={property}
              property={property}
              value={value}
              onChange={handleStyleChange}
              onRemove={handleRemoveStyle}
            />
          ))}
        </>
      )}
      {isApplying && <div className="bp3-text-muted">Applying styles...</div>}
    </Card>
  );
};