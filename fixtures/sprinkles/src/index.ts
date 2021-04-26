import { createAtomsFn } from '@vanilla-extract/sprinkles/createAtomsFn';

import { atomicStyles } from './styles.css';
import testNodes from '../test-nodes.json';

const atoms = createAtomsFn(atomicStyles);

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
