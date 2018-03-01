'use strict'

const Koa = require('koa');
const request = require('supertest');
const xmlParser = require('../lib/index.js');

function createServer(options) {
  const app = new Koa();
  app.use(xmlParser(options));
  app.use(async context => {
    if (context.request.method !== 'POST') context.throw(405, 'Method Not Allowed');
    context.response.status = 200;
    context.response.body = context.request.body;
  });

  return app;
}

const BOB_RAW_SANITIZED = '<customer><name>Bob</name></customer>';
const BOB_EXPLICIT = {
  customer: { name: ['Bob'] }
}

describe('XML Body Parser', () => {
  it('should parse a body with content-type application/xml', () => {
    const app = createServer().listen(3001);

    return request(app).post('/')
      .set('Content-Type', 'application/xml')
      .send(BOB_RAW_SANITIZED)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(BOB_EXPLICIT);

        app.close();
      });
  });

  it('should parse a body with content-type text/xml', () => {
    const app = createServer().listen(3002);

    return request(app).post('/')
      .set('Content-Type', 'text/xml')
      .send(BOB_RAW_SANITIZED)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(BOB_EXPLICIT);

        app.close();
      });
  });

  it('should parse a body with content-type application/rss+xml', () => {
    const app = createServer().listen(3003);

    return request(app).post('/')
      .set('Content-Type', 'application/rss+xml')
      .send(BOB_RAW_SANITIZED)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(BOB_EXPLICIT);

        app.close();
      });
  });

  it('should accept xml options', () => {
    const app = createServer({
      xml: {
        normalize: true,     // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
      }
    }).listen(3004);

    return request(app).post('/')
      .set('Content-Type', 'text/xml')
      .send(BOB_RAW_SANITIZED)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          customer: { name: 'Bob' }
        });

        app.close();
      });
  });

  it('should accept custom ContentType as array', () => {
    const app = createServer({
      type: ['application/custom-xml-type']
    }).listen(3005);

    return request(app).post('/')
      .set('Content-Type', 'application/custom-xml-type')
      .send(BOB_RAW_SANITIZED)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(BOB_EXPLICIT);

        app.close();
      });
  });

  it('should accept custom ContentType as string', () => {
    const app = createServer({
      type: 'application/custom-xml-type'
    }).listen(3006);

    return request(app).post('/')
      .set('Content-Type', 'application/custom-xml-type')
      .send(BOB_RAW_SANITIZED)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(BOB_EXPLICIT);

        app.close();
      });
  });

  it('should ignore non-XML', () => {
    const app = createServer().listen(3007);

    return request(app).post('/')
      .set('Content-Type', 'text/plain')
      .send('Customer name: Bob')
      .then(response => {
        expect(response.statusCode).toBe(204);
        app.close();
      });
  });

  it('should reject invalid XML', () => {
    const app = createServer().listen(3008);

    return request(app).post('/')
      .set('Content-Type', 'text/xml')
      .send('<invalid-xml>')
      .then(response => {
        expect(response.statusCode).toBe(400);
        app.close();
      });
  });
});
