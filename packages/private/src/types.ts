export type CSSVarFunction =
  | `var(--${string})`
  | `var(--${string}, ${string | number})`;

export type Contract = {
  [key: string]: CSSVarFunction | null | Contract;
};

export type MapLeafNodes<Obj, LeafType> = {
  [Prop in keyof Obj]: Obj[Prop] extends Record<string | number, any>
    ? MapLeafNodes<Obj[Prop], LeafType>
    : LeafType;
};
