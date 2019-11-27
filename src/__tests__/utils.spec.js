import { expect } from '../lib/test-utils'
import { gravatar } from '../lib/utils'

describe('lib > utils.js > gravatar', () => {
  it('should return correct url with hashed email', () => {
    expect(gravatar('toto@gmail.com')).to.equal(
      'https://www.gravatar.com/avatar/5a3f2bbc4a48a3b65438890ecb202aba?d=mp'
    )
  })
})
