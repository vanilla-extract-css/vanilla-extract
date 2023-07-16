import { compile, initialize } from './src';

const filePath = 'styles.css.ts';
const input = /*ts*/ `
  import { layer } from '@vanilla-extract/css';

  export const reset = layer();
  export const framework = layer('framework');
  export const app = layer('app');

  import { createTheme, style } from '@vanilla-extract/css';

  export const [themeClass, vars] = createTheme({
    color: {
      brand: 'blue',
      white: '#fff'
    },
    space: {
      small: '4px',
      medium: '8px',
    }
  });

  export const hero = style({
    backgroundColor: vars.color.brandd,
    color: vars.color.white,
    padding: vars.space.large
  });
`;

(async () => {
  // await initialize({
  //   wasmURL: './node_modules/esbuild-wasm/esbuild.wasm',
  // });

  const result = await compile({
    filePath,
    input,
    // identifiers: 'short'
  });

  console.log(result);
})();
