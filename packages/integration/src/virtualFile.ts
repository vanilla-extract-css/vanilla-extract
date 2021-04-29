export function getSourceFromVirtualCssFile(filePath: string) {
  const [, source] = filePath.match(/\?source=(.*)$/) ?? [];

  if (!source) {
    throw new Error('No source in vanilla CSS file');
  }

  return Buffer.from(source, 'base64').toString('utf-8');
}
