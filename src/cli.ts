#!/usr/bin/env node

import glob from 'glob'
import { program } from 'commander'
import Logger from './utils/logger'
import extractTranslations from './utils/extract-translations'
import translationsToNamespaceMap from './utils/translations-to-namespace-map'
import getConfig from './utils/get-config'
import updateExistingTranslations from './utils/update-existing-translations'
import loadExistingTranslations from './utils/load-existing-translations'
import unFlattenObject from './utils/un-flatten-object'
import rimraf from 'rimraf'
import writeTranslationFiles from './utils/write-translation-files'

const pkg = require('../package.json')

program
  .version(pkg.version)
  .usage('[options] <file ...>')
  .option('-s, --silent', 'Disable logging to stdout')
  .option('--config <config>', 'Path to the config file (default: next-translate-scanner.config.js)', 'next-translate-scanner.config.js')

program.parse(process.argv)
Logger.setSilent(program.opts().silent)

program.on('--help', function () {
  Logger.info()
  Logger.info('Examples:')
  Logger.info('  $ next-translate-scanner "src/**/*.{js,jsx,ts,tsx}"')
  Logger.info('  $ next-translate-scanner --config custom-scanner.config.js')
})

const { config, inputs } = getConfig()
const mapYesNo = (condition: boolean) => condition ? 'yes' : 'no'

Logger.info()
Logger.info(`next-translate Scanner`)
Logger.info(`--------------`)
Logger.info(`Input:           ${inputs.join(', ')}`)
Logger.info(`Output:          ${config.output}`)
Logger.info(`Locales:         [${config.locales.join(', ')}]`)
Logger.info()
Logger.info(`KeepRemoved:     ${mapYesNo(config.keepRemoved)}`)
Logger.info(`ReplaceDefaults: ${mapYesNo(config.replaceDefaults)}`)
Logger.info(`FailOnWarnings:  ${mapYesNo(config.failOnWarnings)}`)
Logger.info()

let allFiles: string[] = []
for (const item of inputs) {
  allFiles = [
    ...allFiles,
    ...glob.sync(item)
  ]
}

const extractedTranslations = extractTranslations(allFiles, config)
const translationsWithNamespace = translationsToNamespaceMap(extractedTranslations, config)

if (config.failOnWarnings && Logger.getWarningCount() > 0) {
  Logger.error(`${Logger.getWarningCount()} warnings encountered`, true)
}

const existingTranslations = loadExistingTranslations(config)
const mergedTranslations = updateExistingTranslations(translationsWithNamespace, existingTranslations, config)

if (!!config.keySeparator) {
  for (const [locale, namespaces] of Object.entries(mergedTranslations)) {
    for (const [namespace, translations] of Object.entries(namespaces)) {
      mergedTranslations[locale][namespace] = unFlattenObject(translations, config.keySeparator)
    }
  }
}

if (!config.keepRemoved) {
  const removePattern = config.output.replace('$LOCALE', '*').replace('$NAMESPACE', '*')
  rimraf.sync(removePattern)
}

writeTranslationFiles(mergedTranslations, config)



