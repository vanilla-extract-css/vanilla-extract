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

type AtomicStyles = {
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

type AtomProps<Atoms extends AtomicStyles> = {
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
      : Atoms[Atoms[Prop]['mappings'][number]] extends ConditionalWithResponsiveArrayProperty
      ? ConditionalStyle<Atoms[Atoms[Prop]['mappings'][number]]['values']>
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
    const nonShorthands: any = { ...props };
    let hasShorthands = false;

    for (const prop in props) {
      const propValue = props[prop];
      const atomicProperty = atomicStyles[prop];
      if (typeof propValue !== 'undefined' && atomicProperty.mappings) {
        // Found a shorthand property
        hasShorthands = true;
        for (const propMapping of atomicProperty.mappings) {
          shorthands[propMapping] = propValue;
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

      if (atomicProperty.mappings) {
        // Skip shorthands
        continue;
      }

      if (typeof propValue === 'string' || typeof propValue === 'number') {
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

          if (value) {
            classNames.push(
              atomicProperty.values[value].conditions[conditionName],
            );
          }
        }
      }
    }

    return classNames.join(' ');
  };
}
