import { createInlineTheme } from '@mattsjones/css-core';

import { theme, altTheme, tokens } from './themes.treat';
import { button, container } from './styles.treat';
import { shadow } from './shared.treat';
import testNodes from '../test-nodes.json';

const inlineTheme = createInlineTheme(tokens, {
  colors: {
    background: 'orange',
    text: 'black',
  },
});

document.body.innerHTML = `
  <div id="${testNodes.root}" class="${shadow}"> 
    Root theme
    <div id="${testNodes.rootContainer}" class="${container}">
      <button id="${testNodes.rootButton}" class="${button.join(
  ' ',
)}">Main theme button</button>
      <div class="${altTheme}"> 
        Alt theme
        <div id="${testNodes.altContainer}" class="${container}">
          <button id="${testNodes.altButton}" class="${button.join(
  ' ',
)}">Alt theme button</button>
          <div class="${theme.className}"> 
            Back to root theme
            <div id="${testNodes.nestedRootContainer}" class="${container}">
              <button id="${testNodes.nestedRootButton}" class="${button.join(
  ' ',
)}">Main theme button</button>
            <div class="${inlineTheme}"> 
              Inline theme
                <div id="${
                  testNodes.inlineThemeContainer
                }" class="${container}">
                  <button id="${
                    testNodes.inlineThemeButton
                  }" class="${button.join(' ')}">Main theme button</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
