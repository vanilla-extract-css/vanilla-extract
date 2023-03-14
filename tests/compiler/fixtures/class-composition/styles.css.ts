import { style } from '@vanilla-extract/css';
import { shared } from './shared.css';

export const className = style([shared, { color: 'red' }]);
