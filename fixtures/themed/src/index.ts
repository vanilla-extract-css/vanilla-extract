import { theme, altTheme } from './themes.treat';
import { button, container } from './styles.treat';

document.body.innerHTML = `
  <div> 
    Root theme
    <div class="${container}">
      <button class="${button}">Main theme button</button>
      <div class="${altTheme}"> 
        Alt theme
        <div class="${container}">
          <button class="${button}">Alt theme button</button>
          <div class="${theme.className}"> 
            Back to root theme
            <div class="${container}">
              <button class="${button}">Main theme button</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;
