import { Transformer } from '@parcel/plugin';
import { compile, processVanillaFile } from '@vanilla-extract/integration';

export default new Transformer({
  async transform({ asset, options }) {
    const { source, watchFiles } = await compile({
      filePath: asset.filePath,
      cwd: options.projectRoot,
    });

    for (const watchFile of watchFiles) {
      asset.invalidateOnFileChange(watchFile);
    }

    const css: Array<{
      type: 'css';
      content: string;
      uniqueKey: string;
    }> = [];

    const contents = await processVanillaFile({
      source,
      filePath: asset.filePath,
      outputCss: asset.env.isBrowser(),
      identOption: options.mode === 'development' ? 'debug' : 'short',
      serializeVirtualCssPath: ({ fileName, source: cssSource }) => {
        const uniqueKey = fileName;

        css.push({
          type: 'css',
          content: cssSource,
          uniqueKey,
        });

        asset.addDependency({
          specifier: uniqueKey,
          specifierType: 'esm',
        });

        // CSS deps are added above so no need to add the import to the file
        return '';
      },
    });

    asset.setCode(contents);
    asset.type = 'js';

    return [asset, ...css];
  },
});
