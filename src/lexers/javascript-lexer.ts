import BaseLexer, { BaseLexerOptions } from './base-lexer'
import * as ts from 'typescript'
import { BinaryExpression, CallExpression, Node, TaggedTemplateExpression } from 'typescript'
import { ExtractedElement } from '../types/extracted-element.type'
import Logger from '../utils/logger'
import extractNamespaceFromKey from '../utils/extract-namespace-from-key'
import spreadOptionsToEntry from '../utils/spread-options-to-entry'

export type JavascriptLexerOptions = BaseLexerOptions & {}

export default class JavascriptLexer extends BaseLexer {
  callPattern: string

  constructor(options: JavascriptLexerOptions = {}) {
    super(options)
    this.callPattern = '(?<=^|\\s|\\.)' + this.functionPattern() + '\\(.*\\)'
  }

  createCommentNodeParser() {
    const visitedComments = new Set()

    return (keys: ExtractedElement[], node: Node, content: string) => {
      ts.forEachLeadingCommentRange(
        content,
        node.getFullStart(),
        (pos, end, kind) => {
          const commentId = `${pos}_${end}`
          if ((kind === ts.SyntaxKind.MultiLineCommentTrivia || kind === ts.SyntaxKind.SingleLineCommentTrivia) && !visitedComments.has(commentId)) {
            visitedComments.add(commentId)
            const text = content.slice(pos, end)
            const commentKeys = this.commentExtractor.call(this, text)
            if (commentKeys) {
              keys.push(...commentKeys)
            }
          }
        }
      )
    }
  }

  setNamespaces(keys: ExtractedElement[]): ExtractedElement[] {
    if (this.defaultNS) {
      keys = keys.map((entry) => ({
        ...entry,
        ns: entry.ns || this.defaultNS as string
      }))
    }
    keys.filter((entry) => {
      if (entry.ns) {
        return true
      }
      Logger.warning(`No namespace found for '${entry.key}'`)
      return false
    })
    return keys
  }

  extract(content: string, filename = '__default.js') {
    const keys: ExtractedElement[] = []
    const parseCommentNode = this.createCommentNodeParser()

    const parseTree = (node: Node) => {
      let entry: ExtractedElement | null = null
      parseCommentNode(keys, node, content)
      if (node.kind === ts.SyntaxKind.TaggedTemplateExpression) {
        entry = this.taggedTemplateExpressionExtractor(node as TaggedTemplateExpression)
      }
      if (node.kind === ts.SyntaxKind.CallExpression) {
        entry = this.expressionExtractor.call(this, node as CallExpression)
      }
      if (entry) {
        keys.push(entry)
      }
      node.forEachChild(parseTree)
    }

    const sourceFile = ts.createSourceFile(filename, content, ts.ScriptTarget.Latest)
    parseTree(sourceFile)

    return this.setNamespaces(keys)
  }

  taggedTemplateExpressionExtractor(node: TaggedTemplateExpression) {
    const entry: any = {}

    const { tag, template }: any = node

    const isTranslationFunction = (tag.text && this.functions.includes(tag.text)) || (tag.name && this.functions.includes(tag.name.text))

    if (!isTranslationFunction) {
      return null
    }

    if (template.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
      entry.key = template.text
    } else if (template.kind === ts.SyntaxKind.TemplateExpression) {
      Logger.warning('A key that is a template string must not have any interpolations.')
      return null
    }

    extractNamespaceFromKey(entry, this.nsSeparator)

    return entry as ExtractedElement
  }

  expressionExtractor(node: CallExpression) {
    const entry: ExtractedElement = {} as ExtractedElement
    const expression: any = node.expression
    const nodeArguments: any[] = [...node.arguments]

    if ((expression.escapedText === 'useTranslation' || expression.escapedText === 'withTranslation' || expression.escapedText === 'getT') && node.arguments.length) {
      const index = expression.escapedText === 'useTranslation' ? 0 : 1
      const { text }: any = node.arguments[index]
      if (text) {
        this.defaultNS = text
      }
    }

    const isTranslationFunction = (expression.text && this.functions.includes(expression.text)) || (expression.name && this.functions.includes(expression.name.text))

    if (isTranslationFunction) {
      const keyArgument = nodeArguments.shift()

      if (!keyArgument) {
        return null
      }

      if (keyArgument.kind === ts.SyntaxKind.StringLiteral || keyArgument.kind === ts.SyntaxKind.NoSubstitutionTemplateLiteral) {
        entry.key = keyArgument.text
      } else if (keyArgument.kind === ts.SyntaxKind.BinaryExpression) {
        const concatenatedString = this.concatenateString(keyArgument)
        if (!concatenatedString) {
          Logger.warning(`Key is not a string literal: ${keyArgument.text}`)
          return null
        }
        entry.key = concatenatedString
      } else {
        Logger.warning(keyArgument.kind === ts.SyntaxKind.Identifier ? `Key is not a string literal: ${keyArgument.text}` : 'Key is not a string literal')
        return null
      }

      const query = nodeArguments[0]
      const options = nodeArguments[1]

      if (query && query.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        try {
          spreadOptionsToEntry(entry, query)
        } catch (e: any) {
          Logger.warning(e.message)
        }
      }

      if (options && options.kind === ts.SyntaxKind.ObjectLiteralExpression) {
        for (const p of options.properties) {
          if (p.initializer) {
            if (p.name.text === 'default') {
              entry.default = p.initializer.text || ''
            }
            if (p.name.text === 'ns') {
              entry.ns = p.initializer.text || ''
            }
          }
        }
      }

      extractNamespaceFromKey(entry, this.nsSeparator)

      return entry
    }

    return null
  }

  commentExtractor(commentText: string) {
    const regexp = new RegExp(this.callPattern, 'g')
    const expressions = commentText.match(regexp)

    if (!expressions) {
      return null
    }

    const keys: ExtractedElement[] = []
    expressions.forEach((expression) => {
      const expressionKeys = this.extract(expression)
      if (expressionKeys) {
        keys.push(...expressionKeys)
      }
    })
    return keys
  }

  concatenateString(binaryExpression: BinaryExpression, string = '') {
    if (binaryExpression.operatorToken.kind !== ts.SyntaxKind.PlusToken) {
      return
    }

    if (binaryExpression.left.kind === ts.SyntaxKind.BinaryExpression) {
      string += this.concatenateString(binaryExpression.left as BinaryExpression, string)
    } else if (binaryExpression.left.kind === ts.SyntaxKind.StringLiteral) {
      string += (binaryExpression.left as any).text
    } else {
      return
    }

    if (binaryExpression.right.kind === ts.SyntaxKind.BinaryExpression) {
      string += this.concatenateString(binaryExpression.right as BinaryExpression, string)
    } else if (binaryExpression.right.kind === ts.SyntaxKind.StringLiteral) {
      string += (binaryExpression.right as any).text
    } else {
      return
    }

    return string
  }
}
