import isPluralKey from './is-plural-key'

describe('isPluralKey', () => {
  test.each([
    ['_zero', true],
    ['_one', true],
    ['_two', true],
    ['_few', true],
    ['_many', true],
    ['_other', true],
    ['_0', true],
    ['_5', true],
    ['_990', true],
    ['_zero_foo', false],
    ['_foo', false],
    ['foo', false]
  ])('should test %p and return %p', (value, result) => {
    expect(isPluralKey(value)).toBe(result)
  })
})
