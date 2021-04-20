type Variants = {
  [variant: string]: string;
};

type ConditionalVariants = {
  [variant: string]: {
    conditions: {
      [condition: string]: string;
    };
    defaultCondition?: string;
  };
};

type AtomicStyles = {
  [property: string]: Variants | ConditionalVariants;
};

type AtomProps<Atoms extends AtomicStyles> = {
  [Prop in keyof Atoms]?: Atoms[Prop] extends ConditionalVariants
    ?
        | keyof Atoms[Prop]
        | {
            [Condition in keyof Atoms[Prop][keyof Atoms[Prop]]['conditions']]?: keyof Atoms[Prop];
          }
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
