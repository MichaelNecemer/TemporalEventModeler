import { reduce, assign } from "min-dash";

import inherits from "inherits";

import { is } from "bpmn-js/lib/util/ModelUtil";

import RuleProvider from "diagram-js/lib/features/rules/RuleProvider";

import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

import elementRegistry from "diagram-js/lib/core/ElementRegistry";

import { isElementTemporalEvent } from "../../utils/helper";

var HIGH_PRIORITY = 2000;

/**
 * Specific rules for custom elements
 */
export default function CustomRules(eventBus, elementRegistry) {
  RuleProvider.call(this, eventBus);
  this._eventbus = eventBus;
  this._elementRegistry = elementRegistry;
}

inherits(CustomRules, RuleProvider);

CustomRules.$inject = ["eventBus", "elementRegistry"];

CustomRules.prototype.init = function () {
  let self = this;

  function canCreate(shape, target) {
    // only judge about custom elements
    if (!isElementTemporalEvent(shape)) {
      return;
    }
    // allow creation on processes
    return (
      is(target, "bpmn:Process") ||
      is(target, "bpmn:Participant") ||
      is(target, "bpmn:Collaboration")
    );
  }

  function canConnect(source, target, connectionType) {
    if (!isElementTemporalEvent(source) && !isElementTemporalEvent(target)) {
      return;
    }

    // allow connecting temporal events with constraints
    if (isElementTemporalEvent(source) && isElementTemporalEvent(target)) {
      if (connectionType === "tc:DurationConstraint") {
        return { type: "bpmn:Association", constraintType: connectionType };
      }

      if (connectionType === "tc:UpperboundConstraint") {
        return { type: "bpmn:Association", constraintType: connectionType };
      }

      if (connectionType === "tc:LowerboundConstraint") {
        return { type: "bpmn:Association", constraintType: connectionType };
      }
    }
  }

  this.addRule("elements.move", HIGH_PRIORITY, function (context) {
    var target = context.target,
      shapes = context.shapes;

    var type;

    // do not allow mixed movements of custom / BPMN shapes
    // if any shape cannot be moved, the group cannot be moved, too
    var allowed = reduce(
      shapes,
      function (result, s) {
        if (type === undefined) {
          type = isElementTemporalEvent(s);
        }

        if (type !== isElementTemporalEvent(s) || result === false) {
          return false;
        }

        return canCreate(s, target);
      },
      undefined
    );

    // reject, if we have at least one
    // custom element that cannot be moved
    return allowed;
  });

  this.addRule("shape.create", HIGH_PRIORITY, function (context) {
    var target = context.target,
      shape = context.shape;

    return canCreate(shape, target);
  });

  this.addRule("shape.resize", HIGH_PRIORITY, function (context) {
    var shape = context.shape;

    if (isElementTemporalEvent(shape)) {
      // cannot resize custom elements
      return false;
    }

    // allow resizing other elements
    /*     return true;
     */
  });

  this.addRule("connection.create", HIGH_PRIORITY, function (context) {
    var source = context.source,
      target = context.target,
      hints = context.hints || {},
      connectionType = context.connectionType || {};
    // pass down the connectionType to allow creating the constraints
    return canConnect(source, target, connectionType);
  });

  this.addRule("connection.reconnectStart", HIGH_PRIORITY, function (context) {
    var connection = context.connection,
      source = context.hover || context.source,
      target = connection.target;
    return canConnect(source, target, connection.type);
  });

  this.addRule("connection.reconnectEnd", HIGH_PRIORITY, function (context) {
    var connection = context.connection,
      source = connection.source,
      target = context.hover || context.target;
    return canConnect(source, target, connection);
  });
};
