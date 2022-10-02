const {
  expect
} = require('chai');

const pkg = require('../../package.json');


describe('bpmn-moddle', function() {

  it('should expose CJS bundle', function() {
    const BpmnModdle = require('../../' + pkg['main']);

    expect(new BpmnModdle()).to.exist;
  });


  it('should expose UMD bundle', function() {
    const BpmnModdle = require('../../' + pkg['umd:main']);

    expect(new BpmnModdle()).to.exist;
  });

});