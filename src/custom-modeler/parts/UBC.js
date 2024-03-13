import {isNumberFieldEntryEdited, isTextFieldEntryEdited, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { HolderComponent, ContingencyComponent, DurationComponent, SatisfiabilityComponent} from './SharedComps';

export default function (element) {

  return [   
    {
      id: 'holder',
      element,
      component: HolderComponent,
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

