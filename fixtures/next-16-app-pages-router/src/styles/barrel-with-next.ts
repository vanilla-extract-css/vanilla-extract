// barrel that re-exports both tokens and next apis
// this would normally cause AsyncLocalStorage errors during css.ts evaluation
// but our stubs prevent that

export { headers, cookies } from 'next/headers';
export { redirect } from 'next/navigation';
export { after } from 'next/server';

// safe token exports
export const colors = {
  primary: 'blue',
  secondary: 'green',
} as const;

export const spacing = {
  sm: '8px',
  md: '16px',
  lg: '24px',
} as const;
