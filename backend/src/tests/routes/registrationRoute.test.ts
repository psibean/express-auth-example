import { jest } from '@jest/globals';
import supertest from 'supertest';

import app from '../../server/app.js';

const requester = supertest(app);

let csrfToken: string | null;

it("Successfully generates a signup link", async() => {
  const temp = await requester.get('/');
  const setCookie = temp.get('set-cookie');
  for (const cookie of setCookie) {
    if (cookie.includes("XSRF-TOKEN")) {
      csrfToken = cookie.substring(cookie.indexOf("=") + 1, cookie.indexOf(";")).trim();
    }
  }
  return requester.post('/registration/signup/')
    .type('json')
    .set('x-csrf-token', csrfToken!)
    .send({ email: 'random@example.com' }).then(response => expect(response.status).toBe(200));
})