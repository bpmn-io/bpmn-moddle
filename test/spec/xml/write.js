'use strict';

var assign = require('lodash/object/assign'),
    isFunction = require('lodash/lang/isFunction');

var Helper = require('../../helper');



describe('bpmn-moddle - write', function() {

  var moddle = Helper.createModdle();


  function write(element, options, callback) {
    if (isFunction(options)) {
      callback = options;
      options = {};
    }

    // skip preamble for tests
    options = assign({ preamble: false }, options);

    moddle.toXML(element, options, callback);
  }



  describe('should export types', function() {

    describe('bpmn', function() {

      it('Definitions (empty)', function(done) {

        // given
        var definitions = moddle.create('bpmn:Definitions');

        var expectedXML =
          '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" />';

        // when
        write(definitions, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Definitions (participant + interface)', function(done) {

        // given
        var interfaceElement = moddle.create('bpmn:Interface', {
          id: 'Interface_1'
        });

        var participantElement = moddle.create('bpmn:Participant', {
          id: 'Process_1',
          interfaceRef: [
            interfaceElement
          ]
        });

        var collaborationElement = moddle.create('bpmn:Collaboration', {
          participants: [
            participantElement
          ]
        });

        var definitions = moddle.create('bpmn:Definitions', {
          targetNamespace: 'http://bpmn.io/bpmn',
          rootElements: [
            interfaceElement,
            collaborationElement
          ]
        });

        var expectedXML =
          '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                  'targetNamespace="http://bpmn.io/bpmn">' +
            '<bpmn:interface id="Interface_1" />' +
            '<bpmn:collaboration>' +
              '<bpmn:participant id="Process_1">' +
                '<bpmn:interfaceRef>Interface_1</bpmn:interfaceRef>' +
              '</bpmn:participant>' +
            '</bpmn:collaboration>' +
          '</bpmn:definitions>';

        // when
        write(definitions, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('ScriptTask#script', function(done) {

        // given
        var scriptTask = moddle.create('bpmn:ScriptTask', {
          id: 'ScriptTask_1',
          scriptFormat: 'JavaScript',
          script: 'context.set("FOO", "&nbsp;");'
        });

        var expectedXML =
          '<bpmn:scriptTask xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                           'id="ScriptTask_1" scriptFormat="JavaScript">' +
            '<bpmn:script><![CDATA[context.set("FOO", "&nbsp;");]]></bpmn:script>' +
          '</bpmn:scriptTask>';

        // when
        write(scriptTask, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('SequenceFlow#conditionExpression', function(done) {

        // given
        var sequenceFlow = moddle.create('bpmn:SequenceFlow', {
          id: 'SequenceFlow_1'
        });

        sequenceFlow.conditionExpression = moddle.create('bpmn:FormalExpression', { body: '${ foo < bar }' });

        var expectedXML =
          '<bpmn:sequenceFlow xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                             'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                             'id="SequenceFlow_1">\n' +
          '  <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"><![CDATA[${ foo < bar }]]></bpmn:conditionExpression>\n' +
          '</bpmn:sequenceFlow>\n';

        // when
        write(sequenceFlow, { format: true }, function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('MultiInstanceLoopCharacteristics', function(done) {

        // given
        var loopCharacteristics = moddle.create('bpmn:MultiInstanceLoopCharacteristics', {
          loopCardinality: moddle.create('bpmn:FormalExpression', { body: '${ foo < bar }' }),
          loopDataInputRef: moddle.create('bpmn:Property', { id: 'loopDataInputRef' }),
          loopDataOutputRef: moddle.create('bpmn:Property', { id: 'loopDataOutputRef' }),
          inputDataItem: moddle.create('bpmn:DataInput', { id: 'inputDataItem' }),
          outputDataItem: moddle.create('bpmn:DataOutput', { id: 'outputDataItem' }),
          complexBehaviorDefinition: [
            moddle.create('bpmn:ComplexBehaviorDefinition', { id: 'complexBehaviorDefinition' })
          ],
          completionCondition: moddle.create('bpmn:FormalExpression', { body: '${ done }' }),
          isSequential: true,
          behavior: 'One',
          oneBehaviorEventRef: moddle.create('bpmn:CancelEventDefinition', { id: 'oneBehaviorEventRef' }),
          noneBehaviorEventRef: moddle.create('bpmn:MessageEventDefinition', { id: 'noneBehaviorEventRef' })
        });

        var expectedXML =
          '<bpmn:multiInstanceLoopCharacteristics xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                                                 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                                                 'isSequential="true" ' +
                                                 'behavior="One" ' +
                                                 'oneBehaviorEventRef="oneBehaviorEventRef" ' +
                                                 'noneBehaviorEventRef="noneBehaviorEventRef">' +
              '<bpmn:loopCardinality xsi:type="bpmn:tFormalExpression"><![CDATA[${ foo < bar }]]></bpmn:loopCardinality>' +
              '<bpmn:loopDataInputRef>loopDataInputRef</bpmn:loopDataInputRef>' +
              '<bpmn:loopDataOutputRef>loopDataOutputRef</bpmn:loopDataOutputRef>' +
              '<bpmn:inputDataItem id="inputDataItem" />' +
              '<bpmn:outputDataItem id="outputDataItem" />' +
              '<bpmn:complexBehaviorDefinition id="complexBehaviorDefinition" />' +
              '<bpmn:completionCondition xsi:type="bpmn:tFormalExpression">${ done }</bpmn:completionCondition>' +
          '</bpmn:multiInstanceLoopCharacteristics>';

        // when
        write(loopCharacteristics, function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Process', function(done) {

        // given
        var processElement = moddle.create('bpmn:Process', {
          id: 'Process_1',
          flowElements: [
            moddle.create('bpmn:Task', { id: 'Task_1' })
          ],
          properties: [
            moddle.create('bpmn:Property', { name: 'foo' })
          ],
          laneSets: [
            moddle.create('bpmn:LaneSet', { id: 'LaneSet_1' })
          ],
          monitoring: moddle.create('bpmn:Monitoring'),
          artifacts: [
            moddle.create('bpmn:TextAnnotation', {
              id: 'TextAnnotation_1',
              text: 'FOOBAR'
            })
          ],
          resources: [
            moddle.create('bpmn:PotentialOwner', { name: 'Walter' })
          ]
        });

        var expectedXML =
          '<bpmn:process xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                        'id="Process_1">' +
            '<bpmn:monitoring />' +
            '<bpmn:property name="foo" />' +
            '<bpmn:laneSet id="LaneSet_1" />' +
            '<bpmn:task id="Task_1" />' +
            '<bpmn:textAnnotation id="TextAnnotation_1">' +
              '<bpmn:text>FOOBAR</bpmn:text>' +
            '</bpmn:textAnnotation>' +
            '<bpmn:potentialOwner name="Walter" />' +
          '</bpmn:process>';

        // when
        write(processElement, function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Activity', function(done) {

        // given
        var activity = moddle.create('bpmn:Activity', {
          id: 'Activity_1',
          properties: [
            moddle.create('bpmn:Property', { name: 'FOO' }),
            moddle.create('bpmn:Property', { name: 'BAR' })
          ],
          resources: [
            moddle.create('bpmn:HumanPerformer', { name: 'Walter'} )
          ],
          dataInputAssociations: [
            moddle.create('bpmn:DataInputAssociation', { id: 'Input_1' })
          ],
          dataOutputAssociations: [
            moddle.create('bpmn:DataOutputAssociation', { id: 'Output_1' })
          ],
          ioSpecification: moddle.create('bpmn:InputOutputSpecification')
        });

        var expectedXML =
          '<bpmn:activity xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Activity_1">' +
            '<bpmn:ioSpecification />' +
            '<bpmn:property name="FOO" />' +
            '<bpmn:property name="BAR" />' +
            '<bpmn:dataInputAssociation id="Input_1" />' +
            '<bpmn:dataOutputAssociation id="Output_1" />' +
            '<bpmn:humanPerformer name="Walter" />' +
          '</bpmn:activity>';

        // when
        write(activity, function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('BaseElement#documentation', function(done) {

        // given
        var defs = moddle.create('bpmn:Definitions', {
          id: 'Definitions_1'
        });

        var docs = defs.get('documentation');

        docs.push(moddle.create('bpmn:Documentation', { textFormat: 'xyz', text: 'FOO\nBAR' }));
        docs.push(moddle.create('bpmn:Documentation', { text: '<some /><html></html>' }));

        var expectedXML =
          '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_1">' +
             '<bpmn:documentation textFormat="xyz"><![CDATA[FOO\nBAR]]></bpmn:documentation>' +
             '<bpmn:documentation><![CDATA[<some /><html></html>]]></bpmn:documentation>' +
          '</bpmn:definitions>';

        // when
        write(defs, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('CallableElement#ioSpecification', function(done) {

        // given
        var callableElement = moddle.create('bpmn:CallableElement', {
          id: 'Callable_1',
          ioSpecification: moddle.create('bpmn:InputOutputSpecification')
        });

        var expectedXML =
          '<bpmn:callableElement xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Callable_1">' +
            '<bpmn:ioSpecification />' +
          '</bpmn:callableElement>';

        // when
        write(callableElement, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done();
        });
      });


      it('ResourceRole#resourceRef', function(done) {

        // given
        var role = moddle.create('bpmn:ResourceRole', {
          id: 'Callable_1',
          resourceRef: moddle.create('bpmn:Resource', { id: 'REF' })
        });

        var expectedXML =
          '<bpmn:resourceRole xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Callable_1">' +
            '<bpmn:resourceRef>REF</bpmn:resourceRef>' +
          '</bpmn:resourceRole>';

        // when
        write(role, function(err, result) {

          // then
          expect(err).not.to.exist;

          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('ResourceAssignmentExpression', function(done) {

        // given
        var expression = moddle.create('bpmn:FormalExpression', { body: '${ foo < bar }' });

        var assignmentExpression =
              moddle.create('bpmn:ResourceAssignmentExpression', {
                id: 'FOO BAR',
                expression: expression
              });

        var expectedXML =
          '<bpmn:resourceAssignmentExpression ' +
                    'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                    'id="FOO BAR">' +
            '<bpmn:expression xsi:type="bpmn:tFormalExpression">' +
              '<![CDATA[${ foo < bar }]]>' +
            '</bpmn:expression>' +
          '</bpmn:resourceAssignmentExpression>';

        // when
        write(assignmentExpression, function(err, result, context) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });

      });


      it('CallActivity#calledElement', function(done) {

        // given
        var callActivity = moddle.create('bpmn:CallActivity', {
          id: 'CallActivity_1',
          calledElement: 'otherProcess'
        });

        var expectedXML =
          '<bpmn:callActivity ' +
              'xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
              'id="CallActivity_1" calledElement="otherProcess" />';

        // when
        write(callActivity, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('ItemDefinition#structureRef', function(done) {

        // given
        var itemDefinition = moddle.create('bpmn:ItemDefinition', {
          id: 'serviceInput',
          structureRef: 'service:CelsiusToFahrenheitSoapIn'
        });

        var expectedXML =
          '<bpmn:itemDefinition xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                  'id="serviceInput" ' +
                  'structureRef="service:CelsiusToFahrenheitSoapIn" />';

        // when
        write(itemDefinition, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('ItemDefinition#structureRef with ns', function(done) {

        // given
        var itemDefinition = moddle.create('bpmn:ItemDefinition', {
          'xmlns:xs': 'http://xml-types',
          id: 'xsdBool',
          isCollection: true,
          itemKind: 'Information',
          structureRef: 'xs:tBool'
        });

        var expectedXML =
          '<bpmn:itemDefinition xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                               'xmlns:xs="http://xml-types" ' +
                               'id="xsdBool" ' +
                               'itemKind="Information" ' +
                               'structureRef="xs:tBool" ' +
                               'isCollection="true" />';


        // when
        write(itemDefinition, function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done();
        });
      });


      it('Operation#implementationRef', function(done) {

        // given
        var operation = moddle.create('bpmn:Operation', {
          id: 'operation',
          implementationRef: 'foo:operation'
        });

        var expectedXML =
          '<bpmn:operation xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                  'id="operation" ' +
                  'implementationRef="foo:operation" />';

        // when
        write(operation, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Interface#implementationRef', function(done) {

        // given
        var iface = moddle.create('bpmn:Interface', {
          id: 'interface',
          implementationRef: 'foo:interface'
        });

        var expectedXML =
          '<bpmn:interface xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                  'id="interface" ' +
                  'implementationRef="foo:interface" />';

        // when
        write(iface, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Collaboration', function(done) {

        // given

        var participant = moddle.create('bpmn:Participant', {
          id: 'Participant_1'
        });

        var textAnnotation = moddle.create('bpmn:TextAnnotation', {
          id: 'TextAnnotation_1'
        });

        var collaboration = moddle.create('bpmn:Collaboration', {
          id: 'Collaboration_1',
          participants: [ participant ],
          artifacts: [ textAnnotation ]
        });

        var expectedXML =
          '<bpmn:collaboration xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Collaboration_1">' +
            '<bpmn:participant id="Participant_1" />' +
            '<bpmn:textAnnotation id="TextAnnotation_1" />' +
          '</bpmn:collaboration>';


        // when
        write(collaboration, function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done();
        });
      });


      it('ExtensionElements', function(done) {

        // given
        var extensionElements = moddle.create('bpmn:ExtensionElements');

        var foo = moddle.createAny('vendor:foo', 'http://vendor', {
          key: 'FOO',
          value: 'BAR'
        });

        extensionElements.get('values').push(foo);

        var definitions = moddle.create('bpmn:Definitions', {
          extensionElements: extensionElements
        });

        var expectedXML =
          '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                            'xmlns:vendor="http://vendor">' +
            '<bpmn:extensionElements>' +
              '<vendor:foo key="FOO" value="BAR" />' +
            '</bpmn:extensionElements>' +
          '</bpmn:definitions>';


        // when
        write(definitions, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('Operation#messageRef', function(done) {
        // given
        var inMessage = moddle.create('bpmn:Message', {
          id: 'fooInMessage'
        });

        var outMessage = moddle.create('bpmn:Message', {
          id: 'fooOutMessage'
        });

        var operation = moddle.create('bpmn:Operation', {
          id: 'operation',
          inMessageRef: inMessage,
          outMessageRef: outMessage
        });

        var expectedXML =
          '<bpmn:operation xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="operation">' +
            '<bpmn:inMessageRef>fooInMessage</bpmn:inMessageRef>' +
            '<bpmn:outMessageRef>fooOutMessage</bpmn:outMessageRef>' +
          '</bpmn:operation>';

        // when
        write(operation, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });
    });


    describe('bpmndi', function() {

      it('BPMNDiagram', function(done) {

        // given
        var diagram = moddle.create('bpmndi:BPMNDiagram', { name: 'FOO', resolution: 96.5 });

        var expectedXML =
          '<bpmndi:BPMNDiagram xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                              'name="FOO" ' +
                              'resolution="96.5" />';

        // when
        write(diagram, function(err, result) {

          if (err) {
            return done(err);
          }

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });


      it('BPMNShape', function(done) {

        // given
        var bounds = moddle.create('dc:Bounds', { x: 100.0, y: 200.0, width: 50.0, height: 50.0 });
        var bpmnShape = moddle.create('bpmndi:BPMNShape', { bounds: bounds });

        var expectedXML =
          '<bpmndi:BPMNShape xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                            'xmlns:di="http://www.omg.org/spec/DD/20100524/DI" ' +
                            'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC">' +
            '<dc:Bounds x="100" y="200" width="50" height="50" />' +
          '</bpmndi:BPMNShape>';

        // when
        write(bpmnShape, function(err, result) {

          // then
          expect(result).to.eql(expectedXML);

          done(err);
        });
      });

    });

  });


  describe('should export extensions', function() {

    it('manually added custom namespace', function(done) {

      // given
      var definitions = moddle.create('bpmn:Definitions');

      definitions.set('xmlns:foo', 'http://foobar');

      // or alternatively directly assign it to definitions.$attrs

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                          'xmlns:foo="http://foobar" />';

      // when
      write(definitions, function(err, result) {

        if (err) {
          return done(err);
        }

        // then
        expect(result).to.eql(expectedXML);

        done(err);
      });
    });


    it('attributes on root', function(done) {

      // given
      var definitions = moddle.create('bpmn:Definitions');

      definitions.set('xmlns:foo', 'http://foobar');
      definitions.set('foo:bar', 'BAR');

      // or alternatively directly assign it to definitions.$attrs

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                          'xmlns:foo="http://foobar" foo:bar="BAR" />';

      // when
      write(definitions, function(err, result) {

        // then
        expect(result).to.eql(expectedXML);

        done(err);
      });
    });


    it('attributes on nested element', function(done) {

      // given
      var signal = moddle.create('bpmn:Signal', {
        'foo:bar': 'BAR'
      });

      var definitions = moddle.create('bpmn:Definitions');

      definitions.set('xmlns:foo', 'http://foobar');
      definitions.get('rootElements').push(signal);

      // or alternatively directly assign it to definitions.$attrs

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                          'xmlns:foo="http://foobar">' +
          '<bpmn:signal foo:bar="BAR" />' +
        '</bpmn:definitions>';

      // when
      write(definitions, function(err, result) {

        // then
        expect(result).to.eql(expectedXML);

        done(err);
      });
    });


    it('elements via bpmn:extensionElements', function(done) {

      // given

      var vendorBgColor = moddle.createAny('vendor:info', 'http://vendor', {
        key: 'bgcolor',
        value: '#ffffff'
      });

      var vendorRole = moddle.createAny('vendor:info', 'http://vendor', {
        key: 'role',
        value: '[]'
      });

      var extensionElements = moddle.create('bpmn:ExtensionElements', {
        values: [ vendorBgColor, vendorRole ]
      });

      var definitions = moddle.create('bpmn:Definitions', { extensionElements: extensionElements });

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                          'xmlns:vendor="http://vendor">' +
          '<bpmn:extensionElements>' +
            '<vendor:info key="bgcolor" value="#ffffff" />' +
            '<vendor:info key="role" value="[]" />' +
          '</bpmn:extensionElements>' +
        '</bpmn:definitions>';


      // when
      write(definitions, function(err, result) {

        if (err) {
          return done(err);
        }

        // then
        expect(result).to.eql(expectedXML);

        done();
      });
    });


    it('nested elements via bpmn:extensionElements', function(done) {

      var camundaNs = 'http://camunda.org/schema/1.0/bpmn';

      // when

      var inputParameter = moddle.createAny('camunda:inputParameter', camundaNs, {
        name: 'assigneeEntity',
        $body: 'user'
      });

      var inputOutput = moddle.createAny('camunda:inputOutput', camundaNs, {
        $children: [
          inputParameter
        ]
      });

      var extensionElements = moddle.create('bpmn:ExtensionElements', {
        values: [ inputOutput ]
      });

      var userTask = moddle.create('bpmn:UserTask', {
        extensionElements: extensionElements
      });

      var expectedXML =
          '<bpmn:userTask xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                         'xmlns:camunda="' + camundaNs + '">' +
            '<bpmn:extensionElements>' +
              '<camunda:inputOutput>' +
                '<camunda:inputParameter name="assigneeEntity">user</camunda:inputParameter>' +
              '</camunda:inputOutput>' +
            '</bpmn:extensionElements>' +
          '</bpmn:userTask>';

      // when
      write(userTask, function(err, result) {

        if (err) {
          return done(err);
        }

        // then
        expect(result).to.eql(expectedXML);

        done();
      });
    });

  });

});
