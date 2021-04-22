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

type ShorthandProperty = {
  mappings: Array<string>;
};

type AtomicStyles = {
  [property: string]:
    | ConditionalProperty
    | ShorthandProperty
    | UnconditionalProperty;
};

type ResponsiveArrayVariant<
  Variant extends ConditionalProperty,
  Values extends string | number | symbol
> = Variant['responsiveArray'] extends {
  length: number;
}
  ? ResponsiveArray<Variant['responsiveArray']['length'], Values | null>
  : never;

type AtomProps<Atoms extends AtomicStyles> = {
  [Prop in keyof Atoms]?: Atoms[Prop] extends ConditionalProperty
    ?
        | keyof Atoms[Prop]['values']
        | {
            [Condition in keyof Atoms[Prop]['values'][keyof Atoms[Prop]['values']]['conditions']]?: keyof Atoms[Prop]['values'];
          }
        | ResponsiveArrayVariant<Atoms[Prop], keyof Atoms[Prop]['values']>
    : Atoms[Prop] extends ShorthandProperty
    ? Atoms[Atoms[Prop]['mappings'][number]] extends ConditionalProperty
      ?
          | keyof Atoms[Atoms[Prop]['mappings'][number]]['values']
          | {
              [Condition in keyof Atoms[Atoms[Prop]['mappings'][number]]['values'][keyof Atoms[Atoms[Prop]['mappings'][number]]['values']]['conditions']]?: keyof Atoms[Atoms[Prop]['mappings'][number]]['values'];
            }
          | ResponsiveArrayVariant<
              Atoms[Atoms[Prop]['mappings'][number]],
              keyof Atoms[Atoms[Prop]['mappings'][number]]['values']
            >
      : Atoms[Atoms[Prop]['mappings'][number]] extends UnconditionalProperty
      ? keyof Atoms[Atoms[Prop]['mappings'][number]]['values']
      : never
    : Atoms[Prop] extends UnconditionalProperty
    ? keyof Atoms[Prop]['values']
    : never;
};

type AtomsFn<Styles extends AtomicStyles> = (
  props: AtomProps<Styles>,
) => string;

export function createAtomsFn<Styles extends AtomicStyles>(
  input: Styles,
): AtomsFn<Styles> {
  return (props: any) => {
    const atomicStyles = input as any;
    const classNames = [];
    const shorthands: any = {};
    let hasShorthands = false;

    for (const prop in props) {
      const propValue = props[prop];
      const atomicProperty = atomicStyles[prop];

      if (atomicProperty.mappings) {
        // Found a shorthand property
        hasShorthands = true;
        for (const propMapping of atomicProperty.mappings) {
          shorthands[propMapping] = propValue;
        }
      }
    }

    const finalProps = hasShorthands ? { ...shorthands, ...props } : props;

    for (const prop in finalProps) {
      const propValue = finalProps[prop];
      const atomicProperty = atomicStyles[prop];

      if (atomicProperty.mappings) {
        // Skip shorthands
        continue;
      }

      if (typeof propValue === 'string') {
        classNames.push(atomicProperty.values[propValue].defaultClass);
      } else if (Array.isArray(propValue)) {
        for (const responsiveIndex in propValue) {
          const responsiveValue = propValue[responsiveIndex];
          if (responsiveValue) {
            const conditionName =
              atomicProperty.responsiveArray[responsiveIndex];
            classNames.push(
              atomicProperty.values[responsiveValue].conditions[conditionName],
            );
          }
        }
      } else {
        for (const conditionName in propValue) {
          // Conditional style
          const value = propValue[conditionName];
          classNames.push(
            atomicProperty.values[value].conditions[conditionName],
          );
        }
      }
    }

    return classNames.join(' ');
  };
}
