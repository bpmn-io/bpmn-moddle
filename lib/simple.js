import {
  assign
} from 'min-dash';

import BpmnModdle from './bpmn-moddle';

import BpmnPackage from '../resources/bpmn/json/bpmn.json';
import BpmnDiPackage from '../resources/bpmn/json/bpmndi.json';
import DcPackage from '../resources/bpmn/json/dc.json';
import DiPackage from '../resources/bpmn/json/di.json';
import BiocPackage from '../resources/bpmn-io/json/bioc.json';
import BpmnInColorPackage from 'bpmn-in-color-moddle/resources/bpmn-in-color.json';

var packages = {
  bpmn: BpmnPackage,
  bpmndi: BpmnDiPackage,
  dc: DcPackage,
  di: DiPackage,
  bioc: BiocPackage,
  color: BpmnInColorPackage
};

export default function(additionalPackages, options) {
  var pks = assign({}, packages, additionalPackages);

  return new BpmnModdle(pks, options);
}
