import { a } from './styles.css';
import testNodes from '../test-nodes.json';

console.log(a);

function render() {
  document.body.innerHTML = `
  <div id="${testNodes.root}""> 
    Root theme
    
  </div>
`;
}

render();

// @ts-expect-error
if (module.hot) {
  // @ts-expect-error
  module.hot.accept(['./styles.css'], () => {
    render();
  });
}
