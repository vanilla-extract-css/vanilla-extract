type Primitive = string | number | boolean | null | undefined;

type Serializable =
  | Primitive
  | {
      [Key in string | number]: Primitive | Serializable;
    }
  | ReadonlyArray<Primitive | Serializable>;

interface SerializerConfig {
  importPath: string;
  importName: string;
  args: ReadonlyArray<Serializable>;
}

export function addFunctionSerializer<Target extends object>(
  target: Target,
  recipe: SerializerConfig,
): Target {
  // TODO: Update to "__function_serializer__" in future.
  // __recipe__ is the backwards compatible name
  Object.defineProperty(target, '__recipe__', {
    value: recipe,
    writable: false,
  });

  return target;
}
