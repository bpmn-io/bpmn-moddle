import expect from '../../expect';

import {
  assign
} from 'min-dash';

import {
  createModdle
} from '../../helper';


describe('bpmn-moddle - write', function() {

  var moddle = createModdle();


  function write(element, options) {

    // skip preamble for tests
    options = assign({ preamble: false }, options);

    return moddle.toXML(element, options);
  }


  describe('should export types', function() {

    describe('bpmn', function() {

      it('Definitions (empty)', async function() {

        // given
        var definitions = moddle.create('bpmn:Definitions');

        var expectedXML =
          '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" />';

        // when
        var { xml } = await write(definitions);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('Definitions (participant + interface)', async function() {

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
        var { xml } = await write(definitions);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('ScriptTask#script', async function() {

        // given
        var scriptTask = moddle.create('bpmn:ScriptTask', {
          id: 'ScriptTask_1',
          scriptFormat: 'JavaScript',
          script: 'context.set("FOO", "&nbsp;");'
        });

        var expectedXML =
          '<bpmn:scriptTask xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                           'id="ScriptTask_1" scriptFormat="JavaScript">' +
            '<bpmn:script>context.set("FOO", "&amp;nbsp;");</bpmn:script>' +
          '</bpmn:scriptTask>';

        // when
        var { xml } = await write(scriptTask);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('Task with null property', async function() {

        // given
        var task = moddle.create('bpmn:Task', {
          id: 'Task_1',
          default: null
        });

        // when
        var expectedXML =
          '<bpmn:task xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                           'id="Task_1" />';

        var { xml } = await write(task);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('SequenceFlow#conditionExpression', async function() {

        // given
        var sequenceFlow = moddle.create('bpmn:SequenceFlow', {
          id: 'SequenceFlow_1'
        });

        sequenceFlow.conditionExpression = moddle.create('bpmn:FormalExpression', { body: '${ foo < bar }' });

        var expectedXML =
          '<bpmn:sequenceFlow xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                             'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                             'id="SequenceFlow_1">\n' +
          '  <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">${ foo &lt; bar }</bpmn:conditionExpression>\n' +
          '</bpmn:sequenceFlow>\n';

        // when
        var { xml } = await write(sequenceFlow, { format: true });

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('MultiInstanceLoopCharacteristics', async function() {

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
              '<bpmn:loopCardinality xsi:type="bpmn:tFormalExpression">${ foo &lt; bar }</bpmn:loopCardinality>' +
              '<bpmn:loopDataInputRef>loopDataInputRef</bpmn:loopDataInputRef>' +
              '<bpmn:loopDataOutputRef>loopDataOutputRef</bpmn:loopDataOutputRef>' +
              '<bpmn:inputDataItem id="inputDataItem" />' +
              '<bpmn:outputDataItem id="outputDataItem" />' +
              '<bpmn:complexBehaviorDefinition id="complexBehaviorDefinition" />' +
              '<bpmn:completionCondition xsi:type="bpmn:tFormalExpression">${ done }</bpmn:completionCondition>' +
          '</bpmn:multiInstanceLoopCharacteristics>';

        // when
        var { xml } = await write(loopCharacteristics);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('LinkEventDefinition', async function() {

        // given
        var definition = moddle.create('bpmn:LinkEventDefinition', { name: '' });

        var expectedXML =
          '<bpmn:linkEventDefinition xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" name="" />';

        // when
        var { xml } = await write(definition);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('StandardLoopCharacteristics', async function() {

        // given
        var loopCharacteristics = moddle.create('bpmn:StandardLoopCharacteristics', {
          testBefore: true,
          loopMaximum: 100,
          loopCondition: moddle.create('bpmn:FormalExpression', {
            body: '${ foo < bar }'
          })
        });

        var expectedXML =
          '<bpmn:standardLoopCharacteristics xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                                            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                                            'testBefore="true" ' +
                                            'loopMaximum="100">' +
              '<bpmn:loopCondition xsi:type="bpmn:tFormalExpression">${ foo &lt; bar }</bpmn:loopCondition>' +
          '</bpmn:standardLoopCharacteristics>';

        // when
        var { xml } = await write(loopCharacteristics);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('Process', async function() {

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
        var { xml } = await write(processElement);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('Activity', async function() {

        // given
        var activity = moddle.create('bpmn:Activity', {
          id: 'Activity_1',
          properties: [
            moddle.create('bpmn:Property', { name: 'FOO' }),
            moddle.create('bpmn:Property', { name: 'BAR' })
          ],
          resources: [
            moddle.create('bpmn:HumanPerformer', { name: 'Walter' })
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
        var { xml } = await write(activity);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('BaseElement#documentation', async function() {

        // given
        var defs = moddle.create('bpmn:Definitions', {
          id: 'Definitions_1'
        });

        var docs = defs.get('documentation');

        docs.push(moddle.create('bpmn:Documentation', { textFormat: 'xyz', text: 'FOO\nBAR' }));
        docs.push(moddle.create('bpmn:Documentation', { text: '<some /><html></html>' }));

        var expectedXML =
          '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="Definitions_1">' +
             '<bpmn:documentation textFormat="xyz">FOO\nBAR</bpmn:documentation>' +
             '<bpmn:documentation>&lt;some /&gt;&lt;html&gt;&lt;/html&gt;</bpmn:documentation>' +
          '</bpmn:definitions>';

        // when
        var { xml } = await write(defs);

        // then
        expect(xml).to.eql(expectedXML);

      });


      it('CallableElement#ioSpecification', async function() {

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
        var { xml } = await write(callableElement);

        // then
        expect(xml).to.eql(expectedXML);

      });


      it('ResourceRole#resourceRef', async function() {

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
        var { xml } = await write(role);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('ResourceAssignmentExpression', async function() {

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
              '${ foo &lt; bar }' +
            '</bpmn:expression>' +
          '</bpmn:resourceAssignmentExpression>';

        // when
        var { xml } = await write(assignmentExpression);

        // then
        expect(xml).to.eql(expectedXML);

      });


      it('CallActivity#calledElement', async function() {

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
        var { xml } = await write(callActivity);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('ItemDefinition#structureRef', async function() {

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
        var { xml } = await write(itemDefinition);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('ItemDefinition#structureRef with ns', async function() {

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
        var { xml } = await write(itemDefinition);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('Operation#implementationRef', async function() {

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
        var { xml } = await write(operation);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('Interface#implementationRef', async function() {

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
        var { xml } = await write(iface);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('Collaboration', async function() {

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
        var { xml } = await write(collaboration);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('ExtensionElements', async function() {

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
        var { xml } = await write(definitions);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('Operation#messageRef', async function() {

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
        var { xml } = await write(operation);

        // then
        expect(xml).to.eql(expectedXML);
      });
    });


    describe('bpmndi', function() {

      it('BPMNDiagram', async function() {

        // given
        var diagram = moddle.create('bpmndi:BPMNDiagram', { name: 'FOO', resolution: 96.5 });

        var expectedXML =
          '<bpmndi:BPMNDiagram xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                              'name="FOO" ' +
                              'resolution="96.5" />';

        // when
        var { xml } = await write(diagram);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('BPMNShape', async function() {

        // given
        var bounds = moddle.create('dc:Bounds', { x: 100.0, y: 200.0, width: 50.0, height: 50.0 });
        var bpmnShape = moddle.create('bpmndi:BPMNShape', { bounds: bounds });

        var expectedXML =
          '<bpmndi:BPMNShape xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                            'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC">' +
            '<dc:Bounds x="100" y="200" width="50" height="50" />' +
          '</bpmndi:BPMNShape>';

        // when
        var { xml } = await write(bpmnShape);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('BPMNShape (colored)', async function() {

        // given
        var bpmnShape = moddle.create('bpmndi:BPMNShape', {
          fill: '#ff0000',
          stroke: '#00ff00'
        });

        var expectedXML =
          '<bpmndi:BPMNShape xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                            'xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" ' +
                            'bioc:stroke="#00ff00" bioc:fill="#ff0000" />';

        // when
        var { xml } = await write(bpmnShape);

        // then
        expect(xml).to.eql(expectedXML);
      });


      it('BPMNEdge (colored)', async function() {

        // given
        var bpmnEdge = moddle.create('bpmndi:BPMNEdge', {
          fill: '#ff0000',
          stroke: '#00ff00'
        });

        var expectedXML =
          '<bpmndi:BPMNEdge xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                            'xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" ' +
                            'bioc:stroke="#00ff00" bioc:fill="#ff0000" />';

        // when
        var { xml } = await write(bpmnEdge);

        // then
        expect(xml).to.eql(expectedXML);
      });

    });

  });


  describe('should export extensions', function() {

    it('manually added custom namespace', async function() {

      // given
      var definitions = moddle.create('bpmn:Definitions');

      definitions.set('xmlns:foo', 'http://foobar');

      // or alternatively directly assign it to definitions.$attrs

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                          'xmlns:foo="http://foobar" />';

      // when
      var { xml } = await write(definitions);

      // then
      expect(xml).to.eql(expectedXML);
    });


    it('attributes on root', async function() {

      // given
      var definitions = moddle.create('bpmn:Definitions');

      definitions.set('xmlns:foo', 'http://foobar');
      definitions.set('foo:bar', 'BAR');

      // or alternatively directly assign it to definitions.$attrs

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                          'xmlns:foo="http://foobar" foo:bar="BAR" />';

      // when
      var { xml } = await write(definitions);

      // then
      expect(xml).to.eql(expectedXML);
    });


    it('attributes on nested element', async function() {

      // given
      var signal = moddle.create('bpmn:Signal', {
        'foo:bar': 'BAR'
      });

      var definitions = moddle.create('bpmn:Definitions', {
        rootElements: [ signal ],
        'xmlns:foo': 'http://foobar'
      });

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                          'xmlns:foo="http://foobar">' +
          '<bpmn:signal foo:bar="BAR" />' +
        '</bpmn:definitions>';

      // when
      var { xml } = await write(definitions);

      // then
      expect(xml).to.eql(expectedXML);
    });


    it('attributes and namespace on nested element', async function() {

      // given
      var signal = moddle.create('bpmn:Signal', {
        'xmlns:foo': 'http://foobar',
        'foo:bar': 'BAR'
      });

      var definitions = moddle.create('bpmn:Definitions', {
        rootElements: [ signal ]
      });

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">' +
          '<bpmn:signal xmlns:foo="http://foobar" foo:bar="BAR" />' +
        '</bpmn:definitions>';

      // when
      var { xml } = await write(definitions);

      // then
      expect(xml).to.eql(expectedXML);
    });


    it('attributes and namespace on root + nested element', async function() {

      // given
      var signal = moddle.create('bpmn:Signal', {
        'xmlns:foo': 'http://foobar',
        'foo:bar': 'BAR'
      });

      var definitions = moddle.create('bpmn:Definitions', {
        'xmlns:foo': 'http://foobar',
        rootElements: [ signal ]
      });

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                          'xmlns:foo="http://foobar">' +
          '<bpmn:signal foo:bar="BAR" />' +
        '</bpmn:definitions>';

      // when
      var { xml } = await write(definitions);

      // then
      expect(xml).to.eql(expectedXML);
    });


    it('elements via bpmn:extensionElements', async function() {

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
      var { xml } = await write(definitions);

      // then
      expect(xml).to.eql(expectedXML);
    });


    it('nested elements via bpmn:extensionElements', async function() {

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
      var { xml } = await write(userTask);

      // then
      expect(xml).to.eql(expectedXML);
    });

  });

});
