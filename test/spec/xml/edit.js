import expect from '../../expect';

import {
  createModdle
} from '../../helper';

import {
  fromFile as readFromFile,
  validate,
  toXML
} from '../../xml-helper';


describe('bpmn-moddle - edit', function() {

  var moddle = createModdle();

  function fromFile(file, done) {
    readFromFile(moddle, file, done);
  }


  describe('save after change', function() {

    it('should serialize changed name', function(done) {

      // given
      fromFile('test/fixtures/bpmn/simple.bpmn', function(err, result) {

        if (err) {
          return done(err);
        }

        result.rootElements[0].name = 'OTHER PROCESS';

        // when
        toXML(result, { format: true }, function(err, xml) {
          expect(xml).to.contain('name="OTHER PROCESS"');

          done(err);
        });
      });

    });

  });


  describe('dataObjectRef', function() {

    it('should update', function(done) {

      fromFile('test/fixtures/bpmn/data-object-reference.bpmn', function(err, result) {

        // given
        var process = result.rootElements[0],
            dataObjectReference = process.flowElements[0];

        // when
        // creating new data object
        var dataObject_2 = moddle.create('bpmn:DataObject', { id: 'dataObject_2' });

        // adding data object to its parent (makes sure it is contained in the XML)
        process.flowElements.push(dataObject_2);

        // set reference to the new data object
        dataObjectReference.dataObjectRef = dataObject_2;

        toXML(result, { format: true }, function(err, xml) {

          // then
          expect(xml).to.contain('<bpmn:dataObject id="dataObject_2" />');
          expect(xml).to.contain('<bpmn:dataObjectReference id="DataObjectReference_1" dataObjectRef="dataObject_2" />');

          done(err);
        });

      });
    });
  });


  describe('generate DI', function() {

    function readAndGenerateDI(file, done) {

      fromFile(file, function(err, definitions) {

        if (err) {
          return done(err);
        }

        var process = definitions.rootElements[0];

        var flowElements = process.flowElements;

        var [
          start,
          task,
          flow
        ] = flowElements;

        var plane = definitions.diagrams[0].plane;

        var model = definitions.$model;

        var planeElements = plane.get('planeElement');

        // when
        planeElements.push(
          model.create('bpmndi:BPMNEdge', {
            id: 'Flow_di',
            bpmnElement: flow,
            waypoint: [
              model.create('dc:Point', { x: 100, y: 100 }),
              model.create('dc:Point', { x: 150, y: 150 })
            ]
          }),
          model.create('bpmndi:BPMNShape', {
            id: 'Start_di',
            bpmnElement: start,
            bounds: model.create('dc:Bounds', { x: 50, y: 50, width: 100, height: 100 })
          }),
          model.create('bpmndi:BPMNShape', {
            id: 'Task_di',
            bpmnElement: task,
            bounds: model.create('dc:Bounds', { x: 100, y: 100, width: 100, height: 100 })
          })
        );

        return done(null, definitions);
      });
    }


    it('should auto-add wellknown', function(done) {

      // given
      readAndGenerateDI('test/fixtures/bpmn/local-ns-no-di.bpmn', function(err, definitions) {
        if (err) {
          return done(err);
        }

        // when
        toXML(definitions, { format: true }, function(err, xml) {

          if (err) {
            return done(err);
          }

          try {
            // then
            expect(xml).to.contain(
              'xmlns:di="http://www.omg.org/spec/DD/20100524/DI"'
            );

            expect(xml).to.contain(
              'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"'
            );
          } catch (_err) {
            err = _err;
          }

          return validate(err, xml, done);
        });
      });

    });


    it('should reuse global namespace', function(done) {

      // given
      readAndGenerateDI('test/fixtures/bpmn/local-ns-no-di.bpmn', function(err, definitions) {
        if (err) {
          return done(err);
        }

        // when
        toXML(definitions, { format: true }, function(err, xml) {

          if (err) {
            return done(err);
          }

          // when
          // set global namespace information
          definitions.$attrs['xmlns:di'] = 'http://www.omg.org/spec/DD/20100524/DI';
          definitions.$attrs['xmlns:dc'] = 'http://www.omg.org/spec/DD/20100524/DC';

          // then
          try {
            expect(xml).to.contain(
              'xmlns:di="http://www.omg.org/spec/DD/20100524/DI"'
            );

            expect(xml).to.contain(
              'xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"'
            );
          } catch (_err) {
            err = _err;
          }

          return validate(err, xml, done);
        });

      });

    });

  });

});