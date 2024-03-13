import inherits from "inherits-browser";

import CommandInterceptor from "diagram-js/lib/command/CommandInterceptor";

import { getBusinessObject, is, isAny } from "bpmn-js/lib/util/ModelUtil";

import {
  DEFAULT_CONTINGENCY,
  DEFAULT_MAX_DURATION,
  DEFAULT_MIN_DURATION,
  DEFAULT_DURATION,
  LABEL_ABBREVIATION_NONCONTINGENT,
  LABEL_ABBREVIATION_CONTINGENT,
  LABELPREFIX_DURATIONCONSTRAINT,
  LABELPREFIX_UPPERBOUNDCONSTRAINT,
  LABELPREFIX_LOWERBOUNDCONSTRAINT,
} from "./default_config";

import { getHolder, isTemporalConstraint } from "./helper";

import {
  generateConstraintLabel,
  generateLabel,
  getContingencyLabel,
  isAssociationTemporalConstraint,
  isElementTemporalEvent,
} from "./helper";

class CustomCommandInterceptor extends CommandInterceptor {
  constructor(eventBus, modeling, elementRegistry) {
    super(eventBus);

    // when the label element of a temporal event changes -> need to recreate the tc:label for the constraints
    /*     this.postExecuted(['element.updateLabel'], ({context}) => {
      const {element} = context;
      const {id} = element;
      console.log("ELEMent updateproperties");
      console.log(element.businessObject.isTemporalEvent);
      if(isElementTemporalEvent(element)){
        console.log("Element is temporal event");
        // find any constraint where the element is the source
        const elements = elementRegistry.getAll();
        console.log(elements);

        elements.forEach(el => {
          if(isTemporalConstraint(el)){
            console.log("IS temporal constraint");
            const source = el.source;
            console.log(source);
            console.log(el);
            console.log(element);
            if(source === element){
              // udpate the label of the constraint
              console.log("updat");
              const holder = getHolder(source)
              console.log(holder);
              modeling.updateProperties(el, {
                holder: holder
              })
              const newLabel = generateLabel(el)
              modeling.updateProperties(el, {
                label: newLabel
              })
            }
          }

        })

        // update the label 
        const updatedLabel = 'SLJFE'
        elementRegistry.get(id)
    
      }


    }) */

    // hook into connection creation and assign default values!
    // create the label for the constraint
    this.postExecuted(["connection.create"], ({ context }) => {
      const { connection } = context;

      const { id } = connection;

      const { type } = connection;

      const { source } = context;

      const { target } = context;

      const businessObject = getBusinessObject(connection);

      const constrType = connection.constraintType;

      // only hook into constraints!
      if (constrType) {
        // get the element in the elementfactory

        let label;
        let labelValues;
        let prefix;

        const holder = getHolder(source);
        console.log("HOLDER");
        console.log(holder);

        if (constrType === "tc:DurationConstraint") {
          modeling.updateProperties(connection, {
            constraintType: connection.constraintType,
            holder: holder,
            contingency: DEFAULT_CONTINGENCY,
            minDuration: DEFAULT_MIN_DURATION,
            maxDuration: DEFAULT_MAX_DURATION,
            isSatisfiable: true,
          });
        }

        if (constrType === "tc:UpperboundConstraint") {
          modeling.updateProperties(connection, {
            constraintType: connection.constraintType,
            upperboundDuration: DEFAULT_DURATION,
            holder: holder,
            contingency: DEFAULT_CONTINGENCY,
            isSatisfiable: true,
          });
        }

        if (constrType === "tc:LowerboundConstraint") {
          modeling.updateProperties(connection, {
            constraintType: connection.constraintType,
            lowerboundDuration: DEFAULT_DURATION,
            holder: holder,
            contingency: DEFAULT_CONTINGENCY,
            isSatisfiable: true,
          });
        }

        label = generateLabel(connection);
        modeling.updateProperties(connection, { label: label });
      }
    });
  }
}

CustomCommandInterceptor.$inject = ["eventBus", "modeling", "elementRegistry"];

export default {
  __init__: ["customCommandInterceptor"],
  customCommandInterceptor: ["type", CustomCommandInterceptor],
};
