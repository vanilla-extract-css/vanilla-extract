import { box } from 'main.css';

const root = document.getElementById('root');
if (!root) {
  throw new Error("Failed to get 'root' element");
}

root.innerHTML = `<div class="${box}">hello world</div>`;
