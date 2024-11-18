import expect from './expect.js';

import SchemaValidator from 'xsd-schema-validator';

import {
  readFile
} from './helper.js';

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

export async function validate(xml) {

  if (!xml) {
    throw new Error('XML is not defined');
  }

  const result = await SchemaValidator.validateXML(xml, BPMN_XSD);

  expect(result.valid).to.be.true;
}
