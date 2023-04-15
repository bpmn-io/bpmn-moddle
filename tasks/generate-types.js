import fs from 'fs';
import path from 'path';

import generateTypes from 'ts-moddle';

[
  {
    source: 'resources/bpmn/json/bpmn.json',
    target: 'resources/bpmn/types/bpmn.d.ts'
  },
  {
    source: 'resources/bpmn/json/bpmndi.json',
    target: 'resources/bpmn/types/bpmndi.d.ts'
  },
  {
    source: 'resources/bpmn/json/dc.json',
    target: 'resources/bpmn/types/dc.d.ts'
  },
  {
    source: 'resources/bpmn/json/di.json',
    target: 'resources/bpmn/types/di.d.ts'
  },
  {
    source: 'resources/bpmn-io/json/bioc.json',
    target: 'resources/bpmn-io/types/bioc.d.ts'
  }
].forEach(({ source, target }) => {
  const jsonFile = fs.readFileSync(source, 'utf-8');

  const json = JSON.parse(jsonFile);

  const data = generateTypes(json);

  fs.mkdirSync(path.dirname(target), { recursive: true });

  fs.writeFileSync(target, data);
});