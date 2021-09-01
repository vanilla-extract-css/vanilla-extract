import { button } from './styles.css';
import testNodes from '../test-nodes.json';

function render() {
  document.body.innerHTML = `
  <button id="${testNodes.root}" class="${button({ size: 'small' })}"> 
    Small button
  </button>
  <button id="${testNodes.root}" class="${button()}"> 
    Standard button
  </button>
`;
}

render();
