type Primitive = string | number | boolean | null | undefined;

type Serializable =
  | {
      [Key in string | number]: Primitive | Serializable;
    }
  | ReadonlyArray<Primitive | Serializable>;

interface Recipe {
  importPath: string;
  importName: string;
  args: ReadonlyArray<Serializable>;
}

export function addRecipe<Target extends object>(
  target: Target,
  recipe: Recipe,
) {
  Object.defineProperty(target, '__recipe__', {
    value: recipe,
    writable: false,
  });

  return target;
}
