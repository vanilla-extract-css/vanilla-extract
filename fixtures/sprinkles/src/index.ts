import { atoms, responsiveValue } from './styles.css';
import testNodes from '../test-nodes.json';

console.log('responsiveValue', responsiveValue);

const { mobile, tablet, desktop } = responsiveValue.normalize('hello');
console.log(mobile, tablet, desktop);

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
