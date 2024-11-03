// src/index.js
import pkg from '../package.json';
import { formatPackageName } from './utils/utils';
import { exportTagStyles } from './utils/exportStyles';
import createObserver from "roamjs-components/dom/createObserver";
import createIconButton from "roamjs-components/dom/createIconButton";
import React from 'react';
import ReactDOM from 'react-dom';
import { TagPopoverMenu } from './components/TagPopoverMenu';
import { applyStylesToTag } from './utils/roamStyler';

const extensionName = formatPackageName(pkg.name);

// Store observers and listeners globally so they can be managed
const runners = {
  observer: null,
  listeners: new Map(),
};

const createPopover = (target, tagName, extensionAPI) => {
  try {
    const existingPopover = document.querySelector('.tag-painter-popover');
    if (existingPopover) {
      ReactDOM.unmountComponentAtNode(existingPopover);
      existingPopover.remove();
    }

    const parent = document.createElement("div");
    parent.className = 'tag-painter-popover';
    document.body.appendChild(parent);

    // Position the popover near the tag
    const rect = target.getBoundingClientRect();
    parent.style.position = 'absolute';
    parent.style.left = `${rect.left}px`;
    parent.style.top = `${rect.bottom}px`;

    let selectedStyles = {};

    const handleClickOutside = (event) => {
      if (parent && !parent.contains(event.target) && !target.contains(event.target) && !event.target.closest('.bp3-popover')) {
        document.removeEventListener('mousedown', handleClickOutside);
        // Here you can handle the selected styles, e.g., save them to storage
        ReactDOM.unmountComponentAtNode(parent);
        parent.remove();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    ReactDOM.render(
      <TagPopoverMenu
        tagName={tagName}
        extensionAPI={extensionAPI}
        onClose={(styles) => {
          selectedStyles = styles;
        }}
      />,
      parent
    );

    return parent;
  } catch (error) {
    console.error("Error creating popover:", error);
  }
};

const popperFunction = (e, extensionAPI) => {
  try {
    if (e.target.closest('.tag-painter-popover')) {
      return;
    }

    let tag = e.target.innerText;
    if (tag.startsWith("#")) {
      tag = tag.slice(1);
    }
    createPopover(e.target, tag, extensionAPI);
  } catch (error) {
    console.error("Error in popperFunction:", error);
  }
};

const addListenersToTags = (extensionAPI) => {
  try {
    const tags = document.querySelectorAll(".rm-page-ref--tag");
    tags.forEach(tag => {
      if (!runners.listeners.has(tag)) {
        const listener = (e) => popperFunction(e, extensionAPI);
        tag.addEventListener("mouseenter", listener);
        runners.listeners.set(tag, listener);
      }
    });
  } catch (error) {
    console.error("Error in addListenersToTags:", error);
  }
};

const removeListenersFromTags = () => {
  try {
    runners.listeners.forEach((listener, tag) => {
      tag.removeEventListener("mouseenter", listener);
    });
    runners.listeners.clear();
  } catch (error) {
  }
};

let isTagEditingActive = false;
let topbarButton = null;

const toggleTagEditing = (extensionAPI) => {
  if (isTagEditingActive) {
    removeListenersFromTags();
    if (runners.observer) {
      runners.observer.disconnect();
      runners.observer = null;
    }
  } else {
    addListenersToTags(extensionAPI);
    runners.observer = createObserver(() => {
      addListenersToTags(extensionAPI);
    });
  }
  isTagEditingActive = !isTagEditingActive;
  updateButtonStyle();
};

const updateButtonStyle = () => {
  const button = document.getElementById('tag-painter-button');
  if (button) {
    if (isTagEditingActive) {
      button.classList.add('bp3-intent-primary');
    } else {
      button.classList.remove('bp3-intent-primary');
    }
  }
};

const addTagPainterButton = (extensionAPI) => {
  if (topbarButton) return; // Prevent adding multiple buttons

  const button = createIconButton('style');
  button.id = 'tag-painter-button';
  button.addEventListener('click', () => toggleTagEditing(extensionAPI));

  const calendarIcon = document.querySelector('.rm-topbar .bp3-icon-calendar');
  if (!calendarIcon) {
    console.error("Couldn't find the calendar icon");
    return;
  }

  const calendarWrapper = calendarIcon.closest('.bp3-popover-wrapper');
  if (!calendarWrapper) {
    console.error("Couldn't find the calendar wrapper");
    return;
  }

  const buttonWrapper = document.createElement('span');
  buttonWrapper.className = 'bp3-popover-wrapper';
  const buttonTarget = document.createElement('span');
  buttonTarget.className = 'bp3-popover-target';
  buttonTarget.appendChild(button);
  buttonWrapper.appendChild(buttonTarget);

  calendarWrapper.parentNode.insertBefore(buttonWrapper, calendarWrapper);

  const spacer = document.createElement('div');
  spacer.className = 'rm-topbar__spacer-sm';
  calendarWrapper.parentNode.insertBefore(spacer, calendarWrapper);

  topbarButton = buttonWrapper;
};

const removeTagPainterButton = () => {
  if (topbarButton) {
    const nextSpacer = topbarButton.nextElementSibling;
    if (nextSpacer && nextSpacer.className === 'rm-topbar__spacer-sm') {
      nextSpacer.remove();
    }
    topbarButton.remove();
    topbarButton = null;
  }
};

const addCommandPaletteCommand = (extensionAPI) => {
  extensionAPI.ui.commandPalette.addCommand({
    label: 'Toggle Tag Painter',
    callback: () => toggleTagEditing(extensionAPI)
  });
};

const loadAndApplyAllStyles = async (extensionAPI) => {
  try {
    const allSettings = await extensionAPI.settings.getAll();
    if (!allSettings) {
      console.log("No settings found");
      return;
    }

    Object.entries(allSettings).forEach(([key, value]) => {
      if (key.startsWith('tagStyles-') && value !== null && value !== undefined) {
        const tagName = key.replace('tagStyles-', '');
        try {
          const styles = JSON.parse(value);
          applyStylesToTag(tagName, styles);
        } catch (parseError) {
          console.error(`Error parsing styles for tag ${tagName}:`, parseError);
        }
      }
    });
  } catch (error) {
    console.error("Error loading and applying styles:", error);
  }
};

// MARK: Load
async function onload({ extensionAPI }) {
  try {
    const panelConfig = {
      tabTitle: extensionName,
      settings: [
        {
          id: "show-topbar-button",
          name: "Show Topbar Button",
          description: "Toggle visibility of the Tag Painter button in the topbar",
          action: {
            type: "switch",
            onChange: (evt) => {
              if (evt.target.checked) {
                addTagPainterButton(extensionAPI);
              } else {
                removeTagPainterButton();
              }
              extensionAPI.settings.set('show-topbar-button', evt.target.checked);
            }
          }
        },
        {
          id: "export-css",
          name: "Export CSS",
          description: "Toggle visibility of the Tag Painter button in the topbar",
          action: {
            type: "button",
            onClick: () => {
              console.log(extensionAPI);
              
              exportTagStyles(extensionAPI);
            },
            content: "Export"
          }
        }
      ]
    };

    extensionAPI.settings.panel.create(panelConfig);
    
    const showTopbarButton = await extensionAPI.settings.get('show-topbar-button') ?? true;
    if (showTopbarButton) {
      addTagPainterButton(extensionAPI);
    }

    addCommandPaletteCommand(extensionAPI);
    
    await loadAndApplyAllStyles(extensionAPI);
  } catch (error) {
    console.error("[onload] Error", error);
  }
}

// MARK: UNLOAD
function onunload() {
  try {
    removeListenersFromTags();
    if (runners.observer) {
      runners.observer.disconnect();
    }

    document.querySelectorAll('style[id^="tag-painter-style-"]').forEach(el => el.remove());

    removeTagPainterButton();

    console.log("[onunload]", { extensionName, version: pkg.version });
  } catch (error) {
    console.error("[onunload] Error", error);
  }
}

export default {
  onload,
  onunload
};