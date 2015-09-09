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


      it.skip('Process', function(done) {

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


      it.skip('ItemDefinition#structureRef', function(done) {

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

      it.skip('BPMNDiagram', function(done) {

        // given
        var diagram = moddle.create('bpmndi:BPMNDiagram', { name: 'FOO' });

        var expectedXML =
          '<bpmndi:BPMNDiagram xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" name="FOO" />';

        // when
        write(diagram, function(err, result) {

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


    it('as attributes', function(done) {

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


    it('as elements', function(done) {

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

  });

});
