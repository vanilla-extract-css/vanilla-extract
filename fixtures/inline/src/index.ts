import { style$ } from '@vanilla-extract/css';
import { recipe$ } from '@vanilla-extract/recipes';
import { brandVar, brand, BrandDetails } from './colors';
import { styled$ } from './styled';
import { large, legacyStyle } from './styles.css';

const block = style$({
  vars: {
    [brandVar]: brand,
  },
  backgroundColor: brandVar,
  padding: 20,
});

const test = styled$('Test', 'red');

const thing = recipe$({
  base: {
    background: 'black',
    color: 'white',
  },
  variants: {
    size: {
      small: { fontSize: 12 },
      medium: { fontSize: 16 },
      large: { fontSize: 32 },
    },
  },
});

document.body.innerHTML = `
  <div class="${block}"> 
    I'm a block
  </div>
  <div class="${style$({ color: 'red' })}">Yo</div>
  <div class="${legacyStyle}"></div>
  <div class="${large}">Large legacy style text</div>
  <div class="${thing({ size: 'large' })}">I am a recipe$</div>
  ${BrandDetails()}
  ${test}
`;
