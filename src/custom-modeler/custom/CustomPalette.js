 let excludeEntriesFromPalette = [];
/*  excludeEntriesFromPalette.push(
  "create.task", "create.data-object", "create.data-store", "create.group", "create.end-event", "create.intermediate-event", "create.start-event", 
  "create.exclusive-gateway", "create.participant-expanded", "create.subprocess-expanded"
 ); */

let excludeToolsFromPalette = [];
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
/* excludeToolsFromPalette.push(
  "global-connect-tool", "space-tool", "lasso-tool", "hand-tool"
);
  */

import { assign } from "min-dash";

      

export default class CustomPaletteProvider {
  constructor(bpmnFactory, create, elementFactory, palette, translate) {
    this.bpmnFactory = bpmnFactory;
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      bpmnFactory,
      create,
      elementFactory,
      translate
    } = this;

/*     function createTemporalEvent(){
      return function(event) { 

        // business object is the type that will be displayed in the xml for the temporal event
        const businessObject = bpmnFactory.create('bpmn:IntermediateCatchEvent');
        businessObject.isTemporalEvent = true;

        // shape is the graphics that will be displayed for the temporal event
        const shape = elementFactory.createShape({
          type: 'bpmn:IntermediateCatchEvent',
          businessObject: businessObject
        });
  
        create.start(event, shape);
      };    
    } */



    return function (entries) {   

      // exclude tools from the palette
      excludeToolsFromPalette.map(tool => delete entries[tool])

      // delete all entries from the palette
      excludeEntriesFromPalette.map(entry => delete entries[entry])
      
      // add custom elements to palette
      return {
        ...entries,
/* 
        'custom-separator': {
          group: 'custom',
          separator: true
        },
     
        'create.temporal-event': {
          group: 'custom',
          className: 'bpmn-icon-intermediate-event-none',
          title: translate('Create a temporal event'),
          action: {
            dragStart: createTemporalEvent(),
            click: createTemporalEvent()
          }
        },  */
      }
    };

  }
}

CustomPaletteProvider.$inject = [
  'bpmnFactory',
  'create',
  'elementFactory',
  'palette',
  'translate'
]; 