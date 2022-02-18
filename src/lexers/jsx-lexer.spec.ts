import JsxLexer from '../../src/lexers/jsx-lexer'

let Lexer: JsxLexer

describe('JsxLexer', () => {
  beforeEach(() => {
    Lexer = new JsxLexer({ defaultNS: 'common', nsSeparator: ':' })
  })

  describe('<Trans>', () => {
    it('extracts keys from attributes', () => {
      expect(Lexer.extract(`<Trans i18nKey="example" />`)).toEqual([
        {
          key: 'example',
          ns: 'common'
        }
      ])
    })

    it('extracts keys and count from attributes', () => {
      expect(Lexer.extract(`
        <Trans
          i18nKey="example"
          values={{ count }}
        />
      `)).toEqual([
        {
          key: 'example',
          ns: 'common',
          isPlural: true,
          options: {
            count: '{count}'
          }
        }
      ])
    })

    it('extracts default value from defaultTrans', () => {
      expect(Lexer.extract(`
        <Trans
          i18nKey="example"
          values={{ count: 42 }}
          defaultTrans="Example Translate {{ count }}"
        />
      `)).toEqual([
        {
          key: 'example',
          ns: 'common',
          default: 'Example Translate {{ count }}',
          isPlural: true,
          options: {
            count: 42
          }
        }
      ])
    })

    it('extracts default value from defaultTrans as string', () => {
      expect(Lexer.extract(`
        <Trans
          i18nKey="example"
          values={{ count: 42 }}
          defaultTrans={'Example Translate {{ count }}'}
        />
      `)).toEqual([
        {
          key: 'example',
          ns: 'common',
          default: 'Example Translate {{ count }}',
          isPlural: true,
          options: {
            count: 42
          }
        }
      ])
    })

    it('extracts from empty tag', () => {
      expect(Lexer.extract(`<Trans i18nKey="example"></Trans>`)).toEqual([{ key: 'example', ns: 'common' }])
    })

    it('extracts namespace from key', () => {
      expect(Lexer.extract(`<Trans i18nKey="ns2:example" />`)).toEqual([{ key: 'example', ns: 'ns2' }])
    })

    it('extracts namespace from ns attribute', () => {
      expect(Lexer.extract(`<Trans i18nKey="example" ns="ns2" />`)).toEqual([{ key: 'example', ns: 'ns2' }])
    })

    it('extracts with values', () => {
      expect(Lexer.extract(`
        <Trans
          i18nKey="example"
          values={{ 
            ordinal: true,
            customTrue: true,
            name: 'User', 
            description: 'Demo Description' 
        }}
        />
      `)).toEqual([
        {
          key: 'example',
          ns: 'common',
          options: {
            ordinal: true,
            customTrue: true,
            description: 'Demo Description',
            name: 'User'
          }
        }
      ])
    })

    it('handles jsx fragments', () => {
      expect(Lexer.extract(`<><Trans i18nKey="first" /></>`)).toEqual([{ key: 'first', ns: 'common' }])
    })
  })

  describe('supports TypeScript', () => {
    it('supports basic tsx syntax', () => {
      expect(Lexer.extract(`<Trans i18nKey="example" values={{ name: 'User', count: 42 as number }} />`)).toEqual([
        {
          key: 'example',
          ns: 'common',
          isPlural: true,
          options: {
            name: 'User',
            count: 42
          }
        }
      ])
    })
  })
})
