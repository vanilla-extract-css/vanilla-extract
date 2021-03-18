/**
 * @jest-environment jsdom
 */
import { screen } from '@testing-library/dom';
import { createInlineTheme } from '@mattsjones/css-core';

import { hide, padding, twentyTheme, themeVars, blackBg } from './jest-dom.css';

describe('jest-dom', () => {
  it('should attach css to nodes', () => {
    document.body.innerHTML = `
      <div data-testid="hidden" class="${hide}">Hidden Example</div>
      <div data-testid="blackBg" class="${blackBg}">Hidden Example</div>
    `;

    expect(screen.queryByTestId('hidden')).not.toBeVisible();
    expect(screen.queryByTestId('blackBg')).toHaveStyle({
      backgroundColor: 'rgb(0, 0, 0)',
    });
  });

  // CSS vars seem to be broken in jsdom/cssom/cssstyle (whichever one is relevant here)
  // As far as I can tell the issue is not on our end
  it.skip('should support css variables', () => {
    document.body.innerHTML = `
      <div data-testid="10" class="${padding}">10 padding top</div>
      <div data-testid="20" class="${twentyTheme} ${padding}">20 padding top</div>
      <div data-testid="30" style="${createInlineTheme(themeVars, {
        space: '30px',
      })}" class="${padding}">20 padding top</div>
    `;

    expect(screen.queryByTestId('10')).toHaveStyle({ paddingTop: '10px' });
    expect(screen.queryByTestId('20')).toHaveStyle({ paddingTop: '20px' });
    expect(screen.queryByTestId('30')).toHaveStyle({ paddingTop: '30px' });
  });
});
