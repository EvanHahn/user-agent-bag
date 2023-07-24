const test = require("ava");
const UserAgentBag = require("../UserAgentBag");

test("parsing a string with products and comments", (t) => {
  const bag = new UserAgentBag(
    "Foo/fooVersion (comment (nested)!) Bar Baz/bazVersion (comment2) Bar/secondBar",
  );

  t.assert(bag.has("Foo"));
  t.is(bag.get("Foo"), "fooVersion");
  t.deepEqual(bag.getAll("Foo"), ["fooVersion"]);

  t.assert(bag.has("Bar"));
  t.is(bag.get("Bar"), null);
  t.deepEqual(bag.getAll("Bar"), [null, "secondBar"]);

  t.assert(bag.has("Baz"));
  t.is(bag.get("Baz"), "bazVersion");
  t.deepEqual(bag.getAll("Baz"), ["bazVersion"]);

  t.assert(!bag.has("Garbage"));
  t.assert(!bag.has("foo"));
  t.assert(!bag.has(""));

  t.is(bag.get("Garbage"), undefined);
  t.is(bag.get("foo"), undefined);
  t.deepEqual(bag.getAll("Garbage"), []);
  t.deepEqual(bag.getAll("foo"), []);

  t.deepEqual(
    [...bag.entries()],
    [
      ["Foo", "fooVersion"],
      ["Bar", null],
      ["Baz", "bazVersion"],
      ["Bar", "secondBar"],
    ],
  );
  t.deepEqual(
    [...bag],
    [
      ["Foo", "fooVersion"],
      ["Bar", null],
      ["Baz", "bazVersion"],
      ["Bar", "secondBar"],
    ],
  );

  t.is(bag.size(), 4);

  t.is(
    bag.toString(),
    "Foo/fooVersion (comment (nested)!) Bar Baz/bazVersion (comment2) Bar/secondBar",
  );
});

test("can convert entries to a bag", (t) => {
  const entries = [
    ["Foo", "bar"],
    ["Baz", null],
    ["Foo", "two"],
  ];

  const bag = new UserAgentBag(entries);

  t.deepEqual(bag.getAll("Foo"), ["bar", "two"]);
  t.deepEqual(bag.getAll("Baz"), [null]);

  t.is(bag.size(), 3);

  t.is(bag.toString(), "Foo/bar Baz Foo/two");
});

test("returns an empty bag if the string is malformed", (t) => {
  const testCases = [
    "",
    "NoVersion/",
    "(starts with comment) Mozilla/5.0",
    "Test/Invalid (comment",
    "Test (invalid comment",
    " LeadingWhitespace/1",
    "Trailing/whitespace ",
    "Am(biguous)/1",
    "Inv[alid]/1",
    "Invalid/[two]",
    "b".repeat(257),
  ];

  for (const testCase of testCases) {
    const bag = new UserAgentBag(testCase);
    t.deepEqual([...bag.entries()], []);
    t.is(bag.size(), 0);
  }
});

test("returns an empty bag if null or undefined are passed", (t) => {
  const nullBag = new UserAgentBag(null);
  t.deepEqual([...nullBag.entries()], []);
  t.is(nullBag.size(), 0);

  const undefinedBag = new UserAgentBag(undefined);
  t.deepEqual([...undefinedBag.entries()], []);
  t.is(undefinedBag.size(), 0);
});

test("throws if bogus types are passed", (t) => {
  const testCases = [0, 123, true, false, { toString: () => "User/agent" }];

  for (const testCase of testCases) {
    t.throws(() => new UserAgentBag(/*:: ( */ testCase /*:: : any) */));
  }
});
