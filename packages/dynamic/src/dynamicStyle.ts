import { style, createVar, StyleRule } from '@vanilla-extract/css';
import { addFunctionSerializer } from '@vanilla-extract/css/functionSerializer';
import {
  dynamicStyle as runtimeDynamicStyle,
  RuntimeFn,
} from './runtimeDynamicStyle';

type CSSVarFunction = string;

type PropertiesOption<Property extends string> =
  | Property[]
  | Record<Property, unknown>;

type StyleFn<Property extends string> = (
  props: Record<Property, CSSVarFunction>,
) => StyleRule;

export function dynamicStyle<ProvidedType, Property extends string = string>(
  properties: PropertiesOption<Property>,
  styleFn: StyleFn<Property>,
): RuntimeFn<ProvidedType, Property> {
  const propNames = (
    Array.isArray(properties) ? properties : Object.keys(properties)
  ) as Property[];
  const vars = propNames.reduce((acc, curr: Property) => {
    acc[curr] = createVar();
    return acc;
  }, {} as Record<Property, CSSVarFunction>);

  const className = style(styleFn(vars));

  const args = [vars, className] as const;

  const result = runtimeDynamicStyle<ProvidedType, typeof vars>(...args);

  addFunctionSerializer(result, {
    importPath: '@vanilla-extract/dynamic/runtimeDynamicStyle',
    importName: 'runtimeDynamicStyle',
    // @ts-expect-error
    args,
  });

  return result;
}
