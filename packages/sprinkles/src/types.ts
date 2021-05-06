export type RA1<Value> = readonly [Value];
export type RA2<Value> = readonly [Value, Value];
export type RA3<Value> = readonly [Value, Value, Value];
export type RA4<Value> = readonly [Value, Value, Value, Value];
export type RA5<Value> = readonly [Value, Value, Value, Value, Value];
export type RA6<Value> = readonly [Value, Value, Value, Value, Value, Value];
export type RA7<Value> = readonly [
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
];
export type RA8<Value> = readonly [
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
  Value,
];

export type ResponsiveArrayConfig<Value> =
  | RA2<Value>
  | RA3<Value>
  | RA4<Value>
  | RA5<Value>
  | RA6<Value>
  | RA7<Value>
  | RA8<Value>;

export type ResponsiveArray<Count extends number, Value> = [
  never,
  RA1<Value>,
  RA1<Value> | RA2<Value>,
  RA1<Value> | RA2<Value> | RA3<Value>,
  RA1<Value> | RA2<Value> | RA3<Value> | RA4<Value>,
  RA1<Value> | RA2<Value> | RA3<Value> | RA4<Value> | RA5<Value>,
  RA1<Value> | RA2<Value> | RA3<Value> | RA4<Value> | RA5<Value> | RA6<Value>,
  (
    | RA1<Value>
    | RA2<Value>
    | RA3<Value>
    | RA4<Value>
    | RA5<Value>
    | RA6<Value>
    | RA7<Value>
  ),
  (
    | RA1<Value>
    | RA2<Value>
    | RA3<Value>
    | RA4<Value>
    | RA5<Value>
    | RA6<Value>
    | RA7<Value>
    | RA8<Value>
  ),
][Count];
