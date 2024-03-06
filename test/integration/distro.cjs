const {
  expect
} = require('chai');

const pkg = require('../../package.json');
const pkgExports = pkg.exports['.'];


describe('bpmn-moddle - integration', function() {

  describe('distribution', function() {

    it('should expose CJS bundle', function() {
      const BpmnModdle = require('../../' + pkgExports['require']);

      expect(new BpmnModdle()).to.exist;
    });

  });

});