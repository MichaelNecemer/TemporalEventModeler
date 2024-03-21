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

import { getController, getControllerForTemporalEvent, getDefaultController, getDefaultControllerForConnection, getDefaultControllerForTemporalEvent, isTemporalConstraint } from "./helper";

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

    this.postExecuted(["shape.create"], ({ context }) => {
      const { shape } = context;
      const {id} = shape;

      const {parent} = context;

      if (is(shape, "bpmn:Event")) {
          
        const controller = getDefaultControllerForTemporalEvent(shape, parent);
  
        // make each event a temporal event
        modeling.updateProperties(shape, {
          isTemporalEvent: true,
          controller: controller,
        });
      }
    });

    // hook into connection creation and assign default values!
    // create the label for the constraint
    this.postExecuted(["connection.create"], ({ context }) => {
      const { connection } = context;

      const { id } = connection;

      const { source } = context;

      const { target } = context;

      const constrType = connection.constraintType;

      // only hook into constraints!
      if (constrType) {
        let label;
        let labelValues;
        let prefix;

        const controller = getDefaultControllerForConnection(source)

        // update the properties all constraints share
        modeling.updateProperties(connection, {
          constraintType: constrType,
          controller: controller,
          contingency: DEFAULT_CONTINGENCY,
          isSatisfiable: true,
        });

        if (constrType === "tc:DurationConstraint") {
          modeling.updateProperties(connection, {
            minDuration: DEFAULT_MIN_DURATION,
            maxDuration: DEFAULT_MAX_DURATION,
          });
        }

        if (constrType === "tc:UpperboundConstraint") {
          modeling.updateProperties(connection, {
            upperboundDuration: DEFAULT_DURATION,
          });
        }

        if (constrType === "tc:LowerboundConstraint") {
          modeling.updateProperties(connection, {
            lowerboundDuration: DEFAULT_DURATION,
          });
        }

        label = generateLabel(connection);
        modeling.updateProperties(connection, {
          label: label,
        });
      }
    });
  }
}

CustomCommandInterceptor.$inject = ["eventBus", "modeling", "elementRegistry"];

export default {
  __init__: ["customCommandInterceptor"],
  customCommandInterceptor: ["type", CustomCommandInterceptor],
};
