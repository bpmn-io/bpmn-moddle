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

        builder.alter('BaseElement#id', {
          isId: true
        });

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
          builder.reorderProperties(desc, [
            'rootElements',
            'diagrams',
            'relationships'
          ]);
        });

        // fix ioSpec children order

        builder.alter('InputOutputSpecification', function(desc) {
          builder.reorderProperties(desc, [
            'dataInputs',
            'dataOutputs',
            'inputSets',
            'outputSets'
          ]);
        });

        builder.alter('Relationship#sources', function(desc) {
          desc.name = 'source';
        });

        builder.alter('Relationship#targets', function(desc) {
          desc.name = 'target';
        });


        // fix event dataInput/dataOutput associations

        builder.alter('CatchEvent#dataOutputAssociation', function(desc) {
          desc.name = 'dataOutputAssociations';
        });

        builder.alter('ThrowEvent#dataInputAssociation', function(desc) {
          desc.name = 'dataInputAssociations';
        });

        // fix catchEvent children order

        builder.alter('CatchEvent', function(desc) {
          builder.reorderProperties(desc, [
            'dataOutputs',
            'dataOutputAssociations',
            'outputSet',
            'eventDefinitions',
            'eventDefinitionRefs',
          ]);
        });

        // fix throwEvent children order

        builder.alter('ThrowEvent', function(desc) {
          builder.reorderProperties(desc, [
            'dataInputs',
            'dataInputAssociations',
            'inputSet',
            'eventDefinitions',
            'eventDefinitionRefs',
          ]);
        });

        // fix Collaboration child element order
        builder.alter('Collaboration', function(desc) {

          builder.reorderProperties(desc, [
            'participants',
            'messageFlows',
            'artifacts',
            'conversations',
            'conversationAssociations',
            'participantAssociations',
            'messageFlowAssociations',
            'correlationKeys',
            'choreographyRef',
            'conversationLinks'
          ]);
        });

        // fix PotentialOwner#resourceRef

        builder.alter('ResourceRole#resourceRef', function(desc) {
          delete desc.isAttr;
        });

        // fix missing ResourceAssignmentExpression parent

        builder.alter('ResourceAssignmentExpression', function(desc) {
          desc.superClass = [ 'BaseElement' ];
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
          builder.reorderProperties(desc, [
            'sourceRef',
            'targetRef',
            'transformation'
          ]);
        });

        builder.alter('DataAssociation#transformation', function(desc) {
          desc.xml = {
            'serialize': 'property'
          };
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


        // fix *Refs -> Ref

        builder.alter('CallableElement#supportedInterfaceRefs', {
          name: 'supportedInterfaceRef'
        });

        builder.alter('Participant#interfaceRefs', {
          name: 'interfaceRef'
        });

        builder.alter('Operation#errorRefs', {
          name: 'errorRef'
        });

        builder.alter('ThrowEvent#eventDefinitionRefs', {
          name: 'eventDefinitionRef'
        });

        builder.alter('CatchEvent#eventDefinitionRefs', {
          name: 'eventDefinitionRef'
        });

        builder.alter('DataInput#inputSetRefs', {
          name: 'inputSetRef'
        });

        builder.alter('DataOutput#outputSetRefs', {
          name: 'outputSetRef'
        });


        builder.alter('Process', function(desc) {

          desc.properties.push({
            "name": "laneSets",
            "type": "LaneSet",
            "isMany": true,
            "replaces": "FlowElementsContainer#laneSets"
          });

          desc.properties.push({
            "name": "flowElements",
            "type": "FlowElement",
            "isMany": true,
            "replaces": "FlowElementsContainer#flowElements"
          });

          builder.reorderProperties(desc, [
            'auditing',
            'monitoring',
            'properties',
            'laneSets',
            'flowElements',
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

        // fix MultiMultiInstanceLoopCharacteristics

        builder.alter('MultiInstanceLoopCharacteristics#loopDataInputRef', function(desc) {
          delete desc.isAttr;
        });

        builder.alter('MultiInstanceLoopCharacteristics#loopDataOutputRef', function(desc) {
          delete desc.isAttr;
        });

        builder.alter('MultiInstanceLoopCharacteristics#inputDataItem', function(desc) {
          desc.xml = { serialize: 'property' };
        });

        builder.alter('MultiInstanceLoopCharacteristics#outputDataItem', function(desc) {
          desc.xml = { serialize: 'property' };
        });

        builder.alter('MultiInstanceLoopCharacteristics', function(desc) {
          builder.reorderProperties(desc, [
            'outputDataItem',
            'complexBehaviorDefinition',
            'completionCondition'
          ]);
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

        builder.alter('Lane#childLaneSet', {
          xml: { serialize: 'xsi:type' }
        });

        builder.alter('Lane', function(desc) {
          builder.reorderProperties(desc, [
            'partitionElement',
            'flowNodeRef',
            'childLaneSet'
          ]);
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
          name: 'Extension',
          properties: [
            {
              name: 'values',
              type: 'Element',
              isMany: true
            }
          ]
        });

        builder.alter('DiagramElement', function(data) {

          data.properties.unshift({
            name: 'extension',
            type: 'Extension'
          });

          data.properties.unshift({
            name: 'id',
            type: 'String',
            isAttr: true,
            isId: true
          });
        });

        builder.alter('Diagram', function(data) {
          data.properties.unshift({
            name: 'id',
            type: 'String',
            isAttr: true,
            isId: true
          });
        });


        builder.alter('Style', function(data) {
          (data.properties = data.properties || []).unshift({
            name: 'id',
            type: 'String',
            isAttr: true,
            isId: true
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
