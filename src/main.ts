import { getInput, info, setFailed } from '@actions/core'
import dedent from 'dedent'
import * as fs from 'fs'

export interface Args {
  full_text: string
  directory: string
}

export async function writeEnv(args: Args): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (!fs.existsSync(args.directory)) {
      throw new Error(`Invalid directory input: ${args.directory} doesn't exist.`)
    }
    if (!fs.statSync(args.directory).isDirectory()) {
      throw new Error(`Invalid directory input: ${args.directory} is not a directory.`)
    }
    const filePath = `${args.directory}/.env`
    const text = dedent(args.full_text).trim()
    fs.writeFile(filePath, text, err => {
      if (err) return reject(err)
      resolve()
    })
  })
}

export async function run(): Promise<void> {
  try {
    const args: Args = {
      full_text: getInput('full_text'),
      directory: getInput('directory')
    }
    info(`Creating .env file in ${args.directory}`)
    await writeEnv(args)
    info('Done.')
  } catch (error) {
    setFailed(error.message)
  }
}

run()
