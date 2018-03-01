'use strict'

const isString = object => (typeof object === 'string');
exports.isString = isString;

const notString = object => !isString(object);

exports.parseTypes = (types = ['*/xml', '+xml']) => {
  if (!Array.isArray(types)) types = [ types ];
  if (types.some(notString)) throw new TypeError('Invalid request accept type format');
  return types;
}
