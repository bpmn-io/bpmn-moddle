'use strict';

var Helper = require('../../helper'),
    XMLHelper = require('../../xml-helper');

var toXML = XMLHelper.toXML,
    validate = XMLHelper.validate;


describe('bpmn-moddle - roundtrip', function() {

  var moddle = Helper.createModdle();

  function fromFile(file, done) {
    XMLHelper.fromFile(moddle, file, done);
  }


  describe('should serialize valid BPMN 2.0 xml after read', function() {


    it('home-made bpmn model', function(done) {

      var definitions = moddle.create('bpmn:Definitions', { targetNamespace: 'http://foo' });

      var ServiceTask = moddle.getType('bpmn:ServiceTask');

      var process = moddle.create('bpmn:Process');
      var serviceTask = moddle.create('bpmn:ServiceTask', { name: 'MyService Task'});

      process.get('flowElements').push(serviceTask);
      definitions.get('rootElements').push(process);

      // when
      toXML(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('complex process', function(done) {

      // given
      fromFile('test/fixtures/bpmn/complex-no-extensions.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('extension attributes', function(done) {

      // given
      fromFile('test/fixtures/bpmn/extension-attributes.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('complex process / extensionElements', function(done) {

      // given
      fromFile('test/fixtures/bpmn/complex.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('simple process', function(done) {

      // given
      fromFile('test/fixtures/bpmn/simple.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });

  });
});