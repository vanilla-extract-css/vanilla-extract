export interface ResponsiveArray<
  Length extends number,
  Value,
> extends ReadonlyArray<Value> {
  0: Value;
  length: Length;
}

export interface RequiredResponsiveArray<
  Length extends number,
  Value,
> extends ReadonlyArray<Value> {
  0: Exclude<Value, null>;
  length: Length;
}

export type ResponsiveArrayConfig<Value> = ResponsiveArray<
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20,
  Value
>;

type ClampedLength<MaxLength extends number> = MaxLength extends
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  ? MaxLength
  : 20;

export type ResponsiveArrayByMaxLength<MaxLength extends number, Value> = [
  never,
  ResponsiveArray<1, Value | null>,
  ResponsiveArray<1 | 2, Value | null>,
  ResponsiveArray<1 | 2 | 3, Value | null>,
  ResponsiveArray<1 | 2 | 3 | 4, Value | null>,
  ResponsiveArray<1 | 2 | 3 | 4 | 5, Value | null>,
  ResponsiveArray<1 | 2 | 3 | 4 | 5 | 6, Value | null>,
  ResponsiveArray<1 | 2 | 3 | 4 | 5 | 6 | 7, Value | null>,
  ResponsiveArray<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, Value | null>,
  ResponsiveArray<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, Value | null>,
  ResponsiveArray<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, Value | null>,
  ResponsiveArray<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11, Value | null>,
  ResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    Value | null
  >,
  ResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13,
    Value | null
  >,
  ResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14,
    Value | null
  >,
  ResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15,
    Value | null
  >,
  ResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16,
    Value | null
  >,
  ResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17,
    Value | null
  >,
  ResponsiveArray<
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18,
    Value | null
  >,
  ResponsiveArray<
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19,
    Value | null
  >,
  ResponsiveArray<
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20,
    Value | null
  >,
][ClampedLength<MaxLength>];

export type RequiredResponsiveArrayByMaxLength<
  MaxLength extends number,
  Value,
> = [
  never,
  RequiredResponsiveArray<1, Value | null>,
  RequiredResponsiveArray<1 | 2, Value | null>,
  RequiredResponsiveArray<1 | 2 | 3, Value | null>,
  RequiredResponsiveArray<1 | 2 | 3 | 4, Value | null>,
  RequiredResponsiveArray<1 | 2 | 3 | 4 | 5, Value | null>,
  RequiredResponsiveArray<1 | 2 | 3 | 4 | 5 | 6, Value | null>,
  RequiredResponsiveArray<1 | 2 | 3 | 4 | 5 | 6 | 7, Value | null>,
  RequiredResponsiveArray<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, Value | null>,
  RequiredResponsiveArray<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, Value | null>,
  RequiredResponsiveArray<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10, Value | null>,
  RequiredResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11,
    Value | null
  >,
  RequiredResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
    Value | null
  >,
  RequiredResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13,
    Value | null
  >,
  RequiredResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14,
    Value | null
  >,
  RequiredResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15,
    Value | null
  >,
  RequiredResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16,
    Value | null
  >,
  RequiredResponsiveArray<
    1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17,
    Value | null
  >,
  RequiredResponsiveArray<
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18,
    Value | null
  >,
  RequiredResponsiveArray<
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19,
    Value | null
  >,
  RequiredResponsiveArray<
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20,
    Value | null
  >,
][ClampedLength<MaxLength>];

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
