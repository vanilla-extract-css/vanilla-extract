import { theme, altTheme } from './themes.css';
import { button, container } from './styles.css';
import { shadow } from './shared.css';

function render() {
  document.body.innerHTML = `
  <div class="${shadow}"> 
    Root theme
    <div class="${container}">
      <button class="${button.join(' ')}">Main theme button</button>
      <div class="${altTheme}"> 
        Alt theme
        <div class="${container}">
          <button class="${button.join(' ')}">Alt theme button</button>
          <div class="${theme}"> 
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
}

render();

// @ts-expect-error
if (module.hot) {
  // @ts-expect-error
  module.hot.accept(['./shared.css', './styles.css', './themes.css'], () => {
    render();
  });
}
