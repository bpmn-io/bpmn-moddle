import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

import babelParser from '@babel/eslint-parser';

export default [
  {
    'ignores': [ 'dist' ]
  },
  ...bpmnIoPlugin.configs.recommended,
  ...bpmnIoPlugin.configs.node.map(config => {

    return {
      ...config,
      files: [
        'tasks/**/*.cjs'
      ]
    };
  }),
  ...bpmnIoPlugin.configs.mocha.map(config => {

    return {
      ...config,
      files: [
        'test/**/*.js',
        'test/**/*.cjs'
      ]
    };
  }),

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