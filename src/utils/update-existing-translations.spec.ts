import testConfig from '../../_test-files/test-config'
import updateExistingTranslations from './update-existing-translations'
import { ExtractedTranslations } from '../types/extracted-translations.type'

const existingTranslations = {
  en: {
    common: {
      key: 'en_translation',
      key_empty: '',
      first_zero: 'en_first zero',
      first_one: 'en_first',
      first_other: 'en_first plural',
      second_one: 'en_second',
      second_zero: 'en_second plural zero',
      second_other: 'en_second plural other',
      third_one: 'en_third',
      third_zero: 'en_third plural zero',
      third_other: 'en_second plural other',
      'my.nested.key': 'en_nested key',
      'my.nested.plural_one': 'en_plural',
      'my.nested.plural_other': 'en_plural plural'
    },
    ns1: { key: 'en_translation' }
  },
  de: {
    common: {
      key: 'de_translation',
      key_empty: '',
      first_zero: 'de_first zero',
      first_one: 'de_first',
      first_other: 'de_first plural',
      second_one: 'de_second',
      second_zero: 'de_second plural zero',
      second_other: 'de_second plural other',
      third_one: 'de_third',
      third_zero: 'de_third plural zero',
      third_other: 'de_second plural other',
      'my.nested.key': 'de_nested key',
      'my.nested.plural_one': 'de_plural',
      'my.nested.plural_other': 'de_plural plural'
    },
    ns1: { key: 'de_translation' }
  }
}

const newTranslations: ExtractedTranslations = {
  common: {
    key: 'new translation',
    key_empty: 'new empty translation',
    first_one: 'new first',
    first_other: 'new first',
    newKey: 'new translation key',
    'new.nested.key': '',
    second_one: '',
    second_zero: '',
    second_other: ''
  }
}

describe('updateExistingTranslations', () => {
  it('should update existing with keepRemoved', () => {
    expect(updateExistingTranslations(newTranslations, existingTranslations, testConfig)).toEqual({
      en: {
        common: {
          key: 'en_translation',
          key_empty: 'new empty translation',
          first_zero: 'en_first zero',
          first_one: 'en_first',
          first_other: 'en_first plural',
          newKey: 'new translation key',
          'new.nested.key': '',
          second_one: 'en_second',
          second_zero: 'en_second plural zero',
          second_other: 'en_second plural other',
          third_one: 'en_third',
          third_zero: 'en_third plural zero',
          third_other: 'en_second plural other',
          'my.nested.key': 'en_nested key',
          'my.nested.plural_one': 'en_plural',
          'my.nested.plural_other': 'en_plural plural'
        },
        ns1: { key: 'en_translation' }
      },
      de: {
        common: {
          key: 'de_translation',
          key_empty: 'new empty translation',
          first_zero: 'de_first zero',
          first_one: 'de_first',
          first_other: 'de_first plural',
          newKey: 'new translation key',
          'new.nested.key': '',
          second_one: 'de_second',
          second_zero: 'de_second plural zero',
          second_other: 'de_second plural other',
          third_one: 'de_third',
          third_zero: 'de_third plural zero',
          third_other: 'de_second plural other',
          'my.nested.key': 'de_nested key',
          'my.nested.plural_one': 'de_plural',
          'my.nested.plural_other': 'de_plural plural'
        },
        ns1: { key: 'de_translation' }
      }
    })
  })

  it('should update existing without keepRemoved', () => {
    expect(updateExistingTranslations(newTranslations, existingTranslations, {
      ...testConfig,
      keepRemoved: false
    })).toEqual({
      en: {
        common: {
          key: 'en_translation',
          key_empty: 'new empty translation',
          first_zero: 'en_first zero',
          first_one: 'en_first',
          first_other: 'en_first plural',
          newKey: 'new translation key',
          'new.nested.key': '',
          second_one: 'en_second',
          second_zero: 'en_second plural zero',
          second_other: 'en_second plural other'
        }
      },
      de: {
        common: {
          key: 'de_translation',
          key_empty: 'new empty translation',
          first_zero: 'de_first zero',
          first_one: 'de_first',
          first_other: 'de_first plural',
          newKey: 'new translation key',
          'new.nested.key': '',
          second_one: 'de_second',
          second_zero: 'de_second plural zero',
          second_other: 'de_second plural other'
        }
      }
    })
  })

  it('should update existing with replaceDefaults', () => {
    expect(updateExistingTranslations(newTranslations, existingTranslations, {
      ...testConfig,
      replaceDefaults: true
    })).toEqual({
      en: {
        common: {
          key: 'new translation',
          key_empty: 'new empty translation',
          first_one: 'new first',
          first_other: 'new first',
          newKey: 'new translation key',
          'new.nested.key': '',
          second_one: 'en_second',
          second_zero: 'en_second plural zero',
          second_other: 'en_second plural other',
          third_one: 'en_third',
          third_zero: 'en_third plural zero',
          third_other: 'en_second plural other',
          'my.nested.key': 'en_nested key',
          'my.nested.plural_one': 'en_plural',
          'my.nested.plural_other': 'en_plural plural'
        },
        ns1: { key: 'en_translation' }
      },
      de: {
        common: {
          key: 'new translation',
          key_empty: 'new empty translation',
          first_one: 'new first',
          first_other: 'new first',
          newKey: 'new translation key',
          'new.nested.key': '',
          second_one: 'de_second',
          second_zero: 'de_second plural zero',
          second_other: 'de_second plural other',
          third_one: 'de_third',
          third_zero: 'de_third plural zero',
          third_other: 'de_second plural other',
          'my.nested.key': 'de_nested key',
          'my.nested.plural_one': 'de_plural',
          'my.nested.plural_other': 'de_plural plural'
        },
        ns1: { key: 'de_translation' }
      }
    })
  })
})
