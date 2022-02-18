import orderObjectByKey from './order-object-by-key'

describe('orderObjectByKey', () => {
  it('should order object', () => {
    expect(JSON.stringify(orderObjectByKey({ a: 1, c: 2, b: 3 }))).toBe('{"a":1,"b":3,"c":2}')
  })

  it('should order nested object', () => {
    expect(JSON.stringify(orderObjectByKey({ 'a.b': 1, 'a.a': 2, b: 3 }))).toBe('{"a.a":2,"a.b":1,"b":3}')
  })
})
