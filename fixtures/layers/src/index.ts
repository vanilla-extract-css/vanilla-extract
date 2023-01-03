import testNodes from '../test-nodes.json';
import { textBase, textReset, textApp } from './styles.css';

const html = String.raw;

document.body.innerHTML = html`
  <div>
    <p id="${testNodes.default}" class="reset">
      Text on reset layer (globalStyle)
    </p>
    <p id="${testNodes.reset}" class="${textReset}">Text on reset layer</p>
    <p id="${testNodes.base}" class="${textBase}">Text on base layer</p>
    <p id="${testNodes.app}" class="${textApp}">Text on app layer</p>
  </div>
`;
