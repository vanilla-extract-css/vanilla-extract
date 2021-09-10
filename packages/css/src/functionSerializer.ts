type Primitive = string | number | boolean | null | undefined;

type Serializable =
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
) {
  Object.defineProperty(target, '__function_serializer__', {
    value: recipe,
    writable: false,
  });

  return target;
}
