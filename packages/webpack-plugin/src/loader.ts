import type { LoaderContext } from './types';
import { compiler } from './compiler';

export function pitch(this: LoaderContext) {
  const callback = this.async();

  compiler
    .processVanillaFile(this.resourcePath)
    .then(({ source, watchFiles }) => {
      for (const watchFile of watchFiles) {
        this.addDependency(watchFile);
      }

      callback(null, source);
    })
    .catch((e) => {
      callback(e);
    });
}
