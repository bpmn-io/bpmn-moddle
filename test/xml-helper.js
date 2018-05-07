import expect from './expect';

import SchemaValidator from 'xsd-schema-validator';

import {
  readFile
} from './helper';

var BPMN_XSD = 'test/fixtures/xsd/BPMN20.xsd';


export function fromFile(moddle, file, done) {
  return fromFilePart(moddle, file, 'bpmn:Definitions', done);
}

export function fromFilePart(moddle, file, type, done) {
  var fileContents = readFile(file);

  moddle.fromXML(fileContents, type, done);
}

export function fromValidFile(moddle, file, done) {
  var fileContents = readFile(file);

  validate(null, fileContents, function(err) {

    if (err) {
      return done(err);
    }

    moddle.fromXML(fileContents, 'bpmn:Definitions', done);
  });
}


export function toXML(element, opts, done) {
  element.$model.toXML(element, opts, done);
}


export function validate(err, xml, done) {

  if (err) {
    return done(err);
  }

  if (!xml) {
    return done(new Error('XML is not defined'));
  }

  SchemaValidator.validateXML(xml, BPMN_XSD, function(err, result) {

    if (err) {
      return done(err);
    }

    expect(result.valid).to.be.true;
    done();
  });
}