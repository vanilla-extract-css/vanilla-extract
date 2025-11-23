import * as fs from 'fs';
import * as path from 'path';
import turbopackVanillaExtractLoader, {
  type TurboLoaderContext,
  type TurboLoaderOptions,
  cleanupSharedCompiler,
} from './index';

const testDir = path.join(process.cwd(), 'fixtures/next-16-app-pages-router');

// for CI testing, 10 iterations is fine
// for local testing, issues can be *very* rare since this is a race condition
// for most of my testing I used 1000 iterations
const iterations = 10;
const timeout = iterations * 250;

describe('turbopack-plugin stress test', () => {
  afterEach(() => {
    cleanupSharedCompiler();
  });

  it(
    'should handle rapid entry updates correctly',
    async () => {
      const mockContext: TurboLoaderContext<TurboLoaderOptions> = {
        rootContext: testDir,
        resourcePath: path.join(testDir, 'style.css.ts'),
        getOptions: () => ({
          identifiers: 'short',
          outputCss: true,
          nextEnv: {},
        }),
        getResolve: () => async (context: string, request: string) => {
          // Simplified resolver that just returns the request if it's relative,
          // or null if we can't handle it. For this test, we don't need much.
          if (request.startsWith('.')) {
            return path.resolve(context, request);
          }
          return request;
        },
        fs: {
          readFile: fs.readFile,
        },
      };

      for (let i = 0; i < iterations; i++) {
        const uniqueId = crypto.randomUUID();
        const fileContent = `
          import { style } from '@vanilla-extract/css';
          
          export const myStyle = style({
            content: "${uniqueId}"
          });
        `;

        fs.writeFileSync(mockContext.resourcePath, fileContent);

        const result = await turbopackVanillaExtractLoader.call(mockContext);

        expect(result).toContain('data:text/css;base64,');
        const match = result.match(/import 'data:text\/css;base64,([^']+)';/);
        expect(match).toBeTruthy();

        if (match) {
          const decodedCss = Buffer.from(match[1], 'base64').toString('utf-8');
          expect(decodedCss).toContain(`content: "${uniqueId}"`);
        }
      }

      fs.rmSync(mockContext.resourcePath);
    },
    timeout,
  );

  it(
    'should handle rapid dependency updates correctly',
    async () => {
      const mockContext: TurboLoaderContext<TurboLoaderOptions> = {
        rootContext: testDir,
        resourcePath: path.join(testDir, 'style.css.ts'),
        getOptions: () => ({
          identifiers: 'short',
          outputCss: true,
          nextEnv: {},
        }),
        getResolve: () => async (context: string, request: string) => {
          // Simplified resolver that just returns the request if it's relative,
          // or null if we can't handle it. For this test, we don't need much.
          if (request.startsWith('.')) {
            return path.resolve(context, request);
          }
          return request;
        },
        fs: {
          readFile: fs.readFile,
        },
      };

      for (let i = 0; i < iterations; i++) {
        const uniqueId = crypto.randomUUID();
        const fileDependency = `
          export const randomId = "${uniqueId}";
        `;
        const fileContent = `
          import { style } from '@vanilla-extract/css';
          import { randomId } from './dependency.ts';
          
          export const myStyle = style({
            content: randomId
          });
        `;

        fs.writeFileSync(path.join(testDir, 'dependency.ts'), fileDependency);
        if (i === 0)
          fs.writeFileSync(path.join(testDir, 'style.css.ts'), fileContent);

        const result = await turbopackVanillaExtractLoader.call(mockContext);

        expect(result).toContain('data:text/css;base64,');
        const match = result.match(/import 'data:text\/css;base64,([^']+)';/);
        expect(match).toBeTruthy();

        if (match) {
          const decodedCss = Buffer.from(match[1], 'base64').toString('utf-8');
          expect(decodedCss).toContain(`content: "${uniqueId}"`);
        }
      }

      fs.rmSync(path.join(testDir, 'dependency.ts'));
      fs.rmSync(mockContext.resourcePath);
    },
    timeout,
  );
});
