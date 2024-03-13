import {isNumberFieldEntryEdited, isTextFieldEntryEdited, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { HolderComponent, ContingencyComponent, DurationComponent, MinDurationComponent, MaxDurationComponent, SatisfiabilityComponent} from './SharedComps';

export default function (element) {

  return [
    {
      id: 'holder',
      element,
      component: HolderComponent,
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





