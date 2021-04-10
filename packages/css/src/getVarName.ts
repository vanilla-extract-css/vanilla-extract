export const getVarName = (variable: string) => {
  const matches = variable.match(/^var\((.*)\)$/);

  if (matches) {
    return matches[1];
  }

  return variable;
};
