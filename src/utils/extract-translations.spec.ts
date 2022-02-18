import extractTranslations from './extract-translations'
import Logger from './logger'
import testConfig from '../../_test-files/test-config'

describe('extractTranslations', () => {
  beforeEach(() => {
    Logger.setSilent(true)
    Logger.resetWarnings()
  })

  it('should extract translations', () => {
    expect(extractTranslations(['_test-files/files/demo.jsx'], testConfig)).toEqual([
      { key: 'title', ns: 'ns1' },
      { key: 'my.nested.key', ns: 'ns1' },
      { key: 'description', ns: 'ns1' },
      { key: 'example', options: { count: 3 }, isPlural: true, ns: 'ns2' }
    ])
  })
})
