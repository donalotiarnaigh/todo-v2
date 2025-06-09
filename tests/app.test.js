const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('responds with status 200', async () => {
    await request(app).get('/').expect(200);
  });
});
