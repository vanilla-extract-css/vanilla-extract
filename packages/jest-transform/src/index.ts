import path from 'path';
import type { Transformer } from '@jest/transform';
import {
  transformSync,
  getPackageInfo,
  cssFileFilter,
} from '@vanilla-extract/integration';
import * as esbuild from 'esbuild';

const vanillaTransformer: Transformer = {
  canInstrument: false,
  process(source, filePath, options) {
    if (!cssFileFilter.test(filePath)) {
      // If the file that passes through to the transformer is not a VE file,
      // then it's likely a vanilla .css file (because Jest can't differentiate
      // between them)
      return {
        code: `module.exports = ${JSON.stringify(path.basename(filePath))};`,
      };
    }

    const packageInfo = getPackageInfo(options.config.rootDir);

    const code = transformSync({
      source,
      filePath,
      rootPath: options.config.rootDir,
      packageName: packageInfo?.name,
      identOption: 'debug',
    });

    const result = esbuild.transformSync(code, {
      format: options.supportsStaticESM ? 'esm' : 'cjs',
      target: 'es2018',
      loader: 'ts',
    });

    return result;
  },
};

export default vanillaTransformer;
