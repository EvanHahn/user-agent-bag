const parser = require('./parser')

class UserAgentBag {
  constructor (arg) {
    this._asMap = new Map()

    if (typeof arg === 'string') {
      try {
        this._nodes = parser.parse(arg)
      } catch (err) {
        this.error = err
        this._nodes = []
      }

      for (const node of this._nodes) {
        if (node.type !== 'product') {
          continue
        } else if (this._asMap.has(node.product)) {
          this._asMap.get(node.product).push(node.version)
        } else {
          this._asMap.set(node.product, [node.version])
        }
      }
    } else if (arg && arg[Symbol.iterator]) {
      this._nodes = []
      for (const entry of arg) {
        if (!isValidEntry(entry)) {
          throw new Error('Iterator value is not an entry object')
        }
        // Entries can be arraylike objects which is why we can't use destructuring here.
        const product = entry[0]
        const version = entry[1]

        this._nodes.push({
          type: 'product',
          product,
          version
        })

        if (this._asMap.has(product)) {
          this._asMap.get(product).push(version)
        } else {
          this._asMap.set(product, [version])
        }
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

  toString () {
    return this._nodes.map(node => {
      if (node.type === 'product') {
        if (node.version) {
          return node.product + '/' + node.version
        } else {
          return node.product
        }
      } else {
        return '(' + node.text + ')'
      }
    }).join(' ')
  }
}

module.exports = UserAgentBag

function isValidEntry (value) {
  return (
    Boolean(value) &&
    (typeof value === 'object') &&
    ('0' in value) &&
    ('1' in value)
  )
}
