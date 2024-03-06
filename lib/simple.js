import {
  assign
} from 'min-dash';

import BpmnModdle from './bpmn-moddle.js';

import BpmnPackage from '../resources/bpmn/json/bpmn.json' assert { type: 'json' };
import BpmnDiPackage from '../resources/bpmn/json/bpmndi.json' assert { type: 'json' };
import DcPackage from '../resources/bpmn/json/dc.json' assert { type: 'json' };
import DiPackage from '../resources/bpmn/json/di.json' assert { type: 'json' };
import BiocPackage from '../resources/bpmn-io/json/bioc.json' assert { type: 'json' };
import BpmnInColorPackage from 'bpmn-in-color-moddle/resources/bpmn-in-color.json' assert { type: 'json' };

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
