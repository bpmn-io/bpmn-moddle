'use strict';

var ID_PATTERN = /^(.*:)?id$/;

/**
 * Extends the bpmn instance with id support.
 *
 * @example
 *
 * var moddle, ids;
 *
 * require('id-support').extend(moddle, ids);
 *
 * moddle.ids.next(); // create a next id
 * moddle.ids; // ids instance
 *
 * // claims id as used
 * moddle.create('foo:Bar', { id: 'fooobar1' });
 *
 *
 * @param  {Moddle} model
 * @param  {Ids} ids
 *
 * @return {Moddle} the extended moddle instance
 */
module.exports.extend = function(model, ids) {

  var set = model.properties.set;

  // do not reinitialize setter
  // unless it is already initialized
  if (!model.ids) {

    model.properties.set = function(target, property, value) {

      // ensure we log used ids once they are assigned
      // to model elements
      if (ID_PATTERN.test(property)) {

        var assigned = model.ids.assigned(value);
        if (assigned && assigned !== target) {
          throw new Error('id <' + value + '> already used');
        }

        model.ids.claim(value, target);
      }

      set.call(this, target, property, value);
    };
  }

  model.ids = ids;

  return model;
};