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
        builder.cleanAssociations();

        // remove associations
        pkg.associations = [];

        pkg.xml = {
          tagAlias: 'lowerCase',
          typePrefix: 't'
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

        // fix documentation being first element

        builder.alter('BaseElement', function(desc) {
          builder.reorderProperties(desc, [ 'id', 'documentation' ]);
        });

        // fix definitions children order

        builder.alter('Definitions', function(desc) {
          builder.reorderProperties(desc, [ 'rootElements', 'diagrams', 'relationships' ]);
        });

        // fix ioSpec children order

        builder.alter('InputOutputSpecification', function(desc) {
          builder.reorderProperties(desc, [ 'dataInputs', 'dataOutputs', 'inputSets', 'outputSets' ]);
        });

        builder.alter('Relationship#sources', function(desc) {
          desc.name = 'source';
        });

        builder.alter('Relationship#targets', function(desc) {
          desc.name = 'target';
        });


        // fix PotentialOwner#resourceRef

        builder.alter('ResourceRole#resourceRef', function(desc) {
          delete desc.isAttr;
        });


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


        // fix Activity order serialization

        builder.alter('Activity', function(desc) {
          builder.reorderProperties(desc, [
            'ioSpecification',
            'properties',
            'dataInputAssociations',
            'dataOutputAssociations',
            'resources',
            'loopCharacteristics'
          ]);
        });

        builder.alter('Process', function(desc) {
          builder.reorderProperties(desc, [
            'auditing',
            'monitoring',
            'properties',
            'artifacts',
            'resources',
            'correlationSubscriptions',
            'supports'
          ]);
        });


        builder.alter('SubProcess', function(desc) {
          desc.superClass.push('InteractionNode');
        });

        builder.alter('Documentation#text', function(prop) {
          prop.isBody = true;
          delete prop.isAttr;
        });

        builder.alter('ScriptTask#script', function(desc) {
          delete desc.isAttr;
        });

        builder.alter('TextAnnotation#text', function(desc) {
          delete desc.isAttr;
        });

        builder.alter('Expression', {
          isAbstract: true
        });

        // serialize Expression as xsi:type
        pkg.types.forEach(function(t) {
          (t.properties || []).forEach(function(p) {
            if (p.type === 'Expression') {
              p.xml = { serialize: 'xsi:type' };
            }
          });
        });

        builder.alter('Lane#childLaneSet', {
          xml: { serialize: 'xsi:type' }
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

        builder.alter('FormalExpression#body', {
          'type': 'String',
          'isBody': true
        });

        builder.alter('CallableElement#ioSpecification', function(desc) {
          desc.xml = { serialize: 'property' };
        });

        builder.alter('CallableElement#ioBinding', function(desc) {
          desc.xml = { serialize: 'property' };
        });

        builder.alter('Activity#ioSpecification', function(desc) {
          desc.xml = { serialize: 'property' };
        });

        // fix Operation attributes issue
        builder.alter('Operation#inMessageRef', function(desc) {
          delete desc.isAttr;
        });

        builder.alter('Operation#outMessageRef', function(desc) {
          delete desc.isAttr;
        });

        builder.exportTo('resources/bpmn/json/bpmn.json');
      }, done);

    });


    it('transform BPMNDI.cmof', function(done) {

      var builder = new Builder();

      builder.parse('resources/bpmn/cmof/BPMNDI.cmof', function(pkg) {

        builder.cleanIDs();
        builder.cleanAssociations();

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
        builder.cleanAssociations();

        pkg.xml = {
          tagAlias: 'lowerCase'
        };

        // remove associations
        pkg.associations = [];

        pkg.types.push({
          "name": "Extension",
          "properties": [
            {
              "name": "values",
              "type": "Element",
              "isMany": true
            }
          ]
        });

        builder.alter('DiagramElement', function(data) {

          data.properties.unshift({
            "name": "extension",
            "type": "Extension"
          });
        });

        builder.alter('Edge#waypoint', {
          xml: { serialize: 'xsi:type' }
        });

        builder.exportTo('resources/bpmn/json/di.json');
      }, done);

    });


    it('transform DC.cmof', function(done) {

      var builder = new Builder();

      builder.parse('resources/bpmn/cmof/DC.cmof', function(pkg, cmof) {

        builder.cleanIDs();
        builder.cleanAssociations();

        // remove associations
        pkg.associations = [];

        builder.exportTo('resources/bpmn/json/dc.json');
      }, done);

    });

  });

});
