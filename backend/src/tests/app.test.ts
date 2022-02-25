import { jest } from '@jest/globals';
import supertest from 'supertest';

import app from '../server/app.js';

import { MockContext, Context, createMockContext } from './context'

let mockCtx: MockContext
let ctx: Context

beforeEach(() => {
  mockCtx = createMockContext()
  ctx = mockCtx as unknown as Context
})

const requester = supertest(app);

it("Successfully loads rooot", async () => {
  const response = await requester.get('/');
  expect(response.status).toBe(200);
  expect(response.text).toBe("Hello World");
})

