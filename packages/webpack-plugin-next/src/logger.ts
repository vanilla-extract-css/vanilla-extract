import createDebug from 'debug';
import pc from 'picocolors';

export const formatResourcePath = (i: string) =>
  pc.blue(`"${i.replace(/.*\//, '')}"`);

createDebug.formatters.r = (r: string) => formatResourcePath(r);

export const debug = createDebug;
