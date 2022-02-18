import * as ts from 'typescript'
import { ExtractedElement } from '../types/extracted-element.type'

const spreadOptionsToEntry = (entry: ExtractedElement, expression: any, fallback = (property: any) => '') => {
  entry.options = {}
  if (expression.kind === ts.SyntaxKind.ObjectLiteralExpression) {
    for (const property of expression.properties) {
      if (property.kind === ts.SyntaxKind.SpreadAssignment) {
        throw new Error(`Options argument is a spread operator : ${property.expression.text}`)
      } else if (property.initializer) {
        const initializer = property.initializer.expression || property.initializer
        if (initializer.kind === ts.SyntaxKind.TrueKeyword) {
          entry.options[property.name.text] = true
        } else if (initializer.kind === ts.SyntaxKind.FalseKeyword) {
          entry.options[property.name.text] = false
        } else if (initializer.kind === ts.SyntaxKind.NumericLiteral) {
          entry.options[property.name.text] = parseFloat(initializer.text)
        } else {
          entry.options[property.name.text] = initializer.text || fallback(property)
        }
      } else {
        entry.options[property.name.text] = '' || fallback(property)
      }
      if (property.name.text === 'count') {
        entry.isPlural = true
      }
    }
  }
  if (Object.keys(entry.options).length === 0) {
    delete entry.options
  }
}

export default spreadOptionsToEntry
