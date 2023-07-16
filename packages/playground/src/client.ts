export {};

async function updateResult(input: string) {
  const res = await fetch('/ve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filePath: 'styles.css.ts',
      input,
      // identifiers: 'short'
    }),
  });

  const { css } = await res.json();

  document.querySelector('#result')!.innerHTML = css;
}

document.querySelector('textarea')!.addEventListener('input', async (e) => {
  const input = (e.target as HTMLTextAreaElement).value;

  updateResult(input);
});

updateResult(document.querySelector('textarea')!.value);
