'use strict'

const { Parser } = require('xml2js');

exports.xmlParser = (options = {}) => {
  const parser = new Parser(options);

  return text => new Promise((resolve, reject) => parser.parseString(text, (err, xml) => {
    if (err) return reject(err);
    resolve(xml);
  }));
}
