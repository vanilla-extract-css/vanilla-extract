import testNodes from '../test-nodes.json';
import { myText } from './ordering.css';

const html = String.raw;

document.querySelector('#root')!.innerHTML = html`
  <div>
    <p id="${testNodes.text}" class="${myText}">This is some text</p>
  </div>
  <footer>
    <br />
    <a href="/">Go back</a>
  </footer>
`;
