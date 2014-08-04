'use strict';

var XMLHelper = require('../../xml-helper'),
    Helper = require('../../helper');

var toXML = XMLHelper.toXML;


describe('bpmn-moddle - edit', function() {

  var moddle = Helper.createModdle();

  function fromFile(file, done) {
    XMLHelper.fromFile(moddle, file, done);
  }


  describe('save after change', function() {

    it('should serialize changed name', function(done) {

      // given
      fromFile('test/fixtures/bpmn/simple.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        result.rootElements[0].name = 'OTHER PROCESS';

        // when
        toXML(result, { format: true }, function(err, xml) {
          expect(xml).to.contain('name="OTHER PROCESS"');

          done(err);
        });
      });

    });

  });

});