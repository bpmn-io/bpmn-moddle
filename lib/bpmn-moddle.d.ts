import {
  Base,
  Moddle
} from 'moddle';

type FromXMLResult = {
  elementsById: Record<string, Base>;
  references: Base[];
  rootElement: Base;
  warnings: string[];
};

type ToXMLResult = {
  xml: string;
};

/**
 * A BPMN 2.0 meta-model library.
 */
export default class BpmnModdle<T = {}> extends Moddle<T> {
  constructor(options: any);

  fromXML(xmlStr: string, typeName?: string, options?: Object): Promise<FromXMLResult>;

  toXML(element: Base, options?: Object): Promise<ToXMLResult>;
}

