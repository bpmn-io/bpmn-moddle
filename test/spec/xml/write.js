var _ = require('lodash');

var Helper = require('../../helper');



describe('bpmn-moddle - write', function() {

  var createModel = Helper.createModelBuilder('resources/bpmn/json/');

  var moddle = Helper.createModdle();


  function write(element, options, callback) {
    if (_.isFunction(options)) {
      callback = options;
      options = {};
    }

    // skip preamble for tests
    options = _.extend({ preamble: false }, options);

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
             '<bpmn:documentation textFormat="xyz">FOO\nBAR</bpmn:documentation>' +
             '<bpmn:documentation><![CDATA[<some /><html></html>]]></bpmn:documentation>' +
          '</bpmn:definitions>';

        // when
        write(defs, function(err, result) {

          console.log(err);

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

    });


    describe('bpmndi', function() {

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

});