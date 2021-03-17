// @ts-expect-error
import postcssJs from 'postcss-js';
import postcss from 'postcss';

import { CSS } from './types';
import { transformCss } from './transformCss';

interface GenerateCssParams {
  localClassNames: Array<string>;
  cssObjs: Array<CSS>;
}
export function generateCss({
  localClassNames,
  cssObjs,
}: GenerateCssParams): Array<string> {
  const flattenedCss = transformCss({ localClassNames, cssObjs });

  const result = postcss().process(flattenedCss, {
    parser: postcssJs,
    from: undefined,
  });

  return result.root.nodes.map((node) => node.toString());
}
