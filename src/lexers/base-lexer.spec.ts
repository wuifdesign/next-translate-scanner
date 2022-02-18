import BaseLexer from '../../src/lexers/base-lexer'

describe('BaseLexer', () => {
  it('functionPattern() return a regex pattern', () => {
    const Lexer = new BaseLexer({ functions: ['this.t', '__'] })
    expect(Lexer.functionPattern()).toBe('(?:this\\.t|__)')
  })

  describe('validateString()', () => {
    it('matches double quote strings', () => {
      const Lexer = new BaseLexer()
      expect(Lexer.validateString('"args"')).toBe(true)
    })

    it('matches single quote strings', () => {
      const Lexer = new BaseLexer()
      expect(Lexer.validateString('\'args\'')).toBe(true)
    })

    it('does not match variables', () => {
      const Lexer = new BaseLexer()
      expect(Lexer.validateString('args')).toBe(false)
    })

    it('does not match null value', () => {
      const Lexer = new BaseLexer()
      expect(Lexer.validateString(null)).toBe(false)
    })

    it('does not match undefined value', () => {
      const Lexer = new BaseLexer()
      expect(Lexer.validateString(undefined)).toBe(false)
    })

    it('does not match empty string', () => {
      const Lexer = new BaseLexer()
      expect(Lexer.validateString('')).toBe(false)
    })
  })
})
