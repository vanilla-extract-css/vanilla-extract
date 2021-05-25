interface ResponsiveArray<Length extends number, Value>
  extends ReadonlyArray<Value> {
  0: Value;
  length: Length;
}

interface RequiredResponsiveArray<Length extends number, Value>
  extends ReadonlyArray<Value> {
  0: Exclude<Value, null>;
  length: Length;
}

export type ResponsiveArrayConfig<
  Value extends string | number
> = ResponsiveArray<2 | 3 | 5 | 6 | 7 | 8, Value>;

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
][MaxLength];

export type RequiredResponsiveArrayByMaxLength<
  MaxLength extends number,
  Value
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

export type AtomicStyles = {
  styles: {
    [property: string]:
      | ConditionalWithResponsiveArrayProperty
      | ConditionalProperty
      | ShorthandProperty
      | UnconditionalProperty;
  };
};
