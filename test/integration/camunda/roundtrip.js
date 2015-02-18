'use strict';

var Helper = require('../../helper'),
    XMLHelper = require('../../xml-helper');

var toXML = XMLHelper.toXML,
    validate = XMLHelper.validate;

var camundaPackage = require('../../fixtures/json/model/camunda');


describe('bpmn-moddle - integration', function() {

  describe('camunda extension', function() {

    var moddle = Helper.createModdle({ camunda: camundaPackage });

    function fromFile(file, done) {
      XMLHelper.fromFile(moddle, file, done);
    }


    describe('should serialize valid BPMN 2.0 after read', function() {

      this.timeout(15000);


      it('inputOutput', function(done) {

        // given
        fromFile('test/fixtures/bpmn/extension/camunda/inputOutput.bpmn', function(err, result) {

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

});