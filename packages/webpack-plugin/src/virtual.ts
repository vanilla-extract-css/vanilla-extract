// @ts-expect-error
import { getOptions } from 'loader-utils';
import zlib from 'zlib';

export default function (this: any) {
  const { source } = getOptions(this);

  let decompressedSource = zlib.gunzipSync(Buffer.from(source, 'base64'));

  return decompressedSource.toString('utf-8');
}
