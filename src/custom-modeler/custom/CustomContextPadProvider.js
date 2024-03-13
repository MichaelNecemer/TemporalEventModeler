import inherits from 'inherits';

import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';

import {
  isAny,
  is
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  assign,
  bind
} from 'min-dash';
import { isElementTemporalEvent } from '../../utils/helper';


export default function CustomContextPadProvider(bpmnFactory, injector, connect, translate, autoPlace, elementFactory, create) {

  injector.invoke(ContextPadProvider, this);

  var cached = bind(this.getContextPadEntries, this);

  this.getContextPadEntries = function(element) {
    var actions = cached(element);

    var businessObject = element.businessObject;

    function startConnectWithType(connectionType) {
      return function (event, element, autoActivate){
      connect.start(event, element, connectionType, autoActivate);
      }      
    } 
 

   /**
   * Create an append action
   *
   * @param {string} type
   * @param {string} className
   * @param {string} [title]
   * @param {Object} [options]
   *
   * @return {Object} descriptor
   */
  function appendAction(type, className, title, options) {

    if (typeof title !== 'string') {
      options = title;
      title = translate('Append {type}', { type: type.replace(/^bpmn:/, '') });
    }

    function appendStart(event, element) {

      var shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape, {
        source: element, 
      });
    }
    var append = autoPlace ? function(event, element) {
      var shape = elementFactory.createShape(assign({ type: type }, options));

      autoPlace.append(element, shape);
    } : appendStart;



    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append
      }
    };
  }

  function appendTemporalEvent(event, element) {
      if (autoPlace) {
        const businessObject = bpmnFactory.create('bpmn:IntermediateThrowEvent');

        businessObject.isTemporalEvent = true;

        const shape = elementFactory.createShape({ type: 'bpmn:IntermediateThrowEvent', businessObject: businessObject });

        autoPlace.append(element, shape);
      } else {
        appendTemporalEventStart(event, element);
      }

    }

    function appendTemporalEventStart(event) {
      const businessObject = bpmnFactory.create('bpmn:IntermediateThrowEvent');

      businessObject.isTemporalEvent = true;

      const shape = elementFactory.createShape({ type: 'bpmn:IntermediateThrowEvent', businessObject: businessObject});

      create.start(event, shape, element);
    }


    if (isElementTemporalEvent(element)) {
        assign(actions, {
          'connect.seqFlow': {
            group: 'connect',
            className: 'bpmn-icon-connection',
            title: translate('Connect using SequenceFlow'),
            action: {
              click: startConnectWithType('bpmn:SequenceFlow'),
              dragstart: startConnectWithType('bpmn:SequenceFlow'),
            }
          }, 
          'connect.duration-constraint': {
            group: 'custom-1',
            className: 'bpmn-icon-connection',
            title: translate('Insert a duration constraint'),
            action: {
              click: startConnectWithType('tc:DurationConstraint'),
              dragstart: startConnectWithType('tc:DurationConstraint'),
            }
          }, 
          'connect.upperbound-constraint': {
            group: 'custom-1',
            className: 'bpmn-icon-connection',
            title: translate('Insert an upperbound-constraint'),
            action: {
              click: startConnectWithType('tc:UpperboundConstraint'),
              dragstart: startConnectWithType('tc:UpperboundConstraint'),
            }
          }, 
          'connect.lowerbound-constraint': {
            group: 'custom-1',
            className: 'bpmn-icon-connection',
            title: translate('Insert a lowerbound-constraint'),
            action: {
              click: startConnectWithType('tc:LowerboundConstraint'),
              dragstart: startConnectWithType('tc:LowerboundConstraint'),
            }
          }, 

       });
     }

     if(is(element, ['bpmn:FlowNode']) && !element.labelTarget){
     assign(actions, {
      'append.temporal-event': {
        group: 'custom-2',
        className: 'bpmn-icon-intermediate-event-none',
        title: translate('Append Temporal Event'),
        action: {
          click: appendTemporalEvent,
          dragstart: appendTemporalEventStart
       }
     }

     })
    }
    return actions;
  };
}

inherits(CustomContextPadProvider, ContextPadProvider);

CustomContextPadProvider.$inject = [
  'bpmnFactory',
  'injector',
  'connect',
  'translate',
  'autoPlace',
  'elementFactory',
  'create'
];