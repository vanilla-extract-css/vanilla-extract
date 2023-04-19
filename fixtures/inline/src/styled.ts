import { style } from '@vanilla-extract/css';

export const styled$ = (name: string, color: string) => {
  return `<div class="${style({ color })}">styled(${name})</div>`;
};
