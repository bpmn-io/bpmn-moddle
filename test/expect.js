var chai = require('chai');

// add matchers
chai.use(require('./matchers'));

// expose expect as global
global.expect = chai.expect;