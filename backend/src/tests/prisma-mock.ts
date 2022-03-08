import { jest } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from '../server/database';

jest.mock('../server/database.ts', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  mockReset(prismaMock)
})

console.log("MOCKING");

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>