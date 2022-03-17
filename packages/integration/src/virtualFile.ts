import zlib from 'zlib';

export function getSourceFromVirtualCssFile(id: string) {
  const match = id.match(/^(?<fileName>.*)\?source=(?<source>.*)$/) ?? [];

  if (!match || !match.groups) {
    throw new Error('No source in vanilla CSS file');
  }

  const decompressedSource = zlib.gunzipSync(
    Buffer.from(match.groups.source, 'base64'),
  );

  return {
    fileName: match.groups.fileName,
    source: decompressedSource.toString('utf-8'),
  };
}
