type Primitive = string | number | null | undefined;

type Serializable = {
  [Key in string | number]: Primitive | Serializable;
};

interface Recipe {
  importPath: string;
  importName: string;
  args: ReadonlyArray<Serializable>;
}

export function addRecipe<Target extends object>(
  target: Target,
  recipe: Recipe,
) {
  // @ts-expect-error This references the global adapter bound by the integration package to detect whether we're in a .css.ts context
  if (typeof __adapter__ !== 'undefined') {
    Object.defineProperty(target, '__recipe__', {
      value: recipe,
      writable: false,
    });
  }

  return target;
}
