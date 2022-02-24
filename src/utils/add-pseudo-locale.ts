import { ExtractedTranslations } from '../types/extracted-translations.type'
import pseudoLocalization from 'pseudo-localization'
import Logger from './logger'

const addPseudoLocale = (translations: Record<string, ExtractedTranslations>, baseLocale: string, pseudoLocale: string) => {
  if (!translations[baseLocale]) {
    Logger.error(`Base locale "${baseLocale}" for pseudo locale generation not found.`)
  }

  translations[pseudoLocale] = {}
  for (const [ns, items] of Object.entries(translations[baseLocale])) {
    const temp: Record<string, string> = {}
    for (const [key, value] of Object.entries(items)) {
      let enabled = true
      const split = value.split('')
      temp[key] = split.map((char, index) => {
        if (char === '<' || (char + split[index + 1]) === '{{') {
          enabled = false
        } else if (char === '>' || (char + split[index + 1]) === '}}') {
          enabled = true
        }
        return enabled ? pseudoLocalization.localize(char) : char
      }).join('')
    }
    translations[pseudoLocale][ns] = temp
  }

  return translations
}

export default addPseudoLocale
