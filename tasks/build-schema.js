const mri = require('mri');

const cmofToModdle = require('./build-schema/cmof-to-moddle');

const { input, output } = mri(process.argv, {
  alias: {
    i: 'input',
    o: 'output'
  }
});

cmofToModdle(input, output);

