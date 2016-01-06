'use strict';

var os = require('os');

var Helper = require('../../helper');


describe('bpmn-moddle - read', function() {

  var moddle = Helper.createModdle();

  function read(xml, root, opts, callback) {
    return moddle.fromXML(xml, root, opts, callback);
  }

  function fromFile(file, root, opts, callback) {
    var contents = Helper.readFile(file);
    return read(contents, root, opts, callback);
  }


  describe('should import types', function() {

    describe('bpmn', function() {

      it('SubProcess#flowElements', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/sub-process-flow-nodes.part.bpmn', 'bpmn:SubProcess', function(err, result) {

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
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('SubProcess#flowElements (nested references)', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/sub-process.part.bpmn', 'bpmn:SubProcess', function(err, result) {

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
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('SubProcess#incoming', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/subprocess-flow-nodes-outgoing.part.bpmn', 'bpmn:Process', function(err, result) {

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
          expect(result).to.jsonEqual(expected);


          var subProcess = result.flowElements[0];
          var sequenceFlow = result.flowElements[1];

          // expect correctly resolved references
          expect(subProcess.incoming).to.jsonEqual([ expectedSequenceFlow ]);
          expect(subProcess.outgoing).to.jsonEqual([ expectedSequenceFlow ]);

          expect(sequenceFlow.sourceRef).to.jsonEqual(expectedSubProcess);
          expect(sequenceFlow.targetRef).to.jsonEqual(expectedSubProcess);

          done(err);
        });
      });


      it('TimerEventDefinition#expression', function(done) {

        // given
        var file = 'test/fixtures/bpmn/timerEventDefinition.part.bpmn';

        // when
        fromFile(file, 'bpmn:TimerEventDefinition', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'bpmn:TimerEventDefinition',
            id: 'Definition_1',
            timeCycle: {
              $type: 'bpmn:FormalExpression',
              id: 'TimeCycle_1',
              body: '1w'
            }
          });

          done(err);
        });

      });

      it('Documentation', function(done) {

        // when
        fromFile('test/fixtures/bpmn/documentation.bpmn', function(err, result) {

          // then
          expect(result).to.jsonEqual({
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
                        text : os.EOL + '        <h1>THIS IS HTML</h1>' + os.EOL + '      '
                      }
                    ]
                  }
                ]
              }
            ]
          });

          done(err);
        });

      });


      it('ThrowEvent#dataInputAssociations', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/throw-event-dataInputAssociations.part.bpmn', 'bpmn:EndEvent', function(err, result) {

          var expected = {
            $type: 'bpmn:EndEvent',
            id: 'EndEvent_1',

            dataInputAssociations: [
              { $type: 'bpmn:DataInputAssociation', id: 'DataInputAssociation_1' }
            ]
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('CatchEvent#dataOutputAssociations', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/catch-event-dataOutputAssociations.part.bpmn', 'bpmn:StartEvent', function(err, result) {

          var expected = {
            $type: 'bpmn:StartEvent',
            id: 'StartEvent_1',

            dataOutputAssociations: [
              { $type: 'bpmn:DataOutputAssociation', id: 'DataOutputAssociation_1' }
            ]
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('Escalation + Error', function(done) {

        // when
        fromFile('test/fixtures/bpmn/escalation-error.bpmn', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'bpmn:Definitions',
            id: 'test',
            targetNamespace: 'http://bpmn.io/schema/bpmn',
            rootElements: [
              { $type : 'bpmn:Escalation', id : 'escalation' },
              { $type : 'bpmn:Error', id : 'error' }
            ]
          });

          done(err);
        });
      });


      it('ExtensionElements', function(done) {

        // when
        fromFile('test/fixtures/bpmn/extension-elements.bpmn', function(err, result) {

          expect(result).to.jsonEqual({
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

          done(err);
        });
      });


      it('ScriptTask', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/scriptTask-script.part.bpmn', 'bpmn:ScriptTask', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'bpmn:ScriptTask',
            id : 'ScriptTask_4',
            scriptFormat: 'Javascript',
            script: 'context.set("FOO", "BAR");'
          });

          done(err);
        });
      });


      it('CallActivity#calledElement', function(done) {

        // when
        fromFile('test/fixtures/bpmn/callActivity-calledElement.part.bpmn', 'bpmn:CallActivity', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'bpmn:CallActivity',
            id: 'CallActivity_1',
            calledElement: 'otherProcess'
          });

          done(err);
        });
      });


      it('ItemDefinition#structureRef', function(done) {

        // when
        fromFile('test/fixtures/bpmn/itemDefinition-structureRef.part.bpmn', 'bpmn:ItemDefinition', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'bpmn:ItemDefinition',
            id: 'itemDefinition',
            structureRef: 'foo:Service'
          });

          done(err);
        });
      });


      it('Operation#implementationRef', function(done) {

        // when
        fromFile('test/fixtures/bpmn/operation-implementationRef.part.bpmn', 'bpmn:Operation', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'bpmn:Operation',
            id: 'operation',
            implementationRef: 'foo:operation'
          });

          done(err);
        });
      });


      it('Interface#implementationRef', function(done) {

        // when
        fromFile('test/fixtures/bpmn/interface-implementationRef.part.bpmn', 'bpmn:Interface', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'bpmn:Interface',
            id: 'interface',
            implementationRef: 'foo:interface'
          });

          done(err);
        });
      });


      it('Lane#childLaneSet', function(done) {

        // when
        fromFile('test/fixtures/bpmn/lane-childLaneSets.part.bpmn', 'bpmn:Lane', function(err, result) {

          // then
          expect(result).to.jsonEqual({
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

          done(err);
        });
      });


      it('SequenceFlow#conditionExpression', function(done) {

        // when
        fromFile('test/fixtures/bpmn/sequenceFlow-conditionExpression.part.bpmn', 'bpmn:SequenceFlow', function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.jsonEqual({
            $type: 'bpmn:SequenceFlow',
            id: 'SequenceFlow_1',
            conditionExpression: {
              $type: 'bpmn:FormalExpression',
              body: '${foo > bar}'
            }
          });

          done(err);
        });
      });


      it('Category', function(done) {

        // when
        fromFile('test/fixtures/bpmn/category.bpmn', function(err, result) {

          if (err) {
            return done(err);
          }

          var category = result.rootElements[0];

          // then
          expect(category).to.jsonEqual({
            $type: "bpmn:Category",
            id: "sid-ccc7e63e-916e-4bd0-a9f0-98cbff749195",
            categoryValue: [
              {
                $type: "bpmn:CategoryValue",
                id: "sid-afd7e63e-916e-4bd0-a9f0-98cbff749193",
                value: "group with label"
              }
            ]
          });

          done(err);
        });
      });


      it('MultiInstanceLoopCharacteristics#completionCondition', function(done) {

        // when
        fromFile('test/fixtures/bpmn/multiInstanceLoopCharacteristics-completionCondition.part.bpmn', 'bpmn:MultiInstanceLoopCharacteristics', function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.jsonEqual({
            $type: 'bpmn:MultiInstanceLoopCharacteristics',
            completionCondition: {
              $type: 'bpmn:FormalExpression',
              body: '${foo > bar}'
            }
          });

          done(err);
        });
      });


      it('Operation#messageRef', function(done) {

        // when
        fromFile('test/fixtures/bpmn/operation-messageRef.bpmn', 'bpmn:Definitions', function(err, result, context) {

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

          var references = context.references;

          // then
          expect(references).to.jsonEqual([ inMessage, outMessage ]);

          done(err);
        });
      });

    });


    describe('bpmndi', function() {

      it('Extensions', function(done) {

        // when
        fromFile('test/fixtures/bpmn/di/bpmnDiagram-extension.part.bpmn', 'bpmndi:BPMNDiagram', function(err, result) {

          if (err) {
            return done(err);
          }

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
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('BPMNShape#bounds (non-ns-attributes)', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/di/bpmnShape.part.bpmn', 'bpmndi:BPMNShape', function(err, result) {

          var expected = {
            $type: 'bpmndi:BPMNShape',
            id: 'BPMNShape_1',
            isExpanded: true,
            bounds: { $type: 'dc:Bounds', height: 300.0, width: 300.0, x: 300.0, y: 80.0 }
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('BPMNEdge#waypoint', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/di/bpmnEdge-waypoint.part.bpmn', 'bpmndi:BPMNEdge', function(err, result) {

          // then
          expect(result).to.jsonEqual({
            $type: 'bpmndi:BPMNEdge',
            id : 'sid-2365FF07-4092-4B79-976A-AD192FE4E4E9_gui',
            waypoint: [
              { $type: 'dc:Point', x: 4905.0, y: 1545.0 },
              { $type: 'dc:Point', x: 4950.0, y: 1545.0 }
            ]
          });

          done(err);
        });
      });


      it('BPMNEdge#waypoint (explicit xsi:type)', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/di/bpmnEdge.part.bpmn', 'bpmndi:BPMNEdge', function(err, result) {

          var expected = {
            $type: 'bpmndi:BPMNEdge',
            id: 'BPMNEdge_1',
            waypoint: [
              { $type: 'dc:Point', x: 388.0, y: 260.0 },
              { $type: 'dc:Point', x: 420.0, y: 260.0 }
            ]
          };

          // then
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });


      it('BPMNDiagram (nested elements)', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/di/bpmnDiagram.part.bpmn', 'bpmndi:BPMNDiagram', function(err, result) {

          var expected = {
            $type: 'bpmndi:BPMNDiagram',
            id: 'bpmndiagram',

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
          expect(result).to.jsonEqual(expected);

          done(err);
        });
      });

    });

  });


  describe('should import references', function() {

    it('via attributes', function(done) {

      // given
      var xml = '<bpmn:sequenceFlow xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/bpmnModel" sourceRef="FOO_BAR" />';

      // when
      read(xml, 'bpmn:SequenceFlow', function(err, result, context) {

        var expectedReference = {
          element: {
            $type: 'bpmn:SequenceFlow'
          },
          property: 'bpmn:sourceRef',
          id: 'FOO_BAR'
        };

        var references = context.references;

        // then
        expect(references).to.jsonEqual([ expectedReference ]);

        done(err);
      });
    });


    it('via elements', function(done) {

      // given
      var xml =
        '<bpmn:serviceTask xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/bpmnModel">' +
          '<bpmn:outgoing>OUT_1</bpmn:outgoing>' +
          '<bpmn:outgoing>OUT_2</bpmn:outgoing>' +
        '</bpmn:serviceTask>';

      // when
      read(xml, 'bpmn:ServiceTask', function(err, result, context) {

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

        var references = context.references;

        // then
        expect(references).to.jsonEqual([ reference1, reference2 ]);

        done(err);
      });
    });
  });


  describe('should import extensions', function() {

    it('attributes on root', function(done) {

      // given
      var xml = '<bpmn:sequenceFlow xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/bpmnModel" ' +
                                   'xmlns:foo="http://foobar" foo:bar="BAR" />';

      // when
      read(xml, 'bpmn:SequenceFlow', function(err, result, context) {

        // then
        expect(result.$attrs['foo:bar']).to.eql("BAR");

        done(err);
      });

    });


    it('elements via bpmn:extensionElements', function(done) {

      // when
      fromFile('test/fixtures/bpmn/extension-elements.bpmn', function(err, result) {

        expect(result).to.jsonEqual({
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

        done(err);
      });

    });

  });


  describe('should read xml documents', function() {

    it('empty definitions', function(done) {

      // given

      // when
      fromFile('test/fixtures/bpmn/empty-definitions.bpmn', function(err, result) {

        var expected = {
          $type: 'bpmn:Definitions',
          id: 'empty-definitions',
          targetNamespace: 'http://bpmn.io/schema/bpmn'
        };

        // then
        expect(result).to.jsonEqual(expected);

        done(err);
      });
    });


    it('empty definitions (default ns)', function(done) {

      // given

      // when
      fromFile('test/fixtures/bpmn/empty-definitions-default-ns.bpmn', function(err, result) {

        var expected = {
          $type: 'bpmn:Definitions',
          id: 'empty-definitions',
          targetNamespace: 'http://bpmn.io/schema/bpmn'
        };

        // then
        expect(result).to.jsonEqual(expected);

        done(err);
      });
    });


    it('simple process', function(done) {

      // given

      // when
      fromFile('test/fixtures/bpmn/simple.bpmn', function(err, result) {

        // then
        expect(result.id).to.equal('simple');

        done(err);
      });
    });


    it('simple process (default ns)', function(done) {

      // given

      // when
      fromFile('test/fixtures/bpmn/simple-default-ns.bpmn', function(err, result) {

        expect(result.id).to.equal('simple');

        done(err);
      });
    });

  });


  describe('should handle errors', function() {

    it('when importing non-xml text', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/no-xml.txt', function(err, result) {

        expect(err).not.to.eql(null);

        done();
      });
    });


    it('when importing binary', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/binary.png', function(err, result) {

        expect(err).not.to.eql(null);

        done();
      });

    });


    it('when importing invalid bpmn', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/undeclared-ns-child.bpmn', function(err, result, context) {

        var warnings = context.warnings;

        expect(err).not.to.exist;
        expect(warnings.length).to.eql(1);

        done();
      });
    });


    it('when importing invalid categoryValue / reference', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/categoryValue.bpmn', function(err, result, context) {

        var warnings = context.warnings;

        // then
        expect(err).not.to.exist;

        // wrong <categoryValue> + unresolvable reference
        expect(warnings.length).to.eql(2);

        var invalidElementWarning = warnings[0];
        var unresolvableReferenceWarning = warnings[1];

        expect(invalidElementWarning.message).to.eql(
            'unparsable content <categoryValue> detected\n\t' +
              'line: 2\n\t' +
              'column: 89\n\t' +
              'nested error: unrecognized element <bpmn:categoryValue>');

        expect(unresolvableReferenceWarning.message).to.eql(
            'unresolved reference <sid-afd7e63e-916e-4bd0-a9f0-98cbff749193>');

        done();
      });
    });


    it('when importing valid bpmn / unrecognized element', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/unrecognized-child.bpmn', function(err, result, context) {

        var warnings = context.warnings;

        expect(err).not.to.exist;
        expect(warnings.length).to.eql(1);

        done();
      });
    });

  });

});
