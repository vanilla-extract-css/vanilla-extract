type AtomicStyles = {
  [property: string]: {
    [variant: string]:
      | string
      | {
          [condition: string]: string;
        };
  };
};

type AtomProps<Styles extends AtomicStyles> = {
  [Prop in keyof Styles]?: Styles[Prop][string] extends string
    ? keyof Styles[Prop]
    :
        | keyof Styles[Prop]
        | {
            [Condition in keyof Styles[Prop][string]]?: Styles[Prop];
          };
};

type AtomsFn<Styles extends AtomicStyles> = (props: AtomProps<Styles>) => void;

export function createAtomsFn<Styles extends AtomicStyles>(
  atomicStyles: Styles,
): AtomsFn<Styles> {
  return null as any;
}

const atoms = createAtomsFn({
  display: {
    flex: { mobile: 'hi' },
    block: { mobile: 'hi' },
  },
});

atoms({ display: 'blok' });
