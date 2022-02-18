import JavascriptLexer from '../../src/lexers/javascript-lexer'
import Logger from '../utils/logger'

let Lexer: JavascriptLexer

describe('JavascriptLexer', () => {
  beforeEach(() => {
    Lexer = new JavascriptLexer({ defaultNS: 'common' })
    Logger.setSilent(true)
    Logger.resetWarnings()
  })

  describe('useTranslation', () => {
    it('extracts keys from useTranslation', () => {
      expect(Lexer.extract(`t('example')`)).toEqual([{ key: 'example', ns: 'common' }])
    })

    it('extracts keys from useTranslation with count', () => {
      expect(Lexer.extract(`t('example', { count: 3.5 })`)).toEqual([{
        key: 'example',
        ns: 'common',
        isPlural: true,
        options: { count: 3.5 }
      }])
    })

    it('extracts keys from useTranslation with count and default', () => {
      expect(Lexer.extract(`t('example', { count: 3 }, { default: "The count is: {{count}}." })`)).toEqual([{
        key: 'example',
        ns: 'common',
        isPlural: true,
        options: { count: 3 },
        default: 'The count is: {{count}}.'
      }])
    })

    it('extracts keys from useTranslation and default', () => {
      expect(Lexer.extract(`t('example', {}, { fallback: 'demo', default: "The count is: {{count}}." })`)).toEqual([{
        key: 'example',
        ns: 'common',
        default: 'The count is: {{count}}.'
      }])
    })

    it('extracts keys from useTranslation with count and default', () => {
      expect(Lexer.extract(`t('example', { count: 3 }, { fallback: 'demo', default: "The count is: {{count}}." })`)).toEqual([{
        key: 'example',
        ns: 'common',
        isPlural: true,
        options: { count: 3 },
        default: 'The count is: {{count}}.'
      }])
    })

    it('extracts keys from useTranslation with namespace', () => {
      expect(Lexer.extract(`t('ns2:example')`)).toEqual([{ key: 'example', ns: 'ns2' }])
    })

    it('extracts keys template string with namespace', () => {
      expect(Lexer.extract('t\`ns2:example\`')).toEqual([{ key: 'example', ns: 'ns2' }])
    })

    it('extracts keys from comments', () => {
      expect(Lexer.extract(`
    // t('commentKey1')
    t('commentKey' + i)
    // t('commentKey2')
    t(\`commentKey\${i}\`)
    // Irrelevant comment
    // t('commentKey3')
    `)).toEqual([
        { key: 'commentKey1', ns: 'common' },
        { key: 'commentKey2', ns: 'common' },
        { key: 'commentKey3', ns: 'common' }
      ])
    })

    it('extracts keys from multiline comments', () => {
      expect(Lexer.extract(`
    /*
      i18n.t('commentKey1')
      i18n.t('commentKey2')
    */
    t(\`commentKey\${i}\`)
    // Irrelevant comment
    // t('commentKey3')
    `)).toEqual([
        { key: 'commentKey1', ns: 'common' },
        { key: 'commentKey2', ns: 'common' },
        { key: 'commentKey3', ns: 'common' }
      ])
    })

    it('does not parse text with `doesn\'t` or isolated `t` in it', () => {
      expect(Lexer.extract(`// FIX this doesn\'t work and this t is all alone\nt('example')\nt = () => {}`)).toEqual([{
        key: 'example',
        ns: 'common'
      }])
    })

    it('ignores functions that ends with a t', () => {
      expect(Lexer.extract(`ttt('first')`)).toEqual([])
    })

    it('supports a `functions` option', () => {
      const CustomLexer = new JavascriptLexer({ functions: ['tt', '_e'], defaultNS: 'common' })
      expect(CustomLexer.extract(`tt('first') + _e('second')`)).toEqual([{
        key: 'first',
        ns: 'common'
      }, { key: 'second', ns: 'common' }])
    })

    it('supports async/await', () => {
      Lexer.extract('const data = async () => await Promise.resolve()')
    })

    it('supports the spread operator', () => {
      expect(Lexer.extract('const data = { text: t("foo"), ...rest }; const { text, ...more } = data;')).toEqual([{
        key: 'foo',
        ns: 'common'
      }])
    })

    it('supports dynamic imports', () => {
      Lexer.extract('import("path/to/some/file").then(doSomethingWithData)')
    })

    it('supports the es7 syntax', () => {
      expect(Lexer.extract('@decorator() class Test { test() { t("foo") } }')).toEqual([{ key: 'foo', ns: 'common' }])
    })

    it('supports basic typescript syntax', () => {
      expect(Lexer.extract(`t('first') as potato`)).toEqual([{ key: 'first', ns: 'common' }])
    })

    it('extracts default namespace', () => {
      expect(Lexer.extract(`const {t} = useTranslation('foo'); t('bar');`)).toEqual([{ ns: 'foo', key: 'bar' }])
    })

    it('uses namespace from t function with priority', () => {
      expect(Lexer.extract(`const {t} = useTranslation('foo'); t('bar', {}, { ns: 'baz' });`)).toEqual([{
        key: 'bar',
        ns: 'baz'
      }])
    })
  })

  it('extracts custom options', () => {
    expect(Lexer.extract(`t('example', { description: 'Fantastic key!' });`)).toEqual([{
      key: 'example',
      ns: 'common',
      options: { description: 'Fantastic key!' }
    }])
  })

  it('extracts boolean options', () => {
    expect(Lexer.extract(`t('example', { ordinal: true, custom: false });`)).toEqual([{
      key: 'example',
      ns: 'common',
      options: {
        ordinal: true,
        custom: false
      }
    }])
  })

  it('emits warnings on dynamic keys', () => {
    expect(Lexer.extract('const bar = "bar"; i18n.t("foo"); i18n.t(bar); i18n.t(`foo.${bar}`); i18n.t(`babar`);')).toEqual([{
      key: 'foo',
      ns: 'common'
    }, { key: 'babar', ns: 'common' }])
    expect(Logger.getWarnings().filter((m) => m.includes('Key is not a string literal')).length).toBe(2)
  })

  it('extracts non-interpolated tagged templates', () => {
    expect(Lexer.extract('i18n.t`some-key`')).toEqual([{ key: 'some-key', ns: 'common' }])
  })

  it('emits warnings on interpolated tagged templates', () => {
    Lexer.extract('i18n.t`some-key${someVar}keykey`')
    expect(Logger.getWarnings().filter((m) => m.includes('A key that is a template string must not have any interpolations.')).length).toBe(1)
  })

  it('emits warnings for missing namespace', () => {
    const CustomLexer = new JavascriptLexer()
    CustomLexer.extract(`t('test')`)
    expect(Logger.getWarnings().filter((m) => m.includes(`No namespace found for 'test'`)).length).toBe(1)
  })

  describe('withTranslation', () => {
    it('extracts default namespace when it is a string', () => {
      expect(Lexer.extract(`const ExtendedComponent = withTranslation(MyComponent, 'foo'); t('bar');`)).toEqual([{
        ns: 'foo',
        key: 'bar'
      }])
    })

    it('uses namespace from t key function with priority', () => {
      expect(Lexer.extract(`const ExtendedComponent = withTranslation(MyComponent, 'foo'); t('baz:bar');`)).toEqual([{
        key: 'bar',
        ns: 'baz'
      }])
    })

    it('uses namespace from t option function with priority', () => {
      expect(Lexer.extract(`const ExtendedComponent = withTranslation(MyComponent, 'foo'); t('bar', {}, { ns: 'baz' });`)).toEqual([{
        key: 'bar',
        ns: 'baz'
      }])
    })
  })

  describe('getT', () => {
    it('extracts default namespace when it is a string', () => {
      expect(Lexer.extract(`getT(locale, 'foo'); t('bar');`)).toEqual([{ ns: 'foo', key: 'bar' }])
    })

    it('uses namespace from t key function with priority', () => {
      expect(Lexer.extract(`getT(locale, 'foo'); t('baz:bar');`)).toEqual([{ key: 'bar', ns: 'baz' }])
    })

    it('uses namespace from t function with priority', () => {
      expect(Lexer.extract(`getT(locale, 'foo'); t('bar', {}, { ns: 'baz' });`)).toEqual([{ key: 'bar', ns: 'baz' }])
    })
  })
})
