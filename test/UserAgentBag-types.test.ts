import { Entry } from '..'
import test from 'ava'
import UserAgentBag = require('..')

test('UserAgentBag types', t => {
  const bag1 = new UserAgentBag('Foo/fooVersion (comment (nested)!) Bar Baz/bazVersion (comment2) Bar/secondBar')
  t.assert(bag1.has('Foo'))
  const bag2 = new UserAgentBag([
    ['Foo', '1'],
    ['Bar', '2'],
    ['Baz', '3']
  ] as Array<Entry>)
  t.assert(bag2.has('Foo'))
})
