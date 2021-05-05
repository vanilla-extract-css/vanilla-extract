import { Fragment } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { HeadProvider } from 'react-head';
import App from './App';
import { StatsCompilation } from 'webpack';
import { darkMode, lightMode } from './system/styles/atoms.css';
import { themeKey } from './ColorModeToggle/ColorModeToggle';

type HeadTags = React.ReactElement<unknown>[];

const render = (route: string, headTags: HeadTags, basename: string) =>
  renderToString(
    <StaticRouter location={route} basename={basename}>
      <HeadProvider headTags={headTags}>
        <App />
      </HeadProvider>
    </StaticRouter>,
  );

const fullyQualifiedUrl = (path: string) =>
  `${process.env.URL || 'http://localhost:8080'}${path}`;

interface RenderParams {
  route: string;
  publicPath: string;
  entrypoints: NonNullable<StatsCompilation['entrypoints']>;
}
export default ({ route, publicPath, entrypoints }: RenderParams) => {
  const assetPath = (filename: string) => `${publicPath}${filename}`;
  const assets = entrypoints.main.assets;

  if (!assets) {
    throw new Error('No assets!');
  }

  const cssAssets = assets
    .filter((asset) => asset.name.endsWith('.css'))
    .map(
      (asset) =>
        `<link rel="stylesheet" href="${assetPath(asset.name)}"></link>`,
    );
  const jsAssets = assets
    .filter((asset) => asset.name.endsWith('.js'))
    .map((asset) => `<script src="${assetPath(asset.name)}"></script>`);

  const headTags: HeadTags = [];
  const html = render(route, headTags, publicPath);

  const favicon = (size?: number) =>
    `<link rel="icon" type="image/png" ${
      size ? `sizes="${size}x${size}" ` : ''
    }href="${assetPath(`favicon${size ? `-${size}x${size}` : ''}.png`)}" />`;

  const shareImageUrl = fullyQualifiedUrl(assetPath('og-image.png'));

  return `<html>
    <head>
      <script>
      ((d)=>{try{var p=localStorage.getItem('${themeKey}');if(p==d||(p!='${lightMode}'&&matchMedia('(prefers-color-scheme:dark)').matches)) document.documentElement.classList.add(d)}catch(e){}})('${darkMode}')
      </script>
      <link href="https://fonts.googleapis.com/css?family=Shrikhand&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css?family=DM+Sans&display=swap" rel="stylesheet">
      ${cssAssets.join('\n')}
      ${renderToString(<Fragment>{headTags}</Fragment>)}
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="theme-color" content="#fff"/>
      <link rel="manifest" href="${assetPath('site.webmanifest')}"/>
      <link rel="apple-touch-icon" href="${assetPath('apple-touch-icon.png')}"/>
      ${favicon(16)}
      ${favicon(32)}
      ${favicon()}
      <meta property="og:image" content="${shareImageUrl}" />
      <meta property="og:image:width" content="1200">
      <meta property="og:image:height" content="600">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="vanilla-extract">
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:image" content="${shareImageUrl}" />
    </head>
    <body>
        <div id="app">${html}</div>
        <script>window.BASE_URL = ${JSON.stringify(publicPath)};</script>
        ${jsAssets.join('\n')}
    </body>
  </html>`;
};
