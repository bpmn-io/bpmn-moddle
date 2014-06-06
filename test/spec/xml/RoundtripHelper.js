'use strict';

var SchemaValidator = require('xsd-schema-validator');

var BPMN_XSD = 'resources/bpmn/xsd/BPMN20.xsd';

var Helper = require('../Helper'),
    BpmnModel = Helper.bpmnModel();


function readBpmnDiagram(file) {
  return Helper.readFile('test/fixtures/bpmn/' + file);
}

function readBpmn(file, callback) {
  BpmnModel.fromXML(readBpmnDiagram(file), 'bpmn:Definitions', callback);
}

function writeBpmn(element, opts, callback) {
  BpmnModel.toXML(element, opts, callback);
}

function validate(err, xml, done) {

  if (err) {
    done(err);
  } else {

    if (!xml) {
      done(new Error('XML is not defined'));
    }

    SchemaValidator.validateXML(xml, BPMN_XSD, function(err, result) {

      if (err) {
        done(err);
      } else {
        expect(result.valid).toBe(true);
        done();
      }
    });
  }
}


module.exports.validate = validate;
module.exports.readBpmn = readBpmn;
module.exports.writeBpmn = writeBpmn;
module.exports.bpmnModel = Helper.bpmnModel;