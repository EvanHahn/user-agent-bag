User Agent Bag
==============

Parse User-Agents per [RFC7231](https://tools.ietf.org/html/rfc7231#section-5.5.3). Doesn't handle all the weirdness around real User-Agents, just parses things per the spec.

```js
const UserAgentBag = require('user-agent-bag')

const firefoxBag = new UserAgentBag('Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:47.0) Gecko/20100101 Firefox/47.0')
firefoxBag.get('Mozilla')
// => '5.0'
firefoxBag.has('Gecko')
// => true

const customBag = new UserAgentBag([
  ['Foo', 'bar'],
  ['Baz', null]
])
customBag.toString()
// => 'Foo/bar Baz'
```

API documentation
-----------------

<details>
<summary><code>new UserAgentBag(string)</code></summary>

Creates a new `UserAgentBag` by parsing `string` as a User-Agent per [RFC7231](https://tools.ietf.org/html/rfc7231#section-5.5.3). `string` must have a length of 256 characters or less (this limit may be configurable in the future). If there are any errors in parsing, the bag will be empty.

```js
const validBag = new UserAgentBag('Foo/1.2')
validBag.get('Foo')
// => '1.2'

const invalidStringBag = new UserAgentBag('Foo/1.2 IsInvalidBecauseVersionIsMissing/')
invalidStringBag.get('Foo')
// => undefined
```
</details>

<details>
<summary><code>new UserAgentBag(iterable)</code></summary>

Creates a new `UserAgentBag` from `iterable`. Elements of `iterable` are key-value pairs.

```js
const bagFromEntries = new UserAgentBag([
  ['Foo', '1.2'],
  ['Bar', null]
])
bagFromEntries.toString()
// => 'Foo/1.2 Bar'

const myMap = new Map()
myMap.set('Baz', '5')
myMap.set('Qux', '6')
const bagFromMap = new UserAgentBag(myMap)
bagFromMap.toString()
// => 'Baz/5 Qux/6'
```
</details>

<details>
<summary><code>UserAgentBag.prototype.entries()</code></summary>

Returns an iterable yielding each of the product-version pairs in the bag. Like `Map.prototype.entries`.

```js
const bag = new UserAgentBag('Foo/1.2 Bar Baz/3.4')

for (const [product, version] of bag.entries()) {
  console.log(product + ' version ' + version)
}
// Logs:
// Foo version 1.2
// Bar version null
// Baz version 3.4
```
</details>

<details>
<summary><code>UserAgentBag.prototype.get(product)</code></summary>

Returns the version of the product. If `product` is in the bag multiple times, only the first value is returned. If no version is specified, `null` is returned. If the product is missing from the bag, `undefined` is returned.

```js
const bag = new UserAgentBag('Foo/1.2 Bar/4.5 Bar/6.7 Baz')

bag.get('Foo')
// => '1.2'

bag.get('Bar')
// => '4.5'

bag.get('Baz')
// => null

bag.get('missing')
// => undefined

bag.get('foo')
// => undefined
```
</details>

<details>
<summary><code>UserAgentBag.prototype.getAll(product)</code></summary>

Returns all specified versions of the product as an array. `null` represents the absence of a version. If the product is missing from the bag, the empty array is returned.

```js
const bag = new UserAgentBag('Foo/1.2 Bar/4.5 Bar/null')

bag.getAll('Foo')
// => ['1.2']

bag.getAll('Bar')
// => ['4.5', null]

bag.get('missing')
// => []
```
</details>

<details>
<summary><code>UserAgentBag.prototype.has(product)</code></summary>

Returns `true` if `product` is in the bag, `false` otherwise.

```js
const bag = new UserAgentBag('Foo/1.2 Bar')

bag.has('Foo')
// => true

bag.has('Bar')
// => true

bag.has('missing')
// => false
```
</details>

<details>
<summary><code>UserAgentBag.prototype.toString()</code></summary>

Converts the bag to a string. Useful when constructing your own User-Agents.

```js
const bag = new UserAgentBag([
  ['Foo', '1.2'],
  ['Bar', null]
])
bag.toString()
// => 'Foo/1.2 Bar'
```
</details>
