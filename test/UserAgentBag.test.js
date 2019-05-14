import test from 'ava'

import UserAgentBag from '../UserAgentBag'

test('parsing a string with products and comments', t => {
  const bag = new UserAgentBag('Foo/fooVersion (comment (nested)!) Bar Baz/bazVersion (comment2) Bar/secondBar')

  t.assert(bag.has('Foo'))
  t.is(bag.get('Foo'), 'fooVersion')
  t.deepEqual(bag.getAll('Foo'), ['fooVersion'])

  t.assert(bag.has('Bar'))
  t.is(bag.get('Bar'), null)
  t.deepEqual(bag.getAll('Bar'), [null, 'secondBar'])

  t.assert(bag.has('Baz'))
  t.is(bag.get('Baz'), 'bazVersion')
  t.deepEqual(bag.getAll('Baz'), ['bazVersion'])

  t.assert(!bag.has('Garbage'))
  t.assert(!bag.has('foo'))
  t.assert(!bag.has(''))

  t.is(bag.get('Garbage'), undefined)
  t.is(bag.get('foo'), undefined)
  t.deepEqual(bag.getAll('Garbage'), [])
  t.deepEqual(bag.getAll('foo'), [])

  t.deepEqual([...bag], [
    {
      type: 'product',
      product: 'Foo',
      version: 'fooVersion'
    },
    {
      type: 'comment',
      text: 'comment (nested)!'
    },
    {
      type: 'product',
      product: 'Bar',
      version: null
    },
    {
      type: 'product',
      product: 'Baz',
      version: 'bazVersion'
    },
    {
      type: 'comment',
      text: 'comment2'
    },
    {
      type: 'product',
      product: 'Bar',
      version: 'secondBar'
    }
  ])

  t.is(bag.toString(), 'Foo/fooVersion (comment (nested)!) Bar Baz/bazVersion (comment2) Bar/secondBar')
})

test('can convert entries to a bag', t => {
  const entries = [
    ['Foo', 'bar'],
    ['Baz', null],
    ['Foo', 'two']
  ]

  const bag = new UserAgentBag(entries)

  t.deepEqual(bag.getAll('Foo'), ['bar', 'two'])
  t.deepEqual(bag.getAll('Baz'), [null])

  t.is(bag.toString(), 'Foo/bar Baz Foo/two')
})

test('fails if the string is malformed', t => {
  const testCases = [
    '',
    'NoVersion/',
    '(starts with comment) Mozilla/5.0',
    ' LeadingWhitespace/1',
    'Trailing/whitespace ',
    'Am(biguous)/1',
    'Inv[alid]/1',
    'Invalid/[two]'
  ]

  for (const testCase of testCases) {
    const bag = new UserAgentBag(testCase)
    t.deepEqual([...bag], [])
    t.assert(typeof bag.error.message === 'string')
  }
})
