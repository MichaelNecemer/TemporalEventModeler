import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";
import { isElementTemporalEvent } from "../../utils/helper";

export default class CustomReplaceMenuProvider {
  constructor(popupMenu, bpmnReplace) {
    popupMenu.registerProvider("bpmn-replace", this);
    this.replaceElement = bpmnReplace.replaceElement;
  }

  getPopupMenuHeaderEntries(element) {
    return function (entries) {
      return entries;
    };
  }

  getPopupMenuEntries(element) {
    const self = this;
    console.log("Element");
    console.log(element);
    return function (entries) {
      console.log('Custom replace menu');
      console.log(entries);
      if (isElementTemporalEvent(element)) {
        console.log("element is temporal event");
        // return no entries since
        // temporal event should not be changed via replace menu
        return {};
        entries = {
          ...entries,
          "replace-with-conditional-start": {
            label: "Conditional Start Event",
            className: "bpmn-icon-start-event-condition",
            action: function () {
              console.log(self.replaceElement);
              return self.replaceElement(element, {
                type: "bpmn:StartEvent",
                eventDefinitionType: "bpmn:ConditionalEventDefinition"
              });
            }
          }
        };
      }

      if(is(element, 'bpmn:Event')){
        console.log("Element is event");
        entries =  {
          ... entries, 
          "replace-with-temporal-event": {
            label: `Temporal ${element.type}`, 
            action: function () {
             const businessObject = getBusinessObject(element);
              businessObject.isTemporalEvent = true;
 
              return self.replaceElement(element, {
                type: element.type,
                businessObject: businessObject,
                eventDefinitionType: element.eventDefinitionType
              })
            }
          }

        }
      }

      return entries;
    };
  }
}

CustomReplaceMenuProvider.$inject = ["popupMenu", "bpmnReplace"];
