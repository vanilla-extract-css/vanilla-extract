import { style, createVar, createContainer, css$ } from '@vanilla-extract/css';

const color = createVar();

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
      [color]: 'blue',
    },
    backgroundColor: color,
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
</div>
`;
