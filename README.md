# bpmn-moddle

[![CI](https://github.com/bpmn-io/bpmn-moddle/workflows/CI/badge.svg)](https://github.com/bpmn-io/bpmn-moddle/actions?query=workflow%3ACI)

Read and write BPMN 2.0 diagram files in NodeJS and the browser.

__bpmn-moddle__ uses the [BPMN 2.0 meta-model](http://www.omg.org/spec/BPMN/2.0/) to validate the input and produce correct BPMN 2.0 XML.


## Usage

Get the library via [npm package](https://www.npmjs.org/package/bpmn-moddle). Consume it in NodeJS, via UMD or bundle it using your favorite build tool.

```javascript
import BpmnModdle from 'bpmn-moddle';

const moddle = new BpmnModdle();

const xmlStr =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                     'id="empty-definitions" ' +
                     'targetNamespace="http://bpmn.io/schema/bpmn">' +
  '</bpmn2:definitions>';


const {
  rootElement: definitions
} = await moddle.fromXML(xmlStr);

// update id attribute
definitions.set('id', 'NEW ID');

// add a root element
const bpmnProcess = moddle.create('bpmn:Process', { id: 'MyProcess_1' });
definitions.get('rootElements').push(bpmnProcess);

// xmlStrUpdated contains new id and the added process
const {
  xml: xmlStrUpdated
} = await moddle.toXML(definitions);
```


## Resources

* [Issues](https://github.com/bpmn-io/bpmn-moddle/issues)
* [Examples](https://github.com/bpmn-io/bpmn-moddle/tree/master/test/spec/xml)
* [Changelog](./CHANGELOG.md)


## Building the Project

The tests include XSD schema validation. They required you to have a Java SDK installed and exposed through the `JAVA_HOME` variable.

```bash
# execute the test
npm test

# perform a full build
npm run all
```


## Related

The library is built on top of [moddle](https://github.com/bpmn-io/moddle) and [moddle-xml](https://github.com/bpmn-io/moddle-xml).


## License

Use under the terms of the [MIT license](http://opensource.org/licenses/MIT).
