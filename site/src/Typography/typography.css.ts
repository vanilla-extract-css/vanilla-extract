import { styleVariants } from '@vanilla-extract/css';
import { createCss } from '../capsize';
import { vars } from '../themes.css';
import { mapToProperty, responsiveStyle } from '../themeUtils';

const makeTypographyRules = (textDefinition: typeof vars.text.standard) => {
  const {
    fontSize: mobileFontSize,
    lineHeight: mobileLineHeight,
    ...mobileTrims
  } = createCss(textDefinition.mobile);

  const {
    fontSize: tabletFontSize,
    lineHeight: tabletLineHeight,
    ...desktopTrims
  } = createCss(textDefinition.tablet);

  const {
    fontSize: desktopFontSize,
    lineHeight: desktopLineHeight,
    ...tabletTrims
  } = createCss(textDefinition.tablet);

  return {
    base: responsiveStyle({
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
    trims: responsiveStyle({
      mobile: mobileTrims,
      tablet: tabletTrims,
      desktop: desktopTrims,
    }),
  };
};

export const font = styleVariants(vars.fonts, mapToProperty('fontFamily'));
export const weight = styleVariants(vars.weight, mapToProperty('fontWeight'));

export const text = {
  standard: styleVariants(makeTypographyRules(vars.text.standard)),
  small: styleVariants(makeTypographyRules(vars.text.small)),
  xsmall: styleVariants(makeTypographyRules(vars.text.xsmall)),
  code: styleVariants(makeTypographyRules(vars.text.code)),
};

export const heading = {
  '1': styleVariants(makeTypographyRules(vars.heading.h1)),
  '2': styleVariants(makeTypographyRules(vars.heading.h2)),
  '3': styleVariants(makeTypographyRules(vars.heading.h3)),
  '4': styleVariants(makeTypographyRules(vars.heading.h4)),
};
