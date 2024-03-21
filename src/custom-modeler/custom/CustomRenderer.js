import inherits from "inherits-browser";

import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import { componentsToPath, createLine } from "diagram-js/lib/util/RenderUtil";

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  classes as svgClasses,
  innerSVG,
} from "tiny-svg";
import Ids from "ids";

import { assign } from "min-dash";
import { query as domQuery } from "min-dom";

import { createCurve } from "svg-curves";
import {
  isCustom,
  isElementTemporalEvent,
  isAssociationTemporalConstraint,
  isTemporalConstraint,
} from "../../utils/helper";
import { getBusinessObject, is, isAny } from "bpmn-js/lib/util/ModelUtil";

import {
  COLOR_DURATIONCONSTRAINT_SATISFIED,
  COLOR_LOWERBOUNDCONSTRAINT_SATISFIED,
  COLOR_UPPERBOUNDCONSTRAINT_SATISFIED,
  COLOR_TEMPORALEVENTLABEL,
  COLOR_CONSTRAINTNOTSATISFIED,
  LABELPREFIX_DURATIONCONSTRAINT,
  LABELPREFIX_UPPERBOUNDCONSTRAINT,
  LABELPREFIX_LOWERBOUNDCONSTRAINT,
  LABEL_ABBREVIATION_CONTINGENT,
  LABEL_ABBREVIATION_NONCONTINGENT,
  OFFSET_LABEL_X,
  OFFSET_LABEL_Y,
  COLOR_LABELFORDURATIONCONSTRAINT,
  COLOR_LABELFORUBC,
  COLOR_LABELFORLBC,
} from "../../utils/default_config";

const RENDERER_IDS = new Ids();

/**
 * A renderer that knows how to render custom elements.
 */
export default function CustomRenderer(
  eventBus,
  styles,
  bpmnRenderer,
  textRenderer,
  canvas
) {
  BaseRenderer.call(this, eventBus, 2000);

  this.bpmnRenderer = bpmnRenderer;

  this.textRenderer = textRenderer;

  const computeStyle = styles.computeStyle;

  const markers = {};

  let rendererId = RENDERER_IDS.next();

  function getWaypointsMid(waypoints) {
    var mid = waypoints.length / 2 - 1;

    var first = waypoints[Math.floor(mid)];
    var second = waypoints[Math.ceil(mid + 0.01)];

    return {
      x: first.x + (second.x - first.x) / 2,
      y: first.y + (second.y - first.y) / 2,
    };
  }

  function calculateLabelPosition(waypoints, curve, labelTextLength) {
    // get the waypoints mid
    const mid = waypoints.length / 2 - 1;

    const first = waypoints[Math.floor(mid)];
    const second = waypoints[Math.ceil(mid + 0.01)];

    const curveLength = curve.getTotalLength();
    const position = curve.getPointAtLength(curveLength / 2);

    // calculate angle
    const angle = Math.atan((second.y - first.y) / (second.x - first.x));

    const midPoint = getWaypointsMid(waypoints);
    let addLabelAbove = true;
    if (midPoint.y > waypoints[0].y) {
      addLabelAbove = false;
    }

    let x = position.x,
      y = position.y;

    if (Math.abs(angle) < Math.PI / 2) {
      if (angle == 0) {
        x -= labelTextLength / 2;
        addLabelAbove ? (y -= OFFSET_LABEL_Y) : (y += OFFSET_LABEL_Y + 10);
      } else {
        if(angle<0){
          x += OFFSET_LABEL_X;  
          y += OFFSET_LABEL_Y; 
        } else {
          x += OFFSET_LABEL_X;  
        } 
      }
    } else {
      x += OFFSET_LABEL_X;
    }

    return { x: x, y: y };
  }

  function addMarker(id, options) {
    var attrs = assign(
      {
        fill: "no-fill",
        strokeWidth: 1,
        strokeLinecap: "round",
        strokeDasharray: "none",
      },
      options.attrs
    );

    var ref = options.ref || { x: 0, y: 0 };

    var scale = options.scale || 1;

    // fix for safari / chrome / firefox bug not correctly
    // resetting stroke dash array
    if (attrs.strokeDasharray === "none") {
      attrs.strokeDasharray = [10000, 1];
    }

    var marker = svgCreate("marker");

    svgAttr(options.element, attrs);

    svgAppend(marker, options.element);

    svgAttr(marker, {
      id: id,
      viewBox: "0 0 20 20",
      refX: ref.x,
      refY: ref.y,
      markerWidth: 20 * scale,
      markerHeight: 20 * scale,
      orient: "auto",
    });

    var defs = domQuery("defs", canvas._svg);

    if (!defs) {
      defs = svgCreate("defs");

      svgAppend(canvas._svg, defs);
    }

    svgAppend(defs, marker);

    markers[id] = marker;
  }

  function colorEscape(str) {
    return str.replace(/[()\s,#]+/g, "_");
  }

  function marker(type, fill, stroke) {
    var id =
      type +
      "-" +
      colorEscape(fill) +
      "-" +
      colorEscape(stroke) +
      "-" +
      rendererId;

    if (!markers[id]) {
      createMarker(id, type, fill, stroke);
    }

    return "url(#" + id + ")";
  }

  function createMarker(id, type, fill, stroke) {
    if (type === "sequenceflow-end") {
      var sequenceflowEnd = svgCreate("path");
      svgAttr(sequenceflowEnd, { d: "M 1 5 L 11 10 L 1 15 Z" });

      addMarker(id, {
        element: sequenceflowEnd,
        ref: { x: 11, y: 10 },
        scale: 0.5,
        attrs: {
          fill: stroke,
          stroke: stroke,
        },
      });
    }
  }

  function waitForTextNodeToBeAppendedToDOM(textNode) {
    return new Promise((resolve) => {
      const checkConnection = () => {
        if (
          textNode &&
          textNode.nodeType === Node.TEXT_NODE &&
          textNode.isConnected
        ) {
          resolve(textNode);
        } else {
          setTimeout(checkConnection, 100);
        }
      };
      checkConnection();
    });
  }

/*   this.drawTemporalEvent = function (p, element) {
    const circle = this.bpmnRenderer.drawShape(p, element);

    const text = svgCreate("text");

    svgAttr(text, {
      fill: COLOR_TEMPORALEVENTLABEL,
      transform: "translate(13,24)",
    });

    svgAppend(text, document.createTextNode("T"));

    svgAppend(p, text);

    return circle;
  };
 */
  this.drawLabelForConstraint = function (p, element, color) {
    return renderExternalLabel(p, element, color);
  };

  this.drawConstraint = async function (p, element, colorCurve, colorLabel) {
    const businessObject = getBusinessObject(element);
    const isSatisfiable = businessObject.isSatisfiable;

    if (!isSatisfiable) {
      colorCurve = COLOR_CONSTRAINTNOTSATISFIED;
    }

    var attrs = computeStyle(attrs, {
      stroke: colorCurve,
      strokeWidth: 2,
      strokeDasharray: "5, 5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      markerEnd: marker("sequenceflow-end", "white", colorCurve),
    });

    const curve = createCurve(element.waypoints, attrs);
    const constraint = svgAppend(p, curve);

    const labelText = businessObject.label;

    const label = svgCreate("text");

    let textNode = document.createTextNode(labelText);

    svgAppend(label, textNode);

    svgAppend(p, label);

    // necessary to await the textNode to be present in the DOM
    // to get the computed text length
    await waitForTextNodeToBeAppendedToDOM(textNode);

    // get the length of the labelText
    let labelTextLength = label.getComputedTextLength();

    const midWaypointsOfCurve = calculateLabelPosition(
      element.waypoints,
      curve,
      labelTextLength
    );

    svgAttr(label, {
      fill: colorLabel,
      x: midWaypointsOfCurve.x,
      y: midWaypointsOfCurve.y,
    });

    return constraint;
  };

  this.getConstraintPath = function (connection) {
    var waypoints = connection.waypoints.map(function (p) {
      return p.original || p;
    });

    var connectionPath = [["M", waypoints[0].x, waypoints[0].y]];

    waypoints.forEach(function (waypoint, index) {
      if (index !== 0) {
        connectionPath.push(["L", waypoint.x, waypoint.y]);
      }
    });
    return componentsToPath(connectionPath);
  };
}

inherits(CustomRenderer, BaseRenderer);

CustomRenderer.$inject = [
  "eventBus",
  "styles",
  "bpmnRenderer",
  "textRenderer",
  "canvas",
];

CustomRenderer.prototype.canRender = function (element) {
  return isTemporalConstraint(element) && !element.labelTarget;
};


CustomRenderer.prototype.drawConnection = function (p, element) {
  const businessObject = getBusinessObject(element);

  const constraintType = businessObject.constraintType;

  if (isAssociationTemporalConstraint(element)) {
    const businessObject = getBusinessObject(element);

    if (constraintType === "tc:DurationConstraint") {
      return this.drawConstraint(
        p,
        element,
        COLOR_DURATIONCONSTRAINT_SATISFIED,
        COLOR_LABELFORDURATIONCONSTRAINT
      );
    }

    if (constraintType === "tc:UpperboundConstraint") {
      return this.drawConstraint(
        p,
        element,
        COLOR_UPPERBOUNDCONSTRAINT_SATISFIED,
        COLOR_LABELFORUBC
      );
    }

    if (constraintType === "tc:LowerboundConstraint") {
      return this.drawConstraint(
        p,
        element,
        COLOR_LOWERBOUNDCONSTRAINT_SATISFIED,
        COLOR_LABELFORLBC
      );
    }
  }

  return;
};

CustomRenderer.prototype.getConnectionPath = function (connection) {
  return this.getConstraintPath(connection);
};
