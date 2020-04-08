import expect from '../../expect';

import {
  createModdle
} from '../../helper';

import {
  fromFile as readFromFile,
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
      var result = await fromFile('test/fixtures/bpmn/simple.bpmn');

      result.rootElement.rootElements[0].name = 'OTHER PROCESS';

      // when
      var { xml } = await toXML(result.rootElement, { format: true });

      // then
      expect(xml).to.contain('name="OTHER PROCESS"');
    });

  });


  describe('dataObjectRef', function() {

    it('should update', async function() {

      var result = await fromFile('test/fixtures/bpmn/data-object-reference.bpmn');

      // given
      var process = result.rootElement.rootElements[0],
          dataObjectReference = process.flowElements[0];

      // when
      // creating new data object
      var dataObject_2 = moddle.create('bpmn:DataObject', { id: 'dataObject_2' });

      // adding data object to its parent (makes sure it is contained in the XML)
      process.flowElements.push(dataObject_2);

      // set reference to the new data object
      dataObjectReference.dataObjectRef = dataObject_2;

      var { xml } = await toXML(result.rootElement, { format: true });

      // then
      expect(xml).to.contain('<bpmn:dataObject id="dataObject_2" />');
      expect(xml).to.contain('<bpmn:dataObjectReference id="DataObjectReference_1" dataObjectRef="dataObject_2" />');
    });
  });
});
