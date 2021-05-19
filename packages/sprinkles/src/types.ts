type Tuple<Length extends number, Value> = ReadonlyArray<Value> & {
  length: Length;
};

export type ResponsiveArrayConfig<Value> = Tuple<
  1 | 2 | 3 | 5 | 6 | 7 | 8,
  Value
>;

export type ResponsiveArray<Count extends number, Value> = [
  never,
  Tuple<1, Value>,
  Tuple<1 | 2, Value>,
  Tuple<1 | 2 | 3, Value>,
  Tuple<1 | 2 | 3 | 4, Value>,
  Tuple<1 | 2 | 3 | 4 | 5, Value>,
  Tuple<1 | 2 | 3 | 4 | 5 | 6, Value>,
  Tuple<1 | 2 | 3 | 4 | 5 | 6 | 7, Value>,
  Tuple<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, Value>,
][Count];

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

export type AtomicStyles = {
  styles: {
    [property: string]:
      | ConditionalWithResponsiveArrayProperty
      | ConditionalProperty
      | ShorthandProperty
      | UnconditionalProperty;
  };
};
