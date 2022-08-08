const { transform } = require('@babel/core');
const { compile } = require('@vanilla-extract/integration');
const evalCode = require('eval');

const { transformCss } = require('@vanilla-extract/css/transformCss');
const { setAdapter, removeAdapter } = require('@vanilla-extract/css/adapter');

const getAdapter = () => {
  const localClassNames = new Set();
  const composedClassLists = [];
  let bufferedCSSObjs = [];
  const cssFiles = {};

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
        cssFiles[fileScope.filePath] = transformCss({
          localClassNames: Array.from(localClassNames),
          composedClassLists,
          cssObjs: bufferedCSSObjs,
        }).join('\n');

        bufferedCSSObjs = [];
      },
      getIdentOption: () => 'debug',
    },
    cssFiles,
  };
};

function extractFilesFromCodeBlock(code) {
  const fileMatches = code.matchAll(/(?:\/\/\s(?<fileName>[\w\.]+\.tsx?))/g);

  let lastIndex = code.length - 1;

  return Array.from(fileMatches, (match) => ({
    ...match.groups,
    index: match.index,
  })).reduceRight((acc, curr) => {
    const result = [
      {
        fileName: curr.fileName,
        contents: code
          .slice(curr.index + `// ${curr.fileName}`.length, lastIndex)
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

  const rootContext = this.rootContext;

  const result = source.matchAll(/```(?<language>.+)\n(?<code>(?:.|\n)*?)```/g);

  const codeBlocks = Array.from(result, (match) => ({
    ...match.groups,
    startIndex: match.index,
    endIndex: match.index + match[0].length,
  }));

  const newSource = [];
  let currIndex = 0;

  for (const { code, language, startIndex, endIndex } of codeBlocks) {
    if (language !== 'ts compiled') {
      continue;
    }

    const files = extractFilesFromCodeBlock(code);

    if (files.length === 0) {
      continue;
    }

    // Use the first file as the entrypoint
    const entrypointFile = `./${
      files.find((f) => f.fileName.endsWith('.css.ts')).fileName
    }`;

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
                    path: file.fileName.replace(/\.css\.ts$/, ''),
                  };
                });

                build.onLoad(
                  { filter: /.*/, namespace: virtualFileNamespace },
                  async ({ path }) => {
                    const file = files.find(({ fileName }) =>
                      fileName.includes(path),
                    );

                    if (file) {
                      const babelResult = await transform(file.contents, {
                        filename: file.fileName,
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

  return callback(null, newSource.join('\n'));
}

module.exports = loader;
