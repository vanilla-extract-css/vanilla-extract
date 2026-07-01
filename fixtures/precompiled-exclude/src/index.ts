import testNodes from '../test-nodes.json';
import { buttonRecipe } from '@fixtures/precompiled-lib';
import { container } from './styles.css';

const root = document.createElement('div');
root.id = testNodes.container;
root.className = container;

const button = document.createElement('button');
button.id = testNodes.button;
button.className = buttonRecipe({ size: 'large' });
button.textContent = 'Click me';

root.appendChild(button);
document.body.appendChild(root);
