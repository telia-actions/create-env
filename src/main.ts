import { getInput, info, setFailed } from '@actions/core'
import dedent from 'dedent'
import * as fs from 'fs'

const ENV_PREFIX = 'ACTION_CREATE_ENV_'

export interface Args {
  full_text: string
  directory: string
  include_env_vars: boolean
}

function getTextForEnvFile(args: Args) {
  let text = dedent(args.full_text).trim()
  if (args.include_env_vars) {
    const envVars = Object.entries(process.env)
      .filter(([key]) => key.startsWith(ENV_PREFIX))
      .map(([key, val]) => {
        const newKey = key.replace(new RegExp(`^${ENV_PREFIX}`), '')
        return `${newKey}=${val}`
      })
    text += `\n${envVars.join('\n')}`
  }
  return text.trim()
}

function validateArgs(args: Args) {
  if (!fs.existsSync(args.directory)) {
    throw new Error(`Invalid directory input: ${args.directory} doesn't exist.`)
  }
  if (!fs.statSync(args.directory).isDirectory()) {
    throw new Error(`Invalid directory input: ${args.directory} is not a directory.`)
  }
}

export async function writeToEnvFile(args: Args): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    validateArgs(args)
    const filePath = `${args.directory}/.env`
    const text = getTextForEnvFile(args)
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
      directory: getInput('directory'),
      include_env_vars: !!getInput('include_env_vars')
    }
    info(`Creating .env file in ${args.directory}`)
    await writeToEnvFile(args)
    info('Done.')
  } catch (error) {
    setFailed(error.message)
  }
}

run()
