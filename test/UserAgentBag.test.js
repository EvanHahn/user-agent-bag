const assert = require("node:assert/strict");
const test = require("node:test");
const UserAgentBag = require("../UserAgentBag");

test("parsing a string with products and comments", () => {
  const bag = new UserAgentBag(
    "Foo/fooVersion (comment (nested)!) Bar Baz/bazVersion (comment2) Bar/secondBar",
  );

  assert(bag.has("Foo"));
  assert.equal(bag.get("Foo"), "fooVersion");
  assert.deepEqual(bag.getAll("Foo"), ["fooVersion"]);

  assert(bag.has("Bar"));
  assert.equal(bag.get("Bar"), null);
  assert.deepEqual(bag.getAll("Bar"), [null, "secondBar"]);

  assert(bag.has("Baz"));
  assert.equal(bag.get("Baz"), "bazVersion");
  assert.deepEqual(bag.getAll("Baz"), ["bazVersion"]);

  assert(!bag.has("Garbage"));
  assert(!bag.has("foo"));
  assert(!bag.has(""));

  assert.equal(bag.get("Garbage"), undefined);
  assert.equal(bag.get("foo"), undefined);
  assert.deepEqual(bag.getAll("Garbage"), []);
  assert.deepEqual(bag.getAll("foo"), []);

  assert.deepEqual(
    [...bag.entries()],
    [
      ["Foo", "fooVersion"],
      ["Bar", null],
      ["Baz", "bazVersion"],
      ["Bar", "secondBar"],
    ],
  );
  assert.deepEqual(
    [...bag],
    [
      ["Foo", "fooVersion"],
      ["Bar", null],
      ["Baz", "bazVersion"],
      ["Bar", "secondBar"],
    ],
  );

  assert.equal(bag.size(), 4);

  assert.equal(
    bag.toString(),
    "Foo/fooVersion (comment (nested)!) Bar Baz/bazVersion (comment2) Bar/secondBar",
  );
});

test("can convert entries to a bag", () => {
  const entries = [
    ["Foo", "bar"],
    ["Baz", null],
    ["Foo", "two"],
  ];

  const bag = new UserAgentBag(entries);

  assert.deepEqual(bag.getAll("Foo"), ["bar", "two"]);
  assert.deepEqual(bag.getAll("Baz"), [null]);

  assert.equal(bag.size(), 3);

  assert.equal(bag.toString(), "Foo/bar Baz Foo/two");
});

test("returns an empty bag if the string is malformed", () => {
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
    assert.deepEqual([...bag.entries()], []);
    assert.equal(bag.size(), 0);
  }
});

test("returns an empty bag if null or undefined are passed", () => {
  const nullBag = new UserAgentBag(null);
  assert.deepEqual([...nullBag.entries()], []);
  assert.equal(nullBag.size(), 0);

  const undefinedBag = new UserAgentBag(undefined);
  assert.deepEqual([...undefinedBag.entries()], []);
  assert.equal(undefinedBag.size(), 0);
});

test("throws if bogus types are passed", () => {
  const testCases = [0, 123, true, false, { toString: () => "User/agent" }];

  for (const testCase of testCases) {
    assert.throws(() => new UserAgentBag(/*:: ( */ testCase /*:: : any) */));
  }
});
