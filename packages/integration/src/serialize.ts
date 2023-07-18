import { gzip, gunzip } from 'zlib';
import { promisify } from 'util';
import { Buffer } from 'buffer';

const zip = promisify(gzip);
const unzip = promisify(gunzip);

// The byte threshold for applying compression, below which compressing would out-weigh its value.
const compressionThreshold = 1000;
const compressionFlag = '#';

export async function serializeCss(source: string) {
  if (source.length > compressionThreshold) {
    const compressedSource = await zip(source);

    return compressionFlag + compressedSource.toString('base64');
  }

  return Buffer.from(source, 'utf-8').toString('base64');
}

export async function deserializeCss(source: string) {
  if (source.indexOf(compressionFlag) > -1) {
    const decompressedSource = await unzip(
      Buffer.from(source.replace(compressionFlag, ''), 'base64'),
    );

    return decompressedSource.toString('utf-8');
  }

  return Buffer.from(source, 'base64').toString('utf-8');
}
