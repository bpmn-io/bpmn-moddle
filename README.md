# bpmn-moddle

bpmn-moddle allows you to read and write BPMN 2.0 diagram files in NodeJS and the browser. It uses the [BPMN 2.0 meta-model](http://www.omg.org/spec/BPMN/2.0/) to validate the input and produce correct BPMN 2.0 XML.

The library is built on top of [moddle](https://github.com/bpmn-io/moddle) / [moddle-xml](https://github.com/bpmn-io/moddle-xml).


## Usage

The library is provided as an [npm package](https://www.npmjs.org/package/bpmn-moddle). Bundle it for the web via [browserify](browserify.org).

```javascript
var BpmnModdle = require('bpmn-moddle');

var moddle = new BpmnModdle();

var xmlStr =
  '<?xml version="1.0" encoding="UTF-8"?>' +
  '<bpmn2:definitions xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" id="empty-definitions" targetNamespace="http://bpmn.io/schema/bpmn">' +
  '</bpmn2:definitions>';


moddle.fromXML(xmlStr, function(err, definitions) {

  // update id attribute
  definitions.attr('id', 'NEW ID');

  // add a root element
  var bpmnProcess = moddle.create('bpmn:Process', { id: 'MyProcess_1' });
  definitions.get('rootElements').push(bpmnProcess);

  moddle.toXML(definitions, function(err, xmlStrUpdated) {

    // xmlStrUpdated contains new id and the added process

  });

});
```


## Resources

*   [Issues](https://github.com/bpmn-io/bpmn-moddle/issues)
*   [Examples](https://github.com/bpmn-io/bpmn-moddle/tree/master/test/spec/xml)


## Building the Project

You need [grunt](gruntjs.com) to build the project.

To run the test suite that includes XSD schema validation you must have a Java JDK installed and properly exposed through the `JAVA_HOME` variable.

Execute the test via

```
grunt test
```

Perform a complete build of the application via

```
grunt
```


## License

Use under the terms of the [MIT license](http://opensource.org/licenses/MIT).