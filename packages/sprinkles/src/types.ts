type OneToN<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N
  ? // Result[number] is 0 to N so we Exclude 0 to get 1 to N
    Exclude<Result[number], 0>
  : // Pad with a 0 to increase the initial length by 1
    OneToN<N, [...Result, [...Result, 0]['length']]>;

type TestOneToN = Exclude<OneToN<8>, 1>;

export interface ResponsiveArray<Length extends number, Value>
  extends ReadonlyArray<Value> {
  0: Value;
  length: Length;
}

export interface RequiredResponsiveArray<Length extends number, Value>
  extends ReadonlyArray<Value> {
  0: Exclude<Value, null>;
  length: Length;
}

export type ResponsiveArrayConfig<Value> = ResponsiveArray<
  Exclude<OneToN<8>, 1>,
  Value
>;

type ArrayOfN<
  N extends number,
  Result extends Array<unknown> = [],
> = Result['length'] extends N ? Result : ArrayOfN<N, [...Result, 0]>;

type TestArrayOfN = ArrayOfN<8>;

type Increment<A extends number> = [...ArrayOfN<A>, 0]['length'];

type TestIncrement = Increment<2>;

type EnumerateArray<
  MaxLength extends number,
  Count extends Array<unknown> = [],
  Result extends Array<unknown> = [],
> = Result['length'] extends Increment<MaxLength>
  ? Result extends [infer _First, ...infer Rest]
    ? Rest
    : never
  : EnumerateArray<
      MaxLength,
      [...Count, 0],
      [...Result, OneToN<Result['length']>]
    >;

type Test = EnumerateArray<8>;

type EnumerateResponsiveArray<List, Value> = List extends [
  infer First extends number,
  ...infer Rest,
]
  ? [ResponsiveArray<First, Value>, ...EnumerateResponsiveArray<Rest, Value>]
  : [];

type EnumerateRequiredResponsiveArray<List, Value> = List extends [
  infer First extends number,
  ...infer Rest,
]
  ? [
      RequiredResponsiveArray<First, Value>,
      ...EnumerateRequiredResponsiveArray<Rest, Value>,
    ]
  : [];

type Foo = EnumerateResponsiveArray<EnumerateArray<8>, string>;

export type ResponsiveArrayByMaxLength<MaxLength extends number, Value> = [
  never,
  ...EnumerateResponsiveArray<EnumerateArray<MaxLength>, Value | null>,
][MaxLength];

export type RequiredResponsiveArrayByMaxLength<
  MaxLength extends number,
  Value,
> = [
  never,
  ...EnumerateRequiredResponsiveArray<EnumerateArray<MaxLength>, Value | null>,
][MaxLength];

export type ConditionalPropertyValue = {
  defaultClass: string | undefined;
  conditions: {
    [conditionName: string]: string;
  };
};

export type ConditionalWithResponsiveArrayProperty = {
  responsiveArray: Array<string>;
  values: {
    [valueName: string]: ConditionalPropertyValue;
  };
};

export type ConditionalProperty = {
  values: {
    [valueName: string]: ConditionalPropertyValue;
  };
};

export type UnconditionalProperty = {
  values: {
    [valueName: string]: {
      defaultClass: string;
    };
  };
};

export type ShorthandProperty = {
  mappings: Array<string>;
};

export type SprinklesProperties = {
  styles: {
    [property: string]:
      | ConditionalWithResponsiveArrayProperty
      | ConditionalProperty
      | ShorthandProperty
      | UnconditionalProperty;
  };
};

/** @deprecated - Use `SprinklesProperties` */
export type AtomicStyles = SprinklesProperties;
