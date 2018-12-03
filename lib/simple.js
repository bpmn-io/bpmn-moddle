import {
  assign
} from 'min-dash';

import inherits from 'inherits';

import BpmnModdle from './bpmn-moddle';

import BpmnPackage from '../resources/bpmn/json/bpmn.json';
import BpmnDiPackage from '../resources/bpmn/json/bpmndi.json';
import DcPackage from '../resources/bpmn/json/dc.json';
import DiPackage from '../resources/bpmn/json/di.json';
import BiocPackage from '../resources/bpmn-io/json/bioc.json';

var packages = {
  bpmn: BpmnPackage,
  bpmndi: BpmnDiPackage,
  dc: DcPackage,
  di: DiPackage,
  bioc: BiocPackage
};

/**
 * Create a BpmnModdle instance with the default
 * package definitions baked in.
 *
 * @param {Object} additionalPackages
 * @param {Object} options
 */
export default function SimpleBpmnModdle(additionalPackages, options) {

  if (!(this instanceof SimpleBpmnModdle)) {
    return new SimpleBpmnModdle(additionalPackages, options);
  }

  var pks = assign({}, packages, additionalPackages);

  BpmnModdle.call(this, pks, options);
}

inherits(SimpleBpmnModdle, BpmnModdle);