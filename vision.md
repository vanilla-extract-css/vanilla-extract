# Layers

<https://developer.chrome.com/blog/cascade-layers/>
<https://www.bram.us/2021/09/15/the-future-of-css-cascade-layers-css-at-layer/>

## Why?

The main problem cascade layers solve is providing a guaranteed way to write CSS without worrying about specificity and source order.

<!-- <video autoplay="" loop="" muted=""><source src="https://storage.googleapis.com/web-dev-uploads/video/vS06HQ1YTsbMKSFTIPl2iogUQP73/MQJ5WhdqY78qTwIU2Bt6.mp4" type="video/mp4"></video> -->

```css
@layer reset, base, theme;
@layer utilities;

@layer theme {
  .heading {
    color: rebeccapurple;
  }
  @layer apac {
    .heading {
      color: #0066ff;
    }
  }
}
@layer base {
  .heading {
    color: papayawhip;
  }
}
@layer reset {
  * {
    color: black;
  }
}
```

## Proposed API

### Discarded

```ts
// all-in-one
const [resetLayer, baseLayer, themeLayer, utilitiesLayer] =
  createLayers('reset', 'base', 'theme', 'utilities');

// iterable style (no debug ids)
const [resetLayer, baseLayer, themeLayer, utilitiesLayer] =
  createLayers();
```

### Kept

```ts
// one by one
const resetLayer = layer('reset'); // optional debug id
const baseLayer = layer({ parent: resetLayer }, 'base'); // maybe?
const themeLayer = layer({ sideEffect: false }); // maybe next step?
const utilitiesLayer = layer();

///

export const braidLayer = globalLayer('braid'); // not hashed name
export const utilitiesLayer = layer({ parent: braidLayer }); // hashed name
// @layer braid.styles_utilities__1hiof575;

// in my app
globalLayer(braidLayer);
layer({ parent: braidLayer }, 'myStuff');
globalLayer(utilitiesLayer);
// then import/execute braid code
```

```ts
// alt
const layers = layerTree({
  reset: null,
  theme: {
    apac: null
  }
});

// alt
const resetLayer = layer('reset');
const themeLayer = layer('theme.apac');

const headingTheme = style({
  '@layer': {
    [layers.theme]: {
      color: 'rebeccapurple'
    },
    [layers.theme.apac]: {
      color: '#0066ff'
    }
  }
});
const headingBase = style({
  '@layer': {
    [baseLayer]: {
      color: 'papayawhip'
    }
  }
});
globalStyle('*', {
  '@layer': {
    [resetLayer]: {
      color: 'black'
    }
  }
});
```

### Nesting, Hoising

```ts
const baseLayer = createLayer();

const text = style({
  '@layer': {
    [baseLayer]: {
      '@layer': {
        more_nesting: {
          color: 'magenta',
          textDecoration: 'underline'
        }
      },
      '@media': {
        'screen and (min-width: 200px)': {
          color: 'green',
          '@layer': {
            more_nesting: {
              color: 'indigo'
            }
          }
        }
      }
    }
  }
});

// these will be hoisted
const some = createLayer();
const more = createLayer();
const layers = createLayer();
```
