import type { CSSProperties } from '@vanilla-extract/css';

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

export interface Condition {
  '@media'?: string;
  '@supports'?: string;
  selector?: string;
}

export type BaseConditions = { [conditionName: string]: Condition };

export type AtomicProperties = {
  [Property in keyof CSSProperties]?:
    | Record<string, CSSProperties[Property]>
    | ReadonlyArray<CSSProperties[Property]>;
};

export type ShorthandOptions<
  Properties extends AtomicProperties,
  Shorthands extends { [shorthandName: string]: Array<keyof Properties> }
> = {
  shorthands: Shorthands;
};

export type UnconditionalAtomicOptions<Properties extends AtomicProperties> = {
  properties: Properties;
};

export type ResponsiveArrayOptions<
  Conditions extends { [conditionName: string]: Condition },
  ResponsiveLength extends number
> = {
  responsiveArray: ResponsiveArrayConfig<keyof Conditions> & {
    length: ResponsiveLength;
  };
};

export type ConditionalAtomicOptions<
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  DefaultCondition extends keyof Conditions | false
> = UnconditionalAtomicOptions<Properties> & {
  conditions: Conditions;
  defaultCondition: DefaultCondition;
};

export type Values<Property, Result> = {
  [Value in Property extends ReadonlyArray<any>
    ? Property[number]
    : Property extends Array<any>
    ? Property[number]
    : keyof Property]: Result;
};

export type UnconditionalAtomicStyles<Properties extends AtomicProperties> = {
  conditions: never;
  styles: {
    [Property in keyof Properties]: {
      values: Values<Properties[Property], { defaultClass: string }>;
    };
  };
};

export type ConditionalAtomicStyles<
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  DefaultCondition extends keyof Conditions | false
> = {
  conditions: {
    defaultCondition: DefaultCondition;
    conditionNames: Array<keyof Conditions>;
  };
  styles: {
    [Property in keyof Properties]: {
      values: Values<
        Properties[Property],
        {
          defaultClass: DefaultCondition extends string ? string : undefined;
          conditions: {
            [Rule in keyof Conditions]: string;
          };
        }
      >;
    };
  };
};

export type ConditionalWithResponsiveArrayAtomicStyles<
  Properties extends AtomicProperties,
  Conditions extends { [conditionName: string]: Condition },
  ResponsiveLength extends number,
  DefaultCondition extends keyof Conditions | false
> = {
  conditions: {
    defaultCondition: DefaultCondition;
    conditionNames: Array<keyof Conditions>;
    responsiveArray: Array<keyof Conditions> & { length: ResponsiveLength };
  };
  styles: {
    [Property in keyof Properties]: {
      responsiveArray: Array<keyof Conditions> & { length: ResponsiveLength };
      values: Values<
        Properties[Property],
        {
          defaultClass: DefaultCondition extends string ? string : undefined;
          conditions: {
            [Rule in keyof Conditions]: string;
          };
        }
      >;
    };
  };
};

export type ShorthandAtomicStyles<
  Shorthands extends {
    [shorthandName: string]: Array<string | number | symbol>;
  }
> = {
  styles: {
    [Shorthand in keyof Shorthands]: {
      mappings: Shorthands[Shorthand];
    };
  };
};
