import { isEqual, omit } from 'lodash';
import { StyleRule } from '@vanilla-extract/css';
import { Properties, SimplePseudos } from 'csstype';

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1200,
};

export type Breakpoint = keyof typeof breakpoints;

const makeMediaQuery = (breakpoint: keyof typeof breakpoints) => (
  styles: Properties<string | number>,
) =>
  !styles || Object.keys(styles).length === 0
    ? {}
    : {
        [`screen and (min-width: ${breakpoints[breakpoint]}px)`]: styles,
      };

const mediaQuery = {
  tablet: makeMediaQuery('tablet'),
  desktop: makeMediaQuery('desktop'),
};

type CSSProps = Properties<string | number> &
  { [P in SimplePseudos]?: Properties<string | number> };

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
  const mobileStyles = omit(mobile, '@media');

  const tabletStyles = !tablet || isEqual(tablet, mobileStyles) ? null : tablet;

  const stylesBelowDesktop = tabletStyles || mobileStyles;
  const desktopStyles =
    !desktop || isEqual(desktop, stylesBelowDesktop) ? null : desktop;

  const hasMediaQueries = tabletStyles || desktopStyles;

  return {
    ...mobileStyles,
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

export const mapToProperty = <
  Property extends keyof Properties<string | number>
>(
  property: Property,
  breakpoint?: Breakpoint,
) => (value: string | number) => {
  const styleRule = { [property]: value };

  return breakpoint ? responsiveStyle({ [breakpoint]: styleRule }) : styleRule;
};
