const parser = require('./parser')

class UserAgentBag {
  constructor (str) {
    try {
      this._nodes = parser.parse(str)
    } catch (err) {
      this.error = err
      this._nodes = []
    }

    this._asMap = new Map()
    for (const node of this._nodes) {
      if (node.type !== 'product') {
        continue
      } else if (this._asMap.has(node.product)) {
        this._asMap.get(node.product).push(node.version)
      } else {
        this._asMap.set(node.product, [node.version])
      }
    }
  }

  get (product) {
    const allVersions = this._asMap.get(product)
    return allVersions ? allVersions[0] : undefined
  }

  getAll (product) {
    return this._asMap.get(product) || []
  }

  has (product) {
    return this._asMap.has(product)
  }

  [Symbol.iterator] () {
    return this._nodes[Symbol.iterator]()
  }
}

module.exports = UserAgentBag
