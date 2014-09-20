'use strict';

var Builder = require('./builder');


function makeStringRef(desc) {
  desc.type = 'String';
  delete desc.isReference;
}

describe('moddle BPMN 2.0 json', function() {

  describe('generate simple model', function() {

    it('transform BPMN20.cmof', function(done) {

      var builder = new Builder();

      builder.parse('resources/bpmn/cmof/BPMN20.cmof', function(pkg, cmof) {

        builder.cleanIDs();

        // remove associations
        pkg.associations = [];

        pkg.xml = {
          alias: 'lowerCase'
        };

        // perform a translation from
        //
        // BaseElement
        //   - extensionValues = [ ExtensionAttributeValue#value = ... ]
        //
        // to
        //
        // BaseElement
        //   - extensionElements: ExtensionElements#values = [ ... ]
        //
        builder.alter('ExtensionAttributeValue#value', {
          name: 'values',
          isMany: true
        });

        builder.alter('BaseElement#extensionValues', function(p) {
          p.name = 'extensionElements';

          delete p.isMany;
        });

        builder.rename('extensionAttributeValue', 'extensionElements');

        builder.rename('extensionValues', 'extensionElements');

        builder.rename('ExtensionAttributeValue', 'ExtensionElements');


        // fix positioning of elements

        builder.alter('FlowElementsContainer', function(desc) {
          builder.swapProperties(desc, 'laneSets', 'flowElements');
        });

        builder.alter('FlowNode', function(desc) {
          builder.swapProperties(desc, 'targetRef', 'sourceRef');
          builder.swapProperties(desc, 'incoming', 'outgoing');
        });

        builder.alter('DataAssociation', function(desc) {
          builder.swapProperties(desc, 'targetRef', 'sourceRef');
        });

        builder.alter('Documentation#text', function(prop) {
          prop.isBody = true;
          delete prop.isAttr;
        });

        builder.alter('ScriptTask#script', function(desc) {
          delete desc.isAttr;
        });

        builder.alter('ConditionalEventDefinition#condition', {
          serialize: 'xsi:type'
        });

        builder.alter('TextAnnotation#text', function(desc) {
          delete desc.isAttr;
        });


        // make some references strings rather than references
        // (this way we are able to import it properly)

        builder.alter('Operation#implementationRef', function(desc) {
          desc.isAttr = true;
          makeStringRef(desc);
        });

        builder.alter('Interface#implementationRef', function(desc) {
          desc.isAttr = true;
          makeStringRef(desc);
        });

        builder.alter('ItemDefinition#structureRef', function(desc) {
          desc.isAttr = true;
          makeStringRef(desc);
        });

        builder.alter('CallActivity#calledElementRef', function(desc) {
          desc.name = 'calledElement';
          makeStringRef(desc);
        });

        builder.alter('Gateway#gatewayDirection', function(desc) {
          desc.default = 'Unspecified';
        });

        builder.alter('EventBasedGateway#eventGatewayType', function(desc) {
          desc.default = 'Exclusive';
        });

        builder.alter('CatchEvent#parallelMultiple', function(desc) {
          desc.default = false;
        });

        builder.alter('ParticipantMultiplicity#minimum', function(desc) {
          desc.default = 0;
        });

        builder.alter('ParticipantMultiplicity#maximum', function(desc) {
          desc.default = 1;
        });

        builder.alter('Activity#startQuantity', function(desc) {
          desc.default = 1;
        });

        builder.alter('Activity#completionQuantity', function(desc) {
          desc.default = 1;
        });

        builder.alter('DataAssociation#targetRef', function(desc) {
          delete desc.isAttr;
        });

        builder.alter('Lane#flowNodeRefs', {
          name: 'flowNodeRef'
        });

        builder.alter('Escalation', {
          superClass: [ 'RootElement' ]
        });

        builder.exportTo('resources/bpmn/json/bpmn.json');
      }, done);

    });


    it('transform BPMNDI.cmof', function(done) {

      var builder = new Builder();

      builder.parse('resources/bpmn/cmof/BPMNDI.cmof', function(pkg) {

        builder.cleanIDs();

        // remove associations
        pkg.associations = [];

        builder.alter('BPMNEdge#messageVisibleKind', function(desc) {
          desc.default = 'initiating';
        });

        builder.exportTo('resources/bpmn/json/bpmndi.json');
      }, done);

    });


    it('transform DI.cmof', function(done) {

      var builder = new Builder();

      builder.parse('resources/bpmn/cmof/DI.cmof', function(pkg, cmof) {

        builder.cleanIDs();

        // remove associations
        pkg.associations = [];

        builder.alter('Edge#waypoint', {
          serialize: 'xsi:type'
        });

        builder.exportTo('resources/bpmn/json/di.json');
      }, done);

    });


    it('transform DC.cmof', function(done) {

      var builder = new Builder();

      builder.parse('resources/bpmn/cmof/DC.cmof', function(pkg, cmof) {

        builder.cleanIDs();

        // remove associations
        pkg.associations = [];

        builder.exportTo('resources/bpmn/json/dc.json');
      }, done);

    });

  });

});