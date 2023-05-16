import type { AtRule } from 'csstype';

import { appendCss } from './adapter';
import { PropertySyntax } from './types';
import { getFileScope } from './fileScope';
import { generateIdentifier } from './identifier';
import cssesc from 'cssesc';
import {assertVarName} from './vars'

type PropertyOptions = {
  syntax: PropertySyntax | Array<PropertySyntax>;
  inherits: boolean;
  initialValue?: string
};

const buildPropertyRule = ({ syntax, inherits, initialValue }: PropertyOptions): AtRule.Property => ({
  syntax: `"${Array.isArray(syntax) ? syntax.join(' | ') : syntax}"`,
  inherits: inherits ? 'true' : 'false',
  initialValue,
})

export function createProperty(options: PropertyOptions, debugId?: string): string {
  const cssPropertyName = cssesc(
    generateIdentifier({
      debugId,
      debugFileName: false,
    }),
    { isIdentifier: true },
  );

  appendCss({ type: 'property', name: `--${cssPropertyName}`, rule: buildPropertyRule(options) }, getFileScope());

  return `var(--${cssPropertyName})`;
}

export function createGlobalProperty(name: string, options: PropertyOptions): string {
  appendCss({ type: 'property', name: `--${name}`, rule: buildPropertyRule(options) }, getFileScope());

  return `var(--${name})`;
}

export function property(varName: string): string {
  assertVarName(varName);

  return varName.replace(/^var\((--.*)\)$/, '$1');
}
