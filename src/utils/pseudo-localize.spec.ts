import pseudoLocalizeString from './pseudo-localize'

describe('pseudoLocalizeString', () => {
  it('should change to pseudo', () => {
    expect(pseudoLocalizeString('This is a Test')).toBe('Ŧħīş īş ȧȧ Ŧḗḗşŧ')
  })
})
