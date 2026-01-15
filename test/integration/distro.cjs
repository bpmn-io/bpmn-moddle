const {
  expect
} = require('chai');


describe('bpmn-moddle - integration', function() {

  describe('distribution', function() {

    it('should expose CJS bundle', function() {
      const { BpmnModdle } = require('bpmn-moddle');

      expect(new BpmnModdle()).to.exist;
    });


    it('should expose ESM bundle', async function() {
      const {
        BpmnModdle
      } = await import('bpmn-moddle');

      expect(new BpmnModdle()).to.exist;
    });

  });

});