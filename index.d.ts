declare class UserAgentBag {
  constructor(arg?: null | string | Array<Entry> | Iterable<Entry>);

  entries(): Iterable<Entry>;
  get(product: string): undefined | null | string;
  getAll(product: string): Array<undefined | null | string>;
  has(product: string): boolean;
  size(): number;
  toString(): string;
}

type Entry = [string, null | string];

export = UserAgentBag;
