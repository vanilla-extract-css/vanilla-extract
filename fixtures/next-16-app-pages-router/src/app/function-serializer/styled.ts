import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import { style, type StyleRule } from '@vanilla-extract/css';
import { runtimeStyled } from './runtime';
import React from 'react';

if (React.version.includes('canary')) {
  throw new Error(
    'detected vendored React in styles, this will cause errors in some projects',
  );
}

export function styled<Tag extends keyof JSX.IntrinsicElements>(
  tag: Tag,
  styles: StyleRule,
) {
  const className = style(styles);
  const args = [tag, className] as const;

  const Component = runtimeStyled(...args);

  addFunctionSerializer(Component, {
    importPath: './runtime',
    importName: 'runtimeStyled',
    args,
  });

  return Component;
}
