import type * as CSS from 'csstype';

import { Spread } from './types';

interface Condition {
  '@media'?: string;
  '@supports'?: string;
}

interface AtomicOptions {
  properties: {
    [Property in keyof CSS.Properties]?:
      | Record<string, CSS.Properties[Property]>
      | Array<CSS.Properties[Property]>;
  };
}

interface ConditionalAtomicOptions extends AtomicOptions {
  conditions: Record<string, Condition>;
}

type AtomicStyles<Options extends AtomicOptions, Result = string> = {
  [Property in keyof Options['properties']]: {
    [Value in Options['properties'][Property] extends Array<any>
      ? Options['properties'][Property][number]
      : keyof Options['properties'][Property]]: Result;
  };
};

type ConditionalAtomicStyles<
  Options extends ConditionalAtomicOptions
> = AtomicStyles<
  Options,
  {
    [Rule in keyof Options['conditions']]: string;
  }
>;

export function createAtomicStyles<
  Options extends AtomicOptions | ConditionalAtomicOptions
>(
  options: Options,
): Options extends ConditionalAtomicOptions
  ? ConditionalAtomicStyles<Options>
  : AtomicStyles<Options> {
  return null as any;
}

export function composeAtomicStyles<
  InputAtomicStyles extends Array<
    ConditionalAtomicStyles<any> | AtomicStyles<any>
  >
>(...inputAtomicStyle: InputAtomicStyles): Spread<InputAtomicStyles> {
  return null as any;
}

const a = createAtomicStyles({
  conditions: {
    mobile: {
      '@media': '',
    },
  },
  properties: {
    display: ['flex', 'none', 'block'],
    paddingTop: {
      small: '10px',
      medium: '20px',
    },
  },
});

const b = createAtomicStyles({
  properties: {
    color: {
      critical: 'red',
      happy: 'green',
    },
  },
});

const c = composeAtomicStyles(a, b);

c.paddingTop.medium.mobile;
