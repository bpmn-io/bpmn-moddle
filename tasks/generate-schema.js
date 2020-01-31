const fs = require('fs');

const parseFile = require('cmof-parser');

const {
  transformDC,
  transformDI,
  transformBPMN,
  transformBPMNDI
} = require('./transforms');

async function generateSchema(files) {
  files.forEach(async file => {
    const {
      options,
      source,
      target,
      transform
    } = file;

    const parsed = await parseFile(fs.readFileSync(source, 'utf8'), options);

    const transformed = await transform(parsed);

    fs.writeFileSync(target, JSON.stringify(transformed, null, 2));
  });
}

generateSchema([
  {
    source: 'resources/bpmn/cmof/BPMN20.cmof',
    target: 'resources/bpmn/json/bpmn.json',
    transform: transformBPMN,
    options: {
      clean: true,
      prefixNamespaces: {
        'BPMN20.cmof': 'bpmn',
        'BPMNDI.cmof': 'bpmndi',
        'DC.cmof': 'dc',
        'DI.cmof': 'di'
      }
    }
  },
  {
    source: 'resources/bpmn/cmof/BPMNDI.cmof',
    target: 'resources/bpmn/json/bpmndi.json',
    transform: transformBPMNDI,
    options: {
      clean: true,
      prefixNamespaces: {
        'BPMN20.cmof': 'bpmn',
        'BPMNDI.cmof': 'bpmndi',
        'DC.cmof': 'dc',
        'DI.cmof': 'di'
      }
    }
  },
  {
    source: 'resources/bpmn/cmof/DC.cmof',
    target: 'resources/bpmn/json/dc.json',
    transform: transformDC,
    options: {
      clean: true,
      prefixNamespaces: {
        'BPMN20.cmof': 'bpmn',
        'BPMNDI.cmof': 'bpmndi',
        'DC.cmof': 'dc',
        'DI.cmof': 'di'
      }
    }
  },
  {
    source: 'resources/bpmn/cmof/DI.cmof',
    target: 'resources/bpmn/json/di.json',
    transform: transformDI,
    options: {
      clean: true,
      prefixNamespaces: {
        'BPMN20.cmof': 'bpmn',
        'BPMNDI.cmof': 'bpmndi',
        'DC.cmof': 'dc',
        'DI.cmof': 'di'
      }
    }
  }
]);