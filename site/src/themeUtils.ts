import { dequal as isEqual } from 'dequal';
import type { StyleRule } from '@vanilla-extract/css';
import type { Properties } from 'csstype';
import { entries, fromEntries } from './objectUtils';

export const breakpoints = {
  mobile: 0,
  tablet: 769, // aligning breakpoint with the SearchInput, which uses a `max-width: 768px`. Ref: https://github.com/algolia/docsearch/blob/d81016b110aa0818231b6e4b7b96d2007d345b05/packages/docsearch-css/src/button.css#L66
  desktop: 1200,
};

export type Breakpoint = keyof typeof breakpoints;
type CSSProps = Omit<StyleRule, '@media' | '@supports'>;

const { mobile: _, ...nonMobileBreakpoints } = breakpoints;

export const queries = fromEntries(
  entries(nonMobileBreakpoints).map(([key, bp]) => [
    key,
    `screen and (min-width: ${bp}px)`,
  ]),
);

const makeMediaQuery =
  (breakpoint: keyof typeof queries) => (styles: CSSProps) =>
    !styles || Object.keys(styles).length === 0
      ? {}
      : {
          [queries[breakpoint]]: styles,
        };

const mediaQuery = {
  tablet: makeMediaQuery('tablet'),
  desktop: makeMediaQuery('desktop'),
};

interface ResponsiveStyle {
  mobile?: CSSProps;
  tablet?: CSSProps;
  desktop?: CSSProps;
}

export const responsiveStyle = ({
  mobile,
  tablet,
  desktop,
}: ResponsiveStyle): StyleRule => {
  const tabletStyles = !tablet || isEqual(tablet, mobile) ? null : tablet;

  const stylesBelowDesktop = tabletStyles || mobile;
  const desktopStyles =
    !desktop || isEqual(desktop, stylesBelowDesktop) ? null : desktop;

  const hasMediaQueries = tabletStyles || desktopStyles;

  return {
    ...mobile,
    ...(hasMediaQueries
      ? {
          '@media': {
            ...(tabletStyles ? mediaQuery.tablet(tabletStyles) : {}),
            ...(desktopStyles ? mediaQuery.desktop(desktopStyles) : {}),
          },
        }
      : {}),
  };
};

export const mapToProperty =
  <Property extends keyof Properties<string | number>>(
    property: Property,
    breakpoint?: Breakpoint,
  ) =>
  (value: string | number) => {
    const styleRule = { [property]: value };

    return breakpoint
      ? responsiveStyle({ [breakpoint]: styleRule })
      : styleRule;
  };
