import { parse } from '../lib/index.js'

function getParser (code) {
  return () => parse(code, { sourceType: 'module' })
}

describe('curry function syntax', function () {
  it('should parse', function () {
    expect(getParser(`function @@ foo() {}`)()).toMatchSnapshot()
  })
})