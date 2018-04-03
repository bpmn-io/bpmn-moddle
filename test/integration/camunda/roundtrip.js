import {
  createModdle
} from '../../helper';

import camundaPackage from '../../fixtures/json/model/camunda';

import {
  fromFile as parseFromFile,
  toXML,
  validate
} from '../../xml-helper';


describe('bpmn-moddle - integration', function() {

  describe('camunda extension', function() {

    var moddle = createModdle({ camunda: camundaPackage });

    function fromFile(file, done) {
      parseFromFile(moddle, file, done);
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