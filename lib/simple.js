import {
  assign
} from 'min-dash';

import BpmnModdle from './bpmn-moddle.js';

import BpmnPackage from '../resources/bpmn/json/bpmn.json' with { type: 'json' };
import BpmnDiPackage from '../resources/bpmn/json/bpmndi.json' with { type: 'json' };
import DcPackage from '../resources/bpmn/json/dc.json' with { type: 'json' };
import DiPackage from '../resources/bpmn/json/di.json' with { type: 'json' };
import BiocPackage from '../resources/bpmn-io/json/bioc.json' with { type: 'json' };
import BpmnInColorPackage from 'bpmn-in-color-moddle/resources/bpmn-in-color.json' with { type: 'json' };

const packages = {
  bpmn: BpmnPackage,
  bpmndi: BpmnDiPackage,
  dc: DcPackage,
  di: DiPackage,
  bioc: BiocPackage,
  color: BpmnInColorPackage
};

export default function SimpleBpmnModdle(additionalPackages, options) {
  const pks = assign({}, packages, additionalPackages);

  return new BpmnModdle(pks, options);
}
