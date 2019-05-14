const parser = require('./parser')

const PRODUCT = 'PRODUCT'

class UserAgentBag {
  constructor (str) {
    this._nodes = parser.parse(str)
  }

  has (product) {
    return this._nodes.some(node => (
      (node.type === PRODUCT) && (node.product === product)
    ))
  }
}

module.exports = UserAgentBag
