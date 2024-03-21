import { html } from "htm/preact";

import {
  NumberFieldEntry,
  SelectEntry,
  TextFieldEntry,
  isNumberFieldEntryEdited,
  isTextFieldEntryEdited,
  isSelectEntryEdited,
} from "@bpmn-io/properties-panel";
import { useService } from "bpmn-js-properties-panel";
import { isNumber } from "min-dash";
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import { generateConstraintLabel, generateLabel } from "../../utils/helper";


export function ControllerOfTempEventComponent(props) {
  const { element, id } = props;
  const { businessObject } = element;

  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getController = () => {
    return element.businessObject.controller || "";
  };

  const setController = (newController) => {
    modeling.updateProperties(element, {
      controller: newController,
    });
    // update constraints labels 

    return newController;
  };

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    description=${translate("Change the controller")}
    label=${translate("Controller")}
    getValue=${getController}
    setValue=${setController}
    debounce=${debounce}
  />`;
}


export function ControllerComponent(props) {
  const { element, id } = props;
  const { businessObject } = element;

  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getController = () => {
    return element.businessObject.controller || "";
  };

  const setController = (newController) => {
    modeling.updateProperties(element, {
      controller: newController,
    });
    const updatedLabel = generateLabel(element);
    modeling.updateProperties(element, {
      label: updatedLabel,
    });
    return newController;
  };

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    description=${translate("Change the controller")}
    label=${translate("Controller")}
    getValue=${getController}
    setValue=${setController}
    debounce=${debounce}
  />`;
}

export function ContingencyComponent(props) {
  const { element, id } = props;
  const { businessObject } = element;

  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getContingency = () => {
    return element.businessObject.contingency || "";
  };

  const setContingency = (newContingency) => {
    modeling.updateProperties(element, {
      contingency: newContingency,
    });

    const updatedLabel = generateLabel(element);
    modeling.updateProperties(element, {
      label: updatedLabel,
    });
    return newContingency;
  };

  const getOptions = () => {
    return [
      { label: "contingent", value: "contingent" },
      { label: "non-contingent", value: "non-contingent" },
    ];
  };

  return html`<${SelectEntry}
    id=${id}
    element=${element}
    description=${translate("Change the type")}
    label=${translate("Type")}
    getValue=${getContingency}
    setValue=${setContingency}
    getOptions=${getOptions}
    debounce=${debounce}
  />`;
}

export function DurationComponent(props) {
  const { element, id } = props;
  const { businessObject } = element;
  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    if (businessObject.upperboundDuration) {
      return businessObject.upperboundDuration;
    }

    if (businessObject.lowerboundDuration) {
      return businessObject.lowerboundDuration;
    }
    return "";
  };

  const setValue = (newDuration) => {
    if (businessObject.upperboundDuration) {
      modeling.updateProperties(element, {
        upperboundDuration: newDuration,
      });
      const updatedLabel = generateLabel(element);
      modeling.updateProperties(element, {
        label: updatedLabel,
      });
      return newDuration;
    }

    if (businessObject.lowerboundDuration) {
      modeling.updateProperties(element, {
        lowerboundDuration: newDuration,
      });

      const updatedLabel = generateLabel(element);
      modeling.updateProperties(element, {
        label: updatedLabel,
      });
      return newDuration;
    }
  };

  return html`<${NumberFieldEntry}
    id=${id}
    element=${element}
    description=${translate("Change duration value")}
    label=${translate("Duration")}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

export function MinDurationComponent(props) {
  const { element, id } = props;
  const { businessObject } = element;
  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return element.businessObject.minDuration || "";
  };

  const setValue = (newDuration) => {
    modeling.updateProperties(element, {
      minDuration: newDuration,
    });

    const updatedLabel = generateLabel(element);
    modeling.updateProperties(element, {
      label: updatedLabel,
    });
    return newDuration;
  };

  return html`<${NumberFieldEntry}
    id=${id}
    element=${element}
    description=${translate("Change min duration value")}
    label=${translate("Minimum duration")}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

export function MaxDurationComponent(props) {
  const { element, id } = props;
  const { businessObject } = element;
  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getValue = () => {
    return element.businessObject.maxDuration || "";
  };

  const setValue = (newDuration) => {
    modeling.updateProperties(element, {
      maxDuration: newDuration,
    });
    const updatedLabel = generateLabel(element);
    modeling.updateProperties(element, {
      label: updatedLabel,
    });
    return newDuration;
  };

  return html`<${NumberFieldEntry}
    id=${id}
    element=${element}
    description=${translate("Change max duration value")}
    label=${translate("Maximum duration")}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

export function SatisfiabilityComponent(props) {
  const { element, id } = props;

  const modeling = useService("modeling");
  const translate = useService("translate");
  const debounce = useService("debounceInput");

  const getSatisfiability = () => {
    return element.businessObject.isSatisfiable + "" || "";
  };

  const setSatisfiability = (newSatisfiability) => {
    return modeling.updateProperties(element, {
      isSatisfiable: newSatisfiability === "true" ? true : false,
    });
  };

  return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    description=${translate("Satisfiability of the constraint")}
    label=${translate("Satisfiability (true | false)")}
    getValue=${getSatisfiability}
    setValue=${setSatisfiability}
    debounce=${debounce}
    disabled=${true}
  />`;
}
