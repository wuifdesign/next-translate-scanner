import Logger from './logger'
import translationsToNamespaceMap from './translations-to-namespace-map'
import testConfig from '../../_test-files/test-config'

describe('translationsToNamespaceMap', () => {
  beforeEach(() => {
    Logger.setSilent(true)
    Logger.resetWarnings()
  })

  it('should extract translations', () => {
    expect(translationsToNamespaceMap([
      { key: 'example', ns: 'common' },
      { key: 'example', ns: 'ns2', default: 'This is an example.' },
      { key: 'example', ns: 'ns2' },
      { key: 'pluralExample', options: { count: 3 }, isPlural: true, ns: 'common' }
    ], testConfig)).toEqual({
      common: { 'example': '', 'pluralExample_one': '', 'pluralExample_other': '' },
      ns2: { 'example': 'This is an example.' }
    })
    expect(Logger.getWarningCount()).toBe(0)
  })

  it('should extract translations with nested key', () => {
    expect(translationsToNamespaceMap([
      { key: 'example.test.name', ns: 'common' }
    ], testConfig)).toEqual({
      common: { 'example.test.name': '' }
    })
  })

  it('should prefer translations with default', () => {
    expect(translationsToNamespaceMap([
      { key: 'example', ns: 'common' },
      { key: 'example', ns: 'common', default: 'Value 1' },
      { key: 'example', ns: 'common', default: 'Value 2' },
      { key: 'example', ns: 'common', default: '' },
      { key: 'example', ns: 'ns2', options: { count: 3 }, isPlural: true, default: '' },
      { key: 'example', ns: 'ns2', options: { count: 3 }, isPlural: true, default: 'Value 1' },
      { key: 'example', ns: 'ns2', options: { count: 3 }, isPlural: true, default: 'Value 2' },
      { key: 'example', ns: 'ns2', options: { count: 3 }, isPlural: true, default: '' }
    ], testConfig)).toEqual({
      common: { example: 'Value 1' },
      ns2: { example_one: 'Value 1', example_other: 'Value 1' }
    })
    expect(Logger.getWarnings()).toEqual([
      'Same key with different default value found: common:example',
      'Same key with different default value found: ns2:example'
    ])
  })

  it('should extract translations with different default', () => {
    expect(translationsToNamespaceMap([
      { key: 'example', ns: 'common' },
      { key: 'example', ns: 'ns2', default: 'This is an example.' },
      { key: 'example', ns: 'ns2', default: 'This is another example.' },
      { key: 'pluralExample', options: { count: 3 }, isPlural: true, ns: 'common' }
    ], testConfig)).toEqual({
      common: { 'example': '', 'pluralExample_one': '', 'pluralExample_other': '' },
      ns2: { 'example': 'This is an example.' }
    })
    expect(Logger.getWarnings()).toEqual(['Same key with different default value found: ns2:example'])
  })

  it('should extract plural translations with different default', () => {
    expect(translationsToNamespaceMap([
      { key: 'example', ns: 'common', default: 'This is an example.', options: { count: 3 }, isPlural: true },
      { key: 'example', ns: 'common', default: 'This is another example.', options: { count: 3 }, isPlural: true }
    ], testConfig)).toEqual({
      common: { 'example_one': 'This is an example.', 'example_other': 'This is an example.' }
    })
    expect(Logger.getWarnings()).toEqual(['Same key with different default value found: common:example'])
  })

  it('should extract translations with default value for plural', () => {
    expect(translationsToNamespaceMap([
      { key: 'pluralExample', options: { count: 3 }, isPlural: true, ns: 'common', default: 'This is an example.' }
    ], testConfig)).toEqual({
      common: { 'pluralExample_one': 'This is an example.', 'pluralExample_other': 'This is an example.' }
    })
  })

  it('should warn same key without plural after plural init', () => {
    expect(translationsToNamespaceMap([
      { key: 'example', options: { count: 3 }, isPlural: true, ns: 'common', default: 'This is an example.' },
      { key: 'example', ns: 'common', default: 'This is another example.' }
    ], testConfig)).toEqual({
      common: {
        'example': 'This is another example.',
        'example_one': 'This is an example.',
        'example_other': 'This is an example.'
      }
    })
  })

  it('should warn same key plural after non plural', () => {
    expect(translationsToNamespaceMap([
      { key: 'example', ns: 'common', default: 'This is an example.' },
      { key: 'example', options: { count: 3 }, isPlural: true, ns: 'common', default: 'This is another example.' }
    ], testConfig)).toEqual({
      common: {
        'example': 'This is an example.',
        'example_one': 'This is another example.',
        'example_other': 'This is another example.'
      }
    })
  })
})
