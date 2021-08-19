import { globalStyle } from '@vanilla-extract/css';
import {
  createAtomicStyles,
  createAtomsFn,
  createMapValueFn,
  createNormalizeValueFn,
} from '@vanilla-extract/sprinkles';

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
    bgOpacity: {
      none: {
        vars: {
          '--alpha': 0
        }
      },
      '10': {
        vars: {
          '--alpha': 0.1
        }
      }
    },
    background: {
      red: `rgb(255, 0, 0, var(--alpha, 1))`
    }
  },
});

export const atoms = createAtomsFn(responsiveStyles);

export const mapResponsiveValue = createMapValueFn(responsiveStyles);
export const normalizeResponsiveValue =
  createNormalizeValueFn(responsiveStyles);

export const preComposedAtoms = atoms({
  display: 'block',
  paddingTop: 'small',
  bgOpacity: {
    mobile: 'none',
    tablet: '10'
  }
});

export const preComposedAtomsUsedInSelector = atoms({
  display: 'flex',
  paddingTop: 'medium'
});

globalStyle(`body > ${preComposedAtomsUsedInSelector}`, {
  background: 'red',
});

/**
 * Desired API Result
 * 
 * .randomClassHash_bgOpacity {
 *    --alpha: 0.5
 * }
 * 
 * .randomClassHash_background {
 *    background: rgba(var(--brandPrimary), var(--alpha))
 * }
 * 
 * Desired API
 * 
 * properties: {
 *  custom: {
 *  }
 *    bgOpacity: {
 *      
 *    }
 * }
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
