import expect from './expect';

import SchemaValidator from 'xsd-schema-validator';

import {
  readFile
} from './helper';

var BPMN_XSD = 'test/fixtures/xsd/BPMN20.xsd';


export function fromFile(moddle, file) {
  return fromFilePart(moddle, file, 'bpmn:Definitions');
}

export function fromFilePart(moddle, file, type) {
  var fileContents = readFile(file);

  return moddle.fromXML(fileContents, type);
}

export function fromValidFile(moddle, file) {
  var fileContents = readFile(file);

  return validate(fileContents).then(function() {
    return moddle.fromXML(fileContents, 'bpmn:Definitions');
  });
}

export function toXML(element, opts) {
  return element.$model.toXML(element, opts);
}

export function validate(xml) {

  return new Promise(function(resolve, reject) {

    if (!xml) {
      return reject(new Error('XML is not defined'));
    }

    SchemaValidator.validateXML(xml, BPMN_XSD, function(err, result) {

      if (err) {
        return reject(err);
      }

      try {
        expect(result.valid).to.be.true;
      } catch (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}
