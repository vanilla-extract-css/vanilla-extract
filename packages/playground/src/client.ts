import { compile, init, type CompileOptions } from '.';

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
    mode: 'client',
  });

  document.querySelector('#result')!.innerHTML = css;
}

init.then(() => {
  document
    .querySelector<HTMLTextAreaElement>('#editor')!
    .addEventListener('input', updateResult);
  document
    .querySelector<HTMLTextAreaElement>('#options')!
    .addEventListener('input', updateResult);

  updateResult();
});
