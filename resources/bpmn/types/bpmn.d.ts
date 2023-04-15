enum ProcessType {
    None,
    Public,
    Private
}
enum GatewayDirection {
    Unspecified,
    Converging,
    Diverging,
    Mixed
}
enum EventBasedGatewayType {
    Parallel,
    Exclusive
}
enum RelationshipDirection {
    None,
    Forward,
    Backward,
    Both
}
enum ItemKind {
    Physical,
    Information
}
enum ChoreographyLoopType {
    None,
    Standard,
    MultiInstanceSequential,
    MultiInstanceParallel
}
enum AssociationDirection {
    None,
    One,
    Both
}
enum MultiInstanceBehavior {
    None,
    One,
    All,
    Complex
}
enum AdHocOrdering {
    Parallel,
    Sequential
}
interface Interface {
    "name": string;
    "operations": Operation[];
    "implementationRef": string;
}
interface Operation {
    "name": string;
    "inMessageRef": Message;
    "outMessageRef": Message;
    "errorRef": Error[];
    "implementationRef": string;
}
interface EndPoint {
}
interface Auditing {
}
interface GlobalTask {
    "resources": ResourceRole[];
}
interface Monitoring {
}
interface Performer {
}
interface Process {
    "processType": ProcessType;
    "isClosed": boolean;
    "auditing": Auditing;
    "monitoring": Monitoring;
    "properties": Property[];
    "laneSets": LaneSet[];
    "flowElements": FlowElement[];
    "artifacts": Artifact[];
    "resources": ResourceRole[];
    "correlationSubscriptions": CorrelationSubscription[];
    "supports": Process[];
    "definitionalCollaborationRef": Collaboration;
    "isExecutable": boolean;
}
interface LaneSet {
    "lanes": Lane[];
    "name": string;
}
interface Lane {
    "name": string;
    "partitionElementRef": BaseElement;
    "partitionElement": BaseElement;
    "flowNodeRef": FlowNode[];
    "childLaneSet": LaneSet;
}
interface GlobalManualTask {
}
interface ManualTask {
}
interface UserTask {
    "renderings": Rendering[];
    "implementation": string;
}
interface Rendering {
}
interface HumanPerformer {
}
interface PotentialOwner {
}
interface GlobalUserTask {
    "implementation": string;
    "renderings": Rendering[];
}
interface Gateway {
    "gatewayDirection": GatewayDirection;
}
interface EventBasedGateway {
    "instantiate": boolean;
    "eventGatewayType": EventBasedGatewayType;
}
interface ComplexGateway {
    "activationCondition": Expression;
    "default": SequenceFlow;
}
interface ExclusiveGateway {
    "default": SequenceFlow;
}
interface InclusiveGateway {
    "default": SequenceFlow;
}
interface ParallelGateway {
}
interface RootElement {
}
interface Relationship {
    "type": string;
    "direction": RelationshipDirection;
    "source": Element[];
    "target": Element[];
}
interface BaseElement {
    "id": string;
    "documentation": Documentation[];
    "extensionDefinitions": ExtensionDefinition[];
    "extensionElements": ExtensionElements;
}
interface Extension {
    "mustUnderstand": boolean;
    "definition": ExtensionDefinition;
}
interface ExtensionDefinition {
    "name": string;
    "extensionAttributeDefinitions": ExtensionAttributeDefinition[];
}
interface ExtensionAttributeDefinition {
    "name": string;
    "type": string;
    "isReference": boolean;
    "extensionDefinition": ExtensionDefinition;
}
interface ExtensionElements {
    "valueRef": Element;
    "values": Element[];
    "extensionAttributeDefinition": ExtensionAttributeDefinition;
}
interface Documentation {
    "text": string;
    "textFormat": string;
}
interface Event {
    "properties": Property[];
}
interface IntermediateCatchEvent {
}
interface IntermediateThrowEvent {
}
interface EndEvent {
}
interface StartEvent {
    "isInterrupting": boolean;
}
interface ThrowEvent {
    "dataInputs": DataInput[];
    "dataInputAssociations": DataInputAssociation[];
    "inputSet": InputSet;
    "eventDefinitions": EventDefinition[];
    "eventDefinitionRef": EventDefinition[];
}
interface CatchEvent {
    "parallelMultiple": boolean;
    "dataOutputs": DataOutput[];
    "dataOutputAssociations": DataOutputAssociation[];
    "outputSet": OutputSet;
    "eventDefinitions": EventDefinition[];
    "eventDefinitionRef": EventDefinition[];
}
interface BoundaryEvent {
    "cancelActivity": boolean;
    "attachedToRef": Activity;
}
interface EventDefinition {
}
interface CancelEventDefinition {
}
interface ErrorEventDefinition {
    "errorRef": Error;
}
interface TerminateEventDefinition {
}
interface EscalationEventDefinition {
    "escalationRef": Escalation;
}
interface Escalation {
    "structureRef": ItemDefinition;
    "name": string;
    "escalationCode": string;
}
interface CompensateEventDefinition {
    "waitForCompletion": boolean;
    "activityRef": Activity;
}
interface TimerEventDefinition {
    "timeDate": Expression;
    "timeCycle": Expression;
    "timeDuration": Expression;
}
interface LinkEventDefinition {
    "name": string;
    "target": LinkEventDefinition;
    "source": LinkEventDefinition[];
}
interface MessageEventDefinition {
    "messageRef": Message;
    "operationRef": Operation;
}
interface ConditionalEventDefinition {
    "condition": Expression;
}
interface SignalEventDefinition {
    "signalRef": Signal;
}
interface Signal {
    "structureRef": ItemDefinition;
    "name": string;
}
interface ImplicitThrowEvent {
}
interface DataState {
    "name": string;
}
interface ItemAwareElement {
    "itemSubjectRef": ItemDefinition;
    "dataState": DataState;
}
interface DataAssociation {
    "sourceRef": ItemAwareElement[];
    "targetRef": ItemAwareElement;
    "transformation": FormalExpression;
    "assignment": Assignment[];
}
interface DataInput {
    "name": string;
    "isCollection": boolean;
    "inputSetRef": InputSet[];
    "inputSetWithOptional": InputSet[];
    "inputSetWithWhileExecuting": InputSet[];
}
interface DataOutput {
    "name": string;
    "isCollection": boolean;
    "outputSetRef": OutputSet[];
    "outputSetWithOptional": OutputSet[];
    "outputSetWithWhileExecuting": OutputSet[];
}
interface InputSet {
    "name": string;
    "dataInputRefs": DataInput[];
    "optionalInputRefs": DataInput[];
    "whileExecutingInputRefs": DataInput[];
    "outputSetRefs": OutputSet[];
}
interface OutputSet {
    "dataOutputRefs": DataOutput[];
    "name": string;
    "inputSetRefs": InputSet[];
    "optionalOutputRefs": DataOutput[];
    "whileExecutingOutputRefs": DataOutput[];
}
interface Property {
    "name": string;
}
interface DataInputAssociation {
}
interface DataOutputAssociation {
}
interface InputOutputSpecification {
    "dataInputs": DataInput[];
    "dataOutputs": DataOutput[];
    "inputSets": InputSet[];
    "outputSets": OutputSet[];
}
interface DataObject {
    "isCollection": boolean;
}
interface InputOutputBinding {
    "inputDataRef": InputSet;
    "outputDataRef": OutputSet;
    "operationRef": Operation;
}
interface Assignment {
    "from": Expression;
    "to": Expression;
}
interface DataStore {
    "name": string;
    "capacity": number;
    "isUnlimited": boolean;
}
interface DataStoreReference {
    "dataStoreRef": DataStore;
}
interface DataObjectReference {
    "dataObjectRef": DataObject;
}
interface ConversationLink {
    "sourceRef": InteractionNode;
    "targetRef": InteractionNode;
    "name": string;
}
interface ConversationAssociation {
    "innerConversationNodeRef": ConversationNode;
    "outerConversationNodeRef": ConversationNode;
}
interface CallConversation {
    "calledCollaborationRef": Collaboration;
    "participantAssociations": ParticipantAssociation[];
}
interface Conversation {
}
interface SubConversation {
    "conversationNodes": ConversationNode[];
}
interface ConversationNode {
    "name": string;
    "participantRef": Participant[];
    "messageFlowRefs": MessageFlow[];
    "correlationKeys": CorrelationKey[];
}
interface GlobalConversation {
}
interface PartnerEntity {
    "name": string;
    "participantRef": Participant[];
}
interface PartnerRole {
    "name": string;
    "participantRef": Participant[];
}
interface CorrelationProperty {
    "correlationPropertyRetrievalExpression": CorrelationPropertyRetrievalExpression[];
    "name": string;
    "type": ItemDefinition;
}
interface Error {
    "structureRef": ItemDefinition;
    "name": string;
    "errorCode": string;
}
interface CorrelationKey {
    "correlationPropertyRef": CorrelationProperty[];
    "name": string;
}
interface Expression {
    "body": string;
}
interface FormalExpression {
    "language": string;
    "evaluatesToTypeRef": ItemDefinition;
}
interface Message {
    "name": string;
    "itemRef": ItemDefinition;
}
interface ItemDefinition {
    "itemKind": ItemKind;
    "structureRef": string;
    "isCollection": boolean;
    "import": Import;
}
interface FlowElement {
    "name": string;
    "auditing": Auditing;
    "monitoring": Monitoring;
    "categoryValueRef": CategoryValue[];
}
interface SequenceFlow {
    "isImmediate": boolean;
    "conditionExpression": Expression;
    "sourceRef": FlowNode;
    "targetRef": FlowNode;
}
interface FlowElementsContainer {
    "laneSets": LaneSet[];
    "flowElements": FlowElement[];
}
interface CallableElement {
    "name": string;
    "ioSpecification": InputOutputSpecification;
    "supportedInterfaceRef": Interface[];
    "ioBinding": InputOutputBinding[];
}
interface FlowNode {
    "incoming": SequenceFlow[];
    "outgoing": SequenceFlow[];
    "lanes": Lane[];
}
interface CorrelationPropertyRetrievalExpression {
    "messagePath": FormalExpression;
    "messageRef": Message;
}
interface CorrelationPropertyBinding {
    "dataPath": FormalExpression;
    "correlationPropertyRef": CorrelationProperty;
}
interface Resource {
    "name": string;
    "resourceParameters": ResourceParameter[];
}
interface ResourceParameter {
    "name": string;
    "isRequired": boolean;
    "type": ItemDefinition;
}
interface CorrelationSubscription {
    "correlationKeyRef": CorrelationKey;
    "correlationPropertyBinding": CorrelationPropertyBinding[];
}
interface MessageFlow {
    "name": string;
    "sourceRef": InteractionNode;
    "targetRef": InteractionNode;
    "messageRef": Message;
}
interface MessageFlowAssociation {
    "innerMessageFlowRef": MessageFlow;
    "outerMessageFlowRef": MessageFlow;
}
interface InteractionNode {
    "incomingConversationLinks": ConversationLink[];
    "outgoingConversationLinks": ConversationLink[];
}
interface Participant {
    "name": string;
    "interfaceRef": Interface[];
    "participantMultiplicity": ParticipantMultiplicity;
    "endPointRefs": EndPoint[];
    "processRef": Process;
}
interface ParticipantAssociation {
    "innerParticipantRef": Participant;
    "outerParticipantRef": Participant;
}
interface ParticipantMultiplicity {
    "minimum": number;
    "maximum": number;
}
interface Collaboration {
    "name": string;
    "isClosed": boolean;
    "participants": Participant[];
    "messageFlows": MessageFlow[];
    "artifacts": Artifact[];
    "conversations": ConversationNode[];
    "conversationAssociations": ConversationAssociation;
    "participantAssociations": ParticipantAssociation[];
    "messageFlowAssociations": MessageFlowAssociation[];
    "correlationKeys": CorrelationKey[];
    "choreographyRef": Choreography[];
    "conversationLinks": ConversationLink[];
}
interface ChoreographyActivity {
    "participantRef": Participant[];
    "initiatingParticipantRef": Participant;
    "correlationKeys": CorrelationKey[];
    "loopType": ChoreographyLoopType;
}
interface CallChoreography {
    "calledChoreographyRef": Choreography;
    "participantAssociations": ParticipantAssociation[];
}
interface SubChoreography {
    "artifacts": Artifact[];
}
interface ChoreographyTask {
    "messageFlowRef": MessageFlow[];
}
interface Choreography {
}
interface GlobalChoreographyTask {
    "initiatingParticipantRef": Participant;
}
interface TextAnnotation {
    "text": string;
    "textFormat": string;
}
interface Group {
    "categoryValueRef": CategoryValue;
}
interface Association {
    "associationDirection": AssociationDirection;
    "sourceRef": BaseElement;
    "targetRef": BaseElement;
}
interface Category {
    "categoryValue": CategoryValue[];
    "name": string;
}
interface Artifact {
}
interface CategoryValue {
    "categorizedFlowElements": FlowElement[];
    "value": string;
}
interface Activity {
    "isForCompensation": boolean;
    "default": SequenceFlow;
    "ioSpecification": InputOutputSpecification;
    "boundaryEventRefs": BoundaryEvent[];
    "properties": Property[];
    "dataInputAssociations": DataInputAssociation[];
    "dataOutputAssociations": DataOutputAssociation[];
    "startQuantity": number;
    "resources": ResourceRole[];
    "completionQuantity": number;
    "loopCharacteristics": LoopCharacteristics;
}
interface ServiceTask {
    "implementation": string;
    "operationRef": Operation;
}
interface SubProcess {
    "triggeredByEvent": boolean;
    "artifacts": Artifact[];
}
interface LoopCharacteristics {
}
interface MultiInstanceLoopCharacteristics {
    "isSequential": boolean;
    "behavior": MultiInstanceBehavior;
    "loopCardinality": Expression;
    "loopDataInputRef": ItemAwareElement;
    "loopDataOutputRef": ItemAwareElement;
    "inputDataItem": DataInput;
    "outputDataItem": DataOutput;
    "complexBehaviorDefinition": ComplexBehaviorDefinition[];
    "completionCondition": Expression;
    "oneBehaviorEventRef": EventDefinition;
    "noneBehaviorEventRef": EventDefinition;
}
interface StandardLoopCharacteristics {
    "testBefore": boolean;
    "loopCondition": Expression;
    "loopMaximum": number;
}
interface CallActivity {
    "calledElement": string;
}
interface Task {
}
interface SendTask {
    "implementation": string;
    "operationRef": Operation;
    "messageRef": Message;
}
interface ReceiveTask {
    "implementation": string;
    "instantiate": boolean;
    "operationRef": Operation;
    "messageRef": Message;
}
interface ScriptTask {
    "scriptFormat": string;
    "script": string;
}
interface BusinessRuleTask {
    "implementation": string;
}
interface AdHocSubProcess {
    "completionCondition": Expression;
    "ordering": AdHocOrdering;
    "cancelRemainingInstances": boolean;
}
interface Transaction {
    "protocol": string;
    "method": string;
}
interface GlobalScriptTask {
    "scriptLanguage": string;
    "script": string;
}
interface GlobalBusinessRuleTask {
    "implementation": string;
}
interface ComplexBehaviorDefinition {
    "condition": FormalExpression;
    "event": ImplicitThrowEvent;
}
interface ResourceRole {
    "resourceRef": Resource;
    "resourceParameterBindings": ResourceParameterBinding[];
    "resourceAssignmentExpression": ResourceAssignmentExpression;
    "name": string;
}
interface ResourceParameterBinding {
    "expression": Expression;
    "parameterRef": ResourceParameter;
}
interface ResourceAssignmentExpression {
    "expression": Expression;
}
interface Import {
    "importType": string;
    "location": string;
    "namespace": string;
}
interface Definitions {
    "name": string;
    "targetNamespace": string;
    "expressionLanguage": string;
    "typeLanguage": string;
    "imports": Import[];
    "extensions": Extension[];
    "rootElements": RootElement[];
    "diagrams": bpmndi_BPMNDiagram[];
    "exporter": string;
    "relationships": Relationship[];
    "exporterVersion": string;
}
export type BPMN20 = {
    "bpmn_Interface": Interface;
    "bpmn_Operation": Operation;
    "bpmn_EndPoint": EndPoint;
    "bpmn_Auditing": Auditing;
    "bpmn_GlobalTask": GlobalTask;
    "bpmn_Monitoring": Monitoring;
    "bpmn_Performer": Performer;
    "bpmn_Process": Process;
    "bpmn_LaneSet": LaneSet;
    "bpmn_Lane": Lane;
    "bpmn_GlobalManualTask": GlobalManualTask;
    "bpmn_ManualTask": ManualTask;
    "bpmn_UserTask": UserTask;
    "bpmn_Rendering": Rendering;
    "bpmn_HumanPerformer": HumanPerformer;
    "bpmn_PotentialOwner": PotentialOwner;
    "bpmn_GlobalUserTask": GlobalUserTask;
    "bpmn_Gateway": Gateway;
    "bpmn_EventBasedGateway": EventBasedGateway;
    "bpmn_ComplexGateway": ComplexGateway;
    "bpmn_ExclusiveGateway": ExclusiveGateway;
    "bpmn_InclusiveGateway": InclusiveGateway;
    "bpmn_ParallelGateway": ParallelGateway;
    "bpmn_RootElement": RootElement;
    "bpmn_Relationship": Relationship;
    "bpmn_BaseElement": BaseElement;
    "bpmn_Extension": Extension;
    "bpmn_ExtensionDefinition": ExtensionDefinition;
    "bpmn_ExtensionAttributeDefinition": ExtensionAttributeDefinition;
    "bpmn_ExtensionElements": ExtensionElements;
    "bpmn_Documentation": Documentation;
    "bpmn_Event": Event;
    "bpmn_IntermediateCatchEvent": IntermediateCatchEvent;
    "bpmn_IntermediateThrowEvent": IntermediateThrowEvent;
    "bpmn_EndEvent": EndEvent;
    "bpmn_StartEvent": StartEvent;
    "bpmn_ThrowEvent": ThrowEvent;
    "bpmn_CatchEvent": CatchEvent;
    "bpmn_BoundaryEvent": BoundaryEvent;
    "bpmn_EventDefinition": EventDefinition;
    "bpmn_CancelEventDefinition": CancelEventDefinition;
    "bpmn_ErrorEventDefinition": ErrorEventDefinition;
    "bpmn_TerminateEventDefinition": TerminateEventDefinition;
    "bpmn_EscalationEventDefinition": EscalationEventDefinition;
    "bpmn_Escalation": Escalation;
    "bpmn_CompensateEventDefinition": CompensateEventDefinition;
    "bpmn_TimerEventDefinition": TimerEventDefinition;
    "bpmn_LinkEventDefinition": LinkEventDefinition;
    "bpmn_MessageEventDefinition": MessageEventDefinition;
    "bpmn_ConditionalEventDefinition": ConditionalEventDefinition;
    "bpmn_SignalEventDefinition": SignalEventDefinition;
    "bpmn_Signal": Signal;
    "bpmn_ImplicitThrowEvent": ImplicitThrowEvent;
    "bpmn_DataState": DataState;
    "bpmn_ItemAwareElement": ItemAwareElement;
    "bpmn_DataAssociation": DataAssociation;
    "bpmn_DataInput": DataInput;
    "bpmn_DataOutput": DataOutput;
    "bpmn_InputSet": InputSet;
    "bpmn_OutputSet": OutputSet;
    "bpmn_Property": Property;
    "bpmn_DataInputAssociation": DataInputAssociation;
    "bpmn_DataOutputAssociation": DataOutputAssociation;
    "bpmn_InputOutputSpecification": InputOutputSpecification;
    "bpmn_DataObject": DataObject;
    "bpmn_InputOutputBinding": InputOutputBinding;
    "bpmn_Assignment": Assignment;
    "bpmn_DataStore": DataStore;
    "bpmn_DataStoreReference": DataStoreReference;
    "bpmn_DataObjectReference": DataObjectReference;
    "bpmn_ConversationLink": ConversationLink;
    "bpmn_ConversationAssociation": ConversationAssociation;
    "bpmn_CallConversation": CallConversation;
    "bpmn_Conversation": Conversation;
    "bpmn_SubConversation": SubConversation;
    "bpmn_ConversationNode": ConversationNode;
    "bpmn_GlobalConversation": GlobalConversation;
    "bpmn_PartnerEntity": PartnerEntity;
    "bpmn_PartnerRole": PartnerRole;
    "bpmn_CorrelationProperty": CorrelationProperty;
    "bpmn_Error": Error;
    "bpmn_CorrelationKey": CorrelationKey;
    "bpmn_Expression": Expression;
    "bpmn_FormalExpression": FormalExpression;
    "bpmn_Message": Message;
    "bpmn_ItemDefinition": ItemDefinition;
    "bpmn_FlowElement": FlowElement;
    "bpmn_SequenceFlow": SequenceFlow;
    "bpmn_FlowElementsContainer": FlowElementsContainer;
    "bpmn_CallableElement": CallableElement;
    "bpmn_FlowNode": FlowNode;
    "bpmn_CorrelationPropertyRetrievalExpression": CorrelationPropertyRetrievalExpression;
    "bpmn_CorrelationPropertyBinding": CorrelationPropertyBinding;
    "bpmn_Resource": Resource;
    "bpmn_ResourceParameter": ResourceParameter;
    "bpmn_CorrelationSubscription": CorrelationSubscription;
    "bpmn_MessageFlow": MessageFlow;
    "bpmn_MessageFlowAssociation": MessageFlowAssociation;
    "bpmn_InteractionNode": InteractionNode;
    "bpmn_Participant": Participant;
    "bpmn_ParticipantAssociation": ParticipantAssociation;
    "bpmn_ParticipantMultiplicity": ParticipantMultiplicity;
    "bpmn_Collaboration": Collaboration;
    "bpmn_ChoreographyActivity": ChoreographyActivity;
    "bpmn_CallChoreography": CallChoreography;
    "bpmn_SubChoreography": SubChoreography;
    "bpmn_ChoreographyTask": ChoreographyTask;
    "bpmn_Choreography": Choreography;
    "bpmn_GlobalChoreographyTask": GlobalChoreographyTask;
    "bpmn_TextAnnotation": TextAnnotation;
    "bpmn_Group": Group;
    "bpmn_Association": Association;
    "bpmn_Category": Category;
    "bpmn_Artifact": Artifact;
    "bpmn_CategoryValue": CategoryValue;
    "bpmn_Activity": Activity;
    "bpmn_ServiceTask": ServiceTask;
    "bpmn_SubProcess": SubProcess;
    "bpmn_LoopCharacteristics": LoopCharacteristics;
    "bpmn_MultiInstanceLoopCharacteristics": MultiInstanceLoopCharacteristics;
    "bpmn_StandardLoopCharacteristics": StandardLoopCharacteristics;
    "bpmn_CallActivity": CallActivity;
    "bpmn_Task": Task;
    "bpmn_SendTask": SendTask;
    "bpmn_ReceiveTask": ReceiveTask;
    "bpmn_ScriptTask": ScriptTask;
    "bpmn_BusinessRuleTask": BusinessRuleTask;
    "bpmn_AdHocSubProcess": AdHocSubProcess;
    "bpmn_Transaction": Transaction;
    "bpmn_GlobalScriptTask": GlobalScriptTask;
    "bpmn_GlobalBusinessRuleTask": GlobalBusinessRuleTask;
    "bpmn_ComplexBehaviorDefinition": ComplexBehaviorDefinition;
    "bpmn_ResourceRole": ResourceRole;
    "bpmn_ResourceParameterBinding": ResourceParameterBinding;
    "bpmn_ResourceAssignmentExpression": ResourceAssignmentExpression;
    "bpmn_Import": Import;
    "bpmn_Definitions": Definitions;
};
