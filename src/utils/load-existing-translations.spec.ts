import loadExistingTranslations from './load-existing-translations'
import testConfig from '../../_test-files/test-config'

const config = {
  ...testConfig,
  output: './_test-files/locales/$LOCALE/$NAMESPACE.json'
}

describe('loadExistingTranslations', () => {
  it('should extract translations', () => {
    expect(loadExistingTranslations(config)).toEqual({
      en: {
        common: {
          key: 'en_translation',
          first_one: 'en_first',
          first_other: 'en_first plural',
          second_one: 'en_second',
          second_zero: 'en_second plural zero',
          second_other: 'en_second plural other',
          'my.nested.key': 'en_nested key',
          'my.nested.plural_one': 'en_plural',
          'my.nested.plural_other': 'en_plural plural'
        },
        ns1: { key: 'en_translation' }
      },
      de: {
        common: {
          key: 'de_translation',
          first_one: 'de_first',
          first_other: 'de_first plural',
          second_one: 'de_second',
          second_zero: 'de_second plural zero',
          second_other: 'de_second plural other',
          'my.nested.key': 'de_nested key',
          'my.nested.plural_one': 'de_plural',
          'my.nested.plural_other': 'de_plural plural'
        },
        ns1: { key: 'de_translation' }
      }
    })
  })
})
