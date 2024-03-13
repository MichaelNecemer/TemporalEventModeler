import Modeler from 'bpmn-js/lib/Modeler';

import {
  assign,
  isArray
} from 'min-dash';

import inherits from 'inherits-browser';

import CustomModule from './custom';


export default function CustomModeler(options) {
  Modeler.call(this, options);

  this._customElements = [];
}

inherits(CustomModeler, Modeler);

CustomModeler.prototype._modules = [].concat(
  CustomModeler.prototype._modules,
  [
    CustomModule
  ]
);