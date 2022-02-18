import chalk from 'chalk'
import { program } from 'commander'

class LoggerClass {
  _warnings: string[] = []
  _silent = false

  setSilent(silent: boolean) {
    this._silent = silent
  }

  info(message: string = '') {
    if (!this._silent) {
      console.log(chalk.cyan(`  ${message}`))
    }
  }

  error(message: string, exitProgram = false) {
    if (exitProgram) {
      program.error(chalk.red(`  [error]  ${message}`))
    } else {
      if (!this._silent) {
        console.log(chalk.red(`  [error]  ${message}`))
      }
    }
  }

  warning(message: string) {
    this._warnings.push(message)
    if (!this._silent) {
      console.log(chalk.yellow(`  [warning]  ${message}`))
    }
  }

  created(message: string) {
    if (!this._silent) {
      console.log(chalk.green(`  [created]  ${message}`))
    }
  }

  resetWarnings() {
    this._warnings = []
  }

  getWarnings() {
    return this._warnings
  }

  getWarningCount() {
    return this._warnings.length
  }
}

const Logger = new LoggerClass()

export default Logger
