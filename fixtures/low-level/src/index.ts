import {
  block,
  container,
  textVariant,
  textReset,
  textBase,
} from './styles.css';
import testNodes from '../test-nodes.json';

const html = String.raw;

document.body.innerHTML = html`
  <div class="${container}">
    <div id="${testNodes.block}" class="${block}">I'm a block</div>
    <div>
      <p id="${testNodes.text}" class="${textVariant}">This is some text</p>
      <button type="button" id="button">
        Simulate loading CSS asynchronously 3...
      </button>
    </div>
  </div>
`;

document.getElementById('button')!.addEventListener('click', (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  const textClasses = document.getElementById(testNodes.text)!.classList;
  if (!textClasses.contains(textReset)) {
    button.innerHTML += '2...';
    return textClasses.add(textReset);
  }
  if (!textClasses.contains(textBase)) {
    button.innerHTML += '1... Done';
    return textClasses.add(textBase);
  }
});
