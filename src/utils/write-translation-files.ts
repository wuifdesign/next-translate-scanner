import fs from 'fs'
import path from 'path'
import { ScannerConfig } from '../types/scanner-config.type'
import Logger from './logger'
import { ExtractedTranslations } from '../types/extracted-translations.type'

const writeTranslationFiles = (translationsWithLocale: Record<string, ExtractedTranslations>, config: ScannerConfig) => {
  for (const [locale, translations] of Object.entries(translationsWithLocale)) {
    const outputPath = config.output.replace('$LOCALE', locale)
    for (const [ns, value] of Object.entries(translations)) {
      const filePath = outputPath.replace('$NAMESPACE', ns)
      try {
        fs.mkdirSync(path.dirname(filePath), { recursive: true })
        fs.writeFileSync(filePath, JSON.stringify(value, null, config.indentation))
        Logger.created(filePath)
      } catch (error) {
        Logger.error(`failed to create "${filePath}"`, true)
      }
    }
  }
}

export default writeTranslationFiles
