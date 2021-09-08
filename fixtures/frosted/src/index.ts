import { button } from './styles.css';
import testNodes from '../test-nodes.json';

function render() {
  document.body.innerHTML = `
  <button id="${testNodes.root}" class="${button()}"> 
    Standard calm button
  </button>
  <button id="${testNodes.root}" class="${button({ size: 'small' })}"> 
    Small calm button
  </button>
  <button id="${testNodes.root}" class="${button({ tone: 'angry' })}"> 
    Standard angry button
  </button>
  <button id="${testNodes.root}" class="${button({
    size: 'small',
    tone: 'angry',
  })}"> 
    Small angry button
  </button>
`;
}

render();
