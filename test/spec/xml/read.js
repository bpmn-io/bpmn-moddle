'use strict';

var os = require('os');

var XMLHelper = require('../../xml-helper'),
    Helper = require('../../helper');

var writeBpmn = XMLHelper.writeBpmn,
    readBpmn = XMLHelper.readBpmn;


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


      it('Documentation', function(done) {

        // when
        fromFile('test/fixtures/bpmn/documentation.bpmn', 'bpmn:Definitions', function(err, result) {

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


      it('Escalation + Error', function(done) {

        // when
        fromFile('test/fixtures/bpmn/escalation-error.bpmn', 'bpmn:Definitions', function(err, result) {

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
        fromFile('test/fixtures/bpmn/extension-elements.bpmn', 'bpmn:Definitions', function(err, result) {

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

    });


    describe('bpmndi', function() {

      it('BPMNShape#bounds (non-ns-attributes)', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/di/bpmnshape.part.bpmn', 'bpmndi:BPMNShape', function(err, result) {

          var expected = {
            $type: 'bpmndi:BPMNShape',
            id: 'BPMNShape_1',
            isExpanded: true,
            bounds: { $type: 'dc:Bounds', height: 300.0, width: 300.0, x: 300.0, y: 80.0 }
          };

          // then
          expect(result).to.jsonEqual(expected);
          expect(result.bounds).to.exist;

          done(err);
        });
      });


      it('BPMNEdge#waypoint', function(done) {

        // given

        // when
        fromFile('test/fixtures/bpmn/di/bpmnedge-waypoint.part.bpmn', 'bpmndi:BPMNEdge', function(err, result) {

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
        fromFile('test/fixtures/bpmn/di/bpmnedge.part.bpmn', 'bpmndi:BPMNEdge', function(err, result) {

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
        fromFile('test/fixtures/bpmn/di/bpmndiagram.part.bpmn', 'bpmndi:BPMNDiagram', function(err, result) {

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


  describe('should read xml documents', function() {

    it('empty definitions', function(done) {

      // given

      // when
      fromFile('test/fixtures/bpmn/empty-definitions.bpmn', 'bpmn:Definitions', function(err, result) {

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
      fromFile('test/fixtures/bpmn/empty-definitions-default-ns.bpmn', 'bpmn:Definitions', function(err, result) {

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
      fromFile('test/fixtures/bpmn/simple.bpmn', 'bpmn:Definitions', function(err, result) {

        // then
        expect(result.id).to.equal('simple');

        done(err);
      });
    });


    it('simple process (default ns)', function(done) {

      // given

      // when
      fromFile('test/fixtures/bpmn/simple-default-ns.bpmn', 'bpmn:Definitions', function(err, result) {

        expect(result.id).to.equal('simple');

        done(err);
      });
    });

  });


  describe('should handle errors', function() {

    it('when importing non-xml text', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/no-xml.txt', 'bpmn:Definitions', function(err, result) {

        expect(err).not.to.eql(null);

        done();
      });
    });


    it('when importing binary', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/binary.png', 'bpmn:Definitions', function(err, result) {

        expect(err).not.to.eql(null);

        done();
      });

    });


    it('when importing invalid bpmn', function(done) {

      // when
      fromFile('test/fixtures/bpmn/error/invalid-child.bpmn', 'bpmn:Definitions', function(err, result) {

        expect(err).not.to.eql(null);

        done();
      });
    });

  });

});