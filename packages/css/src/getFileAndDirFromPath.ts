const getLastSlashBeforeIndex = (path: string, index: number) => {
  let pathIndex = index - 1;

  while (pathIndex >= 0) {
    if (path[pathIndex] === '/') {
      return pathIndex;
    }

    pathIndex--;
  }

  return -1;
};

type FileAndDir = {
  file: string;
  dir?: string;
};

/**
 * Assumptions:
 * - The path is always normalized to use posix file separators (/) (see `addFileScope`)
 * - The path is always relative to the project root, i.e. there will never be a leading slash (see `addFileScope`)
 * - As long as `.css` is there, we have a valid `.css.*` file path, because otherwise there wouldn't
 *   be a file scope to begin with
 */
const _getFileAndDirFromPath = (path: string): FileAndDir | undefined => {
  let file: string;
  let dir: string | undefined;

  const lastIndexOfDotCss = path.lastIndexOf('.css');

  if (lastIndexOfDotCss === -1) {
    return;
  }

  const lastSlashIndex = getLastSlashBeforeIndex(path, lastIndexOfDotCss);
  if (lastSlashIndex === -1) {
    return { file: path.slice(0, lastIndexOfDotCss) };
  }

  let secondLastSlashIndex = getLastSlashBeforeIndex(path, lastSlashIndex - 1);

  // If secondLastSlashIndex is -1, it means that the path looks like `directory/file.css.ts`,
  // in which case dir will still be sliced starting at 0, which is what we want
  dir = path.slice(secondLastSlashIndex + 1, lastSlashIndex);
  file = path.slice(lastSlashIndex + 1, lastIndexOfDotCss);

  return { dir, file };
};

const memoizedGetFileAndDirFromPath = () => {
  const cache = new Map();

  return (path: string) => {
    const cachedResult = cache.get(path);

    if (cachedResult) {
      return cachedResult;
    }

    const result = _getFileAndDirFromPath(path);
    cache.set(path, result);

    return result;
  };
};

export const getFileAndDirFromPath = memoizedGetFileAndDirFromPath();
