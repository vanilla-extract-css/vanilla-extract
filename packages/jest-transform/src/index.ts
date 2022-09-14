import type { Transformer } from '@jest/transform';
import { transformSync, getPackageInfo } from '@vanilla-extract/integration';
import * as esbuild from 'esbuild';

const vanillaTransformer: Transformer = {
  canInstrument: false,
  process(source, filePath, options) {
    const { name: packageName } = getPackageInfo(options.config.rootDir);

    const code = transformSync({
      source,
      filePath,
      rootPath: options.config.rootDir,
      packageName: packageName,
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
