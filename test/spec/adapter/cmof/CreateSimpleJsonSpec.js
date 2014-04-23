var Builder = require('./Builder');


describe('moddle BPMN 2.0 json', function() {

  describe('generate simple model', function() {

    it('transform BPMN20.cmof', function(done) {

      var builder = new Builder();
      
      builder.parse('resources/bpmn/cmof/BPMN20.cmof', function(pkg, cmof) {
        
        builder.cleanIDs();
        
        // remove associations
        pkg.associations = [];

        pkg.alias = 'lowerCase';

        // perform a translation from
        // 
        // BaseElement
        //   - extensionValues = [ ExtensionAttributeValue#value = ... ]
        //   
        // to
        // 
        // BaseElement
        //   - extensionElements: ExtensionElements#values = [ ... ]
        //
        builder.alter('ExtensionAttributeValue#value', {
          name: 'values',
          isMany: true
        });

        builder.alter('BaseElement#extensionValues', function(p) {
          p.name = 'extensionElements';

          delete p.isMany;
        });

        builder.rename('extensionAttributeValue', 'extensionElements');

        builder.rename('extensionValues', 'extensionElements');

        builder.rename('ExtensionAttributeValue', 'ExtensionElements');


        // fix positioning of elements
        
        builder.alter('FlowElementsContainer', function(desc) {
          builder.swapProperties(desc, 'laneSets', 'flowElements');
        });

        builder.alter('FlowNode', function(desc) {
          builder.swapProperties(desc, 'targetRef', 'sourceRef');
          builder.swapProperties(desc, 'incoming', 'outgoing');
        });

        builder.alter('DataAssociation', function(desc) {
          builder.swapProperties(desc, 'targetRef', 'sourceRef');
        });

        builder.alter('Documentation#text', {
          isBody: true
        });

        builder.alter('ScriptTask#script', function(desc) {
          delete desc.isAttr;
        });

        builder.alter('ConditionalEventDefinition#condition', {
          serialize: 'xsi:type'
        });

        builder.alter('TextAnnotation#text', function(desc) {
          delete desc.isAttr;
        });

        builder.alter('DataAssociation#targetRef', function(desc) {
          delete desc.isAttr;
        });

        builder.alter('Lane#flowNodeRefs', {
          name: 'flowNodeRef'
        });

        builder.alter('Escalation', {
          superClass: [ 'RootElement' ]
        });

        builder.exportTo('resources/bpmn/json/bpmn.json');
      }, done);

    });


    it('transform BPMNDI.cmof', function(done) {

      var builder = new Builder();
      
      builder.parse('resources/bpmn/cmof/BPMNDI.cmof', function(pkg) {
        
        builder.cleanIDs();
        
        // remove associations
        pkg.associations = [];

        builder.exportTo('resources/bpmn/json/bpmndi.json');
      }, done);

    });


    it('transform DI.cmof', function(done) {

      var builder = new Builder();
      
      builder.parse('resources/bpmn/cmof/DI.cmof', function(pkg, cmof) {

        builder.cleanIDs();

        // remove associations
        pkg.associations = [];

        builder.alter('Edge#waypoint', {
          serialize: 'xsi:type'
        });

        builder.exportTo('resources/bpmn/json/di.json');
      }, done);

    });


    it('transform DC.cmof', function(done) {

      var builder = new Builder();
      
      builder.parse('resources/bpmn/cmof/DC.cmof', function(pkg, cmof) {

        builder.cleanIDs();
        
        // remove associations
        pkg.associations = [];

        builder.exportTo('resources/bpmn/json/dc.json');
      }, done);

    });

  });

});