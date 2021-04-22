const startingCharCode = 'a'.charCodeAt(0);

export function refCountToAlpha(number: number) {
  let n = number + 1;
  let returnValue = '';

  while (n > 0) {
    const offset = (n - 1) % 26;
    returnValue = String.fromCharCode(startingCharCode + offset) + returnValue;
    n = ((n - offset) / 26) | 0;
  }

  return returnValue;
}
