const add = require('./');

describe('.add', () => {
  it('returns 10 when given 7 and 3', () => {
    expect(add(7, 3)).toBe(10);
  })
})