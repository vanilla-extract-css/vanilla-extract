import type { AstroIntegration } from 'astro';
import { defineMdastPlugin } from 'satteri';
import {
  closeCompiler,
  compileVanillaExtract,
  extractFiles,
} from './compileVanillaExtract';
import { extractTitle, highlight } from './highlight';

const compiledCodeComponent = 'MdxCompiledCode';

const jsxProps = (props: Record<string, unknown>) =>
  Object.entries(props)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
    .join(' ');

/**
 * Astro passes MDX components their children as pre-rendered HTML, so anything
 * that depends on the markdown's structure is handled here instead.
 */
export const docsPlugin = () =>
  defineMdastPlugin({
    name: 'vanilla-extract-docs',
    async code(node, ctx) {
      const language = node.lang ?? '';

      // `tsx compiled` lets `.tsx` files sit alongside the compiled `.css.ts` files
      if (
        (language === 'ts' || language === 'tsx') &&
        node.meta === 'compiled'
      ) {
        const files = extractFiles(node.value);

        if (files.length > 0) {
          let css: Record<string, string>;
          try {
            css = await compileVanillaExtract(files);
          } catch (error) {
            const location = `${ctx.fileURL?.pathname}:${node.position?.start.line}`;
            throw new Error(
              `Failed to compile \`${language} compiled\` block at ${location}`,
              { cause: error },
            );
          }

          const props = {
            code: await Promise.all(
              files.map(async ({ fileName, contents }) => ({
                fileName,
                html: await highlight('tsx', contents),
              })),
            ),
            css: Object.fromEntries(
              await Promise.all(
                Object.entries(css).map(async ([fileName, contents]) => [
                  fileName,
                  contents && (await highlight('css', contents)),
                ]),
              ),
            ),
          };

          ctx.data.hasCompiledCode = true;
          ctx.replaceNode(node, {
            raw: `<${compiledCodeComponent} client:visible ${jsxProps(props)} />`,
          });
          return;
        }
      }

      const { title, code } = extractTitle(node.value);

      ctx.replaceNode(node, {
        raw: `<CodeBlock ${jsxProps({ fileName: title, html: await highlight(language, code) })} />`,
      });
    },
    link(node, ctx) {
      if (
        node.children.length === 1 &&
        node.children[0].type === 'inlineCode'
      ) {
        ctx.setProperty(node, 'data', {
          hProperties: { 'data-inline-code': true },
        });
      }
    },
    blockquote(node, ctx) {
      for (const child of node.children) {
        if (child.type === 'paragraph') {
          ctx.setProperty(child, 'data', { hName: 'blockquote-p' });
        }
      }
    },
    after(root, ctx) {
      // Hydrated islands have to be imported by the MDX file itself
      if (ctx.data.hasCompiledCode) {
        ctx.prependChild(root, {
          raw: `import ${compiledCodeComponent} from '/src/Code/MdxCompiledCode';`,
        });
      }
    },
  });

/** Mdast plugins have no lifecycle hooks, so the compiler is closed from here */
export const docsIntegration = (): AstroIntegration => ({
  name: 'vanilla-extract-docs',
  hooks: {
    'astro:build:done': closeCompiler,
    'astro:server:done': closeCompiler,
  },
});
