export function getSourceFromVirtualCssFile(id: string) {
  const match = id.match(/^(?<fileName>.*)\?source=(?<source>.*)$/) ?? [];

  if (!match || !match.groups) {
    throw new Error('No source in vanilla CSS file');
  }

  return {
    fileName: match.groups.fileName,
    source: Buffer.from(match.groups.source, 'base64').toString('utf-8'),
  };
}
