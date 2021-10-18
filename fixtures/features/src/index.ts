import * as styles from './features.css';
import testNodes from '../test-nodes.json';

function render() {
  document.body.innerHTML = `
    <div id="${testNodes.mergedStyle}" class="${styles.mergedStyle}">Merged style</div>
    <div id="${testNodes.styleWithComposition}" class="${styles.styleWithComposition}">Style with composition</div>
    <div id="${testNodes.styleVariantsWithComposition}" class="${styles.styleVariantsWithComposition.variant}">Style variants with composition</div>
    <div id="${testNodes.styleVariantsWithMappedComposition}" class="${styles.styleVariantsWithMappedComposition.variant}">Style variants with mapped composition</div>
    <div id="${testNodes.compositionOnly}" class="${styles.compositionOnly}">Composition only</div>
    <div id="${testNodes.styleCompositionInSelector}" class="${styles.styleCompositionInSelector}">Style composition in selector</div>
    <div id="${testNodes.styleVariantsCompositionInSelector}" class="${styles.styleVariantsCompositionInSelector.variant}">Style variants composition in selector</div>
  `;
}

render();

// Uncomment to enable HMR with Vite
// if (import.meta.hot) {
//   import.meta.hot.accept('./features.css', () => {
//     render();
//   });
// }
