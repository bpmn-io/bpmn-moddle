import expect from '../../expect';

import {
  createModdle,
  readFile
} from '../../helper';

import camundaPackage from '../../fixtures/json/model/camunda';


describe('bpmn-moddle - integration', function() {

  describe('camunda extension', function() {

    describe('read', function() {

      var moddle = createModdle({ camunda: camundaPackage });

      function read(xml, root, opts) {
        return moddle.fromXML(xml, root, opts);
      }

      function fromFile(file, root, opts) {
        var contents = readFile('test/fixtures/bpmn/' + file);
        return read(contents, root, opts);
      }


      describe('should recognize camunda types', function() {

        it('InputOutput - list', async function() {

          // given
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

          // when
          var {
            rootElement
          } = await fromFile('extension/camunda/inputOutput-list.part.bpmn', 'camunda:InputOutput');

          // then
          expect(rootElement).to.jsonEqual(expected);
        });


        it('InputOutput - map', async function() {

          // given
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

          // when
          var {
            rootElement
          } = await fromFile('extension/camunda/inputOutput-map.part.bpmn', 'camunda:InputOutput');

          // then
          expect(rootElement).to.jsonEqual(expected);
        });


        it('InputOutput - mixed', async function() {

          // given
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
                      source: 'return "scriptValue";'
                    }
                  ]
                }
              }
            ]
          };

          // when
          var {
            rootElement
          } = await fromFile('extension/camunda/inputOutput-mixed.part.bpmn', 'camunda:InputOutput');

          // then
          expect(rootElement).to.jsonEqual(expected);
        });


        it('InputOutput - plain', async function() {

          // given
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

          // when
          var {
            rootElement
          } = await fromFile('extension/camunda/inputOutput-plain.part.bpmn', 'camunda:InputOutput');

          // then
          expect(rootElement).to.jsonEqual(expected);
        });


        it('InputOutput - script', async function() {

          // given
          var expected = {
            $type: 'camunda:InputOutput',
            outputParameters: [
              {
                $type: 'camunda:OutputParameter',
                name: 'var1',
                definition: {
                  $type: 'camunda:Script',
                  source: 'return 1 + 1;'
                }
              }
            ]
          };

          // when
          var {
            rootElement
          } = await fromFile('extension/camunda/inputOutput-script.part.bpmn', 'camunda:InputOutput');

          // then
          expect(rootElement).to.jsonEqual(expected);
        });
      });

    });

  });

});
