import {isNumberFieldEntryEdited, isTextFieldEntryEdited, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { ControllerComponent, ControllerOfTempEventComponent} from './SharedComps';

export default function (element) {

  return [   
    {
      id: 'controller',
      element,
      component: ControllerOfTempEventComponent,
      isEdited: isTextFieldEntryEdited
    }, 
  ];
}

