import {
  createModdle
} from '../../helper';

import camundaPackage from '../../fixtures/json/model/camunda';

import {
  fromFile as parseFromFile,
  toXML,
  validate
} from '../../xml-helper';


describe('bpmn-moddle - integration', function() {

  describe('camunda extension', function() {

    var moddle = createModdle({ camunda: camundaPackage });

    function fromFile(file) {
      return parseFromFile(moddle, file);
    }


    describe('should serialize valid BPMN 2.0 after read', function() {

      this.timeout(15000);


      it('inputOutput', async function() {

        // given
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/extension/camunda/inputOutput.bpmn');

        // when
        var {
          xml
        } = await toXML(rootElement, { format: true });

        // then
        await validate(xml);
      });

    });

  });

});
