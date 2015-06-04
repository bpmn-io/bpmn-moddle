'use strict';

var os = require('os');

var Helper = require('../../helper');

var camundaPackage = require('../../fixtures/json/model/camunda');


describe('bpmn-moddle - integration', function() {

  describe('camunda extension', function() {

    describe('read', function() {

      var moddle = Helper.createModdle({ camunda: camundaPackage });

      function read(xml, root, opts, callback) {
        return moddle.fromXML(xml, root, opts, callback);
      }

      function fromFile(file, root, opts, callback) {
        var contents = Helper.readFile('test/fixtures/bpmn/' + file);
        return read(contents, root, opts, callback);
      }


      describe('should recognize camunda types', function() {

        it('InputOutput - list', function(done) {

          // given

          // when
          fromFile('extension/camunda/inputOutput-list.part.bpmn', 'camunda:InputOutput', function(err, result) {

            var expected = {
              $type: 'camunda:InputOutput',
              outputParameters: [
                {
                  $type: 'camunda:OutputParameter',
                  name: 'var1',
                  definition: {
                    $type: 'camunda:List',
                    items: [
                      { $type: 'camunda:Value', value: '${1+1}' },
                      { $type: 'camunda:Value', value: '${1+2}' },
                      { $type: 'camunda:Value', value: '${1+3}' }
                    ]
                  }
                }
              ]
            };

            // then
            expect(result).to.jsonEqual(expected);

            done(err);
          });
        });


        it('InputOutput - map', function(done) {

          // given

          // when
          fromFile('extension/camunda/inputOutput-map.part.bpmn', 'camunda:InputOutput', function(err, result) {

            var expected = {
              $type: 'camunda:InputOutput',
              inputParameters: [
                {
                  $type: 'camunda:InputParameter',
                  name: 'var1',
                  definition: {
                    $type: 'camunda:Map',
                    entries: [
                      {
                        $type: 'camunda:Entry',
                        key: 'a',
                        value: {
                          $type: 'camunda:List',
                          items: [
                            {
                              $type: 'camunda:Value',
                              value: 'stringInListNestedInMap'
                            },
                            {
                              $type: 'camunda:Value',
                              value: '${ \'b\' }'
                            }
                          ]
                        }
                      }
                    ]
                  }
                }
              ]
            };

            // then
            expect(result).to.jsonEqual(expected);

            done(err);
          });
        });


        it('InputOutput - mixed', function(done) {

          // when
          fromFile('extension/camunda/inputOutput-mixed.part.bpmn', 'camunda:InputOutput', function(err, result) {

            var expected = {
              $type: 'camunda:InputOutput',
              inputParameters: [
                {
                  $type: 'camunda:InputParameter',
                  name: 'var1',
                  definition: {
                    $type: 'camunda:List',
                    items: [
                      { $type: 'camunda:Value', value: 'constantStringValue' },
                      { $type: 'camunda:Value', value: '${ \'elValue\' }' },
                      {
                        $type: 'camunda:Script',
                        source: os.EOL + '            return "scriptValue";'+ os.EOL +'          '
                      }
                    ]
                  }
                }
              ]
            };

            // then
            expect(result).to.jsonEqual(expected);

            done(err);
          });
        });


        it('InputOutput - plain', function(done) {

          // given

          // when
          fromFile('extension/camunda/inputOutput-plain.part.bpmn', 'camunda:InputOutput', function(err, result) {

            var expected = {
              $type: 'camunda:InputOutput',
              inputParameters: [
                {
                  $type: 'camunda:InputParameter',
                  name: 'var2',
                  value: 'stringConstantValue'
                }
              ]
            };

            // then
            expect(result).to.jsonEqual(expected);

            done(err);
          });
        });


        it('InputOutput - script', function(done) {

          // given

          // when
          fromFile('extension/camunda/inputOutput-script.part.bpmn', 'camunda:InputOutput', function(err, result) {

            var expected = {
              $type: 'camunda:InputOutput',
              outputParameters: [
                {
                  $type: 'camunda:OutputParameter',
                  name: 'var1',
                  definition: {
                    $type: 'camunda:Script',
                    source: os.EOL + '          return 1 + 1;'+ os.EOL + '        '
                  }
                }
              ]
            };

            // then
            expect(result).to.jsonEqual(expected);

            done(err);
          });
        });
      });

    });

  });

});
