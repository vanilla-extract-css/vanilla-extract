import { atoms, responsiveValue } from './styles.css';
import testNodes from '../test-nodes.json';

const n = responsiveValue.normalize('hello');
console.log(n);

function render() {
  document.body.innerHTML = `
  <div id="${testNodes.root}" class="${atoms({
    display: 'block',
    paddingTop: {
      mobile: 'small',
      desktop: 'medium',
    },
  })}"> 
    Sprinkles
  </div>
`;
}

render();
