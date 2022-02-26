import UserAgentBag = require("..");

new UserAgentBag();
new UserAgentBag(null);
new UserAgentBag(undefined);
new UserAgentBag("string");
new UserAgentBag([
  ["key", "value"],
  ["key2", null],
]);
new UserAgentBag(
  new Set([
    ["key", "value"],
    ["key2", null],
  ])
);

const bag = new UserAgentBag();

expectType<undefined | null | string>(bag.get("foo"));
expectType<Array<undefined | null | string>>(bag.getAll("bar"));
expectType<boolean>(bag.has("baz"));
expectType<Iterable<[string, string | null]>>(bag.entries());
expectType<number>(bag.size());
expectType<string>(bag.toString());
function expectType<T>(_value: T): void {}
