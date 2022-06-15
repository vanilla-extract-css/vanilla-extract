const path = require('path');

const { transform } = require('@babel/core');
const { compile } = require('@vanilla-extract/integration');

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
          file: fileScope.filePath,
          css,
        });

        bufferedCSSObjs = [];
      },
      getIdentOption: () => 'debug',
    },
    cssFiles,
  };
};

async function loader(source) {
  this.cacheable(true);

  const callback = this.async();
  const rootContext = this.rootContext;

  const result = source.matchAll(
    /```(?<language>\w+)\n(?:\/\/\s(?<title>.+))?(?<code>(?:.|\n)*?)```/g,
  );

  const codeBlocks = Array.from(result, (match) => ({
    ...match.groups,
    startIndex: match.index,
    endIndex: match.index + match[0].length,
  }));

  const newSource = [];
  let currIndex = 0;

  for (const { title, code, language, startIndex, endIndex } of codeBlocks) {
    if (!title || title !== 'dawg.css.ts') {
      continue;
    }

    const entrypointFile = 'entrypoint.ts';
    const entrypointFilter = new RegExp(entrypointFile);
    const entrypointNamespace = 'entrypoint-ns';

    const babelResult = await transform(code, {
      filename: title,
      cwd: rootContext,
      plugins: [
        require('@babel/plugin-syntax-typescript'),
        require('@vanilla-extract/babel-plugin'),
      ],
      configFile: false,
    });

    if (!babelResult) {
      return callback(null, source);
    }

    try {
      const { source: compiledSource } = await compile({
        filePath: entrypointFile,
        cwd: rootContext,
        esbuildOptions: {
          plugins: [
            {
              name: 'virtual-entrypoint',
              setup(build) {
                build.onResolve({ filter: entrypointFilter }, ({ path }) => {
                  return {
                    namespace: entrypointNamespace,
                    path,
                  };
                });

                build.onLoad(
                  { filter: /.*/, namespace: entrypointNamespace },
                  () => {
                    return {
                      contents: babelResult.code,
                      loader: 'ts',
                      resolveDir: rootContext,
                    };
                  },
                );
              },
            },
          ],
        },
      });

      const { adapter, cssFiles } = getAdapter();

      setAdapter(adapter);

      eval(compiledSource);

      removeAdapter(adapter);

      newSource.push(source.slice(currIndex, startIndex));

      newSource.push(
        `<compiledcode code={${JSON.stringify(code)}} css={${JSON.stringify(
          cssFiles[0].css,
        )}} />`,
      );

      currIndex = endIndex;
    } catch (e) {
      console.error('Hi', e);

      return callback(null, source);
    }

    newSource.push(source.slice(currIndex));

    return callback(null, newSource.join('\n'));
  }

  return callback(null, source);
}

module.exports = loader;
