import * as styles from './composedStyles.css';
import testNodes from '../test-nodes.json';

function render() {
  document.body.innerHTML = `
    <div id="${testNodes.mergedStyle}" class="${styles.mergedStyle}">Merged style</div>
    <div id="${testNodes.styleWithComposition}" class="${styles.styleWithComposition}">Style with composition</div>
    <div id="${testNodes.compositionOnly}" class="${styles.compositionOnly}">Composition only</div>
    <div id="${testNodes.compositionInSelector}" class="${styles.compositionInSelector}">Composition in selector</div>
  `;
}

render();
