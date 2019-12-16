const SchemaBuilder = require('./schema-builder');

const path = require('path');

const fs = require('fs');


const schemaTransforms = [
  { cmof: 'BPMN20.cmof', json: 'bpmn.json', transform: transformBPMN2 },
  { cmof: 'BPMNDI.cmof', json: 'bpmndi.json', transform: transformBPMNDI },
  { cmof: 'DI.cmof', json: 'di.json', transform: transformDI },
  { cmof: 'DC.cmof', json: 'dc.json', transform: transformDC }
];


module.exports = async function cmofToModdle(cmofDir, outputDir) {

  for (const { cmof, json, transform } of schemaTransforms) {
    const schema = await transform(path.join(cmofDir, cmof));

    fs.writeFileSync(path.join(outputDir, json), schema);
  }
};

function transformBPMN2(cmofPath) {
  const builder = new SchemaBuilder(cmofPath);

  builder.afterParsed(pkg => {

    // remove associations
    pkg.associations = [];

    pkg.xml = {
      tagAlias: 'lowerCase',
      typePrefix: 't'
    };

    return pkg;
  });

  // serialize Expression as xsi:type
  builder.afterParsed(pkg => {
    pkg.types.forEach(function(t) {
      (t.properties || []).forEach(function(p) {
        if (p.type === 'Expression') {
          p.xml = { serialize: 'xsi:type' };
        }
      });
    });

    return pkg;
  });

  builder.cleanIDs();
  builder.cleanAssociations();

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


  // fix cryptic bpmn:Extension reference
  builder.alter('Extension#definition', {
    isAttr: true,
    isReference: true
  });


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

  // fix missing ResourceParameterBinding parent

  builder.alter('ResourceParameterBinding', function(desc) {
    desc.superClass = [ 'BaseElement' ];
  });

  // fix missing ResourceAssignmentExpression parent

  builder.alter('ResourceAssignmentExpression', function(desc) {
    desc.superClass = [ 'BaseElement' ];
  });

  // fix missing ParticipantMultiplicity parent
  builder.alter('ParticipantMultiplicity', function(desc) {
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


  // fix Choreography child element order by swapping the super classes
  // (Collaboration children should come before FlowElementsContainer children)
  builder.alter('Choreography', function(desc) {
    desc.superClass = [ 'Collaboration', 'FlowElementsContainer' ];
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

  builder.alter('ChoreographyActivity#participantRefs', {
    name: 'participantRef'
  });

  builder.alter('ConversationNode#participantRefs', {
    name: 'participantRef'
  });


  builder.alter('Process', function(desc) {

    desc.properties.push({
      'name': 'laneSets',
      'type': 'LaneSet',
      'isMany': true,
      'replaces': 'FlowElementsContainer#laneSets'
    });

    desc.properties.push({
      'name': 'flowElements',
      'type': 'FlowElement',
      'isMany': true,
      'replaces': 'FlowElementsContainer#flowElements'
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

  // fix StandardLoopCharacteristics#loopMaximum

  builder.alter('StandardLoopCharacteristics#loopMaximum', function(desc) {
    desc.isAttr = true;
    desc.type = 'Integer';

    delete desc.xml;
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

  builder.alter('CompensateEventDefinition#waitForCompletion', function(desc) {
    desc.default = true;
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

  builder.alter('Expression', function(desc) {
    desc.isAbstract = false;
    desc.properties = [
      {
        name: 'body',
        type: 'String',
        isBody: true
      }
    ];
  });

  builder.alter('FormalExpression', function(desc) {
    desc.properties = desc.properties.filter(function(p) {
      return p.name !== 'body';
    });
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

  return builder.build();
}

function transformBPMNDI(cmofPath) {
  const builder = new SchemaBuilder(cmofPath);

  // remove associations
  builder.afterParsed(pkg => {
    pkg.associations = [];
  });

  builder.cleanIDs();
  builder.cleanAssociations();
  builder.alter('BPMNEdge#messageVisibleKind', function(desc) {
    desc.default = 'initiating';
  });

  return builder.build();
}


function transformDI(cmofPath) {

  const builder = new SchemaBuilder(cmofPath);


  builder.cleanIDs();
  builder.cleanAssociations();


  builder.afterParsed(pkg => {

    // remove associations
    pkg.associations = [];

    pkg.xml = {
      tagAlias: 'lowerCase'
    };

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

    return pkg;
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

  return builder.build();
}


function transformDC(cmofPath) {

  const builder = new SchemaBuilder(cmofPath);

  builder.cleanIDs();
  builder.cleanAssociations();

  builder.afterParsed(pkg => {

    // remove associations
    pkg.associations = [];

    return pkg;
  });

  return builder.build();
}



// helper //////
function makeStringRef(desc) {
  desc.type = 'String';
  delete desc.isReference;
}
