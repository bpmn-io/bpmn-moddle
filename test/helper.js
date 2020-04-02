import fs from 'fs';

import SimpleBpmnModdle from '../lib';

import {
  isFunction,
  isString,
  assign
} from 'min-dash';

export function ensureDirExists(dir) {

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export function write(moddle, element, options, callback) {
  if (isFunction(options)) {
    callback = options;
    options = {};
  }

  // skip preamble for tests
  options = assign({ preamble: false }, options);

  moddle.toXML(element, options).then(function(result) {

    callback(null, result);
  }).catch(function(err) {

    callback(err, null);
  });
}

export function read(moddle, xml, root, opts, callback) {

  if (!isString(root)) {
    callback = opts;
    opts = root;
    root = 'bpmn:Definitions';
  }

  if (isFunction(opts)) {
    callback = opts;
    opts = {};
  }

  return moddle.fromXML(xml, root, opts).then(function(result) {

    callback(null, result.result, result.parseContext);
  }).catch(function(err) {

    callback(err, null, err.parseContext);
  });
}

export function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

export function createModdle(additionalPackages, options) {
  return new SimpleBpmnModdle(additionalPackages, options);
}
