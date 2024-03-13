import { isTemporalConstraint } from '../../utils/helper';
import UBC from '../parts/UBC';
import LBC from '../parts/LBC';
import DURC from '../parts/DURC';

import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';

const LOW_PRIORITY = 500;

export default function CustomPropertiesProvider(propertiesPanel, translate) {

 
  this.getGroups = function(element) {

    return function(groups) {

      const businessObject = getBusinessObject(element); 
      const constraintType = businessObject.constraintType;

      if(constraintType ==='tc:UpperboundConstraint'){
        groups.push(createUBCGroup(element, translate));
      }
      if(constraintType === 'tc:LowerboundConstraint'){
        groups.push(createLBCGroup(element, translate));
      }
      if(constraintType === 'tc:DurationConstraint'){
        groups.push(createDurationCGroup(element, translate));
      }

      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

CustomPropertiesProvider.$inject = [ 'propertiesPanel', 'translate' ];

  function createUBCGroup(element, translate) {

    const group = {
      id: 'ubc-group',
      label: translate('UBC properties'),
      entries: UBC(element), 
      tooltip: translate('Edit the upperbound constraints values')
    };

  return group;
}

function createLBCGroup(element, translate) {

  const group = {
    id: 'lbc-group',
    label: translate('LBC properties'),
    entries: LBC(element), 
    tooltip: translate('Edit the lowerbound constraints values')
  };

return group;
}


function createDurationCGroup(element, translate) {

  const group = {
    id: 'durC-group',
    label: translate('Duration constraint properties'),
    entries: DURC(element), 
    tooltip: translate('Edit the duration constraints values')
  };

return group;
}