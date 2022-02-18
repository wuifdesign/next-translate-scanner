import { ScannerConfig } from '../types/scanner-config.type'
import glob from 'glob'
import fs from 'fs'
import path from 'path'
import flattenObject from './flatten-object'
import { ExtractedTranslations } from '../types/extracted-translations.type'

const loadExistingTranslations = (config: ScannerConfig) => {
  const localeTranslations: Record<string, ExtractedTranslations> = {}
  for (const locale of config.locales) {
    localeTranslations[locale] = {}
    const item = config.output.replace('$LOCALE', locale).replace('$NAMESPACE', '*')
    for (const file of glob.sync(item)) {
      const ns = path.parse(file).name
      const data = fs.readFileSync(file, { encoding: 'utf8' })
      localeTranslations[locale][ns] = flattenObject(JSON.parse(data), config.keySeparator)
    }
  }
  return localeTranslations
}

export default loadExistingTranslations
