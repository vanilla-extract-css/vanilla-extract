import { deserializeCss } from '@vanilla-extract/integration';
import type { LoaderContext } from './types';

export default function (this: LoaderContext<{ source: string }>): void {
  const { source } = this.getOptions();
  const callback = this.async();

  deserializeCss(source).then((deserializedCss) => {
    callback(null, deserializedCss);
  });
}
