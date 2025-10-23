import local from 'next/font/local';
import {
  Inter as InterGoogle,
  Roboto_Flex as Flex,
  Noto_Serif as NotoSerif,
} from 'next/font/google';

// weirdly named local font variable to cover edge cases
export const local__font$Weird = local({
  src: [{ path: './fonts/Inter-Regular.woff2', weight: '400' }],
  fallback: ['system-ui'],
});

// renamed google imports
export const _googleInter = InterGoogle({
  subsets: ['latin'],
  fallback: ['system-ui'],
  style: 'italic',
  weight: 'variable',
});
export const _googleFlex = Flex({
  subsets: ['latin'],
  fallback: ['system-ui'],
});

// additional local next/font cases
export const _localMultiFallback = local({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  fallback: ['system-ui', 'ui-monospace', 'third font'],
});

export const _localExplicit = local({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  weight: '400',
  style: 'italic',
  fallback: ['Times New Roman', 'Gill Sans'],
});

export const _localDupFallback = local({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  fallback: ['system-ui', 'system-ui', 'ui-serif', 'weird_font'],
});

// additional google next/font cases (Inter)
export const _googleInterDefaultStyle = InterGoogle({
  subsets: ['latin'],
  fallback: ['serif'],
});

export const _googleInterItalic = InterGoogle({
  subsets: ['latin'],
  fallback: ['sans-serif'],
  style: 'italic',
  weight: '400',
});

export const _googleInterMultiStyle = InterGoogle({
  subsets: ['latin'],
  fallback: ['monospace'],
  style: ['italic', 'normal'],
});

export const _googleInterWeightStr = InterGoogle({ weight: '400' });

export const _googleInterWeightVar = InterGoogle({ weight: 'variable' });

export const _googleNotoSerif = NotoSerif({
  subsets: ['latin'],
  fallback: ['system-ui'],
});

export const _googleInterFallbackSpaces = InterGoogle({
  subsets: ['latin'],
  fallback: ['Times New Roman', 'Gill Sans', 'Avenir Next'],
});

export const _googleInterDupFallback = InterGoogle({
  subsets: ['latin'],
  fallback: ['system-ui', 'system-ui', 'ui-serif', 'weird_font'],
});

// local name edge-cases and option variations
export const localSimple = local({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
});

export const _LocalCamelCase = local({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  fallback: ['serif'],
});

export const local$Dollar = local({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  fallback: ['ui-sans-serif', 'emoji'],
});

export const _local_underscore123 = local({
  src: [
    { path: './fonts/Inter-Regular.woff2', weight: '400' },
    { path: './fonts/Inter-Regular.woff2', style: 'italic' },
  ],
  fallback: ['Times New Roman'],
});

// google extra coverage
export const _googleFlexMultiWeights = Flex({
  subsets: ['latin'],
  weight: ['200', '300'],
  fallback: ['system-ui'],
});

export const _googleInterGenericFallbacks = InterGoogle({
  subsets: ['latin'],
  fallback: [
    'ui-serif',
    'ui-sans-serif',
    'monospace',
    'emoji',
    'math',
    'ui-rounded',
  ],
});

export const _googleInterNoFallback = InterGoogle({ subsets: ['latin'] });
