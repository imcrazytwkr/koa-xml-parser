# Koa XML Parser

## Installation

``` shell
$ yarn add koa-xml-parser
```

## Example

``` javascript
const Koa = require('koa');
const xmlParser = require('koa-xml-parser');

// Configuration object can be omitted, in this case default properties are used
const parseXML = xmlParser({
  limit: '1MB',           // Reject payloads larger than 1 MB
  encoding: 'UTF-8',      // Explicitly set UTF-8 encoding
  xml: {
    normalize: true,      // Trim whitespace inside text nodes
    normalizeTags: true,  // Transform tags to lowercase
    explicitArray: false  // Only put nodes in array if >1
  }
});

const app = new Koa();
app.use(parseXML);
```

This will parse any XML-based request and place it as an object on `context.req.body` and
`context.request.body` the same way most body parsers do.

An XML-based request is determined by the value of the `Content-Type` header. By default, any
`Content-Type` header ending in `/xml` or `+xml` is assumed to be XML and is parsed. For
example, the following headers will all match:

- `text/xml`
- `application/xml`
- `application/rss+xml`

If you need to match against a custom `Content-Type`, you can pass in the `type` property to a
configuration object.

## Configuration

As shown above, instead of relying on library defaults, you can pass custom configuration
options to the parser building function. `config` object has the following parameters:

- `type` - either a string or an array of strings representing content type(s) indicating
  that body should be parsed. Types must conform to a format of
  [type-is](https://github.com/jshttp/type-is) library.
- `encoding` - a string representing explicit request encoding. `UTF-8` by default.
- `limit` - a number or a string representing the request size limit. `1mb` by default.
- `xml` - an object containing configuration object for
  [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) library that is used to parse XML
  internally. You can refer to the library's
  [documentation](https://github.com/Leonidas-from-XIV/node-xml2js#options)
  for a full list of options with their corresponding possible values.

## Test

``` shell
$ yarn test
```

## License

[3-Clause BSD](https://github.com/imcrazytwkr/koa-xml-parser/blob/master/LICENSE)
