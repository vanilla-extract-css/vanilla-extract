import type { FileScope } from '../types';

const stylesheets: Record<string, HTMLElement> = {};

interface InjectStylesOptions {
  fileScope: FileScope;
  css: string;
}
export const injectStyles = ({ fileScope, css }: InjectStylesOptions) => {
  const fileScopeId = fileScope.packageName
    ? [fileScope.packageName, fileScope.filePath].join('/')
    : fileScope.filePath;

  let stylesheet = stylesheets[fileScopeId];

  if (!stylesheet) {
    const styleEl = document.createElement('style');

    if (fileScope.packageName) {
      styleEl.setAttribute('data-package', fileScope.packageName);
    }

    styleEl.setAttribute('data-file', fileScope.filePath);
    styleEl.setAttribute('type', 'text/css');
    stylesheet = stylesheets[fileScopeId] = styleEl;
    document.head.appendChild(styleEl);
  }

  stylesheet.innerHTML = css;
};
