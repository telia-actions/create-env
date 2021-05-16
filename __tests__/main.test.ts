import { Args, writeEnv } from '../src/main'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import * as fs from 'fs'

const ARTIFACTS_PATH = path.join(__dirname, 'artifacts')

beforeEach(() => fs.mkdirSync(ARTIFACTS_PATH))
afterEach(() => fs.rmSync(ARTIFACTS_PATH, { recursive: true, force: true }))

test('throws if <directory> is not found', async () => {
  const args: Args = {
    directory: `${ARTIFACTS_PATH}/this_dir_does_not_exist`,
    full_text: ''
  }
  await expect(writeEnv(args))
    .rejects
    .toThrow(`Invalid directory input: ${args.directory} doesn't exist.`)
})

test('throws if <directory> is not a directory', async () => {
  const args: Args = {
    directory: `${ARTIFACTS_PATH}/file`,
    full_text: ''
  }
  fs.writeFileSync(args.directory, '')
  await expect(writeEnv(args))
    .rejects
    .toThrow(`Invalid directory input: ${args.directory} is not a directory.`)
})

test('creates .env', async () => {
  const args: Args = {
    directory: ARTIFACTS_PATH,
    full_text: `
    PROD=0
    TEST=1\n
    `
  }
  await writeEnv(args)
  const content = fs.readFileSync(`${args.directory}/.env`).toString()
  expect(content).toEqual('PROD=0\nTEST=1')
})

test('overwrites .env', async () => {
  const initialText = `
  PROD=0
  TEST=1
  `
  const args: Args = {
    directory: ARTIFACTS_PATH,
    full_text: `
    PROD=0
    `
  }
  const filePath = `${args.directory}/.env`
  fs.writeFileSync(filePath, initialText)
  await writeEnv(args)
  const content = fs.readFileSync(filePath).toString()
  expect(content).toEqual('PROD=0')
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_FULL_TEXT'] = 'PROD=0'
  process.env['INPUT_DIRECTORY'] = ARTIFACTS_PATH
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
