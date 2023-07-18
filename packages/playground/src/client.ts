import { compile, initialize } from '.';

const options = {
  // identifiers: 'short',
};

async function compileEsbuild(input: string) {
  const { css } = await compile({
    ...options,
    filePath: 'styles.css.ts',
    input,
    mode: 'client',
  });

  return css;
}

async function compilePost(input: string) {
  const res = await fetch('/ve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...options,
      filePath: 'styles.css.ts',
      input,
      mode: 'server',
    }),
  });

  const { css } = await res.json();

  return css;
}

async function updateResult(input: string) {
  document.querySelector('#result')!.innerHTML = await compileEsbuild(input);
}

document.querySelector('textarea')!.addEventListener('input', async (e) => {
  const input = (e.target as HTMLTextAreaElement).value;

  updateResult(input);
});

initialize({
  wasmURL: './node_modules/esbuild-wasm/esbuild.wasm',
}).then(() => {
  updateResult(document.querySelector('textarea')!.value);
});
