import expect from '../../expect';

import {
  createModdle
} from '../../helper';

import {
  fromFile as readFromFile,
  validate,
  toXML
} from '../../xml-helper';


describe('bpmn-moddle - edit', function() {

  var moddle = createModdle();

  function fromFile(file) {
    return readFromFile(moddle, file);
  }


  describe('save after change', function() {

    it('should serialize changed name', async function() {

      // given
      var {
        rootElement: definitions
      } = await fromFile('test/fixtures/bpmn/simple.bpmn');

      definitions.rootElements[0].name = 'OTHER PROCESS';

      // when
      var {
        xml
      } = await toXML(definitions, { format: true });

      // then
      expect(xml).to.contain('name="OTHER PROCESS"');
    });

  });


  describe('dataObjectRef', function() {

    it('should update', async function() {

      var {
        rootElement: definitions
      } = await fromFile('test/fixtures/bpmn/data-object-reference.bpmn');

      // given
      var process = definitions.rootElements[0],
          dataObjectReference = process.flowElements[0];

      // when
      // creating new data object
      var dataObject_2 = moddle.create('bpmn:DataObject', { id: 'dataObject_2' });

      // adding data object to its parent (makes sure it is contained in the XML)
      process.flowElements.push(dataObject_2);

      // set reference to the new data object
      dataObjectReference.dataObjectRef = dataObject_2;

      var {
        xml
      } = await toXML(definitions, { format: true });

      // then
      expect(xml).to.contain('<bpmn:dataObject id="dataObject_2" />');
      expect(xml).to.contain('<bpmn:dataObjectReference id="DataObjectReference_1" dataObjectRef="dataObject_2" />');
    });
  });


  describe('generate DI', function() {

    async function readAndGenerateDI(file) {

      var {
        rootElement: definitions
      } = await fromFile(file);

      var process = definitions.rootElements[0];

      var flowElements = process.flowElements;

      var [
        start,
        task,
        flow
      ] = flowElements;

      var plane = definitions.diagrams[0].plane;

      var model = definitions.$model;

      var planeElements = plane.get('planeElement');

      // when
      planeElements.push(
        model.create('bpmndi:BPMNEdge', {
          id: 'Flow_di',
          bpmnElement: flow,
          waypoint: [
            model.create('dc:Point', { x: 100, y: 100 }),
            model.create('dc:Point', { x: 150, y: 150 })
          ]
        }),
        model.create('bpmndi:BPMNShape', {
          id: 'Start_di',
          bpmnElement: start,
          bounds: model.create('dc:Bounds', { x: 50, y: 50, width: 100, height: 100 })
        }),
        model.create('bpmndi:BPMNShape', {
          id: 'Task_di',
          bpmnElement: task,
          bounds: model.create('dc:Bounds', { x: 100, y: 100, width: 100, height: 100 })
        })
      );

      return {
        definitions
      };
    }


    it('should auto-add wellknown', async function() {

      // given
      var {
        definitions
      } = await readAndGenerateDI('test/fixtures/bpmn/local-ns-no-di.bpmn');

      // when
      var {
        xml
      } = await toXML(definitions, { format: true });

      // then
      expect(xml).to.contain(
        'xmlns:di="http://www.omg.org/spec/DD/20100524/DI"'
      );

      expect(xml).to.contain(
        'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"'
      );

      await validate(xml);
    });


    it('should reuse global namespace', async function() {

      // given
      var {
        definitions
      } = await readAndGenerateDI('test/fixtures/bpmn/local-ns-no-di.bpmn');

      // when
      // set global namespace information
      definitions.$attrs['xmlns:di'] = 'http://www.omg.org/spec/DD/20100524/DI';
      definitions.$attrs['xmlns:dc'] = 'http://www.omg.org/spec/DD/20100524/DC';

      var {
        xml
      } = await toXML(definitions, { format: true });

      // then
      expect(xml).to.contain(
        'xmlns:di="http://www.omg.org/spec/DD/20100524/DI"'
      );

      expect(xml).to.contain(
        'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"'
      );

      await validate(xml);
    });

  });

});
