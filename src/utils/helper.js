import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import {
  LABELPREFIX_DURATIONCONSTRAINT,
  LABELPREFIX_LOWERBOUNDCONSTRAINT,
  LABELPREFIX_UPPERBOUNDCONSTRAINT,
  LABEL_ABBREVIATION_CONTINGENT,
  LABEL_ABBREVIATION_NONCONTINGENT,
} from "./default_config";
import { is } from "bpmn-js/lib/util/ModelUtil";

export function isCustom(element) {
  return isElementTemporalEvent(element) || isTemporalConstraint(element);
}

export function isElementTemporalEvent(element) {
  return getBusinessObject(element).isTemporalEvent || false;
}

export function isAssociationTemporalConstraint(element) {
  return getBusinessObject(element).constraintType ? true : false;
}

export function isTemporalConstraint(element) {
  if (isAssociationTemporalConstraint(element)) {
    return true;
  }

  if (
    element === "tc:DurationConstraint" ||
    element === "tc:UpperboundConstraint" ||
    element === "tc:LowerboundConstraint"
  ) {
    return true;
  }
  return false;
}

function generateConstraintLabel(prefix, values) {
  // Concatenate prefix with values separated by comma
  const label = prefix + "(" + values.join(",") + ")";
  return label;
}

function getContingencyLabel(contingency) {
  let contingencyLabel = "";
  if (contingency === "contingent") {
    contingencyLabel = LABEL_ABBREVIATION_CONTINGENT;
  } else if (contingency === "non-contingent") {
    contingencyLabel = LABEL_ABBREVIATION_NONCONTINGENT;
  }

  return contingencyLabel;
}

export function generateLabel(element) {
  const businessObject = getBusinessObject(element);

  const { controller, contingency } = businessObject;

  let values;
  let prefix;

  if (businessObject.constraintType === "tc:DurationConstraint") {
    values = [
      controller,
      businessObject.minDuration,
      businessObject.maxDuration,
      getContingencyLabel(contingency),
    ];
    prefix = LABELPREFIX_DURATIONCONSTRAINT;
  } else if (businessObject.constraintType === "tc:UpperboundConstraint") {
    values = [
      controller,
      businessObject.upperboundDuration,
      getContingencyLabel(contingency),
    ];
    prefix = LABELPREFIX_UPPERBOUNDCONSTRAINT;
  } else if (businessObject.constraintType === "tc:LowerboundConstraint") {
    values = [
      controller,
      businessObject.lowerboundDuration,
      getContingencyLabel(contingency),
    ];
    prefix = LABELPREFIX_LOWERBOUNDCONSTRAINT;
  }

  return generateConstraintLabel(prefix, values);
}

export function getLabel(element) {
  return getBusinessObject(element).label;
}

export function getDefaultControllerForTemporalEvent(temporalEvent, parent) {
  const bo = getBusinessObject(temporalEvent);

  if (parent) {
    const parentBusinessObject = getBusinessObject(parent);

    if(parentBusinessObject){
      if(parentBusinessObject.name){
        return parentBusinessObject.name;
      }
    }
  }
    return bo.name
    ? bo.name
    : bo.id;
}

export function getDefaultControllerForConnection(connectionSource) {
  let businessObjectOfSource = getBusinessObject(connectionSource);
  return businessObjectOfSource.controller || '';
}
