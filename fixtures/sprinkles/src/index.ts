import {
  atoms,
  mapResponsiveValue,
  normalizeResponsiveValue,
  preComposedAtoms,
  preComposedAtomsUsedInSelector,
} from './styles.css';
import testNodes from '../test-nodes.json';

function render() {
  document.body.innerHTML = `
  <div id="${testNodes.root}" class="${atoms({
    display: normalizeResponsiveValue('block').mobile,
    paddingTop: mapResponsiveValue(
      {
        mobile: 'small',
        desktop: 'medium',
      } as const,
      (x) => x,
    ),
  })}"> 
    Sprinkles
  </div>
  <div class="${preComposedAtoms}">Precomposed atoms</div>
  <div class="${preComposedAtomsUsedInSelector}">Precomposed Atoms Used In Selector</div>
`;
}

render();
