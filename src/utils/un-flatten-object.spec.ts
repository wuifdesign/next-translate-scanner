import unFlattenObject from './un-flatten-object'

describe('unFlattenObject', () => {
  it('should unflatten object', () => {
    const result = unFlattenObject({ demo: 'demo_string', 'key1.key2.key3': 'test', 'test-demo': 'test_string' })
    expect(result).toEqual({
      key1: {
        key2: {
          key3: 'test'
        }
      },
      'test-demo': 'test_string',
      demo: 'demo_string'
    })
  })

  it('should unflatten using a different separator', () => {
    const result = unFlattenObject({ demo: 'demo_string', 'key1-key2-key3': 'test', 'test.demo': 'test_string' }, '-')
    expect(result).toEqual({
      key1: {
        key2: {
          key3: 'test'
        }
      },
      'test.demo': 'test_string',
      demo: 'demo_string'
    })
  })
})
