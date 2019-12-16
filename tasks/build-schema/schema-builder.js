const {
  assign,
  find,
  forEach,
  isFunction,
  matchPattern
} = require('min-dash');

const CmofParser = require('cmof-parser');


module.exports = function SchemaBuilder(cmofPath) {

  let desc;

  const hooks = {
    afterParsed: [],
    preSerialize: []
  };

  function getPackage() {
    const elementsById = desc.byId;
    return elementsById['_0'];
  }

  function findProperty(properties, name) {
    const property = find(properties, function(d) {
      return d.name === name;
    });

    return property && {
      property: property,
      idx: properties.indexOf(property)
    };
  }

  function reorderProperties(desc, propertyNames) {
    const properties = desc.properties;

    let last;

    forEach(propertyNames, function(name) {

      const descriptor = findProperty(properties, name);

      if (!descriptor) {
        throw new Error('property <' + name + '> does not exist');
      }

      if (last) {
        // remove from old position
        properties.splice(descriptor.idx, 1);

        // update descriptor position
        descriptor.idx = last.idx + 1;

        // add at new position
        properties.splice(descriptor.idx, 0, descriptor.property);
      }

      last = descriptor;
    });
  }

  function swapProperties(desc, prop1, prop2) {
    const props = desc.properties;

    function findProperty(name) {
      return find(props, matchPattern({ name }));
    }

    const p1 = findProperty(prop1);
    const p2 = findProperty(prop2);

    const idx1 = props.indexOf(p1);
    const idx2 = props.indexOf(p2);

    props[idx1] = p2;
    props[idx2] = p1;
  }

  async function build() {

    const descriptors = await parse(cmofPath);

    desc = descriptors;

    let pkg = getPackage();

    hooks.afterParsed.forEach(hook => {
      hook(pkg);
    });

    let schema = JSON.stringify(pkg, null, '  ');

    schema = hooks.preSerialize.reduce((prev, hook) => {
      return hook(prev);
    }, schema);

    return schema;
  }

  function preSerialize(fn) {
    hooks.preSerialize.push(fn);
  }

  function afterParsed(fn) {
    hooks.afterParsed.push(fn);
  }

  function rename(oldType, newType) {
    preSerialize(function(str) {
      return str.replace(new RegExp(oldType, 'g'), newType);
    });
  }

  function alter(elementName, extensionOrExtender) {

    afterParsed(() => {
      const elementParts = elementName.split('#');

      const elementsById = desc.byId;

      const element = elementsById[elementParts[0]];

      if (!element) {
        throw new Error('[transform] element <' + elementParts[0] + '> does not exist');
      }

      if (elementParts[1]) {
        const property = find(element.properties, matchPattern({
          name: elementParts[1]
        }));

        if (!property) {
          throw new Error('[transform] property <' + elementParts[0] + '#' + elementParts[1] + '> does not exist');
        }

        if (isFunction(extensionOrExtender)) {
          extensionOrExtender.call(element, property);
        } else {
          assign(property, extensionOrExtender);
        }
      } else {
        if (isFunction(extensionOrExtender)) {
          extensionOrExtender.call(element, element);
        } else {
          assign(element, extensionOrExtender);
        }
      }
    });

  }

  function cleanIDs() {

    preSerialize(function(str) {

      // remove "id": "Something" lines
      return str.replace(/,\n\s+"id": "[^"]+"/g, '');
    });
  }

  function cleanAssociations() {

    preSerialize(function(str) {

      // remove "association": "Something" lines
      return str.replace(/,\n\s+"association": "[^"]+"/g, '');
    });
  }

  function parse(cmof) {

    return new Promise((resolve, reject) => {

      const parser = new CmofParser({ clean: true });

      parser.parseFile(cmof, function(err, desc) {
        if (err) {
          return reject(err);
        }

        resolve(desc);
      });
    });

  }

  this.afterParsed = afterParsed;

  this.alter = alter;
  this.rename = rename;
  this.reorderProperties = reorderProperties;
  this.swapProperties = swapProperties;

  this.cleanIDs = cleanIDs;
  this.cleanAssociations = cleanAssociations;

  this.build = build;
};
