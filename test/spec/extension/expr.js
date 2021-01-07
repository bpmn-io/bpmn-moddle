import expect from '../../expect';

import {
  assign
} from 'min-dash';

import {
  createModdle,
  readFile
} from '../../helper';


describe('bpmn-moddle - expr', function() {

  var moddle = createModdle({
    expr: require('../../fixtures/json/model/expr')
  });

  function read(xml, root, opts) {
    return moddle.fromXML(xml, root, opts);
  }

  function fromFile(file, root, opts) {
    var contents = readFile(file);
    return read(contents, root, opts);
  }

  function write(element, options) {

    // skip preamble for tests
    options = assign({ preamble: false }, options);

    return moddle.toXML(element, options);
  }


  it('should read expr:Guard (sub-class of bpmn:FormalExpression)', async function() {

    // given
    var expected = {
      $type: 'bpmn:SequenceFlow',
      id: 'SequenceFlow_1',

      conditionExpression: {
        $type: 'expr:Guard',
        body: '${ foo < bar }'
      }
    };

    // when
    var {
      rootElement
    } = await fromFile('test/spec/extension/expr-Guard.part.bpmn', 'bpmn:SequenceFlow');

    // then
    expect(rootElement).to.jsonEqual(expected);
  });


  it('should write expr:Guard (sub-class of bpmn:FormalExpression)', async function() {

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
    var { xml } = await write(sequenceFlow, { format: true });

    // then
    expect(xml).to.eql(expectedXML);
  });

});
