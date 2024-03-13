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
  return getBusinessObject(element).constraintType || false;
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

  const { holder, contingency } = businessObject;

  console.log("HOLD");
  console.log(holder);

  let values;
  let prefix;

  if (businessObject.constraintType === "tc:DurationConstraint") {
    values = [
      holder,
      businessObject.minDuration,
      businessObject.maxDuration,
      getContingencyLabel(contingency),
    ];
    prefix = LABELPREFIX_DURATIONCONSTRAINT;
  } else if (businessObject.constraintType === "tc:UpperboundConstraint") {
    values = [
      holder,
      businessObject.upperboundDuration,
      getContingencyLabel(contingency),
    ];
    prefix = LABELPREFIX_UPPERBOUNDCONSTRAINT;
  } else if (businessObject.constraintType === "tc:LowerboundConstraint") {
    values = [
      holder,
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

export function getHolder(connectionSource) {
  let businessObjectOfSource = getBusinessObject(connectionSource);  
  let holder = businessObjectOfSource.$parent;

  if (is(holder, "bpmn:Process")) {
    // get the lane of the event as the holder if possible
    if (businessObjectOfSource.lanes[0]) {
      console.log("LANES");
      console.log(businessObjectOfSource.lanes);
      return businessObjectOfSource.lanes[0].name
        ? businessObjectOfSource.lanes[0].name
        : businessObjectOfSource.lanes[0].id;
    }
    // check if the process has a participant -> the name of the pool!
  }
  // assign the name of the source or the id of the source as the holder
  return businessObjectOfSource.name
    ? businessObjectOfSource.name
    : businessObjectOfSource.id;
}
