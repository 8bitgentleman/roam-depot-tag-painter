import pkg from '../package.json';
import { formatPackageName } from './utils';

const panelConfig = {
  tabTitle: formatPackageName(pkg.name),
  settings: [
      {id:          "button-setting",
       name:        "Button test",
       description: "tests the button",
       action:      {type:    "button",
                     onClick: (evt) => { console.log("Button clicked!"); },
                     content: "Button"}},
      {id:          "switch-setting",
       name:        "Switch Test",
       description: "Test switch component",
       action:      {type:     "switch",
                     onChange: (evt) => { console.log("Switch!", evt); }}},
      {id:     "input-setting",
       name:   "Input test",
       action: {type:        "input",
                placeholder: "placeholder",
                onChange:    (evt) => { console.log("Input Changed!", evt); }}},
      {id:     "select-setting",
       name:   "Select test",
       action: {type:     "select",
                items:    ["one", "two", "three"],
                onChange: (evt) => { console.log("Select Changed!", evt); }}}
  ]
};

// store observers globally so they can be disconnected 
var runners = {
  observers: [],
  listeners: [],
}

async function onload({extensionAPI}) {
  extensionAPI.settings.panel.create(panelConfig);

  const popperFunction = (e) => {
    let t = e['target'];
    let tag = e['target'].innerText;

    if (tag.startsWith("#")) {
      tag = tag.slice(1)
    }

    console.log(tag, t);
  };
  runners["listeners"].push(popperFunction);

  var tagObserver = createObserver(() => {
  
    if (document.querySelectorAll(".rm-page-ref--tag")) {
      var tags = document.querySelectorAll(".rm-page-ref--tag");
      tags.forEach(li =>{
        li.addEventListener("mouseover", popperFunction);
      })
    }})
  
  runners["observers"].push(tagObserver);

  console.log(`${pkg.name} version ${pkg.version} loaded`);
}

function onunload() {
  // remove observers
  runners["observers"].forEach(element =>{element.disconnect();})

  // remove listeners
  if (document.querySelectorAll(".rm-page-ref--tag")) {
    var tags = document.querySelectorAll(".rm-page-ref--tag");
    tags.forEach(li =>{
      li.removeEventListener('mouseover', runners["listeners"][0]);

    })}
  console.log(`${pkg.name} version ${pkg.version} unloaded`);
}

export default {
  onload,
  onunload
};