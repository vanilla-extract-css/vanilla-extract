import { Script } from 'vm';

import { createRequire } from 'module';

function merge(a, b) {
  if (!a || !b) return a;
  const keys = Object.keys(b);
  for (let k, i = 0, n = keys.length; i < n; i++) {
    k = keys[i];
    a[k] = b[k];
  }
  return a;
}

const vmGlobals = new Script(
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
  const _filename = filename || module.parent.filename;

  const sandbox = { ...global, console, require: createRequire(_filename) };
  Object.getOwnPropertyNames(global).forEach((name) => {
    if (!vmGlobals.includes(name)) {
      sandbox[name] = global[name];
    }
  });

  if (typeof scope === 'object') {
    merge(sandbox, scope);
  }

  sandbox.module = {
    exports: exports,
    filename: _filename,
    id: _filename,
    parent: module.parent,
    require: sandbox.require || createRequire(_filename),
  };
  sandbox.global = sandbox;

  const options = {
    filename: _filename,
    displayErrors: false,
    contextName: `VM Context ${_filename}`,
  };

  if (Buffer.isBuffer(content)) {
    content = content.toString();
  }

  // Evalutate the content with the given scope
  const script = new Script(content, options);
  script.runInNewContext(sandbox, options);

  return sandbox.module.exports;
};
