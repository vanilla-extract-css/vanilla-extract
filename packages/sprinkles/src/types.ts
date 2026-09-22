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

/**
 * Produces the union `1 | 2 | ... | MaxLength` for a literal `MaxLength`.
 */
type LengthUpTo<
  MaxLength extends number,
  Counter extends ReadonlyArray<unknown> = [unknown],
  Result = never,
> = Counter['length'] extends MaxLength
  ? Result | MaxLength
  : LengthUpTo<MaxLength, [...Counter, unknown], Result | Counter['length']>;

export type ResponsiveArrayConfig<Value> = readonly [Value, Value, ...Value[]];

export type ResponsiveArrayByMaxLength<
  MaxLength extends number,
  Value,
> = ResponsiveArray<LengthUpTo<MaxLength>, Value | null>;

export type RequiredResponsiveArrayByMaxLength<
  MaxLength extends number,
  Value,
> = RequiredResponsiveArray<LengthUpTo<MaxLength>, Value | null>;

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
