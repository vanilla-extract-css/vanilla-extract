import { appendCss } from './adapter';
import { getFileScope } from './fileScope';
import { generateIdentifier } from './identifier';

export function createLayer(debugId?: string) {
  const name = generateIdentifier(debugId);

  appendCss({ type: 'layer', name }, getFileScope());

  return name;
}

export function createLayers(...debugIds: string[]) {
  const names = debugIds.map((debugId) => generateIdentifier(debugId));

  appendCss({ type: 'layer', name: names.join(', ') }, getFileScope());

  return names;
}
