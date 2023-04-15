interface DiagramElement {
    "id": string;
    "extension": Extension;
    "owningDiagram": Diagram;
    "owningElement": DiagramElement;
    "modelElement": Element;
    "style": Style;
    "ownedElement": DiagramElement[];
}
interface Node {
}
interface Edge {
    "source": DiagramElement;
    "target": DiagramElement;
    "waypoint": dc_Point[];
}
interface Diagram {
    "id": string;
    "rootElement": DiagramElement;
    "name": string;
    "documentation": string;
    "resolution": number;
    "ownedStyle": Style[];
}
interface Shape {
    "bounds": dc_Bounds;
}
interface Plane {
    "planeElement": DiagramElement[];
}
interface LabeledEdge {
    "ownedLabel": Label[];
}
interface LabeledShape {
    "ownedLabel": Label[];
}
interface Label {
    "bounds": dc_Bounds;
}
interface Style {
    "id": string;
}
interface Extension {
    "values": Element[];
}
export type DI = {
    "di_DiagramElement": DiagramElement;
    "di_Node": Node;
    "di_Edge": Edge;
    "di_Diagram": Diagram;
    "di_Shape": Shape;
    "di_Plane": Plane;
    "di_LabeledEdge": LabeledEdge;
    "di_LabeledShape": LabeledShape;
    "di_Label": Label;
    "di_Style": Style;
    "di_Extension": Extension;
};
