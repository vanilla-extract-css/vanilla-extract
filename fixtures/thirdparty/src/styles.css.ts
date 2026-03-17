import { style, createVar } from '@vanilla-extract/css';

export {
  depBlock,
  depColor,
  depdepBlock,
  depdepColor,
} from '@fixtures/thirdparty-dep';

const color = createVar();

export const block = style({
  vars: {
    [color]: 'red',
  },
  backgroundColor: color,
});
