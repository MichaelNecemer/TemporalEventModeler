import {isNumberFieldEntryEdited, isTextFieldEntryEdited, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { ContingencyComponent, DurationComponent, SatisfiabilityComponent, ControllerComponent} from './SharedComps';

export default function (element) {

  return [   
    {
      id: 'controller',
      element,
      component: ControllerComponent,
      isEdited: isTextFieldEntryEdited
    }, 
    {
      id: 'duration',
      element,
      component: DurationComponent,
      isEdited: isNumberFieldEntryEdited
    }, 
    {
      id: 'contingency',
      element,
      component: ContingencyComponent, 
      isEdited: isSelectEntryEdited
    },
    {
      id: 'isSatisfiable',
      element,
      component: SatisfiabilityComponent,
      isEdited: isSelectEntryEdited
    }
  ];
}

