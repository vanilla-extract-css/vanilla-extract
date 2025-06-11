export function get(obj: any, path: Array<string>): any {
  let result = obj;

  for (const key of path) {
    if (!(key in result)) {
      throw new Error(`Path ${path.join(' -> ')} does not exist in object`);
    }
    result = result[key];
  }

  return result;
}
