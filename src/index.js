import pkg from '../package.json';
import { formatPackageName } from './utils';
import createObserver from "roamjs-components/dom/createObserver";

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
    },
    {
      id: "switch-setting",
      name: "Switch Test",
      description: "Test switch component",
      action: {
        type: "switch",
        onChange: (evt) => { console.log("Switch!", evt); }
      }
    },
    {
      id: "input-setting",
      name: "Input test",
      action: {
        type: "input",
        placeholder: "placeholder",
        onChange: (evt) => { console.log("Input Changed!", evt); }
      }
    },
    {
      id: "select-setting",
      name: "Select test",
      action: {
        type: "select",
        items: ["one", "two", "three"],
        onChange: (evt) => { console.log("Select Changed!", evt); }
      }
    }
  ]
};

// Store observers and listeners globally so they can be managed
const runners = {
  observer: null,
  listeners: new Set(),
};

const popperFunction = (e) => {
  let tag = e.target.innerText;
  if (tag.startsWith("#")) {
    tag = tag.slice(1);
  }
  console.log(tag);
};

const addListenersToTags = () => {
  const tags = document.querySelectorAll(".rm-page-ref--tag");
  tags.forEach(tag => {
    if (!runners.listeners.has(tag)) {
      tag.addEventListener("mouseover", popperFunction);
      runners.listeners.add(tag);
    }
  });
};

const removeListenersFromTags = () => {
  runners.listeners.forEach(tag => {
    tag.removeEventListener("mouseover", popperFunction);
  });
  runners.listeners.clear();
};

async function onload({ extensionAPI }) {
  extensionAPI.settings.panel.create(panelConfig);

  runners.observer = createObserver(addListenersToTags);

  console.log(`${extensionName} version ${pkg.version} loaded`);
}

function onunload() {
  if (runners.observer) {
    runners.observer.disconnect();
  }
  removeListenersFromTags();
  console.log(`${extensionName} version ${pkg.version} unloaded`);
}

export default {
  onload,
  onunload
};