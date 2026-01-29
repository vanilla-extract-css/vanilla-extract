import type {
  ResponsiveArrayByMaxLength,
  ConditionalPropertyValue,
  SprinklesProperties,
  ConditionalWithResponsiveArrayProperty,
  ConditionalProperty,
  ShorthandProperty,
  UnconditionalProperty,
} from './types';

type ResponsiveArrayVariant<
  RA extends { length: number },
  Values extends string | number | symbol,
> = ResponsiveArrayByMaxLength<RA['length'], Values | null>;

type ConditionalStyle<
  Values extends { [key: string]: ConditionalPropertyValue },
> =
  | (Values[keyof Values]['defaultClass'] extends string ? keyof Values : never)
  | {
      [Condition in keyof Values[keyof Values]['conditions']]?: keyof Values;
    }
  | undefined;

type ConditionalStyleWithResponsiveArray<
  Values extends { [key: string]: ConditionalPropertyValue },
  RA extends { length: number },
> = ConditionalStyle<Values> | ResponsiveArrayVariant<RA, keyof Values>;

type ChildSprinkleProps<Sprinkles extends SprinklesProperties['styles']> = {
  [Prop in keyof Sprinkles]?: Sprinkles[Prop] extends ConditionalWithResponsiveArrayProperty
    ? ConditionalStyleWithResponsiveArray<
        Sprinkles[Prop]['values'],
        Sprinkles[Prop]['responsiveArray']
      >
    : Sprinkles[Prop] extends ConditionalProperty
    ? ConditionalStyle<Sprinkles[Prop]['values']>
    : Sprinkles[Prop] extends ShorthandProperty
    ? Sprinkles[Sprinkles[Prop]['mappings'][number]] extends ConditionalWithResponsiveArrayProperty
      ? ConditionalStyleWithResponsiveArray<
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['values'],
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['responsiveArray']
        >
      : Sprinkles[Sprinkles[Prop]['mappings'][number]] extends ConditionalProperty
      ? ConditionalStyle<
          Sprinkles[Sprinkles[Prop]['mappings'][number]]['values']
        >
      : Sprinkles[Sprinkles[Prop]['mappings'][number]] extends UnconditionalProperty
      ?
          | keyof Sprinkles[Sprinkles[Prop]['mappings'][number]]['values']
          | undefined
      : never
    : Sprinkles[Prop] extends UnconditionalProperty
    ? keyof Sprinkles[Prop]['values'] | undefined
    : never;
};

type SprinkleProps<Args extends ReadonlyArray<any>> = Args extends [
  infer L,
  ...infer R,
]
  ? (L extends SprinklesProperties ? ChildSprinkleProps<L['styles']> : never) &
      SprinkleProps<R>
  : {};

export type SprinklesFn<Args extends ReadonlyArray<SprinklesProperties>> = ((
  props: SprinkleProps<Args>,
) => string) & { properties: Set<keyof SprinkleProps<Args>> };

export const createSprinkles =
  <Args extends ReadonlyArray<SprinklesProperties>>(
    composeStyles: (classList: string) => string,
  ) =>
  (...args: Args): SprinklesFn<Args> => {
    const sprinklesStyles = Object.assign({}, ...args.map((a) => a.styles));
    const sprinklesKeys = Object.keys(sprinklesStyles) as Array<
      keyof SprinkleProps<Args>
    >;
    const shorthandNames = sprinklesKeys.filter(
      (property) => 'mappings' in sprinklesStyles[property],
    );

    const sprinklesFn = (props: any) => {
      const classNames = [];
      const shorthands: any = {};
      const nonShorthands: any = { ...props };
      let hasShorthands = false;

      for (const shorthand of shorthandNames) {
        const value = props[shorthand];
        if (value != null) {
          const sprinkle = sprinklesStyles[shorthand];
          hasShorthands = true;
          for (const propMapping of sprinkle.mappings) {
            shorthands[propMapping] = value;
            if (nonShorthands[propMapping] == null) {
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
        const sprinkle = sprinklesStyles[prop];
        try {
          if (sprinkle.mappings) {
            // Skip shorthands
            continue;
          }

          if (typeof propValue === 'string' || typeof propValue === 'number') {
            if (process.env.NODE_ENV !== 'production') {
              if (!sprinkle.values[propValue].defaultClass) {
                throw new Error();
              }
            }
            classNames.push(sprinkle.values[propValue].defaultClass);
          } else if (Array.isArray(propValue)) {
            for (
              let responsiveIndex = 0;
              responsiveIndex < propValue.length;
              responsiveIndex++
            ) {
              const responsiveValue = propValue[responsiveIndex];

              if (responsiveValue != null) {
                const conditionName = sprinkle.responsiveArray[responsiveIndex];

                if (process.env.NODE_ENV !== 'production') {
                  if (
                    !sprinkle.values[responsiveValue].conditions[conditionName]
                  ) {
                    throw new Error();
                  }
                }

                classNames.push(
                  sprinkle.values[responsiveValue].conditions[conditionName],
                );
              }
            }
          } else {
            for (const conditionName in propValue) {
              // Conditional style
              const value = propValue[conditionName];

              if (value != null) {
                if (process.env.NODE_ENV !== 'production') {
                  if (!sprinkle.values[value].conditions[conditionName]) {
                    throw new Error();
                  }
                }
                classNames.push(
                  sprinkle.values[value].conditions[conditionName],
                );
              }
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

            if (!sprinkle) {
              throw new SprinklesError(`"${prop}" is not a valid sprinkle`);
            }

            if (
              typeof propValue === 'string' ||
              typeof propValue === 'number'
            ) {
              if (!(propValue in sprinkle.values)) {
                invalidPropValue(prop, propValue, sprinkle.values);
              }
              if (!sprinkle.values[propValue].defaultClass) {
                throw new SprinklesError(
                  `"${prop}" has no default condition. You must specify which conditions to target explicitly. Possible options are ${Object.keys(
                    sprinkle.values[propValue].conditions,
                  )
                    .map(format)
                    .join(', ')}`,
                );
              }
            }

            if (typeof propValue === 'object') {
              if (
                !(
                  'conditions' in
                  sprinkle.values[Object.keys(sprinkle.values)[0]]
                )
              ) {
                throw new SprinklesError(
                  `"${prop}" is not a conditional property`,
                );
              }

              if (Array.isArray(propValue)) {
                if (!('responsiveArray' in sprinkle)) {
                  throw new SprinklesError(
                    `"${prop}" does not support responsive arrays`,
                  );
                }

                const breakpointCount = sprinkle.responsiveArray.length;
                if (breakpointCount < propValue.length) {
                  throw new SprinklesError(
                    `"${prop}" only supports up to ${breakpointCount} breakpoints. You passed ${propValue.length}`,
                  );
                }

                for (const responsiveValue of propValue) {
                  if (!sprinkle.values[responsiveValue]) {
                    invalidPropValue(prop, responsiveValue, sprinkle.values);
                  }
                }
              } else {
                for (const conditionName in propValue) {
                  const value = propValue[conditionName];

                  if (value != null) {
                    if (!sprinkle.values[value]) {
                      invalidPropValue(prop, value, sprinkle.values);
                    }

                    if (!sprinkle.values[value].conditions[conditionName]) {
                      throw new SprinklesError(
                        `"${prop}" has no condition named ${format(
                          conditionName,
                        )}. Possible values are ${Object.keys(
                          sprinkle.values[value].conditions,
                        )
                          .map(format)
                          .join(', ')}`,
                      );
                    }
                  }
                }
              }
            }
          }

          throw e;
        }
      }

      return composeStyles(classNames.join(' '));
    };

    return Object.assign(sprinklesFn, {
      properties: new Set(sprinklesKeys),
    });
  };

function format(v: string | number) {
  return typeof v === 'string' ? `"${v}"` : v;
}
