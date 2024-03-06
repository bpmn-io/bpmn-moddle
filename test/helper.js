import fs from 'node:fs';

import BpmnModdle from 'bpmn-moddle';

export function ensureDirExists(dir) {

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export function readFile(filename) {
  return fs.readFileSync(filename, { encoding: 'UTF-8' });
}

export function createModdle(additionalPackages, options) {
  return new BpmnModdle(additionalPackages, options);
}