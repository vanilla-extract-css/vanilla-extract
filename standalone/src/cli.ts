import fs from 'node:fs/promises';
import parseArgs from 'minimist';

import { initialize, compile } from './index';

const {
  _: [fileName],
  identifiers,
} = parseArgs(process.argv.slice(2));

(async () => {
  await initialize({});

  const { css } = await compile({
    filePath: fileName,
    input: await fs.readFile(fileName, 'utf-8'),
    identifiers,
  });

  console.log(css);
})();
