const {
  expect
} = require('chai');


describe('bpmn-moddle', function() {

  it('should expose CJS bundle', function() {
    const BpmnModdle = require('../..');

    expect(new BpmnModdle()).to.exist;
  });


  it('should expose UMD bundle', function() {
    const BpmnModdle = require('../../dist/bpmn-moddle.umd.prod');

    expect(new BpmnModdle()).to.exist;
  });

});