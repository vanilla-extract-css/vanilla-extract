export const relativePath = (from: string, to: string) => {
  const fromDirs = from.split('/');
  const toDirs = to.split('/');

  const firstDifferentDirIndex = toDirs.findIndex(
    (toDir, index) => fromDirs[index] !== toDir,
  );
  const fromDepth = fromDirs.length;

  const parentDirs = Array.from(
    { length: fromDepth - firstDifferentDirIndex },
    () => '..',
  );

  return [...parentDirs, ...toDirs.slice(firstDifferentDirIndex)].join('/');
};
