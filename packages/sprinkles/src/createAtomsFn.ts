import { ResponsiveArray } from './types';

type ConditionalValue = {
  defaultClass: string | undefined;
  conditions: {
    [conditionName: string]: string;
  };
};

type ConditionalWithResponsiveArrayProperty = {
  responsiveArray: Array<string>;
  values: {
    [valueName: string]: ConditionalValue;
  };
};

type ConditionalProperty = {
  values: {
    [valueName: string]: ConditionalValue;
  };
};

type UnconditionalProperty = {
  values: {
    [valueName: string]: {
      defaultClass: string;
    };
  };
};

type ShorthandProperty = {
  mappings: Array<string>;
};

export type AtomicStyles = {
  [property: string]:
    | ConditionalWithResponsiveArrayProperty
    | ConditionalProperty
    | ShorthandProperty
    | UnconditionalProperty;
};

type ResponsiveArrayVariant<
  RA extends { length: number },
  Values extends string | number | symbol
> = ResponsiveArray<RA['length'], Values | null>;

type ConditionalStyle<Values extends { [key: string]: ConditionalValue }> =
  | (Values[keyof Values]['defaultClass'] extends string ? keyof Values : never)
  | {
      [Condition in keyof Values[keyof Values]['conditions']]?: keyof Values;
    };

type ConditionalStyleWithResponsiveArray<
  Values extends { [key: string]: ConditionalValue },
  RA extends { length: number }
> = ConditionalStyle<Values> | ResponsiveArrayVariant<RA, keyof Values>;

type ChildAtomProps<Atoms extends AtomicStyles> = {
  [Prop in keyof Atoms]?: Atoms[Prop] extends ConditionalWithResponsiveArrayProperty
    ? ConditionalStyleWithResponsiveArray<
        Atoms[Prop]['values'],
        Atoms[Prop]['responsiveArray']
      >
    : Atoms[Prop] extends ConditionalProperty
    ? ConditionalStyle<Atoms[Prop]['values']>
    : Atoms[Prop] extends ShorthandProperty
    ? Atoms[Atoms[Prop]['mappings'][number]] extends ConditionalWithResponsiveArrayProperty
      ? ConditionalStyleWithResponsiveArray<
          Atoms[Atoms[Prop]['mappings'][number]]['values'],
          Atoms[Atoms[Prop]['mappings'][number]]['responsiveArray']
        >
      : Atoms[Atoms[Prop]['mappings'][number]] extends ConditionalProperty
      ? ConditionalStyle<Atoms[Atoms[Prop]['mappings'][number]]['values']>
      : Atoms[Atoms[Prop]['mappings'][number]] extends UnconditionalProperty
      ? keyof Atoms[Atoms[Prop]['mappings'][number]]['values']
      : never
    : Atoms[Prop] extends UnconditionalProperty
    ? keyof Atoms[Prop]['values']
    : never;
};

type AtomProps<Args extends ReadonlyArray<any>> = Args extends [
  infer L,
  ...infer R
]
  ? (L extends AtomicStyles ? ChildAtomProps<L> : never) & AtomProps<R>
  : {};

export type AtomsFn<Args extends ReadonlyArray<AtomicStyles>> = (
  props: AtomProps<Args>,
) => string;

export function createAtomsFn<Args extends ReadonlyArray<AtomicStyles>>(
  ...args: Args
): AtomsFn<Args> {
  const atomicStyles = Object.assign({}, ...args);
  const shorthandNames = Object.keys(atomicStyles).filter(
    (property) => 'mappings' in atomicStyles[property],
  );

  return (props: any) => {
    const classNames = [];
    const shorthands: any = {};
    const nonShorthands: any = { ...props };
    let hasShorthands = false;

    for (const shorthand of shorthandNames) {
      const value = props[shorthand];
      if (value) {
        const atomicProperty = atomicStyles[shorthand];
        hasShorthands = true;
        for (const propMapping of atomicProperty.mappings) {
          shorthands[propMapping] = value;
          if (!nonShorthands[propMapping]) {
            delete nonShorthands[propMapping];
          }
        }
      }
    }

    const finalProps = hasShorthands
      ? { ...shorthands, ...nonShorthands }
      : props;

    for (const prop in finalProps) {
      const propValue = finalProps[prop];
      const atomicProperty = atomicStyles[prop];
      try {
        if (atomicProperty.mappings) {
          // Skip shorthands
          continue;
        }

        if (typeof propValue === 'string' || typeof propValue === 'number') {
          classNames.push(atomicProperty.values[propValue].defaultClass);
        } else if (Array.isArray(propValue)) {
          for (const responsiveIndex in propValue) {
            const responsiveValue = propValue[responsiveIndex];

            if (responsiveValue != null) {
              const conditionName =
                atomicProperty.responsiveArray[responsiveIndex];

              if (process.env.NODE_ENV !== 'production') {
                if (
                  !atomicProperty.values[responsiveValue].conditions[
                    conditionName
                  ]
                ) {
                  throw new Error();
                }
              }

              classNames.push(
                atomicProperty.values[responsiveValue].conditions[
                  conditionName
                ],
              );
            }
          }
        } else {
          for (const conditionName in propValue) {
            // Conditional style
            const value = propValue[conditionName];

            if (process.env.NODE_ENV !== 'production') {
              if (!atomicProperty.values[value].conditions[conditionName]) {
                throw new Error();
              }
            }
            classNames.push(
              atomicProperty.values[value].conditions[conditionName],
            );
          }
        }
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          class SprinklesError extends Error {
            constructor(message: string) {
              super(message);
              this.name = 'SprinklesError';
            }
          }

          const format = (v: string | number) =>
            typeof v === 'string' ? `"${v}"` : v;

          const invalidPropValue = (
            prop: string,
            value: string | number,
            possibleValues: Array<string | number>,
          ) => {
            throw new SprinklesError(
              `"${prop}" has no value ${format(
                value,
              )}. Possible values are ${Object.keys(possibleValues)
                .map(format)
                .join(', ')}`,
            );
          };

          if (!atomicProperty) {
            throw new SprinklesError(`"${prop}" is not a valid atom property`);
          }

          if (
            (typeof propValue === 'string' || typeof propValue === 'number') &&
            !(propValue in atomicProperty.values)
          ) {
            invalidPropValue(prop, propValue, atomicProperty.values);
          }

          if (typeof propValue === 'object') {
            if (
              !(
                'conditions' in
                atomicProperty.values[Object.keys(atomicProperty.values)[0]]
              )
            ) {
              throw new SprinklesError(
                `"${prop}" is not a conditional property`,
              );
            }

            if (Array.isArray(propValue)) {
              if (!('responsiveArray' in atomicProperty)) {
                throw new SprinklesError(
                  `"${prop}" is does not support responsive arrays`,
                );
              }

              const breakpointCount = atomicProperty.responsiveArray.length;
              if (breakpointCount < propValue.length) {
                throw new SprinklesError(
                  `"${prop}" only suports upto ${breakpointCount} breakpoints. You passed ${propValue.length}`,
                );
              }

              for (const responsiveValue of propValue) {
                if (!atomicProperty.values[responsiveValue]) {
                  invalidPropValue(
                    prop,
                    responsiveValue,
                    atomicProperty.values,
                  );
                }
              }
            } else {
              for (const conditionName in propValue) {
                const value = propValue[conditionName];

                if (!atomicProperty.values[value]) {
                  invalidPropValue(prop, value, atomicProperty.values);
                }

                if (!atomicProperty.values[value].conditions[conditionName]) {
                  throw new SprinklesError(
                    `"${prop}" has no condition named ${format(
                      conditionName,
                    )}. Possible values are ${Object.keys(
                      atomicProperty.values[value].conditions,
                    )
                      .map(format)
                      .join(', ')}`,
                  );
                }
              }
            }
          }
        }

        throw e;
      }
    }

    return classNames.join(' ');
  };
}
