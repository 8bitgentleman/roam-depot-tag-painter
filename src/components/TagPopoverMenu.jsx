// src/components/TagPopoverMenu.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { InputGroup, Button, Menu, MenuItem, Card, Divider } from '@blueprintjs/core';
import { StyleOption } from './StyleOption';
import { searchCSSProperties } from '../utils/cssSearch';
import { applyStylesToTag } from '../utils/roamStyler';

export const TagPopoverMenu = ({ tagName, extensionAPI, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyles, setSelectedStyles] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Load saved styles when the component mounts
  useEffect(() => {
    const loadSavedStyles = async () => {
      const savedStyles = await extensionAPI.settings.get(`tagStyles-${tagName}`);
      if (savedStyles) {
        setSelectedStyles(JSON.parse(savedStyles));
      }
    };
    loadSavedStyles();
  }, [tagName, extensionAPI.settings]);

  useEffect(() => {
    setSearchResults(searchCSSProperties(searchTerm));
  }, [searchTerm]);

  useEffect(() => {
    const applyStyles = async () => {
      setIsApplying(true);
      if (Object.keys(selectedStyles).length > 0) {
        applyStylesToTag(tagName, selectedStyles);
        // Save the styles using extensionAPI
        await extensionAPI.settings.set(`tagStyles-${tagName}`, JSON.stringify(selectedStyles));
      } else {
        // Remove all styles and clear the setting
        applyStylesToTag(tagName, {});
        await extensionAPI.settings.set(`tagStyles-${tagName}`, null);
      }
      setIsApplying(false);
    };

    applyStyles();
    
    // Call onClose with the updated selectedStyles
    onClose(selectedStyles);
  }, [selectedStyles, tagName, onClose, extensionAPI.settings]);

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

  const renderSearchResults = () => (
    <Menu className="tag-popover-search-results" style={{ maxHeight: '200px', overflowY: 'auto' }}>
      {searchResults.map(property => (
        <MenuItem
          key={property}
          text={property}
          onClick={() => handleAddStyle(property)}
        />
      ))}
    </Menu>
  );

  const renderSelectedStyles = () => (
    <div className="tag-popover-selected-styles" style={{ maxHeight: '200px', overflowY: 'auto' }}>
      {Object.entries(selectedStyles).map(([property, value]) => (
        <StyleOption
          key={property}
          property={property}
          value={value}
          onChange={handleStyleChange}
          onRemove={handleRemoveStyle}
        />
      ))}
    </div>
  );

  return (
    <Card className="tag-popover-content bp3-popover-content" elevation={2} style={{ zIndex: 90, padding: '10px', width: '300px' }}>
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
      <Divider style={{ margin: '10px 0' }} />
      {isSearching ? renderSearchResults() : renderSelectedStyles()}
      {isApplying && <div className="bp3-text-muted" style={{ marginTop: '10px' }}>Applying styles...</div>}
    </Card>
  );
};