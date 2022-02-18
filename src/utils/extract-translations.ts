import fs from 'fs'
import path from 'path'
import { ScannerConfig } from '../types/scanner-config.type'
import { ExtractedElement } from '../types/extracted-element.type'
import JsxLexer from '../lexers/jsx-lexer'
import JavascriptLexer from '../lexers/javascript-lexer'
import Logger from './logger'

const availableLexers = {
  mjs: [JavascriptLexer],
  js: [JavascriptLexer],
  ts: [JavascriptLexer],
  jsx: [JsxLexer],
  tsx: [JsxLexer],

  default: [JavascriptLexer]
}

const extractTranslations = (filePaths: string[], config: ScannerConfig) => {
  filePaths = [...new Set(filePaths)]
  filePaths.sort()
  let count = 0
  let allTranslations: ExtractedElement[] = []
  for (const filePath of filePaths) {
    count++
    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const extension = path.extname(filePath).substring(1) as keyof typeof availableLexers
      const fileLexers = availableLexers[extension] || availableLexers.default
      for (const lexer of fileLexers) {
        allTranslations = [
          ...allTranslations,
          ...new lexer({ defaultNS: config.defaultNS, nsSeparator: config.nsSeparator }).extract(content)
        ]
      }
    } catch (e) {
      Logger.error(`Can't read "${filePath}"`)
    }
  }
  Logger.info(`Stats:  ${count} files were parsed`)
  Logger.info()
  return allTranslations
}

export default extractTranslations
