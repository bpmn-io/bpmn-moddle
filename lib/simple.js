'use strict';

var assign = require('lodash/assign');

var BpmnModdle = require('./bpmn-moddle');

var packages = {
  bpmn: require('../resources/bpmn/json/bpmn.json'),
  bpmndi: require('../resources/bpmn/json/bpmndi.json'),
  dc: require('../resources/bpmn/json/dc.json'),
  di: require('../resources/bpmn/json/di.json'),
  bioc: require('../resources/bpmn-io/json/bioc.json')
};

module.exports = function(additionalPackages, options) {
  return new BpmnModdle(assign({}, packages, additionalPackages), options);
};
