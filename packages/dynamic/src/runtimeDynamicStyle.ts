import { assignInlineVars } from './assignInlineVars';

export type RuntimeFn<
  ProvidedType,
  Property extends string | symbol | number,
> = (
  props: Partial<
    Record<Property, ProvidedType extends void ? string : ProvidedType>
  >,
) => { class: string; style: ReturnType<typeof assignInlineVars> };

export const dynamicStyle = <ProvidedType, Vars extends Record<string, string>>(
  vars: Vars,
  className: string,
): RuntimeFn<ProvidedType, keyof Vars> => {
  const runtimeFn = (
    props: Partial<
      Record<keyof Vars, ProvidedType extends void ? string : ProvidedType>
    >,
  ) => {
    let style: Record<string, string> = {};
    let runtimeClass = '';

    for (const prop in props) {
      const foundVar = vars[prop];
      if (foundVar) {
        // @ts-expect-error
        style[foundVar] = props[prop];
        runtimeClass = className;
      }
    }

    return { class: runtimeClass, style: assignInlineVars(style) };
  };

  return runtimeFn;
};
