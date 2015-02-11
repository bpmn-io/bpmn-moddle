'use strict';

var fs = require('fs');

var SimpleBpmnModdle = require('../');

function ensureDirExists(dir) {

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

module.exports.readFile = readFile;
module.exports.ensureDirExists = ensureDirExists;

module.exports.createModdle = function(additionalPackages, options) {
  return new SimpleBpmnModdle(additionalPackages, options);
};