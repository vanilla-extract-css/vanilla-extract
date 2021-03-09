import { block } from './styles.treat';
import testNodes from '../test-nodes.json';

document.body.innerHTML = `
  <div id="${testNodes.block}" class="${block}"> 
    I'm a block
  </div>
`;
