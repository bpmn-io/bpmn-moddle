import { terser } from 'rollup-plugin-terser';

import { importAssertions } from 'acorn-import-assertions';

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

import pkg from './package.json';

function pgl(plugins = []) {
  return [
    json(),
    ...plugins
  ];
}

const srcEntry = pkg.source;

const umdDist = pkg['umd:main'];

const umdName = 'BpmnModdle';

export default [

  // browser-friendly UMD build
  {
    input: srcEntry,
    output: {
      file: umdDist.replace(/\.js$/, '.prod.js'),
      format: 'umd',
      name: umdName
    },
    plugins: pgl([
      resolve(),
      commonjs(),
      terser()
    ]),
    acornInjectPlugins: [ importAssertions ]
  },
  {
    input: srcEntry,
    output: {
      file: umdDist,
      format: 'umd',
      name: umdName
    },
    plugins: pgl([
      resolve(),
      commonjs()
    ]),
    acornInjectPlugins: [ importAssertions ]
  },
  {
    input: srcEntry,
    output: [
      { file: pkg.main, format: 'cjs', exports: 'default' },
      { file: pkg.module, format: 'es', exports: 'default' }
    ],
    external: [
      'min-dash',
      'moddle',
      'moddle-xml'
    ],
    plugins: pgl([
      resolve({
        resolveOnly: [
          'bpmn-in-color-moddle'
        ]
      }),
    ]),
    acornInjectPlugins: [ importAssertions ]
  }
];