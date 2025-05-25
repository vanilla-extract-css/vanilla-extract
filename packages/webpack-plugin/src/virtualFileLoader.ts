import { deserializeCss } from '@vanilla-extract/integration';
// @ts-expect-error
import { getOptions } from 'loader-utils';

export default function (this: any): void {
  const { source } = getOptions(this);
  const callback = this.async();

  deserializeCss(source).then((deserializedCss) => {
    callback(null, deserializedCss);
  });
}
