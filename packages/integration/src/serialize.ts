import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';

const zip = promisify(gzip);
const unzip = promisify(gunzip);

// The byte threshold for applying compression, below which compressing would out-weigh its value.
const compressionThreshold = 1000;
const compressionFlag = '#';

export async function serializeCss(source: string): Promise<string> {
  if (source.length > compressionThreshold) {
    const compressedSource = await zip(source);

    return compressionFlag + compressedSource.toString('base64url');
  }

  return Buffer.from(source, 'utf-8').toString('base64url');
}

export async function deserializeCss(source: string): Promise<string> {
  if (source.indexOf(compressionFlag) > -1) {
    const decompressedSource = await unzip(
      Buffer.from(source.replace(compressionFlag, ''), 'base64url'),
    );

    return decompressedSource.toString('utf-8');
  }

  return Buffer.from(source, 'base64url').toString('utf-8');
}
