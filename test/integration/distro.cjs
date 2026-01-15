const {
  expect
} = require('chai');


describe('bpmn-moddle - integration', function() {

  describe('distribution', function() {

    it('should expose CJS bundle', function() {
      const { BpmnModdle } = require('bpmn-moddle');

      expect(new BpmnModdle()).to.exist;
    });

  });

});