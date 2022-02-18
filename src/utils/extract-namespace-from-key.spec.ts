import extractNamespaceFromKey from './extract-namespace-from-key'

describe('extractNamespaceFromKey', () => {
  test.each([
    [{ key: 'ns:demo' }, { key: 'demo', ns: 'ns' }],
    [{ key: 'demo' }, { key: 'demo' }],
    [{ key: 'ns:ns2:demo' }, { key: 'ns2:demo', ns: 'ns' }],
    [{ key: 'ns2:demo', ns: 'ns' }, { key: 'ns2:demo', ns: 'ns' }]
  ])('should test %p and return %p', (value, result) => {
    extractNamespaceFromKey(value as any)
    expect(value).toEqual(result)
  })
})
