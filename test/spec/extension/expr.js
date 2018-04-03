import expect from '../../expect';

import {
  assign,
  isFunction
} from 'min-dash';

import {
  createModdle,
  readFile
} from '../../helper';


describe('bpmn-moddle - expr', function() {

  var moddle = createModdle({
    expr: require('../../fixtures/json/model/expr')
  });

  function read(xml, root, opts, callback) {
    return moddle.fromXML(xml, root, opts, callback);
  }

  function fromFile(file, root, opts, callback) {
    var contents = readFile(file);
    return read(contents, root, opts, callback);
  }

  function write(element, options, callback) {
    if (isFunction(options)) {
      callback = options;
      options = {};
    }

    // skip preamble for tests
    options = assign({ preamble: false }, options);

    moddle.toXML(element, options, callback);
  }


  it('should read expr:Guard (sub-class of bpmn:FormalExpression)', function(done) {

    // given

    // when
    fromFile('test/spec/extension/expr-Guard.part.bpmn', 'bpmn:SequenceFlow', function(err, result) {

      var expected = {
        $type: 'bpmn:SequenceFlow',
        id: 'SequenceFlow_1',

        conditionExpression: {
          $type: 'expr:Guard',
          body: '${ foo < bar }'
        }
      };

      // then
      expect(result).to.jsonEqual(expected);

      done(err);
    });
  });


  it('should write expr:Guard (sub-class of bpmn:FormalExpression)', function(done) {

    // given
    var sequenceFlow = moddle.create('bpmn:SequenceFlow', {
      id: 'SequenceFlow_1'
    });

    sequenceFlow.conditionExpression = moddle.create('expr:Guard', { body: '${ foo < bar }' });

    var expectedXML =
      '<bpmn:sequenceFlow xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                         'xmlns:expr="http://expr" ' +
                         'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                         'id="SequenceFlow_1">\n' +
      '  <bpmn:conditionExpression xsi:type="expr:Guard">${ foo &lt; bar }</bpmn:conditionExpression>\n' +
      '</bpmn:sequenceFlow>\n';

    // when
    write(sequenceFlow, { format: true }, function(err, result) {

      if (err) {
        return done(err);
      }

      // then
      expect(result).to.eql(expectedXML);

      done(err);
    });
  });

});
