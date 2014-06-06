'use strict';

var Matchers = require('../Matchers');

var Helper = require('./RoundtripHelper'),
    BpmnModel = Helper.bpmnModel();

var writeBpmn = Helper.writeBpmn,
    readBpmn = Helper.readBpmn,
    validate = Helper.validate;


describe('Model - roundtrip', function() {

  var bpmnModel = BpmnModel.instance();


  beforeEach(Matchers.add);


  describe('Roundtrip', function() {

    it('should serialize home-made bpmn model', function(done) {

      // given
      var model = bpmnModel;

      var definitions = model.create('bpmn:Definitions', { targetNamespace: 'http://foo' });

      var ServiceTask = model.getType('bpmn:ServiceTask');

      var process = model.create('bpmn:Process');
      var serviceTask = model.create('bpmn:ServiceTask', { name: 'MyService Task'});

      process.get('flowElements').push(serviceTask);
      definitions.get('rootElements').push(process);

      // when
      writeBpmn(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('should write complex process', function(done) {

      // given
      readBpmn('complex-no-extensions.bpmn', function(err, result) {

        if (err) {
          done(err);
          return;
        }

        // when
        writeBpmn(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('should write extension attributes', function(done) {

      // given
      readBpmn('extension-attributes.bpmn', function(err, result) {

        if (err) {
          done(err);
          return;
        }

        // when
        writeBpmn(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('should write complex process / extensionElements', function(done) {

      // given
      readBpmn('complex.bpmn', function(err, result) {

        if (err) {
          done(err);
          return;
        }

        // when
        writeBpmn(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('should write simple process', function(done) {

      // given
      readBpmn('simple.bpmn', function(err, result) {

        if (err) {
          done(err);
          return;
        }

        // when
        writeBpmn(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });

  });
});