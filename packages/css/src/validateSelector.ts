import { parse } from 'css-what';
import cssesc from 'cssesc';
import dedent from 'dedent';

// https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function escapeRegex(string: string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
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
    try {
      for (let i = tokens.length - 1; i >= -1; i--) {
        if (!tokens[i]) {
          throw new Error();
        }

        const token = tokens[i];

        if (
          token.type === 'child' ||
          token.type === 'parent' ||
          token.type === 'sibling' ||
          token.type === 'adjacent' ||
          token.type === 'descendant'
        ) {
          throw new Error();
        }

        if (
          token.type === 'attribute' &&
          token.name === 'class' &&
          token.value === targetClassName
        ) {
          return; // Found it
        }
      }
    } catch (err) {
      throw new Error(
        dedent`
        Invalid selector: ${replaceTarget()}
    
        Style selectors must target the '&' character (along with any modifiers), e.g. ${'`${parent} &`'} or ${'`${parent} &:hover`'}.
        
        This is to ensure that each style block only affects the styling of a single class.
        
        If your selector is targeting another class, you should move it to the style definition for that class, e.g. given we have styles for 'parent' and 'child' elements, instead of adding a selector of ${'`& ${child}`'}) to 'parent', you should add ${'`${parent} &`'} to 'child').
        
        If your selector is targeting something global, use the 'globalStyle' function instead, e.g. if you wanted to write ${'`& h1`'}, you should instead write 'globalStyle(${'`${parent} h1`'}, { ... })'
      `,
        { cause: err },
      );
    }
  });
};
