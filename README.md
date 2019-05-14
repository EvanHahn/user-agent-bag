User Agent Bag
==============

Parse User-Agents per [RFC7231](https://tools.ietf.org/html/rfc7231#section-5.5.3). Doesn't handle all the weirdness around real User-Agents, just parses things per the spec.

```js
const UserAgentBag = require('user-agent-bag')

const bag = new UserAgentBag('Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:47.0) Gecko/20100101 Firefox/47.0')

bag.get('Mozilla')
// => '5.0'

bag.has('Gecko')
// => true
```
