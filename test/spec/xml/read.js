import expect from '../../expect';

import {
  createModdle,
  readFile
} from '../../helper';


describe('bpmn-moddle - read', function() {

  var moddle = createModdle();

  function read(xml, root, opts) {
    return moddle.fromXML(xml, root, opts);
  }

  function fromFile(file, root, opts) {
    var contents = readFile(file);
    return read(contents, root, opts);
  }


  describe('should import types', function() {

    describe('bpmn', function() {

      it('SubProcess#flowElements', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/sub-process-flow-nodes.part.bpmn', 'bpmn:SubProcess');

        var expected = {
          $type: 'bpmn:SubProcess',
          id: 'SubProcess_1',
          name: 'Sub Process 1',

          flowElements: [
            { $type: 'bpmn:StartEvent', id: 'StartEvent_1', name: 'Start Event 1' },
            { $type: 'bpmn:Task', id: 'Task_1', name: 'Task' },
            { $type: 'bpmn:SequenceFlow', id: 'SequenceFlow_1', name: '' }
          ]
        };

        // then
        expect(rootElement).to.jsonEqual(expected);
      });


      it('SubProcess#flowElements (nested references)', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/sub-process.part.bpmn', 'bpmn:SubProcess');

        var expected = {
          $type: 'bpmn:SubProcess',
          id: 'SubProcess_1',
          name: 'Sub Process 1',

          flowElements: [
            { $type: 'bpmn:StartEvent', id: 'StartEvent_1', name: 'Start Event 1' },
            { $type: 'bpmn:Task', id: 'Task_1', name: 'Task' },
            { $type: 'bpmn:SequenceFlow', id: 'SequenceFlow_1', name: '' }
          ]
        };

        // then
        expect(rootElement).to.jsonEqual(expected);
      });


      it('CompensateEventDefinition', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/compensate-event-definition.part.bpmn', 'bpmn:CompensateEventDefinition');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:CompensateEventDefinition'
        });

        expect(rootElement.waitForCompletion).to.be.true;
      });


      it('SubProcess#incoming', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/subprocess-flow-nodes-outgoing.part.bpmn', 'bpmn:Process');

        var expectedSequenceFlow = {
          $type: 'bpmn:SequenceFlow',
          id: 'SequenceFlow_1'
        };

        var expectedSubProcess = {
          $type: 'bpmn:SubProcess',
          id: 'SubProcess_1',
          name: 'Sub Process 1',

          flowElements: [
            { $type: 'bpmn:Task', id: 'Task_1', name: 'Task' }
          ]
        };

        var expected = {
          $type: 'bpmn:Process',
          flowElements: [
            expectedSubProcess,
            expectedSequenceFlow
          ]
        };

        // then
        expect(rootElement).to.jsonEqual(expected);


        var subProcess = rootElement.flowElements[0];
        var sequenceFlow = rootElement.flowElements[1];

        // expect correctly resolved references
        expect(subProcess.incoming).to.jsonEqual([ expectedSequenceFlow ]);
        expect(subProcess.outgoing).to.jsonEqual([ expectedSequenceFlow ]);

        expect(sequenceFlow.sourceRef).to.jsonEqual(expectedSubProcess);
        expect(sequenceFlow.targetRef).to.jsonEqual(expectedSubProcess);
      });


      it('TimerEventDefinition#expression', async function() {

        // given
        var file = 'test/fixtures/bpmn/timerEventDefinition.part.bpmn';

        // when
        var {
          rootElement
        } = await fromFile(file, 'bpmn:TimerEventDefinition');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:TimerEventDefinition',
          id: 'Definition_1',
          timeCycle: {
            $type: 'bpmn:FormalExpression',
            id: 'TimeCycle_1',
            body: '1w'
          }
        });

      });


      it('Documentation', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/documentation.bpmn');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:Definitions',
          id: 'documentation',
          targetNamespace: 'http://bpmn.io/schema/bpmn',
          rootElements: [
            {
              $type: 'bpmn:Process',
              id: 'Process_1',
              documentation: [
                { $type : 'bpmn:Documentation', text : 'THIS IS A PROCESS' }
              ],
              flowElements: [
                {
                  $type : 'bpmn:SubProcess',
                  id: 'SubProcess_1',
                  name : 'Sub Process 1',
                  documentation : [
                    {
                      $type : 'bpmn:Documentation',
                      text : '<h1>THIS IS HTML</h1>'
                    }
                  ]
                }
              ]
            }
          ]
        });

      });


      it('ThrowEvent#dataInputAssociations', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/throw-event-dataInputAssociations.part.bpmn', 'bpmn:EndEvent');

        var expected = {
          $type: 'bpmn:EndEvent',
          id: 'EndEvent_1',

          dataInputAssociations: [
            { $type: 'bpmn:DataInputAssociation', id: 'DataInputAssociation_1' }
          ]
        };

        // then
        expect(rootElement).to.jsonEqual(expected);
      });


      it('CatchEvent#dataOutputAssociations', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/catch-event-dataOutputAssociations.part.bpmn', 'bpmn:StartEvent');

        var expected = {
          $type: 'bpmn:StartEvent',
          id: 'StartEvent_1',

          dataOutputAssociations: [
            { $type: 'bpmn:DataOutputAssociation', id: 'DataOutputAssociation_1' }
          ]
        };

        // then
        expect(rootElement).to.jsonEqual(expected);
      });


      it('Escalation + Error', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/escalation-error.bpmn');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:Definitions',
          id: 'test',
          targetNamespace: 'http://bpmn.io/schema/bpmn',
          rootElements: [
            { $type : 'bpmn:Escalation', id : 'escalation' },
            { $type : 'bpmn:Error', id : 'error' }
          ]
        });
      });


      it('ExtensionElements', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/extension-elements.bpmn');

        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:Definitions',
          id: 'test',
          targetNamespace: 'http://bpmn.io/schema/bpmn',
          extensionElements: {
            $type : 'bpmn:ExtensionElements',
            values : [
              { $type: 'vendor:info', key: 'bgcolor', value: '#ffffff' },
              { $type: 'vendor:info', key: 'role', value: '[]' }
            ]
          }
        });
      });


      it('ScriptTask', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/scriptTask-script.part.bpmn', 'bpmn:ScriptTask');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:ScriptTask',
          id : 'ScriptTask_4',
          scriptFormat: 'Javascript',
          script: 'context.set("FOO", "BAR");'
        });
      });


      it('CallActivity#calledElement', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/callActivity-calledElement.part.bpmn', 'bpmn:CallActivity');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:CallActivity',
          id: 'CallActivity_1',
          calledElement: 'otherProcess'
        });
      });


      it('ItemDefinition#structureRef', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/itemDefinition-structureRef.part.bpmn', 'bpmn:ItemDefinition');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:ItemDefinition',
          id: 'itemDefinition',
          structureRef: 'foo:Service'
        });
      });


      it('Operation#implementationRef', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/operation-implementationRef.part.bpmn', 'bpmn:Operation');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:Operation',
          id: 'operation',
          implementationRef: 'foo:operation'
        });
      });


      it('Interface#implementationRef', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/interface-implementationRef.part.bpmn', 'bpmn:Interface');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:Interface',
          id: 'interface',
          implementationRef: 'foo:interface'
        });
      });


      it('Lane#childLaneSet', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/lane-childLaneSets.part.bpmn', 'bpmn:Lane');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:Lane',
          id: 'Lane_1',
          name: 'Lane',
          childLaneSet: {
            $type: 'bpmn:LaneSet',
            id: 'LaneSet_2',
            lanes: [
              {
                $type: 'bpmn:Lane',
                id: 'Lane_2',
                name: 'Nested Lane'
              }
            ]
          }
        });
      });


      it('SequenceFlow#conditionExpression', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/sequenceFlow-conditionExpression.part.bpmn', 'bpmn:SequenceFlow');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:SequenceFlow',
          id: 'SequenceFlow_1',
          conditionExpression: {
            $type: 'bpmn:FormalExpression',
            body: '${foo > bar}'
          }
        });
      });


      it('Category', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/category.bpmn');
        var category = rootElement.rootElements[0];

        // then
        expect(category).to.jsonEqual({
          $type: 'bpmn:Category',
          id: 'sid-ccc7e63e-916e-4bd0-a9f0-98cbff749195',
          categoryValue: [
            {
              $type: 'bpmn:CategoryValue',
              id: 'sid-afd7e63e-916e-4bd0-a9f0-98cbff749193',
              value: 'group with label'
            }
          ]
        });
      });


      it('MultiInstanceLoopCharacteristics#completionCondition', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/multiInstanceLoopCharacteristics-completionCondition.part.bpmn', 'bpmn:MultiInstanceLoopCharacteristics');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:MultiInstanceLoopCharacteristics',
          completionCondition: {
            $type: 'bpmn:FormalExpression',
            body: '${foo > bar}'
          }
        });
      });


      it('Operation#messageRef', async function() {

        // when
        var {
          references
        } = await fromFile('test/fixtures/bpmn/operation-messageRef.bpmn', 'bpmn:Definitions');

        var inMessage = {
          property: 'bpmn:inMessageRef',
          id: 'fooInMessage',
          element: { $type: 'bpmn:Operation', id: 'operation', name: 'foo' }
        };

        var outMessage = {
          property: 'bpmn:outMessageRef',
          id: 'fooOutMessage',
          element: { $type: 'bpmn:Operation', id: 'operation', name: 'foo' }
        };

        // then
        expect(references).to.jsonEqual([ inMessage, outMessage ]);
      });


      it('Association#associationDirection', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/association.part.bpmn', 'bpmn:Association');

        // then
        expect(rootElement).to.jsonEqual({
          '$type': 'bpmn:Association',
          associationDirection: 'None',
          id: 'association'
        });

      });

    });


    describe('bpmndi', function() {

      it('Extensions', async function() {

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/di/bpmnDiagram-extension.part.bpmn', 'bpmndi:BPMNDiagram');

        var expected = {
          $type: 'bpmndi:BPMNDiagram',
          id: 'BPMNDiagram_1',
          plane: {
            $type: 'bpmndi:BPMNPlane',
            id: 'BPMNPlane_1',
            extension: {
              $type: 'di:Extension',
              values: [
                {
                  $type: 'vendor:baz',
                  baz: 'BAZ'
                }
              ]
            },
            planeElement: [
              {
                $type: 'bpmndi:BPMNShape',
                id: 'BPMNShape_1',
                extension: {
                  $type: 'di:Extension',
                  values: [
                    {
                      $type: 'vendor:bar',
                      $body: 'BAR'
                    }
                  ]
                }
              },
              {
                $type: 'bpmndi:BPMNEdge',
                id: 'BPMNEdge_1',
                extension: {
                  $type: 'di:Extension'
                }
              }
            ]
          }
        };

        // then
        expect(rootElement).to.jsonEqual(expected);
      });


      it('BPMNShape#bounds (non-ns-attributes)', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/di/bpmnShape.part.bpmn', 'bpmndi:BPMNShape');

        var expected = {
          $type: 'bpmndi:BPMNShape',
          id: 'BPMNShape_1',
          isExpanded: true,
          bounds: { $type: 'dc:Bounds', height: 300.0, width: 300.0, x: 300.0, y: 80.0 }
        };

        // then
        expect(rootElement).to.jsonEqual(expected);
      });


      it('BPMNEdge#waypoint', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/di/bpmnEdge-waypoint.part.bpmn', 'bpmndi:BPMNEdge');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmndi:BPMNEdge',
          id : 'sid-2365FF07-4092-4B79-976A-AD192FE4E4E9_gui',
          waypoint: [
            { $type: 'dc:Point', x: 4905.0, y: 1545.0 },
            { $type: 'dc:Point', x: 4950.0, y: 1545.0 }
          ]
        });
      });


      it('Participant#participantMultiplicity', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/participantMultiplicity.part.bpmn', 'bpmn:Participant');

        // then
        expect(rootElement).to.jsonEqual({
          $type: 'bpmn:Participant',
          participantMultiplicity: {
            $type: 'bpmn:ParticipantMultiplicity',
            id: 'sid-a4e85590-bd67-418d-a617-53bcfcfde620',
            maximum: 2,
            minimum: 2
          }
        });
      });


      it('BPMNEdge#waypoint (explicit xsi:type)', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/di/bpmnEdge.part.bpmn', 'bpmndi:BPMNEdge');

        var expected = {
          $type: 'bpmndi:BPMNEdge',
          id: 'BPMNEdge_1',
          waypoint: [
            { $type: 'dc:Point', x: 388.0, y: 260.0 },
            { $type: 'dc:Point', x: 420.0, y: 260.0 }
          ]
        };

        // then
        expect(rootElement).to.jsonEqual(expected);
      });


      it('BPMNDiagram (nested elements)', async function() {

        // given

        // when
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/di/bpmnDiagram.part.bpmn', 'bpmndi:BPMNDiagram');

        var expected = {
          $type: 'bpmndi:BPMNDiagram',
          id: 'BPMNDiagram_1',
          plane: {
            $type: 'bpmndi:BPMNPlane',
            id: 'BPMNPlane_1',
            planeElement: [
              {
                $type: 'bpmndi:BPMNShape',
                id: 'BPMNShape_1',
                isExpanded: true,
                bounds: { $type: 'dc:Bounds', height: 300.0, width: 300.0, x: 300.0, y: 80.0 }
              },
              {
                $type: 'bpmndi:BPMNEdge',
                id: 'BPMNEdge_1',
                waypoint: [
                  { $type: 'dc:Point', x: 388.0, y: 260.0 },
                  { $type: 'dc:Point', x: 420.0, y: 260.0 }
                ]
              }
            ]
          }
        };

        // then
        expect(rootElement).to.jsonEqual(expected);
      });

    });

  });


  describe('should import references', function() {

    it('via attributes', async function() {

      // given
      var xml = '<bpmn:sequenceFlow xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" sourceRef="FOO_BAR" />';

      // when
      var {
        references
      } = await read(xml, 'bpmn:SequenceFlow');

      var expectedReference = {
        element: {
          $type: 'bpmn:SequenceFlow'
        },
        property: 'bpmn:sourceRef',
        id: 'FOO_BAR'
      };

      // then
      expect(references).to.jsonEqual([ expectedReference ]);
    });


    it('via elements', async function() {

      // given
      var xml =
        '<bpmn:serviceTask xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">' +
          '<bpmn:outgoing>OUT_1</bpmn:outgoing>' +
          '<bpmn:outgoing>OUT_2</bpmn:outgoing>' +
        '</bpmn:serviceTask>';

      // when
      var {
        references
      } = await read(xml, 'bpmn:ServiceTask');

      var reference1 = {
        property: 'bpmn:outgoing',
        id: 'OUT_1',
        element: { $type: 'bpmn:ServiceTask' }
      };

      var reference2 = {
        property: 'bpmn:outgoing',
        id: 'OUT_2',
        element: { $type: 'bpmn:ServiceTask' }
      };

      // then
      expect(references).to.jsonEqual([ reference1, reference2 ]);
    });
  });


  describe('should import extensions', function() {

    it('attributes on root', async function() {

      // given
      var xml = '<bpmn:sequenceFlow xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                                   'xmlns:foo="http://foobar" foo:bar="BAR" />';

      // when
      var {
        rootElement
      } = await read(xml, 'bpmn:SequenceFlow');

      // then
      expect(rootElement.$attrs['foo:bar']).to.eql('BAR');

    });


    it('elements via bpmn:extensionElements', async function() {

      // when
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/extension-elements.bpmn');

      expect(rootElement).to.jsonEqual({
        $type: 'bpmn:Definitions',
        id: 'test',
        targetNamespace: 'http://bpmn.io/schema/bpmn',
        extensionElements: {
          $type : 'bpmn:ExtensionElements',
          values : [
            { $type: 'vendor:info', key: 'bgcolor', value: '#ffffff' },
            { $type: 'vendor:info', key: 'role', value: '[]' }
          ]
        }
      });

    });

  });


  describe('should read xml documents', function() {

    it('empty definitions', async function() {

      // when
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/empty-definitions.bpmn');

      var expected = {
        $type: 'bpmn:Definitions',
        id: 'empty-definitions',
        targetNamespace: 'http://bpmn.io/schema/bpmn'
      };

      // then
      expect(rootElement).to.jsonEqual(expected);
    });


    it('empty definitions (default ns)', async function() {

      // given

      // when
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/empty-definitions-default-ns.bpmn');

      var expected = {
        $type: 'bpmn:Definitions',
        id: 'empty-definitions',
        targetNamespace: 'http://bpmn.io/schema/bpmn'
      };

      // then
      expect(rootElement).to.jsonEqual(expected);
    });


    it('simple process', async function() {

      // given

      // when
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/simple.bpmn');

      // then
      expect(rootElement.id).to.equal('simple');
    });


    it('simple process (default ns)', async function() {

      // given

      // when
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/simple-default-ns.bpmn');

      expect(rootElement.id).to.equal('simple');
    });

  });


  describe('should handle errors', function() {

    it('when importing non-xml text', async function() {

      // given
      var error;

      // when
      try {
        await fromFile('test/fixtures/bpmn/error/no-xml.txt');
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;
    });


    it('when importing non-bpmn xml', async function() {

      // given
      var error;

      // when
      try {
        await fromFile('test/fixtures/bpmn/error/not-bpmn.bpmn');
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;

      var warnings = error.warnings;
      var warning = warnings[0];

      expect(error.message).to.match(/failed to parse document as <bpmn:Definitions>/);

      expect(warnings).to.have.length(1);
      expect(warning.message).to.match(/unparsable content <definitions> detected/);
    });


    it('when importing binary', async function() {

      // given
      var error;

      // when
      try {
        await fromFile('test/fixtures/bpmn/error/binary.png');
      } catch (err) {
        error = err;
      }

      // then
      expect(error).to.exist;
    });


    it('when importing bpmn:Extension (missing definition)', async function() {

      // when
      var {
        warnings
      } = await fromFile('test/fixtures/bpmn/error/extension-definition-missing.bpmn');

      // then
      expect(warnings).to.have.length(1);

      expect(warnings[0].message).to.eql('unresolved reference <ino:tInnovator>');
    });


    it('when importing invalid bpmn', async function() {

      // when
      var {
        warnings
      } = await fromFile('test/fixtures/bpmn/error/undeclared-ns-child.bpmn');

      // then
      expect(warnings).to.have.length(1);
    });


    it('when importing invalid categoryValue / reference', async function() {

      // when
      var {
        warnings
      } = await fromFile('test/fixtures/bpmn/error/categoryValue.bpmn');

      // then
      // wrong <categoryValue> + unresolvable reference
      expect(warnings).to.have.length(2);

      var invalidElementWarning = warnings[0];
      var unresolvableReferenceWarning = warnings[1];

      expect(invalidElementWarning.message).to.eql(
        'unparsable content <categoryValue> detected\n\t' +
              'line: 2\n\t' +
              'column: 2\n\t' +
              'nested error: unrecognized element <bpmn:categoryValue>');

      expect(unresolvableReferenceWarning.message).to.eql(
        'unresolved reference <sid-afd7e63e-916e-4bd0-a9f0-98cbff749193>');
    });


    it('when importing valid bpmn / unrecognized element', async function() {

      // when
      var {
        warnings
      } = await fromFile('test/fixtures/bpmn/error/unrecognized-child.bpmn');

      // then
      expect(warnings).to.have.length(1);
    });


    it('when importing duplicate ids', async function() {

      // when
      var {
        warnings
      } = await fromFile('test/fixtures/bpmn/error/duplicate-ids.bpmn');

      // then
      expect(warnings).to.have.length(1);
      expect(warnings[0].message).to.contain('duplicate ID <test>');
    });


    it('when importing non UTF-8 files', async function() {

      // when
      var {
        warnings
      } = await fromFile('test/fixtures/bpmn/error/bad-encoding.bpmn');

      // then
      expect(warnings).to.have.length(1);
      expect(warnings[0].message).to.match(/unsupported document encoding <windows-1252>/);

    });


    it('when importing broken diagram / xmlns redeclaration', async function() {

      // when
      var {
        rootElement,
        warnings
      } = await fromFile('test/fixtures/bpmn/error/xmlns-redeclaration.bpmn');

      // then
      expect(warnings).to.have.length(2);
      expect(warnings[0].message).to.match(/attribute <xmlns> already defined/);
      expect(warnings[1].message).to.match(/attribute <id> already defined/);

      expect(rootElement.$attrs.xmlns).to.eql('http://www.omg.org/spec/BPMN/20100524/MODEL');
      expect(rootElement.id).to.eql('a10');
    });


    it('when importing invalid attributes', async function() {

      // when
      var {
        warnings,
        elementsById,
      } = await fromFile('test/fixtures/bpmn/error/invalid-attributes.bpmn');

      expect(warnings).to.have.length(2);
      expect(warnings[0].message).to.match(/illegal first char attribute name/);
      expect(warnings[1].message).to.match(/missing attribute value/);

      expect(elementsById['Process_1']).to.jsonEqual(
        {
          $type: 'bpmn:Process',
          id: 'Process_1'
        }
      );
    });

  });


  describe('should read attributes', function() {

    it('when importing non-xml text', async function() {

      // when
      var {
        rootElement,
        warnings
      } = await fromFile('test/fixtures/bpmn/attrs.bpmn');

      expect(warnings).to.have.length(1);

      expect(warnings[0].message).to.match(
        /illegal first char attribute name/
      );

      expect(rootElement.$attrs).to.jsonEqual({
        'xmlns:bpmn2': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
        'xmlns:color_1.0': 'http://colors',
        'xmlns:.color': 'http://colors'
      });

      expect(rootElement).to.jsonEqual({
        $type: 'bpmn:Definitions'
      });
    });

  });

});
