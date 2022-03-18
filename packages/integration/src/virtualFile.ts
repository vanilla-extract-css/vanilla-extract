import { deserializeCss } from './serialize';

export async function getSourceFromVirtualCssFile(id: string) {
  const match = id.match(/^(?<fileName>.*)\?source=(?<source>.*)$/) ?? [];

  if (!match || !match.groups) {
    throw new Error('No source in vanilla CSS file');
  }

  const source = await deserializeCss(match.groups.source);

  return {
    fileName: match.groups.fileName,
    source,
  };
}
