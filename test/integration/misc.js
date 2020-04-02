import expect from '../expect';

import {
  createModdle,
  readFile,
  read,
  write
} from '../helper';

import droolsPackage from '../fixtures/json/model/drools';


describe('bpmn-moddle - integration', function() {

  describe('drools:import element', function() {

    var moddle = createModdle({ drools: droolsPackage });

    function fromFile(file, root, opts, callback) {
      var contents = readFile('test/fixtures/bpmn/' + file);
      return read(moddle, contents, root, opts, callback);
    }

    it('should import', function(done) {

      // when
      fromFile('extension/drools.part.bpmn', 'bpmn:Process', function(err, result) {

        var expected = {
          $type: 'bpmn:Process',
          id: 'Evaluation',
          isExecutable: false,
          extensionElements: {
            $type: 'bpmn:ExtensionElements',
            values: [
              {
                $type: 'drools:Import',
                name: 'com.example.model.User'
              }
            ]
          }
        };

        // then
        expect(result).to.jsonEqual(expected);

        done(err);
      });

    });


    it('should export', function(done) {

      // given
      var importElement = moddle.create('drools:Import', {
        name: 'com.example.model.User'
      });

      var processElement = moddle.create('bpmn:Process', {
        extensionElements: moddle.create('bpmn:ExtensionElements', {
          values: [
            importElement
          ]
        })
      });

      var expectedXML =
        '<bpmn:process xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                      'xmlns:drools="http://www.jboss.org/drools">' +
          '<bpmn:extensionElements>' +
            '<drools:import name="com.example.model.User" />' +
          '</bpmn:extensionElements>' +
        '</bpmn:process>';

      // when
      write(moddle, processElement, function(err, result) {

        if (err) {
          return done(err);
        }

        // then
        expect(result).to.eql(expectedXML);

        done(err);
      });
    });

  });

});
