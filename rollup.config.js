import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

import pkg from './package.json';

const pkgExports = pkg.exports['.'];

const srcEntry = 'lib/index.js';

function pgl(plugins = []) {
  return [
    json(),
    ...plugins
  ];
}


export default [
  {
    input: srcEntry,
    output: [
      { file: pkgExports.require, format: 'cjs', sourcemap: true },
      { file: pkgExports.import, format: 'es', sourcemap: true }
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
    ])
  }
];