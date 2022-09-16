import { block, container } from './styles.css';
import testNodes from '../test-nodes.json';

document.body.innerHTML = `
<div class="${container}"> 
  <div id="${testNodes.block}" class="${block}"> 
    I'm a block
  </div>
</div>
`;
