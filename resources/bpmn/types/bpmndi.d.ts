enum ParticipantBandKind {
    top_initiating,
    middle_initiating,
    bottom_initiating,
    top_non_initiating,
    middle_non_initiating,
    bottom_non_initiating
}
enum MessageVisibleKind {
    initiating,
    non_initiating
}
interface BPMNDiagram {
    "plane": BPMNPlane;
    "labelStyle": BPMNLabelStyle[];
}
interface BPMNPlane {
    "bpmnElement": bpmn_BaseElement;
}
interface BPMNShape {
    "bpmnElement": bpmn_BaseElement;
    "isHorizontal": boolean;
    "isExpanded": boolean;
    "isMarkerVisible": boolean;
    "label": BPMNLabel;
    "isMessageVisible": boolean;
    "participantBandKind": ParticipantBandKind;
    "choreographyActivityShape": BPMNShape;
}
interface BPMNEdge {
    "label": BPMNLabel;
    "bpmnElement": bpmn_BaseElement;
    "sourceElement": di_DiagramElement;
    "targetElement": di_DiagramElement;
    "messageVisibleKind": MessageVisibleKind;
}
interface BPMNLabel {
    "labelStyle": BPMNLabelStyle;
}
interface BPMNLabelStyle {
    "font": dc_Font;
}
export type BPMNDI = {
    "bpmndi_BPMNDiagram": BPMNDiagram;
    "bpmndi_BPMNPlane": BPMNPlane;
    "bpmndi_BPMNShape": BPMNShape;
    "bpmndi_BPMNEdge": BPMNEdge;
    "bpmndi_BPMNLabel": BPMNLabel;
    "bpmndi_BPMNLabelStyle": BPMNLabelStyle;
};
