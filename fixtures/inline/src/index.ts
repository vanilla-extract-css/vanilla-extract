import { style, createContainer, css$ } from '@vanilla-extract/css';
import { brandVar, brand, BrandDetails } from './colors';

const myContainer = createContainer('my-container');

const container = css$(
  style({
    containerType: 'size',
    containerName: myContainer,
    width: 500,
  }),
);

const block = css$(
  style({
    vars: {
      [brandVar]: brand,
    },
    backgroundColor: brandVar,
    padding: 20,
    '@media': {
      'screen and (min-width: 200px)': {
        '@container': {
          [`${myContainer} (min-width: 400px)`]: {
            color: 'white',
          },
        },
      },
    },
  }),
);

document.body.innerHTML = `
<div class="${container}"> 
  <div class="${block}"> 
    I'm a block
  </div>
  ${BrandDetails()}
</div>
`;
