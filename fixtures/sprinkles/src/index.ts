import {
  sprinkles,
  mapResponsiveValue,
  normalizeResponsiveValue,
  preComposedSprinkles,
  preComposedSprinklesUsedInSelector,
  container,
} from './styles.css';
import testNodes from '../test-nodes.json';

function render() {
  document.body.innerHTML = `
  <div id="${testNodes.root}" class="${container}">
    <div class="${sprinkles({
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
    <div class="${preComposedSprinkles}">Precomposed sprinkles</div>
    <div class="${preComposedSprinklesUsedInSelector}">Precomposed Sprinkles Used In Selector</div>
  </div>
`;
}

render();
