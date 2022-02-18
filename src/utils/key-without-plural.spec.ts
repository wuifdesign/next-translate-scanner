import keyWithoutPlural from './key-without-plural'

describe('keyWithoutPlural', () => {
  test.each([
    ['example_zero', 'example'],
    ['example_one', 'example'],
    ['example_two', 'example'],
    ['example_few', 'example'],
    ['example_many', 'example'],
    ['example_other', 'example'],
    ['example_0', 'example'],
    ['example_5', 'example'],
    ['example_990', 'example'],
    ['example_zero_foo', 'example_zero_foo'],
    ['example_foo', 'example_foo'],
    ['foo', 'foo']
  ])('should test %p and return %p', (value, result) => {
    expect(keyWithoutPlural(value)).toBe(result)
  })
})
