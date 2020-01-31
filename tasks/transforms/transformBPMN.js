const {
  findProperty,
  findType,
  orderProperties,
  replaceKey,
  replaceValue,
  swapProperties
} = require('./helper');

module.exports = async function(results) {
  const { elementsByType } = results;

  let model = elementsByType[ 'cmof:Package' ][ 0 ];

  model.xml = {
    tagAlias: 'lowerCase',
    typePrefix: 't'
  };

  // remove associations
  model.associations = [];

  findProperty('BaseElement#id', model).isId = true;

  // fix extension elements
  Object.assign(findProperty('ExtensionAttributeValue#value', model), {
    name: 'values',
    isMany: true
  });

  const extensionValues = findProperty('BaseElement#extensionValues', model);

  extensionValues.name = 'extensionElements';

  delete extensionValues.isMany;

  // replace all occurrences of `extensionAttributeValue` with `extensionElements`
  replaceKey('extensionAttributeValue', 'extensionElements', model);

  // replace all occurrences of `extensionValues` with `extensionElements`
  replaceKey('extensionValues', 'extensionElements', model);

  // replace all occurrences of `ExtensionAttributeValue` with `ExtensionElements`
  replaceValue('ExtensionAttributeValue', 'ExtensionElements', model);

  // fix bpmn:Extension definition
  Object.assign(findProperty('Extension#definition', model), {
    isAttr: true,
    isReference: true
  });

  model = orderProperties('BaseElement', [ 'id', 'documentation' ], model);

  model = orderProperties('Definitions', [
    'name',
    'targetNamespace',
    'expressionLanguage',
    'typeLanguage',
    'imports',
    'extensions',
    'rootElements',
    'diagrams',
    'exporter',
    'relationships',
    'exporterVersion'
  ], model);

  model = orderProperties('InputOutputSpecification', [
    'dataInputs',
    'dataOutputs',
    'inputSets',
    'outputSets'
  ], model);

  findProperty('Relationship#sources', model).name = 'source';

  findProperty('Relationship#targets', model).name = 'target';

  findProperty('CatchEvent#dataOutputAssociation', model).name = 'dataOutputAssociations';

  findProperty('ThrowEvent#dataInputAssociation', model).name = 'dataInputAssociations';

  model = orderProperties('CatchEvent', [
    'parallelMultiple',
    'dataOutputs',
    'dataOutputAssociations',
    'outputSet',
    'eventDefinitions',
    'eventDefinitionRefs'
  ], model);

  model = orderProperties('ThrowEvent', [
    'dataInputs',
    'dataInputAssociations',
    'inputSet',
    'eventDefinitions',
    'eventDefinitionRefs'
  ], model);

  model = orderProperties('Collaboration', [
    'name',
    'isClosed',
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
  ], model);

  delete findProperty('ResourceRole#resourceRef', model).isAttr;

  [
    'ResourceParameterBinding',
    'ResourceAssignmentExpression',
    'ParticipantMultiplicity'
  ].forEach(name => {
    findType(name, model).superClass = [ 'BaseElement' ];
  });

  model = swapProperties(
    'FlowElementsContainer#laneSets',
    'FlowElementsContainer#flowElements',
    model
  );

  model = swapProperties(
    'FlowNode#sourceRef',
    'FlowNode#targetRef',
    model
  );

  model = swapProperties(
    'FlowNode#incoming',
    'FlowNode#outgoing',
    model
  );

  model = orderProperties('DataAssociation', [
    'sourceRef',
    'targetRef',
    'transformation'
  ], model);

  findProperty('DataAssociation#transformation', model).xml = {
    serialize: 'property'
  };

  findType('Choreography', model).superClass = [ 'Collaboration', 'FlowElementsContainer' ];

  model = orderProperties('Activity', [
    'isForCompensation',
    'default',
    'ioSpecification',
    'boundaryEventRefs',
    'properties',
    'dataInputAssociations',
    'dataOutputAssociations',
    'startQuantity',
    'resources',
    'completionQuantity',
    'loopCharacteristics'
  ], model);

  model = orderProperties('DataAssociation', [
    'sourceRef',
    'targetRef',
    'transformation',
    'assignment'
  ], model);

  findProperty('CallableElement#supportedInterfaceRefs', model).name = 'supportedInterfaceRef';

  findProperty('Participant#interfaceRefs', model).name = 'interfaceRef';

  findProperty('Operation#errorRefs', model).name = 'errorRef';

  findProperty('ThrowEvent#eventDefinitionRefs', model).name = 'eventDefinitionRef';

  findProperty('CatchEvent#eventDefinitionRefs', model).name = 'eventDefinitionRef';

  findProperty('DataInput#inputSetRefs', model).name = 'inputSetRef';

  findProperty('DataOutput#outputSetRefs', model).name = 'outputSetRef';

  findProperty('ChoreographyActivity#participantRefs', model).name = 'participantRef';

  findProperty('ConversationNode#participantRefs', model).name = 'participantRef';

  const process = findType('Process', model);

  process.properties.push({
    name: 'laneSets',
    isMany: true,
    replaces: 'FlowElementsContainer#laneSets',
    type: 'LaneSet'
  }, {
    name: 'flowElements',
    isMany: true,
    replaces: 'FlowElementsContainer#flowElements',
    type: 'FlowElement'
  });

  model = orderProperties('Process', [
    'processType',
    'isClosed',
    'auditing',
    'monitoring',
    'properties',
    'laneSets',
    'flowElements',
    'artifacts',
    'resources',
    'correlationSubscriptions',
    'supports'
  ], model);

  findType('SubProcess', model).superClass.push('InteractionNode');

  const text = findProperty('Documentation#text', model);

  text.isBody = true;

  delete text.isAttr;

  delete findProperty('ScriptTask#script', model).isAttr;

  delete findProperty('TextAnnotation#text', model).isAttr;

  findType('Expression', model).isAbstract = true;

  // serialize `Expression` as `xsi:type`
  model.types.forEach(type => {
    if (type.properties) {
      type.properties.forEach(property => {
        if (property.type === 'Expression') {
          property.xml = {
            serialize: 'xsi:type'
          };
        }
      });
    }
  });

  const loopMaximum = findProperty('StandardLoopCharacteristics#loopMaximum', model);

  loopMaximum.isAttr = true;

  loopMaximum.type = 'Integer';

  delete loopMaximum.xml;

  delete findProperty('MultiInstanceLoopCharacteristics#loopDataInputRef', model).isAttr;

  delete findProperty('MultiInstanceLoopCharacteristics#loopDataOutputRef', model).isAttr;

  [
    'MultiInstanceLoopCharacteristics#inputDataItem',
    'MultiInstanceLoopCharacteristics#outputDataItem'
  ].forEach(name => {
    findProperty(name, model).xml = {
      serialize: 'property'
    };
  });

  model = orderProperties('MultiInstanceLoopCharacteristics', [
    'isSequential',
    'behavior',
    'loopCardinality',
    'loopDataInputRef',
    'loopDataOutputRef',
    'inputDataItem',
    'outputDataItem',
    'complexBehaviorDefinition',
    'completionCondition'
  ], model);

  [
    'Operation#implementationRef',
    'Interface#implementationRef',
    'ItemDefinition#structureRef'
  ].forEach(name => {
    const property = findProperty(name, model);

    property.type = 'String';

    property.isAttr = true;

    delete property.isReference;
  });

  const calledElementRef = findProperty('CallActivity#calledElementRef', model);

  calledElementRef.name = 'calledElement';

  calledElementRef.type = 'String';

  delete calledElementRef.isReference;

  findProperty('Gateway#gatewayDirection', model).default = 'Unspecified';

  findProperty('CompensateEventDefinition#waitForCompletion', model).default = true;

  findProperty('EventBasedGateway#eventGatewayType', model).default = 'Exclusive';

  findProperty('CatchEvent#parallelMultiple', model).default = false;

  findProperty('ParticipantMultiplicity#minimum', model).default = 0;

  [
    'ParticipantMultiplicity#maximum',
    'Activity#startQuantity',
    'Activity#completionQuantity'
  ].forEach(name => {
    findProperty(name, model).default = 1;
  });

  delete findProperty('DataAssociation#targetRef', model).isAttr;

  findProperty('Lane#flowNodeRefs', model).name = 'flowNodeRef';

  findProperty('Lane#childLaneSet', model).xml = {
    serialize: 'xsi:type'
  };

  model = orderProperties('Lane', [
    'name',
    'partitionElementRef',
    'partitionElement',
    'flowNodeRef',
    'childLaneSet'
  ], model);

  findType('Escalation', model).superClass = [ 'RootElement' ];

  const expression = findType('Expression', model);

  expression.isAbstract = false;

  expression.properties = [{
    name: 'body',
    isBody: true,
    type: 'String'
  }];

  const formalExpression = findType('FormalExpression', model);

  formalExpression.properties = formalExpression.properties.filter(({ name }) => {
    return name !== 'body';
  });

  [
    'CallableElement#ioSpecification',
    'CallableElement#ioBinding',
    'Activity#ioSpecification'
  ].forEach(name => {
    findProperty(name, model).xml = {
      serialize: 'property'
    };
  });

  delete findProperty('Operation#inMessageRef', model).isAttr;

  delete findProperty('Operation#outMessageRef', model).isAttr;

  return model;
};
