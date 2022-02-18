import { ExtractedElement } from '../types/extracted-element.type'

export type BaseLexerOptions = {
  functions?: string[]
  defaultNS?: string
  nsSeparator?: string
}

export default class BaseLexer {
  keys: string[]
  functions: string[]
  defaultNS?: string
  nsSeparator?: string

  constructor(options: BaseLexerOptions = {}) {
    this.keys = []
    this.functions = options.functions || ['t']
    this.defaultNS = options.defaultNS
    this.nsSeparator = options.nsSeparator || ':'
  }

  extract(string: string, filename: string): ExtractedElement[] {
    throw new Error('extract not implemented')
  }

  validateString(string?: string | null) {
    const regex = new RegExp('^' + BaseLexer.stringPattern + '$', 'i')
    return string ? regex.test(string) : false
  }

  functionPattern() {
    return '(?:' + this.functions.join('|').replace('.', '\\.') + ')'
  }

  static get singleQuotePattern() {
    return '\'(?:[^\'].*?[^\\\\])?\''
  }

  static get doubleQuotePattern() {
    return '"(?:[^"].*?[^\\\\])?"'
  }

  static get variablePattern() {
    return '(?:[A-Z0-9_.-]+)'
  }

  static get stringPattern() {
    return ('(?:' + [BaseLexer.singleQuotePattern, BaseLexer.doubleQuotePattern].join('|') + ')')
  }
}
