// import type BPMN from '../resources/bpmn/types/bpmn.d.ts';
// import type BPMNDI from '../resources/bpmn/types/bpmndi.d.ts';
import type DC from '../resources/bpmn/types/dc.js';
// import type DI from '../resources/bpmn/types/di.d.ts';

// import type BIOC from '../resources/bpmn-io/types/bioc.d.ts';
// import type COLOR from '../resources/bpmn-io/types/color.d.ts';

import { Package } from 'moddle';

import type BpmnModdle from './bpmn-moddle';

// type Packages = BPMN & BPMNDI & DC & DI & BIOC & COLOR;

type Packages = DC;

/**
 * BPMN 2.0 meta-model library with default packages.
 */
type simple = <T = {}>(additionalPackages: Record<string, Package>, options?: Object) => BpmnModdle<Packages & T>;

export default simple;