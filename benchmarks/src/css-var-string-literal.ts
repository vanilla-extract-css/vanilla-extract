import { bench } from '@arktype/attest';

import { style, createVar } from '@vanilla-extract/css';
import { setFileScope } from '@vanilla-extract/css/fileScope';

setFileScope('benchmarks/css-var-string-literal.ts');

const narrowVar = createVar();
const narrowMask = `
  repeating-linear-gradient(45deg, #0005 0 calc(1 * ${narrowVar}), black calc(2 * ${narrowVar}) calc(3 * ${narrowVar}), #0005 calc(4 * ${narrowVar}) calc(5 * ${narrowVar})) no-repeat,
  repeating-linear-gradient(-45deg, #0005 0 calc(1 * ${narrowVar}), black calc(2 * ${narrowVar}) calc(3 * ${narrowVar}), #0005 calc(4 * ${narrowVar}) calc(5 * ${narrowVar})) no-repeat
` as const;

const broadVar = narrowVar as string;
const broadMask = `
  repeating-linear-gradient(45deg, #0005 0 calc(1 * ${broadVar}), black calc(2 * ${broadVar}) calc(3 * ${broadVar}), #0005 calc(4 * ${broadVar}) calc(5 * ${broadVar})) no-repeat,
  repeating-linear-gradient(-45deg, #0005 0 calc(1 * ${broadVar}), black calc(2 * ${broadVar}) calc(3 * ${broadVar}), #0005 calc(4 * ${broadVar}) calc(5 * ${broadVar})) no-repeat
` as const;

// Baseline
bench('broad mask', () => {
  style({
    mask: broadMask,
  });
}).types([8003, 'instantiations']);

bench('narrow mask', () => {
  style({
    mask: narrowMask,
  });
}).types([8003, 'instantiations']);
