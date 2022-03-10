// @ts-check
import { dirname, join } from 'path';
import util from 'util';
import NodeEnvironment from 'jest-environment-node';
import type { Config } from '@jest/types';
import { exec as childProcessExec } from 'child_process';
import { fileURLToPath } from 'url';

const exec = util.promisify(childProcessExec)

const prismaBinary = join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  'prisma',
)

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config: Config.ProjectConfig) {
    super(config)

    // Generate a unique sqlite identifier for this test context
    process.env.TEST_DATABASE_URL = process.env.TEST_URL;
    this.global.process.env.TEST_DATABASE_URL = process.env.TEST_URL
  }

  async setup() {
    // Run the migrations to ensure our schema has the required structure
    await exec(`${prismaBinary} migrate reset --force`)
    return super.setup()
  }
}

export default PrismaTestEnvironment