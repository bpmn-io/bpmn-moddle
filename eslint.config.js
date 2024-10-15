import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

import babelParser from '@babel/eslint-parser';

const files = {
  build: [
    'tasks/**/*.cjs'
  ],
  test: [
    'test/**/*.js',
    'test/**/*.cjs'
  ],
  ignored: [
    'dist'
  ]
};

export default [
  {
    'ignores': files.ignored
  },

  // build
  ...bpmnIoPlugin.configs.node.map(config => {

    return {
      ...config,
      files: files.build
    };
  }),

  // lib + test
  ...bpmnIoPlugin.configs.recommended.map(config => {

    return {
      ...config,
      ignores: files.build
    };
  }),

  // test
  ...bpmnIoPlugin.configs.mocha.map(config => {

    return {
      ...config,
      files: files.test
    };
  }),

  // other
  // hook up babel parser
  {
    files: [ '**/*.js', '**/*.mjs' ],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          plugins: [
            '@babel/plugin-syntax-import-attributes'
          ]
        },
      }
    }
  }
];