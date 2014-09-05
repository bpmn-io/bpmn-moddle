'use strict';

var _ = require('lodash');

var Moddle = require('moddle'),
    ModdleXml = require('moddle-xml');


function createModel(packages) {
  return new Moddle(packages);
}

/**
 * A sub class of {@link Moddle} with support for import and export of BPMN 2.0 xml files.
 *
 * @class BpmnModdle
 * @extends Moddle
 *
 * @param {Object|Array} packages to use for instantiating the model
 * @param {Object} [options] additional options to pass over
 */
function BpmnModdle(packages, options) {
  Moddle.call(this, packages, options);
}

BpmnModdle.prototype = Object.create(Moddle.prototype);

module.exports = BpmnModdle;


/**
 * Instantiates a BPMN model tree from a given xml string.
 *
 * @param {String}   xmlStr
 * @param {String}   [typeName]   name of the root element, defaults to 'bpmn:Definitions'
 * @param {Object}   [options]    options to pass to the underlying reader
 * @param {Function} done         callback that is invoked with (err, result, parseContext) once the import completes
 */
BpmnModdle.prototype.fromXML = function(xmlStr, typeName, options, done) {

  if (!_.isString(typeName)) {
    done = options;
    options = typeName;
    typeName = 'bpmn:Definitions';
  }

  if (_.isFunction(options)) {
    done = options;
    options = {};
  }

  var reader = new ModdleXml.Reader(this, options);
  var rootHandler = reader.handler(typeName);

  reader.fromXML(xmlStr, rootHandler, done);
};


/**
 * Serializes a BPMN 2.0 object tree to XML.
 *
 * @param {String}   element    the root element, typically an instance of `bpmn:Definitions`
 * @param {Object}   [options]  to pass to the underlying writer
 * @param {Function} done       callback invoked with (err, xmlStr) once the import completes
 */
BpmnModdle.prototype.toXML = function(element, options, done) {

  if (_.isFunction(options)) {
    done = options;
    options = {};
  }

  var writer = new ModdleXml.Writer(options);
  try {
    var result = writer.toXML(element);
    done(null, result);
  } catch (e) {
    done(e);
  }
};
