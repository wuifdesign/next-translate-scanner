import { ExtractedElement } from '../types/extracted-element.type'

const extractNamespaceFromKey = (entry: ExtractedElement, separator = ':') => {
  if (!entry.ns && entry.key.includes(separator)) {
    const [ns, ...keyArray] = entry.key.split(separator)
    entry.key = keyArray.join(separator)
    entry.ns = ns
  }
}

export default extractNamespaceFromKey
