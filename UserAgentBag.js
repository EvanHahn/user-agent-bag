const parser = require("./parser");

const MAX_STRING_LENGTH = 256;

class UserAgentBag {
  constructor(arg) {
    const { nodes, asMap } = parse(arg);
    this._nodes = nodes;
    this._asMap = asMap;
  }

  get(product) {
    const allVersions = this._asMap.get(product);
    return allVersions ? allVersions[0] : undefined;
  }

  getAll(product) {
    return this._asMap.get(product) || [];
  }

  has(product) {
    return this._asMap.has(product);
  }

  entries() {
    return new UserAgentBagEntries(this._nodes);
  }

  size() {
    return this._nodes.reduce(
      (total, node) => (node.type === "product" ? total + 1 : total),
      0,
    );
  }

  toString() {
    return this._nodes
      .map((node) => {
        if (node.type === "product") {
          if (node.version) {
            return node.product + "/" + node.version;
          } else {
            return node.product;
          }
        } else {
          return "(" + node.text + ")";
        }
      })
      .join(" ");
  }

  [Symbol.iterator]() {
    return this.entries()[Symbol.iterator]();
  }
}

module.exports = UserAgentBag;

function parse(arg) {
  if (arg === undefined || arg === null) {
    return {
      nodes: [],
      asMap: new Map(),
    };
  } else if (typeof arg === "string") {
    return parseString(arg);
  } else if (arg && arg[Symbol.iterator]) {
    return parseIterable(arg);
  } else {
    throw new TypeError(
      "UserAgentBag must be constructed with a string or an iterable",
    );
  }
}

function parseString(str) {
  let nodes = [];
  const asMap = new Map();

  if (str.length && str.length <= MAX_STRING_LENGTH) {
    try {
      nodes = parser.parse(str);
    } catch (err) {
      // Do nothing
    }
  }

  for (const node of nodes) {
    if (node.type !== "product") {
      continue;
    } else if (asMap.has(node.product)) {
      asMap.get(node.product).push(node.version);
    } else {
      asMap.set(node.product, [node.version]);
    }
  }

  return { nodes, asMap };
}

function parseIterable(iterable) {
  const nodes = [];
  const asMap = new Map();

  for (const entry of iterable) {
    if (!isValidEntry(entry)) {
      throw new Error("Iterator value is not an entry object");
    }
    // Entries can be arraylike objects which is why we can't use destructuring here.
    const product = entry[0];
    const version = entry[1];

    nodes.push({
      type: "product",
      product,
      version,
    });

    if (asMap.has(product)) {
      asMap.get(product).push(version);
    } else {
      asMap.set(product, [version]);
    }
  }

  return { nodes, asMap };
}

function isValidEntry(value) {
  return (
    Boolean(value) && typeof value === "object" && "0" in value && "1" in value
  );
}

class UserAgentBagEntries {
  constructor(nodes) {
    this._nodes = nodes;
  }

  *[Symbol.iterator]() {
    for (const node of this._nodes) {
      if (node.type === "product") {
        yield [node.product, node.version];
      }
    }
  }
}
