import { button } from './styles.css';

function render() {
  document.body.innerHTML = `
  <button class="${button()}"> 
    Standard calm button
  </button>
  <button class="${button({ size: 'small' })}"> 
    Small calm button
  </button>
  <button class="${button({ tone: 'angry' })}"> 
    Standard angry button
  </button>
  <button class="${button({
    size: 'small',
    tone: 'angry',
  })}"> 
    Small angry button
  </button>
`;
}

render();
