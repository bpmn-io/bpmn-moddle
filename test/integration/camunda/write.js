'use strict';

var assign = require('lodash/object/assign'),
    isFunction = require('lodash/lang/isFunction');

var Helper = require('../../helper');

var camundaPackage = require('../../fixtures/json/model/camunda');


describe('bpmn-moddle - integration', function() {

  describe('camunda extension', function() {

    describe('write', function() {

      var moddle = Helper.createModdle({ camunda: camundaPackage });

      function write(element, options, callback) {
        if (isFunction(options)) {
          callback = options;
          options = {};
        }

        // skip preamble for tests
        options = assign({ preamble: false }, options);

        moddle.toXML(element, options, callback);
      }


      describe('should export camunda types', function() {

        it('ServiceTaskLike', function(done) {

          // given
          var serviceTask = moddle.create('bpmn:ServiceTask', { javaDelegate: 'FOO' });

          // assume
          expect(serviceTask.$instanceOf('camunda:ServiceTaskLike')).to.be.true;

          var expectedXML =
          '<bpmn:serviceTask xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" ' +
                            'xmlns:camunda="http://activiti.org/bpmn" ' +
                            'camunda:javaDelegate="FOO" />';

          // when
          write(serviceTask, function(err, result) {

            if (err) {
              return done(err);
            }

            // then
            expect(result).to.eql(expectedXML);

            done(err);
          });
        });


        it('InputOutput - list', function(done) {

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
          write(inputOutput, function(err, result) {

            if (err) {
              return done(err);
            }

            // then
            expect(result).to.eql(expectedXML);

            done(err);
          });
        });


        it('InputOutput - map', function(done) {

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
                      '<camunda:value><![CDATA[${ \'b\' }]]></camunda:value>' +
                    '</camunda:list>' +
                  '</camunda:entry>' +
                '</camunda:map>' +
              '</camunda:inputParameter>' +
            '</camunda:inputOutput>';


          // when
          write(inputOutput, function(err, result) {

            if (err) {
              return done(err);
            }

            // then
            expect(result).to.eql(expectedXML);

            done(err);
          });
        });


        it('InputOutput - mixed', function(done) {

          // given
          var inputParameter = moddle.create('camunda:InputParameter', {
            name: 'var1',
            definition: moddle.create('camunda:List', {
              items: [
                moddle.create('camunda:Value', { value: 'constantStringValue' }),
                moddle.create('camunda:Value', { value: '${ \'elValue\' }' }),
                moddle.create('camunda:Script', { source: '\n            return "scriptValue";\n          ' })
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
                  '<camunda:value><![CDATA[${ \'elValue\' }]]></camunda:value>' +
                  '<camunda:script><![CDATA[\n            return "scriptValue";\n          ]]></camunda:script>' +
                '</camunda:list>' +
              '</camunda:inputParameter>' +
            '</camunda:inputOutput>';


          // when
          write(inputOutput, function(err, result) {

            if (err) {
              return done(err);
            }

            // then
            expect(result).to.eql(expectedXML);

            done(err);
          });
        });


        it('InputOutput - plain', function(done) {


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
          write(inputOutput, function(err, result) {

            if (err) {
              return done(err);
            }

            // then
            expect(result).to.eql(expectedXML);

            done(err);
          });
        });

      });

    });

  });

});