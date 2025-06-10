import { style, createVar } from '@vanilla-extract/css';

export {
  depBlock,
  depColor,
  depdepBlock,
  depdepColor,
  // @ts-expect-error package has no types
} from '@fixtures/thirdparty-dep';

const color = createVar();

export const block = style({
  vars: {
    [color]: 'red',
  },
  backgroundColor: color,
});
