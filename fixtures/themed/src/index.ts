import { theme, altTheme } from './themes.treat';
import { button, container } from './styles.treat';
import { shadow } from './shared.treat';

document.body.innerHTML = `
  <div class="${shadow}"> 
    Root theme
    <div class="${container}">
      <button class="${button.join(' ')}">Main theme button</button>
      <div class="${altTheme}"> 
        Alt theme
        <div class="${container}">
          <button class="${button.join(' ')}">Alt theme button</button>
          <div class="${theme.className}"> 
            Back to root theme
            <div class="${container}">
              <button class="${button.join(' ')}">Main theme button</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
