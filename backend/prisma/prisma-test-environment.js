// @ts-check
import path, { dirname } from 'path';
import fs from 'fs';
import util from 'util';
import NodeEnvironment from 'jest-environment-node';
import { v4 as uuidv4 } from 'uuid';
import { exec as childProcessExec } from 'child_process';
import { fileURLToPath } from 'url';

const exec = util.promisify(childProcessExec)
const __dirname = fileURLToPath(dirname(import.meta.url));

const prismaBinary = path.join(
  __dirname,
  '..',
  'node_modules',
  '.bin',
  'prisma',
)

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)

    // Generate a unique sqlite identifier for this test context
    this.dbName = `test_${uuidv4()}.db`
    process.env.DB_URL = `file:${this.dbName}`
    this.global.process.env.DB_URL = `file:${this.dbName}`
    this.dbPath = path.join(__dirname, this.dbName)
  }

  async setup() {
    // Run the migrations to ensure our schema has the required structure
    await exec(`${prismaBinary} db push  `)
    return super.setup()
  }

  async teardown() {
    try {
      await fs.promises.unlink(this.dbPath)
    } catch (error) {
      // doesn't matter as the environment is torn down
    }
  }
}

export default PrismaTestEnvironment