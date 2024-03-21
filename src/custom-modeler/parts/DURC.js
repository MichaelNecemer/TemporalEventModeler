import {isNumberFieldEntryEdited, isTextFieldEntryEdited, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { ContingencyComponent, DurationComponent, MinDurationComponent, MaxDurationComponent, SatisfiabilityComponent, ControllerComponent} from './SharedComps';

export default function (element) {

  return [
    {
      id: 'controller',
      element,
      component: ControllerComponent,
      isEdited: isTextFieldEntryEdited
    }, 
    {
      id: 'minDuration',
      element,
      component: MinDurationComponent,
      isEdited: isNumberFieldEntryEdited
    }, 
    {
      id: 'maxDuration',
      element,
      component: MaxDurationComponent,
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





