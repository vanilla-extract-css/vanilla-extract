import { transformNextFont } from './transform';
import type { Plugin } from 'vite';

export function createNextFontVePlugin(): Plugin {
  return {
    name: 've-next-font-stub',
    enforce: 'pre',
    async transform(code: string, id: string) {
      if (!/\.(?:[cm]?[jt]s|[jt]sx)$/.test(id) || !code.includes('next/font')) {
        return null;
      }

      return await transformNextFont(code, id);
    },
  };
}
