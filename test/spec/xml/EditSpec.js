'use strict';

var Matchers = require('../Matchers');

var Helper = require('./RoundtripHelper'),
    BpmnModel = Helper.bpmnModel();

var writeBpmn = Helper.writeBpmn,
    readBpmn = Helper.readBpmn,
    validate = Helper.validate;


describe('Model - edit', function() {

  var bpmnModel = BpmnModel.instance();

  beforeEach(Matchers.add);


  describe('save after change', function() {

    it('should serialize changed name', function(done) {

      // given
      readBpmn('simple.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        result.rootElements[0].name = 'OTHER PROCESS';

        // when
        writeBpmn(result, { format: true }, function(err, xml) {
          expect(xml).toContain('name="OTHER PROCESS"');

          done(err);
        });
      });
    });

  });

});