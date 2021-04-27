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

  return (props: any) => {
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
