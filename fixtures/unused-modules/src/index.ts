import './global.css';
import { usedStyle } from './lookup';
import { resetStyle } from './reset';
import testNodes from '../test-nodes.json';

const node = document.createElement('div');

node.setAttribute('id', testNodes.root);
node.setAttribute('class', `${resetStyle} ${usedStyle}`);

document.body.appendChild(node);
