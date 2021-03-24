import { createInlineTheme } from '@mattsjones/css-core/createInlineTheme';

import { theme, altTheme, responsiveTheme, vars } from './themes.css';
import { button, container, opacity } from './styles.css';
import { shadow } from './shared.css';
import testNodes from '../test-nodes.json';

const inlineTheme = createInlineTheme(vars, {
  colors: {
    backgroundColor: 'orange',
    text: 'black',
  },
  space: {
    1: '4px',
    2: '8px',
    3: '12px',
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
          <div class="${theme}"> 
            Back to root theme
            <div id="${testNodes.nestedRootContainer}" class="${container}">
              <button id="${testNodes.nestedRootButton}" class="${button.join(
  ' ',
)}">Main theme button</button>
            <div style="${inlineTheme}">
              Inline theme
                <div id="${
                  testNodes.inlineThemeContainer
                }" class="${container}">
                  <button id="${
                    testNodes.inlineThemeButton
                  }" class="${button.join(' ')} ${
  opacity['1/2']
}">Inline theme button</button>
                  <div class="${responsiveTheme}">
              Responsive theme
                <div id="${
                  testNodes.responsiveThemeContainer
                }" class="${container}">
                  <button id="${
                    testNodes.responsiveThemeButton
                  }" class="${button.join(
  ' ',
)}">Responsive theme button</button>
                </div>
              </div>
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
