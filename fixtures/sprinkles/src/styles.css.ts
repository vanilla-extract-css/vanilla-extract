import {
  globalStyle,
  createVar,
  createContainer,
  style,
} from '@vanilla-extract/css';
import {
  defineProperties,
  createSprinkles,
  createMapValueFn,
  createNormalizeValueFn,
} from '@vanilla-extract/sprinkles';

const alpha = createVar();
const textAlpha = createVar();
const color = createVar();

const containerName = createContainer();

export const container = style({
  containerName,
  containerType: 'size',
});
export const document = style({});

const responsiveConditions = {
  defaultCondition: 'mobile',
  conditions: {
    mobile: {},
    tablet: {
      '@container': `${containerName} (min-width: 768px)`,
      '@media': 'screen and (min-width: 768px)',
    },
    desktop: {
      '@container': `${containerName} (min-width: 1024px)`,
      '@media': 'screen and (min-width: 1024px)',
    },
    darkDesktop: {
      '@supports': 'not (display: grid)',
      '@media': 'screen and (min-width: 1024px)',
      selector: '[data-dark-mode] &',
    },
  },
  responsiveArray: ['mobile', 'tablet', 'desktop'],
} as const;

const scopeConditions = {
  defaultCondition: 'unscoped',
  conditions: {
    unscoped: {},
    document: {
      '@scope': `(${document})`,
    },
  },
  responsiveArray: ['unscoped', 'document'],
} as const;

const responsiveProperties = defineProperties({
  ...responsiveConditions,
  properties: {
    display: ['flex', 'none', 'block'],
    paddingTop: {
      small: '10px',
      medium: '20px',
    },
  },
});

const responsiveLayerProperties = defineProperties({
  '@layer': 'responsive-layer-name',
  ...responsiveConditions,
  properties: {
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

const scopeProperties = defineProperties({
  ...scopeConditions,
  properties: {
    flexDirection: ['row', 'column'],
    order: {
      first: '1',
      second: '2',
    },
  },
});

const scopeLayerProperties = defineProperties({
  '@layer': 'responsive-layer-name',
  ...scopeConditions,
  properties: {
    border: {
      light: {
        vars: { [color]: 'black' },
        border: `4px solid ${color}`,
      },
    },
    borderColor: {
      neutral: { vars: { [color]: 'black' } },
      primary: { vars: { [color]: 'blue' } },
      secondary: { vars: { [color]: 'red' } },
    },
  },
});

const unconditionalProperties = defineProperties({
  properties: {
    color: {
      red: {
        vars: {
          [textAlpha]: '1',
        },
        color: `rgba(255, 0, 0, ${textAlpha})`,
      },
    },
  },
});

const unconditionalLayerProperties = defineProperties({
  '@layer': 'unconditional-layer-name',
  properties: {
    textOpacity: {
      1: { vars: { [textAlpha]: '1' } },
      0.8: { vars: { [textAlpha]: '0.8' } },
    },
  },
});

export const sprinkles = createSprinkles(
  responsiveProperties,
  responsiveLayerProperties,
  scopeProperties,
  scopeLayerProperties,
  unconditionalProperties,
  unconditionalLayerProperties,
);

export const mapResponsiveValue = createMapValueFn(responsiveProperties);
export const normalizeResponsiveValue =
  createNormalizeValueFn(responsiveProperties);

export const preComposedSprinkles = sprinkles({
  display: 'block',
  flexDirection: 'row',
  order: 'second',
  paddingTop: 'small',
  background: 'red',
  backgroundOpacity: { mobile: 0.1, tablet: 0.2, desktop: 0.3 },
  color: 'red',
  textOpacity: 0.8,
  border: 'light',
  borderColor: { document: 'primary', unscoped: 'secondary' },
});

export const preComposedSprinklesUsedInSelector = sprinkles({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 'medium',
  order: 'first',
});

globalStyle('body', {
  margin: 0,
});

globalStyle(`body ${preComposedSprinklesUsedInSelector}`, {
  background: 'red',
});
