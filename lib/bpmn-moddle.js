import {
  isString,
  isFunction,
  assign
} from 'min-dash';

import Moddle from 'moddle';

import {
  Reader,
  Writer
} from 'moddle-xml';


/**
 * A sub class of {@link Moddle} with support for import and export of BPMN 2.0 xml files.
 *
 * @class BpmnModdle
 * @extends Moddle
 *
 * @param {Object|Array} packages to use for instantiating the model
 * @param {Object} [options] additional options to pass over
 */
export default function BpmnModdle(packages, options) {
  Moddle.call(this, packages, options);
}

BpmnModdle.prototype = Object.create(Moddle.prototype);


/**
 * Instantiates a BPMN model tree from a given xml string.
 *
 * @param {String}   xmlStr
 * @param {String}   [typeName='bpmn:Definitions'] name of the root element
 * @param {Object}   [options]  options to pass to the underlying reader
 * @param {Function} done       callback that is invoked with (err, result, parseContext)
 *                              once the import completes
 */
BpmnModdle.prototype.fromXML = function(xmlStr, typeName, options, done) {

  if (!isString(typeName)) {
    done = options;
    options = typeName;
    typeName = 'bpmn:Definitions';
  }

  if (isFunction(options)) {
    done = options;
    options = {};
  }

  var reader = new Reader(assign({ model: this, lax: true }, options));
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

  if (isFunction(options)) {
    done = options;
    options = {};
  }

  var writer = new Writer(options);

  var result;
  var err;

  try {
    result = writer.toXML(element);
  } catch (e) {
    err = e;
  }

  return done(err, result);
};
