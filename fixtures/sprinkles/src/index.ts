import { atoms, responsiveValue } from './styles.css';
import testNodes from '../test-nodes.json';

console.log('responsiveValue', responsiveValue.normalize([1, null, 3]));

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
