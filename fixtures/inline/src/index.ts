import { style, css$ } from '@vanilla-extract/css';
import { brandVar, brand, BrandDetails } from './colors';

const block = css$(
  style({
    vars: {
      [brandVar]: brand,
    },
    backgroundColor: brandVar,
    padding: 20,
  }),
);

document.body.innerHTML = `
  <div class="${block}"> 
    I'm a block
  </div>
  ${BrandDetails()}
`;
