import { CssSelectorParser } from 'css-selector-parser';
import cssesc from 'cssesc';
import dedent from 'dedent';

// https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
function escapeRegex(string: string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const parser = new CssSelectorParser();
parser.registerSelectorPseudos('has');
parser.registerNestingOperators('>', '+', '~');
parser.registerAttrEqualityMods('^', '$', '*', '~');
parser.enableSubstitutes();

export const validateSelector = (selector: string, targetClassName: string) => {
  const replaceTarget = () => {
    const targetRegex = new RegExp(
      `.${escapeRegex(cssesc(targetClassName, { isIdentifier: true }))}`,
      'g',
    );
    return selector.replace(targetRegex, '&');
  };

  return selector.split(',').map((selectorPart) => {
    if (selectorPart.indexOf(targetClassName) === -1) {
      throw new Error(
        dedent`
          Invalid selector: ${replaceTarget()}
      
          Selectors must target the ampersand character ('&'), which refers to the generated class name, e.g. '&:nth-child(2n)'
        `,
      );
    }

    let currentRule;

    try {
      const result = parser.parse(selectorPart);

      if (result.type === 'ruleSet') {
        currentRule = result.rule;
      } else {
        throw new Error();
      }
    } catch (err) {
      throw new Error(`Invalid selector: ${replaceTarget()}`);
    }

    while (currentRule.rule) {
      currentRule = currentRule.rule;
    }

    const targetRule = currentRule;

    if (
      !Array.isArray(targetRule.classNames) ||
      !targetRule.classNames.find(
        (className: string) => className === targetClassName,
      )
    ) {
      throw new Error(
        dedent`
          Invalid selector: ${replaceTarget()}
      
          Style selectors must end with the '&' character (along with any modifiers), e.g. ${'`${parent} &`'} or ${'`${parent} &:hover`'}.
          
          This is to ensure that each style block only affects the styling of a single class.
          
          If your selector is targeting another class, you should move it to the style definition for that class, e.g. given we have styles for 'parent' and 'child' elements, instead of adding a selector of ${'`& ${child}`'}) to 'parent', you should add ${'`${parent} &`'} to 'child').
          
          If your selector is targeting something global, use the 'globalStyle' function instead, e.g. if you wanted to write ${'`& h1`'}, you should instead write 'globalStyle(${'`${parent} h1`'}, { ... })'
        `,
      );
    }
  });
};
