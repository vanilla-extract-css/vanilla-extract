export function get(obj: any, path: Array<string>) {
  let result = obj;

  for (const key of path) {
    result = result[key];
  }

  return result;
}
