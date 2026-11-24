// Mocked Google Fonts CSS responses, used via NEXT_FONT_GOOGLE_MOCKED_RESPONSES.
// Google sometimes serves `/l/font?kit=...&skey=...` URLs, which Turbopack fails to parse.
// Turbopack still downloads the font files over the network, webpack doesn't.
// Turbopack serializes these exports, so they must be plain data.
// Must be CommonJS: webpack's font loader does `require(file)[url]`.

const creepster =
  'https://fonts.gstatic.com/s/creepster/v13/AlZy_zVUqJz4yMrniH4Rcn35fh4Dog.woff2';
// Only Creepster is rendered, so every other family can share a file
const inter =
  'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2';

const requests = [
  ['Creepster:wght@400', 'block', creepster],
  ['Inter:ital,wght@0,100..900;1,100..900', 'swap', inter],
  ['Inter:ital,wght@1,100..900', 'swap', inter],
  ['Inter:wght@100..900', 'swap', inter],
  ['Inter:wght@400;700;900', 'swap', inter],
  ['Inter:wght@400', 'swap', inter],
  ['Noto+Serif:wght@100..900', 'swap', inter],
  ['Roboto+Flex:wght@200;300', 'swap', inter],
  ['Roboto:ital,wght@0,100..900;1,100..900', 'swap', inter],
  ['Roboto:ital,wght@0,400;1,400', 'swap', inter],
  ['Roboto:ital,wght@1,400', 'swap', inter],
  ['Roboto:wght@100..900', 'swap', inter],
  ['Roboto:wght@400', 'swap', inter],
];

module.exports = Object.fromEntries(
  requests.map(([family, display, src]) => [
    `https://fonts.googleapis.com/css2?family=${family}&display=${display}`,
    `@font-face {
  font-family: '${family.split(':')[0].replaceAll('+', ' ')}';
  font-style: normal;
  font-weight: 400;
  font-display: ${display};
  src: url(${src}) format('woff2');
}
`,
  ]),
);
