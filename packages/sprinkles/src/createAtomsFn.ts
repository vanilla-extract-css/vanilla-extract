import { ResponsiveArray } from './types';

type Variants = {
  [variant: string]: string;
};

type ConditionalVariants = {
  [variant: string]: {
    conditions: {
      [condition: string]: string;
    };
    defaultCondition?: string;
    responsiveArray?: Array<string>;
  };
};

type AtomicStyles = {
  [property: string]: Variants | ConditionalVariants;
};

type ResponsiveArrayVariant<
  Variant extends ConditionalVariants,
  Values extends string | number | symbol
> = Variant[keyof Variant]['responsiveArray'] extends {
  length: number;
}
  ? ResponsiveArray<Variant[keyof Variant]['responsiveArray']['length'], Values>
  : never;

type AtomProps<Atoms extends AtomicStyles> = {
  [Prop in keyof Atoms]?: Atoms[Prop] extends ConditionalVariants
    ?
        | keyof Atoms[Prop]
        | {
            [Condition in keyof Atoms[Prop][keyof Atoms[Prop]]['conditions']]?: keyof Atoms[Prop];
          }
        | ResponsiveArrayVariant<Atoms[Prop], keyof Atoms[Prop]>
    : keyof Atoms[Prop];
};

type AtomsFn<Styles extends AtomicStyles> = (
  props: AtomProps<Styles>,
) => string;

export function createAtomsFn<Styles extends AtomicStyles>(
  atomicStyles: Styles,
): AtomsFn<Styles> {
  return (props) => {
    const classNames = [];

    for (const prop in props) {
      const propValue = props[prop];

      if (typeof propValue === 'string') {
        const propStyle = atomicStyles[prop][propValue];
        if (typeof propStyle === 'string') {
          // Non-conditional style
          classNames.push(propStyle);
        } else {
          // Conditional style using default condition
          // @ts-expect-error Better types needed
          classNames.push(propStyle.defaultCondition);
        }
      } else if (Array.isArray(propValue)) {
        for (const responsiveIndex in propValue) {
          const responsiveVariant = propValue[responsiveIndex];
          const conditionName =
            // @ts-expect-error
            atomicStyles[prop][responsiveVariant].responsiveArray[
              responsiveIndex
            ];
          classNames.push(
            // @ts-expect-error Better types needed
            atomicStyles[prop][responsiveVariant].conditions[conditionName],
          );
        }
      } else {
        for (const conditionName in propValue) {
          // Conditional style
          // @ts-expect-error Better types needed
          const variant = propValue[conditionName];
          classNames.push(
            // @ts-expect-error Better types needed
            atomicStyles[prop][variant].conditions[conditionName],
          );
        }
      }
    }

    return classNames.join(' ');
  };
}
