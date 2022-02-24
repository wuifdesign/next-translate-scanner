import addPseudoLocale from './add-pseudo-locale'

const existingTranslations = {
  en: {
    common: {
      key: 'en_translation <a>Test</a>',
      first_zero: 'en_first zero {{ count }} zero',
      first_one: 'en_first {{count}}',
      first_other: 'en_first plural {count}'
    },
    ns1: { key: 'en_translation' }
  },
  de: {
    common: {
      key: 'de_translation <a>Test</a>',
      first_zero: 'de_first zero {{ count }} zero',
      first_one: 'de_first {{count}}',
      first_other: 'de_first plural {count}'
    },
    ns1: { key: 'de_translation' }
  }
}

describe('addPseudoLocale', () => {
  it('should add locale', () => {
    expect(addPseudoLocale(existingTranslations, 'en', 'zu')).toEqual({
      ...existingTranslations,
      zu: {
        common: {
          key: 'ḗḗƞ_ŧřȧȧƞşŀȧȧŧīǿǿƞ <a>Ŧḗḗşŧ</a>',
          first_zero: 'ḗḗƞ_ƒīřşŧ ẑḗḗřǿǿ {{ count }} ẑḗḗřǿǿ',
          first_one: 'ḗḗƞ_ƒīřşŧ {{count}}',
          first_other: 'ḗḗƞ_ƒīřşŧ ƥŀŭŭřȧȧŀ {ƈǿǿŭŭƞŧ}'
        },
        ns1: { key: 'ḗḗƞ_ŧřȧȧƞşŀȧȧŧīǿǿƞ' }
      }
    })
  })
})
