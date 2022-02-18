import flattenObject from './flatten-object'

describe('flattenObject', () => {
  it('should flatten object', () => {
    const result = flattenObject({
      key1: {
        key2: {
          key3: 'test'
        }
      },
      'test.demo': 'test_string',
      demo: 'demo_string'
    })
    expect(result).toEqual({ demo: 'demo_string', 'key1.key2.key3': 'test', 'test.demo': 'test_string' })
  })

  it('should flatten use a different separator', () => {
    const result = flattenObject({
      key1: {
        key2: {
          key3: 'test'
        }
      },
      'test.demo': 'test_string',
      demo: 'demo_string'
    }, '-')
    expect(result).toEqual({ demo: 'demo_string', 'key1-key2-key3': 'test', 'test.demo': 'test_string' })
  })
})
