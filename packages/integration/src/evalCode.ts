// Modified version of https://github.com/pierrec/node-eval/blob/c591ce211c7b47f024dabb086fce922bd3842f4c/eval.js

import { Script } from 'vm';

import { createRequire } from 'module';

function merge(a: Record<string, unknown>, b: Record<string, unknown>) {
  if (!a || !b) return a;

  const keys = Object.keys(b);

  for (let k, i = 0, n = keys.length; i < n; i++) {
    k = keys[i];
    a[k] = b[k];
  }

  return a;
}

type GlobalThisKeys = keyof typeof globalThis;
const vmGlobals: GlobalThisKeys[] = new Script(
  'Object.getOwnPropertyNames(globalThis)',
).runInNewContext();

// Return the exports/module.exports constiable set in the content
// content (String|VmScript): required
export const evalCode = (
  content: string,
  filename: string,
  scope: Record<string, any>,
): Record<string, unknown> => {
  // Expose standard Node globals
  const exports = {};
  const sandbox = { ...global, console, require: createRequire(filename) };

  if (typeof scope === 'object') {
    merge(sandbox, scope);
  }

  const globalProperties = Object.getOwnPropertyNames(
    global,
  ) as GlobalThisKeys[];

  globalProperties.forEach((name) => {
    if (!vmGlobals.includes(name)) {
      // @ts-expect-error A bit tricky to satisfy tsc here
      sandbox[name] = global[name];
    }
  });

  sandbox.exports = exports;
  // @ts-expect-error Unsure if the other properties were intentionally left out in the original code
  sandbox.module = {
    exports: exports,
    filename: filename,
    id: filename,
    parent: module.parent,
    require: sandbox.require || createRequire(filename),
  };
  sandbox.global = sandbox;

  const options = {
    filename,
    displayErrors: false,
    contextName: `VM Context ${filename}`,
  };

  // Evalutate the content with the given scope
  const script = new Script(content, options);
  script.runInNewContext(sandbox, options);

  return sandbox.module.exports;
};
