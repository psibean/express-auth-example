import { jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client'
import supertest from 'supertest';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import app from '../server/app.js';

const requester = supertest(app);

it("Successfully loads root", async () => {
  const response = await requester.get('/');
  expect(response.status).toBe(200);
  expect(response.text).toBe("Hello World");
})

