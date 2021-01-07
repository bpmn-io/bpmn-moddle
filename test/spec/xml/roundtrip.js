import expect from '../../expect';

import {
  createModdle
} from '../../helper';

import {
  fromValidFile,
  fromFilePart,
  toXML,
  validate
} from '../../xml-helper';

import {
  readFileSync as readFile
} from 'fs';


describe('bpmn-moddle - roundtrip', function() {

  this.timeout(10000);

  var moddle = createModdle();

  function fromFile(file) {
    return fromValidFile(moddle, file);
  }


  describe('should serialize valid BPMN 2.0 xml after read', function() {

    it('home-made bpmn model', async function() {

      var definitions = moddle.create('bpmn:Definitions', { targetNamespace: 'http://foo' });

      var processElement = moddle.create('bpmn:Process');
      var serviceTask = moddle.create('bpmn:ServiceTask', { name: 'MyService Task' });

      processElement.get('flowElements').push(serviceTask);
      definitions.get('rootElements').push(processElement);

      // when
      var {
        xml
      } = await toXML(definitions, { format: true });

      // then
      await validate(xml);
    });


    it('obscure ids model', async function() {

      var definitions = moddle.create('bpmn:Definitions', {
        'xmlns:foo': 'http://foo-ns',
        targetNamespace: 'http://foo',
        rootElements: [
          moddle.create('bpmn:Message', { id: 'foo_bar' }),
          moddle.create('bpmn:Message', { id: 'foo-bar' }),
          moddle.create('bpmn:Message', { id: 'foo1bar' }),
          moddle.create('bpmn:Message', { id: 'Foo1bar' }),
          moddle.create('bpmn:Message', { id: '_foo_bar' }),
          moddle.create('bpmn:Message', { id: '_foo-bar' }),
          moddle.create('bpmn:Message', { id: '_11' })

          // invalid
          // moddle.create('bpmn:Message', { id: '-foo-bar' }),
          // moddle.create('bpmn:Message', { id: 'foo:_foo_bar' }),
          // moddle.create('bpmn:Message', { id: '1foo_bar' })
        ]
      });

      // when
      var {
        xml
      } = await toXML(definitions, { format: true });

      // then
      await validate(xml);
    });


    it('ioSpecification', async function() {

      // given
      var definitions = moddle.create('bpmn:Definitions', { targetNamespace: 'http://foo' });

      var processElement = moddle.create('bpmn:Process');

      var dataInput = moddle.create('bpmn:DataInput', { id: 'DataInput_FOO' });

      var inputSet = moddle.create('bpmn:InputSet', {
        dataInputRefs: [ dataInput ]
      });

      var outputSet = moddle.create('bpmn:OutputSet');

      var ioSpecification = moddle.create('bpmn:InputOutputSpecification', {
        inputSets: [ inputSet ],
        outputSets: [ outputSet ],
        dataInputs: [ dataInput ]
      });

      var serviceTask = moddle.create('bpmn:ServiceTask', {
        name: 'MyService Task',
        ioSpecification: ioSpecification
      });

      processElement.get('flowElements').push(serviceTask);
      definitions.get('rootElements').push(processElement);

      // when
      var {
        xml
      } = await toXML(definitions, { format: true });

      // then
      await validate(xml);
    });


    it('properties', async function() {

      // given
      var definitions = moddle.create('bpmn:Definitions', { targetNamespace: 'http://foo' });

      var processElement = moddle.create('bpmn:Process');

      var property = moddle.create('bpmn:Property', {
        id: 'Property_112',
        name: '__targetRef_placeholder'
      });

      var serviceTask = moddle.create('bpmn:ServiceTask', {
        name: 'MyService Task',
        properties: [ property ]
      });

      processElement.get('flowElements').push(serviceTask);
      definitions.get('rootElements').push(processElement);

      // when
      var {
        xml
      } = await toXML(definitions, { format: true });

      // then
      await validate(xml);
    });


    it('extension attributes', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/extension-attributes.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      // then
      await validate(xml);
    });


    it('extension attributes on expression', async function() {

      // given
      var {
        rootElement
      } = await fromFilePart(moddle, 'test/fixtures/bpmn/expression-extension.part.bpmn', 'bpmn:ResourceAssignmentExpression');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      expect(xml).to.contain(
        '<bpmn:expression ' +
                'id="ID_0hnlswl" ' +
                'myNs:expressionType="Constant">' +
              'fgdfgdfg' +
            '</bpmn:expression>'
      );

      // then
      await validate(xml);
    });


    it('multi instance loop characteristics', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/multiInstanceLoopCharacteristics.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      // then
      await validate(xml);
    });


    it('Expression without xsi:type', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/expression-plain.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });


      // then
      // we are serializing xsi:type, even though
      // it is the default
      expect(xml).not.to.contain('xsi:type="bpmn:tExpression');

      await validate(xml);

    });


    it('documentation / extensionElements order', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/documentation-extension-elements.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      // then
      await validate(xml);
    });


    it('activity children order', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/activity-children.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      // then
      await validate(xml);
    });


    it('lane children order', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/lane-children.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('conversation children order', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/conversation-children.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('process children order', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/process-children.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('definitions children order', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/definitions-children.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('ioSpecification children order', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/inputOutputSpecification-children.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('dataInputAssociation assignment order', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/data-input-association.assignment.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('Participant#interfaceRef', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/participant-interfaceRef.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('ResourceRole#resourceRef', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/potentialOwner.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('Operation#messageRef', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/operation-messageRef.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      // then
      expect(xml).to.contain('<bpmn:inMessageRef>fooInMessage</bpmn:inMessageRef>');

      await validate(xml);
    });


    it('di extensions', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/di-extension.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      expect(xml).to.contain('<vendor:baz baz="BAZ" />');
      expect(xml).to.contain('<vendor:bar>BAR</vendor:bar>');
      expect(xml).to.contain('<di:extension />');

      await validate(xml);
    });


    it('complex processElement / extensionElements', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/complex.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('category', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/category.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      expect(xml).to.contain('sid-afd7e63e-916e-4bd0-a9f0-98cbff749193');
      expect(xml).to.contain('group with label');

      await validate(xml);

    });


    it('choreography task', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/choreography-task.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      await validate(xml);

    });


    it('simple processElement', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/simple.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('xsi:type', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/xsi-type.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });
      await validate(xml);
    });


    it('colors', async function() {

      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/example-colors.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      await validate(xml);
    });


    it('nested default namespace prefix', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/nested-default-namespace-prefix.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      // then
      expect(xml).to.contain('<Entry key="A" value="B" />');

      await validate(xml);
    });


    it('nested elements no (default) namespace prefix', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/nested-no-namespace-prefix.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      // then
      expect(xml).to.contain('<Entry key="A" value="B" />');

      await validate(xml);
    });


    it('conflicting ns prefix', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/namespace-prefix-collision.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      // then
      await validate(xml);
    });


    it('local namespace declaration / re-definition', async function() {

      // given
      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/redundant-ns-declaration.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      // then
      // unused namespace declaration is cleaned up
      expect(xml).not.to.contain(
        'xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"'
      );

      // local namespace declaration is exported
      expect(xml).to.contain(
        '<BPMNDiagram xmlns="http://www.omg.org/spec/BPMN/20100524/DI" id="BPMNDiagram_1">'
      );

      await validate(xml);
    });


    it('local namespace exports', async function() {

      // given
      var expectedXML = readFile('test/fixtures/bpmn/namespace-redefinition.bpmn', 'utf8');

      var {
        rootElement
      } = await fromFile('test/fixtures/bpmn/namespace-redefinition.bpmn');

      // when
      var {
        xml
      } = await toXML(rootElement, { format: true });

      // then
      expect(xml).to.eql(expectedXML);
    });

  });


  describe('vendor', function() {

    describe('signavio', function() {

      it('complex processElement', async function() {

        // given
        var {
          rootElement
        } = await fromFile('test/fixtures/bpmn/vendor/signavio-complex-no-extensions.bpmn');

        // when
        var {
          xml
        } = await toXML(rootElement, { format: true });
        await validate(xml);
      });

    });


    describe('yaoqiang', function() {

      it('event definitions', async function() {

        // given
        var {
          rootElement,
          warnings
        } = await fromFile('test/fixtures/bpmn/vendor/yaoqiang-event-definitions.bpmn');

        var warningsStr = warnings.map(function(w) {
          return '\n\t- ' + w.message;
        }).join('');

        if (warningsStr) {
          throw new Error('import warnings: ' + warningsStr);
        }

        // when
        var {
          xml
        } = await toXML(rootElement, { format: true });
        await validate(xml);
      });

    });


    describe('bizagi', function() {

      it('event definitions', async function() {

        // given
        var {
          rootElement,
          warnings
        } = await fromFile('test/fixtures/bpmn/vendor/bizagi-nested-ns-definition.bpmn');

        var warningsStr = warnings.map(function(w) {
          return '\n\t- ' + w.message;
        }).join('');

        if (warningsStr) {
          throw new Error('import warnings: ' + warningsStr);
        }

        // when
        var {
          xml
        } = await toXML(rootElement, { format: true });

        // then
        await validate(xml);
      });

    });


    describe('CaseAgile', function() {

      it('local namespace declaration', async function() {

        // given
        var {
          rootElement,
          warnings
        } = await fromFile('test/fixtures/bpmn/vendor/case-agile-local-ns-declaration.bpmn');

        var warningsStr = warnings.map(function(w) {
          return '\n\t- ' + w.message;
        }).join('');

        if (warningsStr) {
          throw new Error('import warnings: ' + warningsStr);
        }

        // when
        var {
          xml
        } = await toXML(rootElement, { format: true });

        // then
        await validate(xml);
      });

    });
  });

});
