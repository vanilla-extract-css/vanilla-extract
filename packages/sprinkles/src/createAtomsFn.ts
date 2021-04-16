type AtomicStyles = {
  [property: string]: {
    [variant: string]:
      | string
      | {
          [condition: string]: string;
        };
  };
};

type AtomProps<Atoms extends AtomicStyles> = {
  [Prop in keyof Atoms]?: Atoms[Prop][keyof Atoms[Prop]] extends string
    ? keyof Atoms[Prop]
    :
        | keyof Atoms[Prop]
        | {
            [Condition in keyof Atoms[Prop][keyof Atoms[Prop]]]?: keyof Atoms[Prop];
          };
};

type AtomsFn<Styles extends AtomicStyles> = (
  props: AtomProps<Styles>,
) => string;

export function createAtomsFn<Styles extends AtomicStyles>(
  atomicStyles: Styles,
): AtomsFn<Styles> {
  return null as any;
}

const atoms = createAtomsFn({
  display: {
    flex: {
      mobile: 'className',
      desktop: 'className',
    },
    none: {
      mobile: 'className',
      desktop: 'className',
    },
  },
  background: {
    pink: 'className',
    blue: 'className',
  },
});

// These are valid
atoms({ display: { desktop: 'flex' } });
atoms({ display: { mobile: 'flex', desktop: 'none' } });
atoms({ background: 'pink' });

// These are invalid
//@ts-expect-error
atoms({ background: 'INVALID' });
//@ts-expect-error
atoms({ display: 'INVALID' });
//@ts-expect-error
atoms({ display: { INVALID: 'flex' } });
