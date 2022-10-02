module.exports = async function(results) {
  const { elementsByType } = results;

  let model = elementsByType[ 'cmof:Package' ][ 0 ];

  // remove associations
  model.associations = [];

  return model;
};