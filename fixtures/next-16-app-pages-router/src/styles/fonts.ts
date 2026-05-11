// --- 1. Imports ---
// Test weirdly named imports for both local and google fonts.

import {
  Noto_Serif as NotoSerif,
  Roboto as R,
  Roboto_Flex as RF,
  Inter as Weird_Renamed_Font$8a_,
} from 'next/font/google';
import weird_renamed_local$3_ from 'next/font/local';

// =================================================================
// next/font/local (using weird_renamed_local$3_)
// =================================================================

// --- 2. Local: Variable Name Edge Cases (Export) ---
// The import name is already tested. This tests weird export names.

export const localSimple = weird_renamed_local$3_({
  src: './fonts/Inter-Regular.woff2',
  preload: false,
});

export const $local_weird_EXPORT_name_ = weird_renamed_local$3_({
  src: './fonts/Inter-Regular.woff2',
  fallback: ['system-ui'],
  preload: false,
});

// --- 3. Local: Fallback Prop ---

export const localFallbackOmitted = weird_renamed_local$3_({
  src: './fonts/Inter-Regular.woff2',
  // fallback is omitted
  preload: false,
});

export const localFallbackSingleArray = weird_renamed_local$3_({
  src: './fonts/Inter-Regular.woff2',
  fallback: ['system-ui'],
  preload: false,
});

export const localFallbackMultiArray = weird_renamed_local$3_({
  src: './fonts/Inter-Regular.woff2',
  fallback: ['Times New Roman', 'Gill Sans', 'emoji'],
  preload: false,
});

// --- 4. Local: Style Prop ---

export const localStyleOmitted = weird_renamed_local$3_({
  src: './fonts/Inter-Regular.woff2',
  // style is omitted
  preload: false,
});

export const localStyleSingle = weird_renamed_local$3_({
  src: './fonts/Inter-Regular.woff2',
  style: 'italic',
  preload: false,
});

// --- 5. Local: Weight Prop ---

export const localWeightOmitted = weird_renamed_local$3_({
  src: './fonts/Inter-Regular.woff2',
  // weight is omitted
  preload: false,
});

export const localWeightSingle = weird_renamed_local$3_({
  src: './fonts/Inter-Regular.woff2',
  weight: '400',
  preload: false,
});

// =================================================================
// next/font/google (using Weird_Renamed_Font$8a_)
// =================================================================

// --- 6. Google: Variable Name Edge Cases (Export) ---
// The import name is already tested. This tests weird export names.

export const googleSimple = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  preload: false,
});

export const $google_weird_EXPORT_name_ = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  fallback: ['system-ui'],
  preload: false,
});

// --- 7. Google: Fallback Prop ---

export const googleFallbackOmitted = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  // fallback is omitted
  preload: false,
});

export const googleFallbackSingleArray = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  fallback: ['system-ui'],
  preload: false,
});

export const googleFallbackMultiArray = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  fallback: ['Times New Roman', 'Gill Sans', 'emoji'],
  preload: false,
});

// --- 8. Google: Style Prop ---

export const googleStyleOmitted = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  // style is omitted
  preload: false,
});

export const googleStyleSingle = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  style: 'italic',
  preload: false,
});

export const googleStyleArray = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  preload: false,
});

// --- 9. Google: Weight Prop ---

export const googleWeightOmitted = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  // weight is omitted
  preload: false,
});

export const googleWeightSingle = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  weight: '400',
  preload: false,
});

export const googleWeightVariable = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  weight: 'variable',
  preload: false,
});

export const googleWeightArray = Weird_Renamed_Font$8a_({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  preload: false,
});

// intentionally odd local variable name to exercise transform edge-cases
export const __Local_Font = weird_renamed_local$3_({
  src: [{ path: './fonts/Inter-Regular.woff2', weight: '400' }],
  fallback: ['system-ui'],
  preload: false,
});

// renamed imports
export const _Roboto = R({
  weight: '400',
  subsets: ['latin'],
  fallback: ['system-ui', 'skibidi', 'third font'],
  style: ['italic', 'normal'],
  preload: false,
});

export const _Flex = RF({
  subsets: ['latin', 'greek'],
  weight: ['200', '300'],
  adjustFontFallback: false,
  style: 'normal',
  fallback: ['system-ui'],
  preload: false,
});

// style properties are consumed dynamically in nextFont.css.ts via pickedValues

// mirror additional cases from next-16
export const _localMultiFallback = weird_renamed_local$3_({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  fallback: ['system-ui', 'ui-monospace', 'third font'],
  preload: false,
});

export const _localExplicit = weird_renamed_local$3_({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  weight: '400',
  style: 'italic',
  fallback: ['Times New Roman', 'Gill Sans'],
  preload: false,
});

export const _localDupFallback = weird_renamed_local$3_({
  src: [{ path: './fonts/Inter-Regular.woff2' }],
  fallback: ['system-ui', 'system-ui', 'ui-serif', 'weird_font'],
  preload: false,
});

export const _robotoDefaultStyle = R({
  subsets: ['latin'],
  fallback: ['serif'],
  preload: false,
});

export const _robotoItalic = R({
  subsets: ['latin'],
  fallback: ['sans-serif'],
  style: 'italic',
  weight: '400',
  preload: false,
});

export const _robotoMultiStyle = R({
  subsets: ['latin'],
  fallback: ['monospace'],
  style: ['italic', 'normal'],
  preload: false,
});

export const _robotoWeightStr = R({ weight: '400', preload: false });

export const _robotoWeightVar = R({ weight: 'variable', preload: false });

export const _notoSerif = NotoSerif({
  subsets: ['latin'],
  fallback: ['system-ui'],
  preload: false,
});

export const _robotoFallbackSpaces = R({
  subsets: ['latin'],
  fallback: ['Times New Roman', 'Gill Sans', 'Avenir Next'],
  preload: false,
});

export const _robotoDupFallback = R({
  subsets: ['latin'],
  fallback: ['system-ui', 'system-ui', 'ui-serif', 'weird_font'],
  preload: false,
});
