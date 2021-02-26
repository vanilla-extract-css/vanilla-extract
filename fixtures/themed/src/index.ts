import { mainTheme, altTheme } from './themes.treat';

import { button, rows } from './styles.treat';

document.body.innerHTML = `
  <div class="${mainTheme.className}"> 
    <div class="${rows}">
      <div><button class="${button}">Main theme button</button></div>
      <div class="${altTheme.className}"><button class="${button}">Alt theme button</button></div>
    </div>
  </div>
`;
