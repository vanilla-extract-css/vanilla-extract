const { transform } = require('@babel/core');
const { compile } = require('@vanilla-extract/integration');
const evalCode = require('eval');

const { transformCss } = require('@vanilla-extract/css/transformCss');
const { setAdapter, removeAdapter } = require('@vanilla-extract/css/adapter');

const getAdapter = () => {
  const localClassNames = new Set();
  const composedClassLists = [];
  let bufferedCSSObjs = [];
  const cssFiles = [];

  return {
    adapter: {
      appendCss: (cssObj) => {
        bufferedCSSObjs.push(cssObj);
      },
      registerClassName: (className) => {
        localClassNames.add(className);
      },
      registerComposition: (composition) => {
        composedClassLists.push(composition);
      },
      markCompositionUsed: () => {},
      onEndFileScope: (fileScope) => {
        const css = transformCss({
          localClassNames: Array.from(localClassNames),
          composedClassLists,
          cssObjs: bufferedCSSObjs,
        }).join('\n');

        cssFiles.push({
          fileName: fileScope.filePath,
          contents: css,
        });

        bufferedCSSObjs = [];
      },
      getIdentOption: () => 'debug',
    },
    cssFiles,
  };
};

function extractFilesFromCodeBlock(code) {
  const fileMatches = code.matchAll(/(?:\/\/\s(?<title>\w+)(?:\.css\.ts))/g);

  let lastIndex = code.length - 1;

  return Array.from(fileMatches, (match) => ({
    ...match.groups,
    index: match.index,
  })).reduceRight((acc, curr) => {
    const result = [
      {
        fileName: `./${curr.title}`,
        contents: code
          .slice(curr.index + `// ${curr.title}.css.ts`.length, lastIndex)
          .trim(),
      },
      ...acc,
    ];
    lastIndex = curr.index;

    return result;
  }, []);
}

async function loader(source) {
  this.cacheable(true);
  const callback = this.async();

  if (!this.resourcePath.includes('style-object')) {
    return callback(null, source);
  }

  const rootContext = this.rootContext;

  const result = source.matchAll(
    /```(?<language>\w+)\n(?<code>(?:.|\n)*?)```/g,
  );

  const codeBlocks = Array.from(result, (match) => ({
    ...match.groups,
    startIndex: match.index,
    endIndex: match.index + match[0].length,
  }));

  const newSource = [];
  let currIndex = 0;

  for (const { code, language, startIndex, endIndex } of codeBlocks) {
    const files = extractFilesFromCodeBlock(code);

    if (files.length === 0) {
      continue;
    }

    // Use the first file as the entrypoint
    const entrypointFile = files[0].fileName;

    // Any relative file is considered virtual
    const virtualFileFilter = /^\.\//;
    const virtualFileNamespace = 'virtual-file-ns';

    try {
      const { source: compiledSource } = await compile({
        filePath: entrypointFile,
        cwd: rootContext,
        esbuildOptions: {
          plugins: [
            {
              name: 'virtual-entrypoint',
              setup(build) {
                build.onResolve({ filter: virtualFileFilter }, ({ path }) => {
                  const file = files.find(({ fileName }) =>
                    path.includes(fileName),
                  );

                  return {
                    namespace: virtualFileNamespace,
                    path: file.fileName,
                  };
                });

                build.onLoad(
                  { filter: /.*/, namespace: virtualFileNamespace },
                  async ({ path }) => {
                    const file = files.find(({ fileName }) =>
                      path.includes(fileName),
                    );

                    if (file) {
                      const babelResult = await transform(file.contents, {
                        filename: `${path}.css.ts`,
                        cwd: rootContext,
                        plugins: [
                          require('@babel/plugin-syntax-typescript'),
                          require('@vanilla-extract/babel-plugin'),
                        ],
                        configFile: false,
                      });

                      return {
                        contents: babelResult.code,
                        loader: 'ts',
                        resolveDir: rootContext,
                      };
                    }
                  },
                );
              },
            },
          ],
        },
      });

      const { adapter, cssFiles } = getAdapter();

      setAdapter(adapter);

      evalCode(compiledSource, entrypointFile, { console, process }, true);

      removeAdapter(adapter);

      newSource.push(source.slice(currIndex, startIndex));

      newSource.push(
        `<compiledcode code={${JSON.stringify(files)}} css={${JSON.stringify(
          cssFiles,
        )}} />`,
      );

      currIndex = endIndex;
    } catch (e) {
      console.error(e);

      return callback(e, source);
    }
  }

  newSource.push(source.slice(currIndex));
  console.log(newSource.join('\n'));
  return callback(null, newSource.join('\n'));
}

module.exports = loader;
