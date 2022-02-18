import JavascriptLexer, { JavascriptLexerOptions } from './javascript-lexer'
import * as ts from 'typescript'
import { CallExpression, JsxChild, JsxElement, Node, NodeArray, TaggedTemplateExpression } from 'typescript'
import { ExtractedElement } from '../types/extracted-element.type'
import Logger from '../utils/logger'
import spreadOptionsToEntry from '../utils/spread-options-to-entry'
import extractNamespaceFromKey from '../utils/extract-namespace-from-key'

export type JsxLexerOptions = JavascriptLexerOptions & {}

export default class JsxLexer extends JavascriptLexer {
  constructor(options: JsxLexerOptions = {}) {
    super(options)
  }

  extract(content: string, filename = '__default.jsx') {
    const keys: ExtractedElement[] = []

    const parseCommentNode = this.createCommentNodeParser()

    const parseTree = (node: Node) => {
      let entry: ExtractedElement | null = null

      parseCommentNode(keys, node, content)

      switch (node.kind) {
        case ts.SyntaxKind.CallExpression:
          entry = this.expressionExtractor(node as CallExpression)
          break
        case ts.SyntaxKind.TaggedTemplateExpression:
          entry = this.taggedTemplateExpressionExtractor(node as TaggedTemplateExpression)
          break
        case ts.SyntaxKind.JsxElement:
        case ts.SyntaxKind.JsxSelfClosingElement:
          entry = this.jsxExtractor(node as JsxElement)
          break
      }

      if (entry) {
        keys.push(entry)
      }

      node.forEachChild(parseTree)
    }

    const sourceFile = ts.createSourceFile(
      filename,
      content,
      ts.ScriptTarget.Latest
    )
    parseTree(sourceFile)

    return this.setNamespaces(keys)
  }

  jsxExtractor(node: JsxElement) {
    const tagNode = (node as any).openingElement || node

    const getPropValue = (node: JsxElement, tagName: string) => {
      const attribute = (node as any).attributes.properties.find((attr: any) => attr.name.text === tagName)
      if (!attribute) {
        return null
      }
      return attribute.initializer.expression ? attribute.initializer.expression.text : attribute.initializer.text
    }

    const getKey = (node: JsxElement) => getPropValue(node, 'i18nKey')

    if (tagNode.tagName.text === 'Trans') {
      const entry: ExtractedElement = {} as ExtractedElement
      entry.key = getKey(tagNode)

      const defaultValue = getPropValue(tagNode, 'defaultTrans')
      if (defaultValue && defaultValue !== '') {
        entry.default = defaultValue
      }

      const ns = getPropValue(tagNode, 'ns')
      if (ns) {
        entry.ns = ns
      }

      for (const property of tagNode.attributes.properties) {
        if (property.initializer) {
          if (property.name.text === 'values') {
            try {
              spreadOptionsToEntry(entry, property.initializer.expression, (p) => `{${p.name.text}}`)
            } catch (e: any) {
              Logger.warning(e.message)
            }
          }
        }
      }

      extractNamespaceFromKey(entry, this.nsSeparator)

      return entry.key ? entry : null
    }
    return null
  }

  parseChildren(children: NodeArray<JsxChild>, sourceText: string): {
    type: string
    children?: any[]
    content?: string
    name?: string
    isBasic?: boolean
    selfClosing?: boolean
  }[] {
    return children?.map((child) => {
      if (child.kind === ts.SyntaxKind.JsxText) {
        return {
          type: 'text',
          content: child.text.replace(/(^(\n|\r)\s*)|((\n|\r)\s*$)/g, '').replace(/(\n|\r)\s*/g, ' ')
        }
      } else if (child.kind === ts.SyntaxKind.JsxElement || child.kind === ts.SyntaxKind.JsxSelfClosingElement) {
        const element = (child as any).openingElement || child
        const name = element.tagName.escapedText
        const isBasic = !element.attributes.properties.length
        return {
          type: 'tag',
          children: this.parseChildren((child as any).children, sourceText),
          name,
          isBasic,
          selfClosing: child.kind === ts.SyntaxKind.JsxSelfClosingElement
        }
      } else if (child.kind === ts.SyntaxKind.JsxExpression) {
        // strip empty expressions
        if (!child.expression) {
          return {
            type: 'text',
            content: ''
          }
        } else if (child.expression.kind === ts.SyntaxKind.StringLiteral) {
          return {
            type: 'text',
            content: (child.expression as any).text
          }
        }
          // strip properties from ObjectExpressions
        // annoying (and who knows how many other exceptions we'll need to write) but necessary
        else if (child.expression.kind === ts.SyntaxKind.ObjectLiteralExpression) {
          let nonFormatProperties = (child.expression as any).properties.filter((prop: any) => prop.name.text !== 'format')
          if (nonFormatProperties.length > 1) {
            Logger.warning(`The passed in object contained more than one variable - the object should look like {{ value, format }} where format is optional.`)
            return {
              type: 'text',
              content: ''
            }
          }

          return {
            type: 'js',
            content: `{{${nonFormatProperties[0].name.text}}}`
          }
        }

        // slice on the expression so that we ignore comments around it
        return {
          type: 'js',
          content: `{${sourceText.slice(
            child.expression.pos,
            child.expression.end
          )}}`
        }
      } else {
        throw new Error('Unknown ast element when parsing jsx: ' + child.kind)
      }
    }).filter((child) => child.type !== 'text' || child.content)
  }
}
