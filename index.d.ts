export = UserAgentBag;
export as namespace UserAgentBag;

declare namespace UserAgentBag {
  export type Entry = [string, string | null];

  export type Entries = Iterable<Entry>;

  type UserAgentBagNode = (
    {
      type: 'product',
      product: string,
      version: string | null
    } | {
      type: 'comment',
      text: string
    }
  );
}

declare class UserAgentBag {
  constructor(arg?: string | UserAgentBag.Entries | null);

  get(product: string): string | null | void;
  getAll(product: string): Array<string | null | void>;
  has(product: string): boolean;
  entries(): UserAgentBag.Entries;
  size(): number;

  toString(): string;
}
