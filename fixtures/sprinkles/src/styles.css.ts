import { globalStyle, createVar } from '@vanilla-extract/css';
import {
  createAtomicStyles,
  createAtomsFn,
  createMapValueFn,
  createNormalizeValueFn,
} from '@vanilla-extract/sprinkles';

const alpha = createVar();
const textAlpha = createVar();

const responsiveStyles = createAtomicStyles({
  defaultCondition: 'mobile',
  conditions: {
    mobile: {},
    tablet: {
      '@media': 'screen and (min-width: 768px)',
    },
    desktop: {
      '@media': 'screen and (min-width: 1024px)',
    },
    darkDesktop: {
      '@supports': 'not (display: grid)',
      '@media': 'screen and (min-width: 1024px)',
      selector: '[data-dark-mode] &',
    },
  },
  responsiveArray: ['mobile', 'tablet', 'desktop'],
  properties: {
    display: ['flex', 'none', 'block'],
    paddingTop: {
      small: '10px',
      medium: '20px',
    },
    background: {
      red: {
        vars: { [alpha]: '1' },
        background: `rgba(255, 0, 0, ${alpha})`,
      },
    },
    backgroundOpacity: {
      1: { vars: { [alpha]: '1' } },
      0.1: { vars: { [alpha]: '0.1' } },
      0.2: { vars: { [alpha]: '0.2' } },
      0.3: { vars: { [alpha]: '0.3' } },
    },
  },
});

const styleWithNoConditions = createAtomicStyles({
  properties: {
    color: {
      red: {
        vars: {
          [textAlpha]: '1'
        },
        color: `rgba(255, 0, 0, ${textAlpha})`
      }
    },
    textOpacity: {
      1: { vars: { [textAlpha]: '1' } },
      0.1: { vars: { [textAlpha]: '0.1' } },
      0.2: { vars: { [textAlpha]: '0.2' } },
      0.3: { vars: { [textAlpha]: '0.3' } },
    }
  }
});

export const atoms = createAtomsFn(responsiveStyles, styleWithNoConditions);

export const mapResponsiveValue = createMapValueFn(responsiveStyles);
export const normalizeResponsiveValue =
  createNormalizeValueFn(responsiveStyles);

export const preComposedAtoms = atoms({
  display: 'block',
  paddingTop: 'small',
  background: 'red',
  backgroundOpacity: { mobile: 0.1, tablet: 0.2, desktop: 0.3 },
  color: 'red'
});

export const preComposedAtomsUsedInSelector = atoms({
  display: 'flex',
  paddingTop: 'medium',
});

globalStyle(`body > ${preComposedAtomsUsedInSelector}`, {
  background: 'red',
});
