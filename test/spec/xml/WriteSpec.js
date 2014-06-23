var _ = require('lodash');

var Helper = require('../Helper'),
    Matchers = require('../Matchers');

var BpmnModel = Helper.bpmnModel();


describe('Model', function() {

  var createModel = Helper.createModelBuilder('resources/bpmn/json/');

  var bpmnModel = BpmnModel.instance();


  function write(element, options, callback) {
    if (_.isFunction(options)) {
      callback = options;
      options = {};
    }

    // skip preamble for tests
    options = _.extend({ preamble: false }, options);

    BpmnModel.toXML(element, options, callback);
  }

  beforeEach(Matchers.add);


  describe('toXML', function() {

    it('export empty Definitions', function(done) {

      // given
      var definitions = bpmnModel.create('bpmn:Definitions');

      var expectedXML =
        '<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" />';

      // when
      write(definitions, function(err, result) {

        // then
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });


    it('export BPMNShape', function(done) {

      // given
      var bounds = bpmnModel.create('dc:Bounds', { x: 100.0, y: 200.0, width: 50.0, height: 50.0 });
      var bpmnShape = bpmnModel.create('bpmndi:BPMNShape', { bounds: bounds });

      var expectedXML =
        '<bpmndi:BPMNShape xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" ' +
                          'xmlns:di="http://www.omg.org/spec/DD/20100524/DI" ' +
                          'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC">' +
          '<dc:Bounds x="100" y="200" width="50" height="50" />' +
        '</bpmndi:BPMNShape>';

      // when
      write(bpmnShape, function(err, result) {

        // then
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });


    it('export ScriptTask / script', function(done) {

      // given
      var scriptTask = bpmnModel.create('bpmn:ScriptTask', {
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
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });


    it('should export CallActivity#calledElement', function(done) {

      // given
      var callActivity = bpmnModel.create('bpmn:CallActivity', {
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
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });


    it('should export ItemDefinition#structureRef', function(done) {

      // given
      var itemDefinition = bpmnModel.create('bpmn:ItemDefinition', {
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
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });


    it('should export Operation#implementationRef', function(done) {

      // given
      var operation = bpmnModel.create('bpmn:Operation', {
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
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });


    it('should export Interface#implementationRef', function(done) {

      // given
      var iface = bpmnModel.create('bpmn:Interface', {
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
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });



    it('export extensionElements', function(done) {

      // given
      var extensionElements = bpmnModel.create('bpmn:ExtensionElements');

      var foo = bpmnModel.createAny('vendor:foo', 'http://vendor', {
        key: 'FOO',
        value: 'BAR'
      });

      extensionElements.get('values').push(foo);

      var definitions = bpmnModel.create('bpmn:Definitions', {
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
        expect(result).toEqual(expectedXML);

        done(err);
      });
    });
  });
});