import { LRUCache } from 'lru-cache';

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

/**
 * Assumptions:
 * - The path is always normalized to use posix file separators (/) (see `addFileScope`)
 * - The path is always relative to the project root, i.e. there will never be a leading slash (see `addFileScope`)
 * - As long as `.css` is there, we have a valid `.css.*` file path, because otherwise there wouldn't
 *   be a file scope to begin with
 *
 * The LRU cache we use can't cache undefined/null values, so we opt to return an empty string,
 * rather than using a custom Symbol or something similar.
 */
const _getDebugFileName = (path: string): string => {
  let file: string;

  const lastIndexOfDotCss = path.lastIndexOf('.css');

  if (lastIndexOfDotCss === -1) {
    return '';
  }

  const lastSlashIndex = getLastSlashBeforeIndex(path, lastIndexOfDotCss);
  file = path.slice(lastSlashIndex + 1, lastIndexOfDotCss);

  // There are no slashes, therefore theres no directory to extract
  if (lastSlashIndex === -1) {
    return file;
  }

  let secondLastSlashIndex = getLastSlashBeforeIndex(path, lastSlashIndex - 1);
  // If secondLastSlashIndex is -1, it means that the path looks like `directory/file.css.ts`,
  // in which case dir will still be sliced starting at 0, which is what we want
  const dir = path.slice(secondLastSlashIndex + 1, lastSlashIndex);

  const debugFileName = file !== 'index' ? file : dir;

  return debugFileName;
};

const memoizedGetDebugFileName = () => {
  const cache = new LRUCache<string, string>({
    max: 500,
  });

  return (path: string): string => {
    const cachedResult = cache.get(path);

    if (cachedResult) {
      return cachedResult;
    }

    const result = _getDebugFileName(path);
    cache.set(path, result);

    return result;
  };
};

export const getDebugFileName: (path: string) => string =
  memoizedGetDebugFileName();
