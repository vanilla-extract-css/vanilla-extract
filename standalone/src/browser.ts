import { version as esbuildVersion } from 'esbuild-wasm/package.json';

import { type CompileOptions, initialize, compile } from './index';

function getOptions() {
  const options: Partial<CompileOptions> = JSON.parse(
    document.querySelector<HTMLTextAreaElement>('#options')!.value,
  );
  return options;
}

async function updateResult() {
  const input = document.querySelector<HTMLTextAreaElement>('#editor')!.value;
  const { css } = await compile({
    ...getOptions(),
    filePath: 'styles.css.ts',
    input,
  });

  document.querySelector('#result')!.innerHTML = css;
}

declare global {
  interface Window {
    WASM_URL: string;
  }
}

initialize({
  wasmURL:
    window.WASM_URL ??
    `https://unpkg.com/esbuild-wasm@${esbuildVersion}/esbuild.wasm`,
}).then(() => {
  document
    .querySelector<HTMLTextAreaElement>('#editor')!
    .addEventListener('input', updateResult);
  document
    .querySelector<HTMLTextAreaElement>('#options')!
    .addEventListener('input', updateResult);

  updateResult();
});
