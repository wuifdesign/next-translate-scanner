import { ScannerConfig } from '../types/scanner-config.type'
import Logger from './logger'
import { program } from 'commander'
import path from 'path'
import chalk from 'chalk'

const getMergedConfig = () => {
  let config: ScannerConfig = {
    input: [],
    locales: ['en'],

    keySeparator: '.',
    nsSeparator: ':',
    defaultNS: undefined,

    sort: true,
    keepRemoved: true,
    output: './locales/$LOCALE/$NAMESPACE.json',
    defaultValue: () => null,
    indentation: 2,
    replaceDefaults: false,
    failOnWarnings: false
  }
  Logger.setSilent(program.opts().silent)

  try {
    config = {
      ...config,
      ...require(path.resolve(program.opts().config))
    }
  } catch (err: any) {
    if (err.code === 'MODULE_NOT_FOUND') {
      program.error(chalk.red(`Config file does not exist: ${program.opts().config}`))
    } else {
      throw err
    }
  }

  config.output = program.opts().output || config.output

  const args = program.args || []
  let inputs: string[] = []

  // prefer globs specified in the cli
  if (args.length) {
    inputs = args
  } else if (config.input) {
    if (!Array.isArray(config.input)) {
      if (typeof config.input === 'string') {
        config.input = [config.input]
      } else {
        Logger.error(`'input' must be an array when specified in the config`, true)
      }
    }
    inputs = config.input
  }

  if (!inputs.length) {
    Logger.error(`no file paths specified`, true)
  }

  return { config, inputs }
}

export default getMergedConfig
