// @ts-expect-error
import postcssJs from 'postcss-js';
import postcss from 'postcss';

import { CSS } from './types';
import { transformCss } from './transformCss';

export function generateCss(...allCssObjs: Array<CSS>): Array<string> {
  const flattenedCss = transformCss(...allCssObjs);

  const result = postcss().process(flattenedCss, {
    parser: postcssJs,
    from: undefined,
  });

  return result.root.nodes.map((node) => node.toString());
}
