import { ScannerConfig } from '../src/types/scanner-config.type'

const testConfig: ScannerConfig = {
  input: [],
  locales: ['en', 'de'],
  pseudoLocale: null,

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

export default testConfig
