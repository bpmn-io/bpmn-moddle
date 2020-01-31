'use strict';

const {
  isArray,
  isObject,
  matchPattern
} = require('min-dash');

const sax = require('sax');

const Stack = require('tiny-stack');

/**
 * Recursively find children in tree that match pattern.
 *
 * @param {Object} parent
 * @param {Function} pattern
 *
 * @returns {Array|null}
 */
function findChildren(parent, pattern) {
  const { children } = parent;

  if (!children) {
    return null;
  }

  const result = children.reduce((result, child) => {
    if (pattern(child)) {
      result = [
        ...result,
        child
      ];
    }

    if (child.children) {
      result = [
        ...result,
        ...(findChildren(child, pattern) || [])
      ];
    }

    return result;
  }, []);

  if (!result.length) {
    return null;
  }

  return result;
}

module.exports.findChildren = findChildren;

/**
 * Find type with specified name in schema.
 *
 * @param {String} type
 * @param {Object} schema
 *
 * @returns {Object}
 */
function findType(type, schema) {
  return schema.types.find(({ name }) => name === type);
}

module.exports.findType = findType;

/**
 * Find property with specified name in schema.
 *
 * @param {String} typeProperty
 * @param {Object} schema
 *
 * @returns {Object}
 */
function findProperty(typeProperty, schema) {
  const [ type, property ] = typeProperty.split('#');

  return findType(type, schema).properties.find(({ name }) => name === property);
}

module.exports.findProperty = findProperty;


/**
* Fix order of properties according to <sequence> indicators specified in XSD.
*
* Example:
*
* <xsd:complexType name="tDecisionRule">
*   <xsd:complexContent>
*     <xsd:extension base="tDMNElement">
*       <xsd:sequence>
*         <xsd:element name="inputEntry" />
*         <xsd:element name="outputEntry" />
*         ...
*       </xsd:sequence>
*     </xsd:extension>
*   </xsd:complexContent>
* </xsd:complexType>
*
* specifies that inputEntry elements must appear before outputEntry elements.
*
* @param {Object} model
* @param {Object} parsedXSD
*
* @returns {Object}
*/
function fixSequence(model, parsedXSD) {
  const { elementsByTagName } = parsedXSD,
        xsdSchema = elementsByTagName[ 'xsd:schema' ][ 0 ];

  const xsdComplexTypes = findChildren(xsdSchema, matchPattern({ tagName: 'xsd:complexType' }));

  if (!xsdComplexTypes) {
    return;
  }

  xsdComplexTypes.forEach(xsdComplexType => {

    // (1) find sequences
    const xsdSequences = findChildren(xsdComplexType, matchPattern({ tagName: 'xsd:sequence' }));

    if (!xsdSequences) {
      return;
    }

    const xsdSequence = xsdSequences[ 0 ];

    // (2) find elements in sequence
    const xsdElements = findChildren(xsdSequence, matchPattern({ tagName: 'xsd:element' }));

    if (!xsdElements) {
      return;
    }

    // (3) find corresponding type
    const type = model.types.find(matchPattern({ name: xsdComplexType.name.slice(1) }));

    if (!type) {
      return;
    }

    // (4) fix sequence of type properties
    type.properties = type.properties
      .map(property => {

        // (4.1) find corresponding element
        const xsdElement = xsdElements.find(({ name, ref }) => name === property.name || ref === property.name);

        if (xsdElement) {

          // (4.1.1) return index of found corresponding element
          return {
            index: xsdElements.indexOf(xsdElement),
            name: property.name
          };
        } else {

          // (4.1.2) find substitute
          const matcher = matchPattern({
            tagName: 'xsd:element',
            type: `t${ property.type }`
          });

          const substitutes = findChildren(xsdSchema, child => {
            return matcher(child) && child.substitutionGroup;
          });

          if (substitutes) {
            const substitute = substitutes[ 0 ];

            // (4.1.3) find substitutable
            const substitutable = xsdElements.find(matchPattern({ ref: substitute.substitutionGroup }));

            if (substitutable) {
              const index = xsdElements.indexOf(substitutable);

              // (4.1.4) return index of found substitutable
              return {
                substituteFor: substitutable.ref,
                index,
                name: property.name
              };
            }
          }
        }

        // (4.2) return maximum index if index not specified in sequence
        return {
          index: type.properties.length - 1,
          name: property.name
        };
      })
      .sort((a, b) => {
        return a.index - b.index;
      })
      .map(({ name }) => {
        return type.properties.find(matchPattern({ name }));
      });
  });

  return model;
}

module.exports.fixSequence = fixSequence;

/**
 * Order properties of type.
 *
 * @param {string} typeName
 * @param {Array<string>} propertiesOrder
 * @param {Object} schema
 *
 * @returns {Object}
 */
function orderProperties(typeName, propertiesOrder, schema) {
  const type = findType(typeName, schema);

  const { properties } = type;

  propertiesOrder.reverse().forEach(propertyName => {
    const index = properties.indexOf(
      properties.find(matchPattern({ name: propertyName }))
    );

    properties.unshift(properties.splice(index, 1).pop());
  });

  return schema;
}

module.exports.orderProperties = orderProperties;

/**
 * Parse XML tag.
 *
 * @param {Object} tag
 * @param {Object} parent
 * @param {Object} context
 * @param {Object} context.elementsByName
 * @param {Object} context.elementsByTagName
 *
 * @returns {Object}
 */
function parseTag(tag, parent, context) {
  const {
    attributes,
    name: tagName
  } = tag;

  const { name } = attributes;

  const {
    elementsByName,
    elementsByTagName
  } = context;

  const element = {
    tagName
  };

  Object.entries(attributes).forEach(([ key, value ]) => {
    if (value === 'true') {
      value = true;
    }

    if (value === 'false') {
      value = false;
    }

    element[ key ] = value;
  });

  if (name) {
    elementsByName[ name ] = element;
  }

  if (!elementsByTagName[ tagName ]) {
    elementsByTagName[ tagName ] = [];
  }

  elementsByTagName[ tagName ].push(element);

  if (parent) {
    if (!parent.children) {
      parent.children = [];
    }

    parent.children.push(element);
  }

  return element;
}

async function parseXML(file) {
  return new Promise((resolve, reject) => {
    const elementsByName = {},
          elementsByTagName = {};

    const context = {
      elementsByName,
      elementsByTagName
    };

    const stack = new Stack();

    const saxParser = sax.parser(true);

    saxParser.onerror = function(err) {
      console.error('error', err);

      this._parser.error = null;
      this._parser.resume();

      reject(err);
    };

    saxParser.onopentag = tag => {
      const parent = stack.peek();

      stack.push(parseTag(tag, parent, context));
    };

    saxParser.onclosetag = name => {
      stack.pop();
    };

    saxParser.onend = () => {
      resolve(context);
    };

    saxParser.write(file).close();
  });
}

module.exports.parseXML = parseXML;

/**
 * Remove prefixes from all type names.
 *
 * @param {Object} model
 * @param {Array<string>|string} prefixes
 *
 * @returns {Object}
 */
function removePrefixes(model, prefixes) {
  if (prefixes && !isArray(prefixes)) {
    prefixes = [ prefixes ];
  }

  model.types.forEach(type => {
    type.name = withoutPrefixes(type.name, prefixes);

    if (type.superClass) {
      type.superClass = type.superClass.map(superClass => {
        return withoutPrefixes(superClass, prefixes);
      });
    }

    if (type.properties) {
      type.properties.forEach(property => {
        property.type = withoutPrefixes(property.type, prefixes);
      });
    }
  });

  model.enumerations.forEach(enumeration => {
    enumeration.name = withoutPrefixes(enumeration.name, prefixes);
  });

  return model;
}

module.exports.removePrefixes = removePrefixes;

/**
 * Remove whitespace from all property names.
 *
 * @param {Object} model
 *
 * @returns {Object}
 */
function removeWhitespace(model) {
  model.types.forEach(({ properties }) => {
    if (!properties) {
      return;
    }

    properties.forEach(property => {
      property.name = property.name.replace(/\s/, '');
    });
  });

  return model;
}

module.exports.removeWhitespace = removeWhitespace;

/**
 * Replace all occurrences of key in object.
 *
 * @param {*} key
 * @param {*} newKey
 * @param {Object} object
 */
function replaceKey(key, newKey, object) {

  // (1) iterate object keys
  Object.entries(object).forEach(entry => {

    if (isArray[ entry[ 1 ]]) {

      // (2.1) recurse
      entry[ 1 ].forEach(item => replaceKey(key, newKey, item));
    }

    if (isObject(entry[ 1 ])) {

      // (2.2) recurse
      replaceKey(key, newKey, entry[ 1 ]);
    }

    if (entry[ 0 ] === key) {

      // (3) replace key
      object[ newKey ] = entry[ 1 ];

      delete object[ key ];
    }
  });
}

module.exports.replaceKey = replaceKey;

/**
 * Replace all occurrences of value in object.
 *
 * @param {*} value
 * @param {*} newValue
 * @param {Object} object
 */
function replaceValue(value, newValue, object) {

  // (1) iterate object values
  Object.entries(object).forEach(entry => {
    if (entry[ 1 ] === value) {

      // (2) replace value
      object[ entry[ 0 ] ] = newValue;
    } else if (isArray(entry[1])) {

      // (3.1) recurse
      entry[ 1 ].forEach(item => replaceValue(value, newValue, item));
    } else if (isObject(entry[ 1 ])) {

      // (3.2) recurse
      replaceValue(value, newValue, entry[ 1 ]);
    }
  });
}

module.exports.replaceValue = replaceValue;

/**
 * Swap properties.
 *
 * @param {string} typePropertyA
 * @param {string} typePropertyB
 * @param {Object} schema
 *
 * @returns {Object}
 */
function swapProperties(typePropertyA, typePropertyB, schema) {
  const typeA = findType(typePropertyA.split('#').shift(), schema),
        typeB = findType(typePropertyB.split('#').shift(), schema);

  typePropertyA = findProperty(typePropertyA, schema);
  typePropertyB = findProperty(typePropertyB, schema);

  const indexOfA = typeA.properties.indexOf(typePropertyA),
        indexOfB = typeB.properties.indexOf(typePropertyB);

  typeA.properties[ indexOfA ] = typePropertyB;
  typeB.properties[ indexOfB ] = typePropertyA;

  return schema;
}

module.exports.swapProperties = swapProperties;

/**
 * Remove specified prefixes from type.
 *
 * @param {string} prefixType
 * @param {Array<string>} prefixes
 *
 * @returns {string}
 */
function withoutPrefixes(prefixType, prefixes) {
  let [ prefix, type ] = prefixType.split(':');

  if (!type) {
    return prefix;
  }

  if (prefixes && prefixes.includes(prefix)) {
    return type;
  }

  return prefixType;
}