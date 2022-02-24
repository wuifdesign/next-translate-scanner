import { ExtractedElement } from './extracted-element.type'

export type ScannerConfig = {
  input: string[] | string
  output: string
  locales: string[]
  pseudoLocale: null | {
    locale: string
    baseLocale: string
  }

  keySeparator: string
  nsSeparator: string
  defaultNS?: string

  sort: boolean
  keepRemoved: boolean
  defaultValue: (data: ExtractedElement) => string | null | undefined
  indentation: number
  replaceDefaults: boolean
  failOnWarnings: boolean
}
