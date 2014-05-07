var _ = require('lodash');

var Moddle = require('moddle'),
    xml = require('moddle-xml');


function createModel(packages) {
  return new Moddle(packages);
}

/**
 * @class Bpmn
 *
 * A wrapper around {@link Moddle} with support for import and export of BPMN 2.0 xml files.
 *
 * @param {Object|Array} packages to use for instantiating the model
 */
function Bpmn(packages) {

  var model = createModel(packages);

  /**
   * Instantiates a BPMN model tree from a given xml string.
   *
   * @method Bpmn#fromXML
   *
   * @param  {String}   xmlStr
   * @param  {String}   [typeName] name of the root element, defaults to 'bpmn:Definitions'
   * @param  {Object}   [options] options to pass to the underlying reader
   * @param  {Function} callback callback that is invoked with (err, result, parseContext) once the import completes
   */
  function fromXML(xmlStr, typeName, options, callback) {

    if (!_.isString(typeName)) {
      callback = options;
      options = typeName;
      typeName = 'bpmn:Definitions';
    }

    if (_.isFunction(options)) {
      callback = options;
      options = {};
    }

    var reader = new xml.Reader(model, options);
    var rootHandler = reader.handler(typeName);

    reader.fromXML(xmlStr, rootHandler, function(err, result) {
      callback(err, result, rootHandler.context);
    });
  }

  /**
   * Serializes a BPMN 2.0 object tree to XML.
   *
   * @method Bpmn#toXML
   *
   * @param  {String}   element the root element, typically an instance of `bpmn:Definitions`
   * @param  {Object}   [options] to pass to the underlying writer
   * @param  {Function} callback invoked with (err, xmlStr) once the import completes
   */
  function toXML(element, options, callback) {

    if (_.isFunction(options)) {
      callback = options;
      options = {};
    }

    var writer = new xml.Writer(options);
    try {
      var result = writer.toXML(element);
      callback(null, result);
    } catch (e) {
      callback(e);
    }
  }

  /**
   * Returns the underlying moddle instance.
   *
   * @method  Bpmn#instance
   *
   * @return {Moddle}
   */
  function instance() {
    return model;
  }


  // API
  this.instance = instance;

  this.fromXML = fromXML;
  this.toXML = toXML;
}


module.exports = Bpmn;