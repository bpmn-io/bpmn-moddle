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

      var process = moddle.create('bpmn:Process');
      var serviceTask = moddle.create('bpmn:ServiceTask', { name: 'MyService Task'});

      process.get('flowElements').push(serviceTask);
      definitions.get('rootElements').push(process);

      // when
      toXML(definitions, { format: true }, function(err, xml) {

        // then
        validate(err, xml, done);
      });
    });


    it('complex process', function(done) {

      // given
      fromFile('test/fixtures/bpmn/complex-no-extensions.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        // when
        toXML(result, { format: true }, function(err, xml) {
          validate(err, xml, done);
        });
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


    it.skip('potentialOwner / dataOutputAssociation order', function(done) {

      // given
      fromFile('test/fixtures/bpmn/data-output-association-potential-owner.bpmn', function(err, result) {

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
          // patch for https://github.com/bpmn-io/bpmn-js/issues/279
          xml = xml.replace(/inputOutputSpecification/g, 'ioSpecification');

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


    it('complex process / extensionElements', function(done) {

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


    it('simple process', function(done) {

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

});