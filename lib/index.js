'use strict'

const { isString, parseTypes } = require('./utils.js');
const { text: parseText } = require('co-body');
const { xmlParser } = require('./xml.js');

module.exports = (options = {}) => {
  const types = parseTypes(options.type);
  delete options.type;

  const parse = xmlParser(options.xml);

  return async (context, next) => {
    if (context.request.is(types)) try {
      const text = await parseText(context, options);

      if (isString(text)) {
        context.req.body = await parse(text);
        context.request.body = context.req.body;
      }
    } catch (err) {
      context.throw(err.statusCode || 400, err.message);
    }

    return await next();
  }
}
