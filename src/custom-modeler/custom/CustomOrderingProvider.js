import inherits from 'inherits-browser';

import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider';
import { isAssociationTemporalConstraint } from '../../utils/helper';
import { is } from 'bpmn-js/lib/util/ModelUtil';


/**
 * a simple ordering provider that ensures that custom
 * connections are always rendered on top.
 */
export default function CustomOrderingProvider(eventBus, canvas) {

  OrderingProvider.call(this, eventBus);

  this.getOrdering = function(element, newParent) {

    if (is(element, 'tc:DurationConstraint')) {
      // always move to end of root element
      // to display always on top
      return {
        parent: canvas.getRootElement(),
        index: -1
      };
    }
  };
}

CustomOrderingProvider.$inject = [ 'eventBus', 'canvas' ];

inherits(CustomOrderingProvider, OrderingProvider);