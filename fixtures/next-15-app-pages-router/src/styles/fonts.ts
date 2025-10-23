import localF from 'next/font/local';
import { Roboto as R, Roboto_Flex as RF, Noto_Serif as NotoSerif } from 'next/font/google';

// intentionally odd local variable name to exercise transform edge-cases
export const __Local_Font = localF({
  src: [{ path: './fonts/Inter-Regular.woff2', weight: '400' }],
  fallback: ['system-ui'],
});

// renamed imports
export const _Roboto = R({
  weight: '400',
  subsets: ['latin'],
  fallback: ['system-ui', 'skibidi', 'third font'],
  style: ['italic', 'normal'],
});

export const _Flex = RF({
  subsets: ['latin', 'greek'],
  weight: ['200', '300'],
  adjustFontFallback: false,
  style: 'normal',
  fallback: ['system-ui'],
});

// style properties are consumed dynamically in nextFont.css.ts via pickedValues

// mirror additional cases from next-16
export const _localMultiFallback = localF({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  fallback: ['system-ui', 'ui-monospace', 'third font'],
});

export const _localExplicit = localF({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  weight: '400',
  style: 'italic',
  fallback: ['Times New Roman', 'Gill Sans'],
});

export const _localDupFallback = localF({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  fallback: ['system-ui', 'system-ui', 'ui-serif', 'weird_font'],
});

export const _robotoDefaultStyle = R({ subsets: ['latin'], fallback: ['serif'] });

export const _robotoItalic = R({ subsets: ['latin'], fallback: ['sans-serif'], style: 'italic', weight: '400' });

export const _robotoMultiStyle = R({ subsets: ['latin'], fallback: ['monospace'], style: ['italic', 'normal'] });

export const _robotoWeightStr = R({ weight: '400' });

export const _robotoWeightVar = R({ weight: 'variable' });

export const _notoSerif = NotoSerif({ subsets: ['latin'], fallback: ['system-ui'] });

export const _robotoFallbackSpaces = R({ subsets: ['latin'], fallback: ['Times New Roman', 'Gill Sans', 'Avenir Next'] });

export const _robotoDupFallback = R({ subsets: ['latin'], fallback: ['system-ui', 'system-ui', 'ui-serif', 'weird_font'] });
