import CustomModeler from "./custom-modeler";

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
} from "bpmn-js-properties-panel";

import temporalConstraintsExtension from "./moddle-extension/temporalConstraintsExtension.json";

import CustomCommandInterceptor from "./utils/CustomCommandInterceptor";

import "./styles/styles.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "@bpmn-io/properties-panel/dist/assets/properties-panel.css";

let fileHandle;

const initialDiagram =  '<?xml version="1.0" encoding="UTF-8"?>' +
'<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                  'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                  'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                  'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" ' +
                  'targetNamespace="http://bpmn.io/schema/bpmn" ' +
                  'id="Definitions_1">' +
  '<bpmn:process id="Process_1" isExecutable="false">' +
  '</bpmn:process>' +
  '<bpmndi:BPMNDiagram id="BPMNDiagram_1">' +
    '<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">' +
    '</bpmndi:BPMNPlane>' +
  '</bpmndi:BPMNDiagram>' +
'</bpmn:definitions>';


const modeler = new CustomModeler({
  container: "#canvas",
  propertiesPanel: {
    parent: "#properties",
  },
  moddleExtensions: {
    tc: temporalConstraintsExtension,
  },
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CustomCommandInterceptor,
  ],
  keyboard: {
    bindTo: document,
  },
});


modeler.createDiagram(initialDiagram);

// Add the load and save buttons
const buttonContainer = document.getElementById("button-container");

const uploadButton = document.createElement("button");
uploadButton.id = "load-button";
uploadButton.textContent = "Open BPMN";

const saveButton = document.createElement("button");
saveButton.id = "save-button";
saveButton.textContent = "Save BPMN";

const exportSVGButton = document.createElement("button");
exportSVGButton.id = "svg-button";
exportSVGButton.textContent = "Export SVG";

buttonContainer.appendChild(uploadButton);
buttonContainer.appendChild(saveButton);
buttonContainer.appendChild(exportSVGButton);

uploadButton.addEventListener("click", handleFileSelect);
saveButton.addEventListener("click", saveFileAs);
exportSVGButton.addEventListener("click", exportSVG);

async function handleFileSelect() {
  [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const currentDiagram = await file.text();
  importXml(currentDiagram);
}

async function saveFileAs() {
  const optionsForFileHandler = {
    suggestedName: fileHandle?.name || "diagram",
    types: [
      {
        description: "BPMN",
        accept: { "text/plain": [".bpmn"] },
      },
    ],
  };
  fileHandle = await window.showSaveFilePicker(optionsForFileHandler);

  exportXml();
}

async function exportXml() {
  const { xml } = await modeler.saveXML({ format: true });

  let stream = await fileHandle.createWritable();
  await stream.write(xml);
  await stream.close();
}

async function importXml(xmlFile) {
  modeler
    .importXML(xmlFile)
    .then((result) => {
      const { warnings } = result;
      //modeler.get('canvas').zoom('fit-viewport', 'auto');
    })
    .catch(function (err) {
      const { warnings, message } = err;

      console.log("something went wrong:", warnings, message);
    });
}

async function exportSVG() {
  const optionsForFileHandler = {
    suggestedName: fileHandle?.name || "diagram",
    types: [
      {
        description: "SVG",
        accept: { "text/plain": [".svg"] },
      },
    ],
  };
  fileHandle = await window.showSaveFilePicker(optionsForFileHandler);

  const { svg } = await modeler.saveSVG({ format: true });

  let stream = await fileHandle.createWritable();
  await stream.write(svg);
  await stream.close();
}
