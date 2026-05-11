import { parse } from 'css-what';
import dedent from 'dedent';
import { cssesc } from './cssesc';

// https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function escapeRegex(string: string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

type Selector = ReturnType<typeof parse>[number];

function targetsClassName(tokens: Selector, targetClassName: string): boolean {
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];

    if (
      token.type === 'child' ||
      token.type === 'parent' ||
      token.type === 'sibling' ||
      token.type === 'adjacent' ||
      token.type === 'descendant'
    ) {
      return false;
    }

    if (
      token.type === 'attribute' &&
      token.name === 'class' &&
      token.value === targetClassName
    ) {
      return true;
    }

    if (
      token.type === 'pseudo' &&
      Array.isArray(token.data) &&
      (token.name === 'is' || token.name === 'where')
    ) {
      if (token.data.every((sub) => targetsClassName(sub, targetClassName))) {
        return true;
      }
    }
  }

  return false;
}

export const validateSelector = (
  selector: string,
  targetClassName: string,
): void => {
  const replaceTarget = () => {
    const targetRegex = new RegExp(
      `.${escapeRegex(cssesc(targetClassName, { isIdentifier: true }))}`,
      'g',
    );
    return selector.replace(targetRegex, '&');
  };

  let selectorParts: ReturnType<typeof parse>;

  try {
    selectorParts = parse(selector);
  } catch (err) {
    throw new Error(`Invalid selector: ${replaceTarget()}`, { cause: err });
  }

  selectorParts.forEach((tokens) => {
    if (!targetsClassName(tokens, targetClassName)) {
      throw new Error(
        dedent`
        Invalid selector: ${replaceTarget()}

        Style selectors must target the '&' character (along with any modifiers), e.g. ${'`${parent} &`'} or ${'`${parent} &:hover`'}.

        This is to ensure that each style block only affects the styling of a single class.

        If your selector is targeting another class, you should move it to the style definition for that class, e.g. given we have styles for 'parent' and 'child' elements, instead of adding a selector of ${'`& ${child}`'}) to 'parent', you should add ${'`${parent} &`'} to 'child').

        If your selector is targeting something global, use the 'globalStyle' function instead, e.g. if you wanted to write ${'`& h1`'}, you should instead write 'globalStyle(${'`${parent} h1`'}, { ... })'
      `,
      );
    }
  });
};
