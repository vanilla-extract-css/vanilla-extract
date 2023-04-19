import { style, css$ } from '@vanilla-extract/css';
import { brandVar, brand, BrandDetails } from './colors';
import { styled$ } from './styled';
import { legacyStyle } from './styles.css';

const block = css$(
  style({
    vars: {
      [brandVar]: brand,
    },
    backgroundColor: brandVar,
    padding: 20,
  }),
);

const test = styled$('Test', 'red');

document.body.innerHTML = `
  <div class="${block}"> 
    I'm a block
  </div>
  <div class="${css$(style({ color: 'red' }))}">Yo</div>
  <div class="${legacyStyle}" />
  ${BrandDetails()}
  ${test}
`;
