import path from 'path';
import { SnowpackBuildMap, SnowpackConfig, SnowpackPlugin } from 'snowpack';
import {
  processVanillaFile,
  compile,
  getSourceFromVirtualCssFile,
  IdentifierOption,
} from '@vanilla-extract/integration';

interface Options {
  identifiers?: IdentifierOption;
}
export default function vanillaExtractPlugin(
  snowpackConfig: SnowpackConfig,
  { identifiers }: Options = {},
): SnowpackPlugin {
  const importedByMap = new Map();

  function addImportsToMap(filePath: string, dependency: string) {
    const importedBy = importedByMap.get(dependency);
    if (importedBy) {
      importedBy.add(filePath);
    } else {
      importedByMap.set(dependency, new Set([filePath]));
    }
  }

  return {
    name: '@vanilla-extract/snowpack-plugin',
    resolve: {
      input: ['.css.ts'],
      output: ['.js', '.css'],
    },
    onChange({ filePath }) {
      if (importedByMap.has(filePath)) {
        const importedBy = importedByMap.get(filePath);
        importedByMap.delete(filePath);
        for (const dependentFilePath of importedBy) {
          this.markChanged?.(dependentFilePath);
        }
      }
    },
    async load(args) {
      const { filePath, isSSR } = args;
      const cwd = snowpackConfig.root || process.cwd();

      const { source, watchFiles } = await compile({
        filePath,
        cwd,
      });

      watchFiles.forEach((dependency) => {
        addImportsToMap(filePath, dependency);
      });

      let css;
      const js = processVanillaFile({
        source,
        filePath,
        outputCss: !isSSR,
        identOption:
          identifiers ??
          (snowpackConfig.mode === 'production' ? 'short' : 'debug'),
        serializeVirtualCssPath({ base64Source, fileScope }) {
          const cssUrl = `${path.join(cwd, fileScope.filePath)}.css`;

          if (cssUrl === `${filePath}.css`) {
            css = getSourceFromVirtualCssFile(`?source=${base64Source}`).source;
            // snowpack injects the .css import for us
            return '';
          }

          const rel = path.relative(path.dirname(filePath), cssUrl);
          const relWithLeadingDot =
            rel.startsWith('./') || rel.startsWith('../') ? rel : `./${rel}`;

          return `import "${relWithLeadingDot}";`;
        },
      });

      const buildMap: SnowpackBuildMap = {
        '.js': {
          code: js,
        },
      };
      if (!isSSR && css) {
        buildMap['.css'] = { code: css };
      }
      return buildMap;
    },
  };
}
