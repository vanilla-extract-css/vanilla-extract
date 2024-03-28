import html from './html';

function render() {
  document.body.innerHTML = html;
}

render();

// Uncomment to enable HMR with Vite
// if (import.meta.hot) {
//   import.meta.hot.accept('./features.css', () => {
//     render();
//   });
// }
