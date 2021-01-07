import expect from '../expect';

import {
  createModdle,
  readFile
} from '../helper';

import droolsPackage from '../fixtures/json/model/drools';

import {
  assign
} from 'min-dash';


describe('bpmn-moddle - integration', function() {

  describe('drools:import element', function() {

    var moddle = createModdle({ drools: droolsPackage });

    function read(xml, root, opts) {
      return moddle.fromXML(xml, root, opts);
    }

    function fromFile(file, root, opts) {
      var contents = readFile('test/fixtures/bpmn/' + file);
      return read(contents, root, opts);
    }

    function write(element, options) {

      // skip preamble for tests
      options = assign({ preamble: false }, options);

      return moddle.toXML(element, options);
    }


    it('should import', async function() {

      // given
      var expected = {
        $type: 'bpmn:Process',
        id: 'Evaluation',
        isExecutable: false,
        extensionElements: {
          $type: 'bpmn:ExtensionElements',
          values: [
            {
              $type: 'drools:Import',
              name: 'com.example.model.User'
            }
          ]
        }
      };

      // when
      var result = await fromFile('extension/drools.part.bpmn', 'bpmn:Process');

      // then
      expect(result.rootElement).to.jsonEqual(expected);
    });


    it('should export', async function() {

      // given
      var importElement = moddle.create('drools:Import', {
        name: 'com.example.model.User'
      });

      var processElement = moddle.create('bpmn:Process', {
        extensionElements: moddle.create('bpmn:ExtensionElements', {
          values: [
            importElement
          ]
        })
      });

      var expectedXML =
        '<bpmn:process xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                      'xmlns:drools="http://www.jboss.org/drools">' +
          '<bpmn:extensionElements>' +
            '<drools:import name="com.example.model.User" />' +
          '</bpmn:extensionElements>' +
        '</bpmn:process>';

      // when
      var { xml } = await write(processElement);

      // then
      expect(xml).to.eql(expectedXML);
    });

  });

});
