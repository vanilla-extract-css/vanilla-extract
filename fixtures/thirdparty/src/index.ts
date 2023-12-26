import { block, depBlock, depdepBlock } from './styles.css';
import testNodes from '../test-nodes.json';

document.body.innerHTML = `
  <div id="${testNodes.first}" class="${block}">
    I'm a first-party block
    <div id="${testNodes.third}" class="${depBlock}">
      I'm a third party block
      <div id="${testNodes.thirdThird}" class="${depdepBlock}">
        I'm a third party of third party block
      </div>
    </div>
  </div>
`;
