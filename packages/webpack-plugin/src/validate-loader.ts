import type { LoaderContext } from './types';

export default function (this: LoaderContext, source: string) {
  return source;
}

let hasErrored = false;

// TODO Improve error messages when we have docs

export async function pitch(this: LoaderContext) {
  if (!hasErrored) {
    const cssLoader = this.loaders.find((loader) =>
      /\/css-loader\//.test(loader.path),
    );

    if (!cssLoader) {
      hasErrored = true;

      this.emitError(
        new Error(`You haven't configured css-loader to handle '*.css' files`),
      );
    }

    if (cssLoader.options && cssLoader.options.modules) {
      hasErrored = true;

      this.emitError(
        new Error(
          `You have configured css-loader to process this file as a CSS Module which will create invalid CSS`,
        ),
      );
    }
  }
}
