const {
  findProperty,
  findType
} = require('./helper');

module.exports = async function(results) {
  const { elementsByType } = results;

  let model = elementsByType[ 'cmof:Package' ][ 0 ];

  model.xml = {
    tagAlias: 'lowerCase'
  };

  // remove associations
  model.associations = [];

  model.types.push({
    name: 'Extension',
    properties: [
      {
        name: 'values',
        isMany: true,
        type: 'Element'
      }
    ]
  });

  const diagramElement = findType('DiagramElement', model);

  diagramElement.properties.unshift({
    name: 'extension',
    type: 'Extension'
  });

  diagramElement.properties.unshift({
    name: 'id',
    isAttr: true,
    isId: true,
    type: 'String'
  });

  findType('Diagram', model).properties.unshift({
    name: 'id',
    isAttr: true,
    isId: true,
    type: 'String'
  });


  findType('Style', model).properties = [{
    name: 'id',
    isAttr: true,
    isId: true,
    type: 'String'
  }];

  findProperty('Edge#waypoint', model).xml = {
    serialize: 'xsi:type'
  };

  return model;
};