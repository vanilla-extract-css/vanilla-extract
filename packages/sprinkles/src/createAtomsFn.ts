import { ResponsiveArray } from './types';

type ConditionalProperty = {
  responsiveArray: Array<string> | undefined;
  values: {
    [valueName: string]: {
      defaultClass: string;
      conditions: {
        [conditionName: string]: string;
      };
    };
  };
};

type UnconditionalProperty = {
  values: {
    [valueName: string]: {
      defaultClass: string;
    };
  };
};

type AtomicStyles = {
  [property: string]: ConditionalProperty | UnconditionalProperty;
};

type ResponsiveArrayVariant<
  Variant extends ConditionalProperty,
  Values extends string | number | symbol
> = Variant['responsiveArray'] extends {
  length: number;
}
  ? ResponsiveArray<Variant['responsiveArray']['length'], Values>
  : never;

type AtomProps<Atoms extends AtomicStyles> = {
  [Prop in keyof Atoms]?: Atoms[Prop] extends ConditionalProperty
    ?
        | keyof Atoms[Prop]['values']
        | {
            [Condition in keyof Atoms[Prop]['values'][keyof Atoms[Prop]['values']]['conditions']]?: keyof Atoms[Prop]['values'];
          }
        | ResponsiveArrayVariant<Atoms[Prop], keyof Atoms[Prop]['values']>
    : keyof Atoms[Prop]['values'];
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
        classNames.push(atomicStyles[prop].values[propValue].defaultClass);
      } else if (Array.isArray(propValue)) {
        for (const responsiveIndex in propValue) {
          const responsiveValue = propValue[responsiveIndex];
          const conditionName =
            // @ts-expect-error
            atomicStyles[prop].responsiveArray[responsiveIndex];
          classNames.push(
            // @ts-expect-error Better types needed
            atomicStyles[prop].values[responsiveValue].conditions[
              conditionName
            ],
          );
        }
      } else {
        for (const conditionName in propValue) {
          // Conditional style
          // @ts-expect-error Better types needed
          const value = propValue[conditionName];
          classNames.push(
            // @ts-expect-error Better types needed
            atomicStyles[prop].values[value].conditions[conditionName],
          );
        }
      }
    }

    return classNames.join(' ');
  };
}
