export type RA2<Value> = [Value, Value];
export type RA3<Value> = [Value, Value, Value];
export type RA4<Value> = [Value, Value, Value, Value];
export type RA5<Value> = [Value, Value, Value, Value, Value];

export type ResponsiveArrayConfig<Value> =
  | RA2<Value>
  | RA3<Value>
  | RA4<Value>
  | RA5<Value>;

export type ResponsiveArray<Count extends number, Value> = [
  never,
  never,
  RA2<Value>,
  RA2<Value> | RA3<Value>,
  RA2<Value> | RA3<Value> | RA4<Value>,
  RA2<Value> | RA3<Value> | RA4<Value> | RA5<Value>,
][Count];
