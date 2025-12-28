import { style, styleVariants } from '@vanilla-extract/css';
import { createTextStyle } from '@capsizecss/vanilla-extract';
import { vars } from '../themes.css';
import { mapToProperty, responsiveStyle, queries } from '../themeUtils';

const makeTypographyRules = (textDefinition: typeof vars.text.standard) => {
  const { fontSize: mobileFontSize, lineHeight: mobileLineHeight } =
    textDefinition.mobile;

  const { fontSize: tabletFontSize, lineHeight: tabletLineHeight } =
    textDefinition.tablet;

  const { fontSize: desktopFontSize, lineHeight: desktopLineHeight } =
    textDefinition.tablet;

  return {
    untrimmed: style(
      responsiveStyle({
        mobile: {
          fontSize: mobileFontSize,
          lineHeight: mobileLineHeight,
        },
        tablet: {
          fontSize: tabletFontSize,
          lineHeight: tabletLineHeight,
        },
        desktop: {
          fontSize: desktopFontSize,
          lineHeight: desktopLineHeight,
        },
      }),
    ),
    trimmed: createTextStyle(textDefinition.mobile, {
      '@media': {
        [queries.tablet]: textDefinition.tablet,
        [queries.desktop]: textDefinition.desktop,
      },
    }),
  };
};

export const font = styleVariants(vars.fonts, mapToProperty('fontFamily'));
export const weight = styleVariants(vars.weight, mapToProperty('fontWeight'));

export const text = {
  standard: makeTypographyRules(vars.text.standard),
  small: makeTypographyRules(vars.text.small),
  xsmall: makeTypographyRules(vars.text.xsmall),
  code: makeTypographyRules(vars.text.code),
};

export const heading = {
  '1': makeTypographyRules(vars.heading.h1),
  '2': makeTypographyRules(vars.heading.h2),
  '3': makeTypographyRules(vars.heading.h3),
  '4': makeTypographyRules(vars.heading.h4),
};
