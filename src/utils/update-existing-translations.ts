import { ScannerConfig } from '../types/scanner-config.type'
import { ExtractedTranslations } from '../types/extracted-translations.type'
import keyWithoutPlural from './key-without-plural'
import isPluralKey from './is-plural-key'
import orderObjectByKey from './order-object-by-key'
import getPluralKeys from './get-plural-keys'

const updateExistingTranslations = (newTranslations: ExtractedTranslations, existingTranslations: Record<string, ExtractedTranslations>, config: ScannerConfig) => {
  const mergedTranslations: Record<string, ExtractedTranslations> = {}
  let namespaces = [...new Set([...Object.keys(newTranslations)])]
  for (const locale of config.locales) {
    namespaces = [...namespaces, ...Object.keys(existingTranslations[locale])]
  }
  namespaces = [...new Set(namespaces)]
  namespaces.sort()

  for (const locale of config.locales) {
    mergedTranslations[locale] = {}
    for (const namespace of namespaces) {
      const existingTransForNamespace = existingTranslations[locale]?.[namespace] || {}
      let temp = { ...newTranslations[namespace] }
      if (existingTranslations[locale]?.[namespace]) {
        for (const [existingKey, existingTranslation] of Object.entries(existingTransForNamespace)) {
          if (!!existingTranslation) {
            let newTrans = existingTranslation
            if (config.replaceDefaults) {
              newTrans = temp[existingKey] || existingTranslation
              if (isPluralKey(existingKey)) {
                const noPluralKey = keyWithoutPlural(existingKey)
                if (temp[`${noPluralKey}_other`] && (!existingKey.endsWith('_one') && !existingKey.endsWith('_other'))) {
                  continue
                }
              }
            }
            temp[existingKey] = newTrans
          }
        }
      }
      if (config.sort) {
        temp = orderObjectByKey(temp)
      }
      if (!config.keepRemoved) {
        let filtered: Record<string, string> = {}
        for (const [key] of Object.entries(newTranslations[namespace] || {})) {
          if (isPluralKey(key)) {
            if (key.endsWith('_other')) {
              const noPluralKey = keyWithoutPlural(key)
              for (const pluralKey of getPluralKeys(noPluralKey)) {
                if (temp[pluralKey] !== undefined) {
                  filtered[pluralKey] = temp[pluralKey]
                }
              }
            }

          } else {
            filtered[key] = temp[key]
          }

        }
        temp = filtered
      }
      if (Object.keys(temp).length) {
        mergedTranslations[locale][namespace] = temp
      }

    }
  }

  return mergedTranslations
}

export default updateExistingTranslations
