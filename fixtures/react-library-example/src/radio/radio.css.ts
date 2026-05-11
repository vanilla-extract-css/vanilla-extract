import { style } from '@vanilla-extract/css';
import { vars } from '../styles/vars.css.js';

export const label = style({
  display: 'block',
  ...vars.typography.body.medium,

  '::before': {
    background: vars.color.background.brand,
    borderColor: vars.color.border.default,
    borderWidth: 1,
    borderStyle: 'solid',
    content: '',
    borderRadius: vars.size.radius.full,
    marginRight: vars.size.space['300'],
  },
});

export const input = style({
  width: '1.5rem',
  height: '1.5rem',
});
