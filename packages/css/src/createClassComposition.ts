import { registerClassComposition, registerClassName } from './adapter';
import { generateIdentifier } from './identifier';
import { hasFileScope } from './fileScope';

export function createClassComposition(classList: string, debugId?: string) {
  if (hasFileScope()) {
    const identifier = generateIdentifier(debugId);
    const composedClassList = `${identifier} ${classList}`;

    registerClassName(identifier);
    registerClassComposition({ identifier, classList: composedClassList });

    return composedClassList;
  }

  return classList;
}
