type Boolean = boolean;
type Integer = number;
type Real = number;
type String = string;
interface Font {
    "name": string;
    "size": number;
    "isBold": boolean;
    "isItalic": boolean;
    "isUnderline": boolean;
    "isStrikeThrough": boolean;
}
interface Point {
    "x": number;
    "y": number;
}
interface Bounds {
    "x": number;
    "y": number;
    "width": number;
    "height": number;
}
export type DC = {
    "dc_Boolean": Boolean;
    "dc_Integer": Integer;
    "dc_Real": Real;
    "dc_String": String;
    "dc_Font": Font;
    "dc_Point": Point;
    "dc_Bounds": Bounds;
};
