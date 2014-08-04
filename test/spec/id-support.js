var Helper = require('../helper');

var Ids = require('ids'),
    IdSupport = require('../../lib/id-support');


describe('bpmn-moddle - id-support', function() {

  describe('.extend', function() {

    it('should extend bpmn-moddle with ids', function() {

      // given
      var moddle = Helper.createModdle();
      var ids = new Ids();

      // when
      IdSupport.extend(moddle, ids);

      // then
      expect(moddle.ids).to.equal(ids);
    });

  });


  describe('functionality', function() {

    it('should claim ids during object creation', function() {

      // given
      var moddle = Helper.createModdle();
      var ids = new Ids();

      IdSupport.extend(moddle, ids);

      // when
      var serviceTask = moddle.create('bpmn:ServiceTask', {
        id: 'ServiceTask_1'
      });

      // then
      expect(serviceTask.id).to.equal('ServiceTask_1');
      expect(moddle.ids.assigned(serviceTask.id)).to.equal(serviceTask);
    });


    it('should claim ids during object creation', function() {

      // given
      var moddle = Helper.createModdle();
      var ids = new Ids();

      IdSupport.extend(moddle, ids);

      // when
      var serviceTask = moddle.create('bpmn:ServiceTask', {
        id: 'ServiceTask_1'
      });

      // then
      expect(function() {

        moddle.create('bpmn:ServiceTask', {
          id: 'ServiceTask_1'
        });
      }).to.throw('id <ServiceTask_1> already used');
    });

  });

});