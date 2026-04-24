import path from 'path';

import { normalizePath } from '@vanilla-extract/integration';

const viteIdPrefix = /^\/?@id\//;
const windowsAbsolutePathRegex =
  /^(?:[a-zA-Z]:[/\\]|[/\\]{2}[^/\\]+[/\\][^/\\]+)/;

const isWindowsAbsolutePath = (filePath: string) =>
  windowsAbsolutePathRegex.test(filePath);

const unwrapAbsoluteViteId = (id: string) => {
  const unwrappedId = id.replace(viteIdPrefix, '');
  const normalizedId = unwrappedId.replace(/^\/([a-zA-Z]:[/\\])/, '$1');

  return path.isAbsolute(normalizedId) || isWindowsAbsolutePath(normalizedId)
    ? normalizedId
    : id;
};

export const getAbsoluteId = ({
  filePath,
  root,
}: {
  filePath: string;
  root: string;
}) => {
  const resolvedId = unwrapAbsoluteViteId(filePath);

  if (
    isWindowsAbsolutePath(resolvedId) ||
    resolvedId.startsWith(root) ||
    // In monorepos the absolute path will be outside of root, so we check that they have the same
    // root on the file system. Paths from Vite are always normalized, so we have to use the posix
    // path separator.
    (path.isAbsolute(resolvedId) &&
      resolvedId.split(path.posix.sep)[1] === root.split(path.posix.sep)[1])
  ) {
    return normalizePath(resolvedId);
  }

  // In SSR mode we can have paths like /app/styles.css.ts
  return normalizePath(path.join(root, resolvedId));
};
