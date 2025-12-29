export const cssFileFilter: RegExp = /\.css\.(js|cjs|mjs|jsx|ts|tsx)(\?used)?$/;
export const virtualCssFileFilter: RegExp = /\.vanilla\.css\?source=.*$/;

const COMPILED_CSS_PATTERN = /\.vanilla(-[a-zA-Z0-9_-]+)?\.css['"]/;
const VANILLA_EXTRACT_FAMILLY = /@vanilla-extract/;

interface IsSourceVanillaFileContext {
  code: string;
}

export function isSourceVanillaFile(
  filePath: string,
  context: IsSourceVanillaFileContext,
): boolean {
  if (!cssFileFilter.test(filePath)) {
    return false;
  }

  if (context.code) {
    if (COMPILED_CSS_PATTERN.test(context.code)) {
      return false;
    }

    if (!VANILLA_EXTRACT_FAMILLY.test(context.code)) {
      return false;
    }
  }

  return true;
}
