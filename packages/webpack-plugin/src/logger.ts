import createDebug from 'debug';
import chalk from 'chalk';

export const formatResourcePath = (i: string) =>
  chalk.blue(`"${i.replace(/.*\//, '')}"`);

createDebug.formatters.r = (r: string) => formatResourcePath(r);

export const debug = createDebug;
