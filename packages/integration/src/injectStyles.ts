const stylesheets: Record<string, HTMLElement> = {};

interface InjectStylesOptions {
  fileScopeId: string;
  css: string;
}
export const injectStyles = ({ fileScopeId, css }: InjectStylesOptions) => {
  let stylesheet = stylesheets[fileScopeId];

  if (!stylesheet) {
    const styleEl = document.createElement('style');
    styleEl.setAttribute('data-vanilla-extract', fileScopeId);
    stylesheet = stylesheets[fileScopeId] = styleEl;
    document.head.appendChild(styleEl);
  }

  stylesheet.innerHTML = css;
};
