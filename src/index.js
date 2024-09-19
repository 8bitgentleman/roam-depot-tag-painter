// src/index.js
import pkg from '../package.json';
import { formatPackageName } from './utils/utils';
import createObserver from "roamjs-components/dom/createObserver";
import React from 'react';
import ReactDOM from 'react-dom';
import { TagPopoverMenu } from './components/TagPopoverMenu';

const extensionName = formatPackageName(pkg.name);
// TODO what should go in the settings panel?
// const panelConfig = {
//   tabTitle: extensionName,
//   settings: [
//     {
//       id: "button-setting",
//       name: "Button test",
//       description: "tests the button",
//       action: {
//         type: "button",
//         onClick: () => { console.log("Button clicked!"); },
//         content: "Button"
//       }

//     }
//   ]
// };

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
        console.log("Selected styles:", selectedStyles);
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

async function onload({ extensionAPI }) {
  try {
    // extensionAPI.settings.panel.create(panelConfig);

    // Set up the observer
    runners.observer = createObserver(() => {
      addListenersToTags(extensionAPI);
    });

    // Initial addition of listeners
    addListenersToTags(extensionAPI);
  } catch (error) {
    console.error("[onload] Error", error);
  }
}

function onunload() {
  try {
    if (runners.observer) {
      runners.observer.disconnect();
    }

    removeListenersFromTags();

    // Remove all tag-painter style elements
    document.querySelectorAll('style[id^="tag-painter-style-"]').forEach(el => el.remove());

    console.log("[onunload]", { extensionName, version: pkg.version });
  } catch (error) {
    console.error("[onunload] Error", error);
  }
}

export default {
  onload,
  onunload
};