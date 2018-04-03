import chai from 'chai';

import Matchers from './matchers';

// add matchers
chai.use(Matchers);

// expose chai expect
export {
  expect as default
} from 'chai';