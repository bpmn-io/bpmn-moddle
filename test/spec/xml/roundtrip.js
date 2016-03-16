'use strict';

var Helper = require('../../helper'),
    XMLHelper = require('../../xml-helper');

var toXML = XMLHelper.toXML,
    validate = XMLHelper.validate;


describe('bpmn-moddle - roundtrip', function() {

  var moddle = Helper.createModdle();

  function fromFile(file, done) {
    XMLHelper.fromFile(moddle, file, done);
  }


  describe('should serialize valid BPMN 2.0 xml after read', function() {

    this.timeout(15000);


    it('home-made bpmn model', function(done) {

      var definitions = moddle.create('bpmn:Definitions', { targetNamespace: 'http://foo' });

      var processElement = moddle.create('bpmn:Process');
      var serviceTask = moddle.create('bpmn:ServiceTask', { name: 'MyService Task' });

      processElement.get('flowElements').push(serviceTask);
      definitions.get('rootElements').push(processElement);

      // when
      toXML(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('obscure ids model', function(done) {

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
      toXML(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('ioSpecification', function(done) {

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
      toXML(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('properties', function(done) {

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
      toXML(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('extension attributes', function(done) {

      // given
      fromFile('test/fixtures/bpmn/extension-attributes.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('multi instance loop characteristics', function(done) {

      // given
      fromFile('test/fixtures/bpmn/multiInstanceLoopCharacteristics.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('documentation / extensionElements order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/documentation-extension-elements.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('activity children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/activity-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('lane children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/lane-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('conversation children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/conversation-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('process children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/process-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('definitions children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/definitions-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('ioSpecification children order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/inputOutputSpecification-children.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('Participant#interfaceRef', function(done) {

      // given
      fromFile('test/fixtures/bpmn/participant-interfaceRef.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('ResourceRole#resourceRef', function(done) {

      // given
      fromFile('test/fixtures/bpmn/potentialOwner.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('Operation#messageRef', function(done) {

      // given
      fromFile('test/fixtures/bpmn/operation-messageRef.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          // then
          expect(xml).to.contain('<bpmn:inMessageRef>fooInMessage</bpmn:inMessageRef>');

          validate(err, xml, done);
        });
      });
    });


    it('di extensions', function(done) {

      // given
      fromFile('test/fixtures/bpmn/di-extension.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          expect(xml).to.contain('<vendor:baz baz="BAZ" />');
          expect(xml).to.contain('<vendor:bar>BAR</vendor:bar>');
          expect(xml).to.contain('<di:extension />');

          validate(err, xml, done);
        });
      });
    });


    it('complex processElement / extensionElements', function(done) {

      // given
      fromFile('test/fixtures/bpmn/complex.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('category', function(done) {

      // given
      fromFile('test/fixtures/bpmn/category.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {

          expect(xml).to.contain('sid-afd7e63e-916e-4bd0-a9f0-98cbff749193');
          expect(xml).to.contain('group with label');

          validate(err, xml, done);
        });
      });

    });


    it('simple processElement', function(done) {

      // given
      fromFile('test/fixtures/bpmn/simple.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });


    it('xsi:type', function(done) {

      // given
      fromFile('test/fixtures/bpmn/xsi-type.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
      });
    });

  });


  describe('vendor', function() {

    describe('signavio', function() {

      it('complex processElement', function(done) {

        // given
        fromFile('test/fixtures/bpmn/vendor/signavio-complex-no-extensions.bpmn', function(err, result) {

          if (err) {
            return done(err);
          }

          // when
          toXML(result, { format: true }, function(err, xml) {
            validate(err, xml, done);
          });
        });
      });

    });


    describe('yaoqiang', function() {

      it('event definitions', function(done) {

        // given
        fromFile('test/fixtures/bpmn/vendor/yaoqiang-event-definitions.bpmn', function(err, result, context) {

          if (err) {
            return done(err);
          }

          var warningsStr = context.warnings.map(function(w) {
            return '\n\t- ' + w.message;
          }).join('');

          if (warningsStr) {
            return done(new Error('import warnings: ' + warningsStr));
          }

          // when
          toXML(result, { format: true }, function(err, xml) {
            validate(err, xml, done);
          });
        });
      });

    });

  });

});
