import expect from '../../expect';

import {
  assign
} from 'min-dash';

import {
  createModdle
} from '../../helper';

import camundaPackage from '../../fixtures/json/model/camunda';


describe('bpmn-moddle - integration', function() {

  describe('camunda extension', function() {

    describe('write', function() {

      var moddle = createModdle({ camunda: camundaPackage });

      function write(element, options) {

        // skip preamble for tests
        options = assign({ preamble: false }, options);

        return moddle.toXML(element, options);
      }


      describe('should export camunda types', function() {

        it('ServiceTaskLike', async function() {

          // given
          var serviceTask = moddle.create('bpmn:ServiceTask', { javaDelegate: 'FOO' });

          // assume
          expect(serviceTask.$instanceOf('camunda:ServiceTaskLike')).to.be.true;

          var expectedXML =
          '<bpmn:serviceTask xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                            'xmlns:camunda="http://activiti.org/bpmn" ' +
                            'camunda:javaDelegate="FOO" />';

          // when
          var { xml } = await write(serviceTask);

          // then
          expect(xml).to.eql(expectedXML);
        });


        it('InputOutput - list', async function() {

          // given
          var outputParameter = moddle.create('camunda:OutputParameter', {
            name: 'var1',
            definition: moddle.create('camunda:List', {
              items: [
                moddle.create('camunda:Value', { value: '${1+1}' }),
                moddle.create('camunda:Value', { value: '${1+2}' }),
                moddle.create('camunda:Value', { value: '${1+3}' })
              ]
            })
          });

          var inputOutput = moddle.create('camunda:InputOutput', {
            outputParameters: [ outputParameter ]
          });


          var expectedXML =
            '<camunda:inputOutput xmlns:camunda="http://activiti.org/bpmn">' +
              '<camunda:outputParameter name="var1">' +
                '<camunda:list>' +
                  '<camunda:value>${1+1}</camunda:value>' +
                  '<camunda:value>${1+2}</camunda:value>' +
                  '<camunda:value>${1+3}</camunda:value>' +
                '</camunda:list>' +
              '</camunda:outputParameter>' +
            '</camunda:inputOutput>';


          // when
          var { xml } = await write(inputOutput);

          // then
          expect(xml).to.eql(expectedXML);
        });


        it('InputOutput - map', async function() {

          // given
          var inputParameter = moddle.create('camunda:InputParameter', {
            name: 'var1',
            definition: moddle.create('camunda:Map', {
              entries: [
                moddle.create('camunda:Entry', {
                  key: 'a',
                  value: moddle.create('camunda:List', {
                    items: [
                      moddle.create('camunda:Value', { value: 'stringInListNestedInMap' }),
                      moddle.create('camunda:Value', { value: '${ \'b\' }' })
                    ]
                  })
                })
              ]
            })
          });

          var inputOutput = moddle.create('camunda:InputOutput', {
            inputParameters: [ inputParameter ]
          });


          var expectedXML =
            '<camunda:inputOutput xmlns:camunda="http://activiti.org/bpmn">' +
              '<camunda:inputParameter name="var1">' +
                '<camunda:map>' +
                  '<camunda:entry key="a">' +
                    '<camunda:list>' +
                      '<camunda:value>stringInListNestedInMap</camunda:value>' +
                      '<camunda:value>${ \'b\' }</camunda:value>' +
                    '</camunda:list>' +
                  '</camunda:entry>' +
                '</camunda:map>' +
              '</camunda:inputParameter>' +
            '</camunda:inputOutput>';


          // when
          var { xml } = await write(inputOutput);

          // then
          expect(xml).to.eql(expectedXML);
        });


        it('InputOutput - mixed', async function() {

          // given
          var inputParameter = moddle.create('camunda:InputParameter', {
            name: 'var1',
            definition: moddle.create('camunda:List', {
              items: [
                moddle.create('camunda:Value', { value: 'constantStringValue' }),
                moddle.create('camunda:Value', { value: '${ \'elValue\' }' }),
                moddle.create('camunda:Script', { source: 'return "scriptValue";' })
              ]
            })
          });

          var inputOutput = moddle.create('camunda:InputOutput', {
            inputParameters: [ inputParameter ]
          });


          var expectedXML =
            '<camunda:inputOutput xmlns:camunda="http://activiti.org/bpmn">' +
              '<camunda:inputParameter name="var1">' +
                '<camunda:list>' +
                  '<camunda:value>constantStringValue</camunda:value>' +
                  '<camunda:value>${ \'elValue\' }</camunda:value>' +
                  '<camunda:script>return "scriptValue";</camunda:script>' +
                '</camunda:list>' +
              '</camunda:inputParameter>' +
            '</camunda:inputOutput>';


          // when
          var { xml } = await write(inputOutput);

          // then
          expect(xml).to.eql(expectedXML);
        });


        it('InputOutput - plain', async function() {


          // given
          var inputParameter = moddle.create('camunda:InputParameter', {
            name: 'var2',
            value: 'stringConstantValue'
          });

          var inputOutput = moddle.create('camunda:InputOutput', {
            inputParameters: [ inputParameter ]
          });


          var expectedXML =
            '<camunda:inputOutput xmlns:camunda="http://activiti.org/bpmn">' +
              '<camunda:inputParameter name="var2">stringConstantValue</camunda:inputParameter>' +
            '</camunda:inputOutput>';


          // when
          var { xml } = await write(inputOutput);

          // then
          expect(xml).to.eql(expectedXML);
        });

      });

    });

  });

});
