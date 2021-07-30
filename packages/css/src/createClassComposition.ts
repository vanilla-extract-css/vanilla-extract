import { registerComposition, registerClassName } from './adapter';
import { generateIdentifier } from './identifier';
import { hasFileScope } from './fileScope';

export function createClassComposition(classList: string, debugId?: string) {
  if (hasFileScope()) {
    const identifier = generateIdentifier(debugId);
    const composedClassList = `${identifier} ${classList}`;

    registerClassName(identifier);
    registerComposition({ identifier, classList: composedClassList });

    return composedClassList;
  }

  return classList;
}
