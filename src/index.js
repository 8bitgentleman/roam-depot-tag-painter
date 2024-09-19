// src/index.js
import pkg from '../package.json';
import { formatPackageName } from './utils';
import createObserver from "roamjs-components/dom/createObserver";
import React from 'react';
import ReactDOM from 'react-dom';
import { TagPopoverMenu } from './components/TagPopoverMenu';

const extensionName = formatPackageName(pkg.name);
const panelConfig = {
  tabTitle: extensionName,
  settings: [
    {
      id: "button-setting",
      name: "Button test",
      description: "tests the button",
      action: {
        type: "button",
        onClick: () => { console.log("Button clicked!"); },
        content: "Button"
      }

    }
  ]
};

// Store observers and listeners globally so they can be managed
const runners = {
  observer: null,
  listeners: new Map(),
};

const createPopover = (target, tagName) => {
  try {
    const parent = document.createElement("div");
    document.body.appendChild(parent);

    ReactDOM.render(
      <TagPopoverMenu
        tagName={tagName}
        targetElement={target}
        onClose={() => {
          ReactDOM.unmountComponentAtNode(parent);
          parent.remove();
        }}
      />,
      parent
    );

    return parent;
  } catch (error) {
  }
};

const popperFunction = (e) => {
  try {
    let tag = e.target.innerText;
    if (tag.startsWith("#")) {
      tag = tag.slice(1);
    }
    createPopover(e.target, tag);
  } catch (error) {
  }
};

const addListenersToTags = () => {
  try {
    const tags = document.querySelectorAll(".rm-page-ref--tag");
    tags.forEach(tag => {
      if (!runners.listeners.has(tag)) {
        const listener = (e) => popperFunction(e);
        tag.addEventListener("mouseenter", listener);
        runners.listeners.set(tag, listener);
      }
    });
  } catch (error) {
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
    extensionAPI.settings.panel.create(panelConfig);

    // Set up the observer
    runners.observer = createObserver(() => {
      addListenersToTags();
    });

    // Initial addition of listeners
    addListenersToTags();

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

    console.log("[onunload]", { extensionName, version: pkg.version });
  } catch (error) {
    console.error("[onunload] Error", error);
  }
}

export default {
  onload,
  onunload
};