/**
 * Now that vite is an ES module, Jest has trouble loading it for running the vite fixture tests.
 *
 * This is partly caused by them having their `main` pointing to the ESM bundle, rather than CJS.
 * They do include it in the `exports` key, but if you're in CJS land then that means nothing.
 *
 * We can get around this by having Jest's loader replace the `main` just for vite.
 */

module.exports = (path, options) => {
  if (path !== 'vite') {
    return options.defaultResolver(path, options);
  }

  return options.defaultResolver(path, {
    ...options,
    packageFilter: (pkg) => {
      if (!pkg.exports) {
        return pkg;
      }

      return {
        ...pkg,
        main: pkg.exports['.'].require,
      };
    },
  });
};
