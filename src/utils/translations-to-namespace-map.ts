import { ExtractedTranslations } from '../types/extracted-translations.type'
import { ScannerConfig } from '../types/scanner-config.type'
import { ExtractedElement } from '../types/extracted-element.type'
import Logger from './logger'

const isDifferent = (value: string | undefined, checkValue: string) => {
  return !!value && value !== checkValue
}

const translationsToNamespaceMap = (entries: ExtractedElement[], config: ScannerConfig): ExtractedTranslations => {
  const namespaces: ExtractedTranslations = {}
  for (const entry of entries) {
    if (!namespaces[entry.ns]) {
      namespaces[entry.ns] = {}
    }
    const value = entry.default || config.defaultValue?.(entry) || ''
    if (entry.isPlural) {
      if (isDifferent(namespaces[entry.ns][`${entry.key}_one`], value)) {
        if (!!value) {
          Logger.warning(`Same key with different default value found: ${entry.ns}:${entry.key}`)
        }
      } else {
        namespaces[entry.ns][`${entry.key}_one`] = value
        namespaces[entry.ns][`${entry.key}_other`] = value
      }
    } else {
      if (isDifferent(namespaces[entry.ns][entry.key], value)) {
        if (!!value) {
          Logger.warning(`Same key with different default value found: ${entry.ns}:${entry.key}`)
        }
      } else {
        namespaces[entry.ns][entry.key] = value
      }
    }
  }
  return namespaces
}
export default translationsToNamespaceMap
