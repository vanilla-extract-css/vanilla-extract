import path from 'path';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { createServer, type ViteDevServer } from 'vite';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { normalizePath } from '@vanilla-extract/integration';

describe('vite-plugin virtual CSS cache', () => {
  const fixtureRoot = path.join(
    import.meta.dirname,
    'fixtures/virtual-css-cache',
  );
  const parentPath = normalizePath(path.join(fixtureRoot, 'src/styles.css.ts'));
  const virtualId = `${parentPath}.vanilla.css`;

  let server: ViteDevServer;

  beforeAll(async () => {
    server = await createServer({
      root: fixtureRoot,
      configFile: false,
      plugins: [vanillaExtractPlugin()],
      server: {
        // Ephemeral port — we only use transformRequest, not HTTP
        middlewareMode: true,
      },
      appType: 'custom',
      logLevel: 'silent',
    });
  });

  afterAll(async () => {
    await server?.close();
  });

  test('serves virtual CSS without a prior parent transform', async () => {
    // Intentionally skip transforming the parent `.css.ts` first — this is the
    // cache-miss path that used to throw "No CSS for file" (e.g. Vite 304
    // revalidation after a dev-server restart with a warm browser cache).
    const result = await server.transformRequest(virtualId);

    expect(result).not.toBeNull();
    expect(result?.code).toMatch(/color:\s*red/);
  });

  test('second request hits the warm cache path', async () => {
    const first = await server.transformRequest(virtualId);
    const second = await server.transformRequest(virtualId);

    expect(second?.code).toBe(first?.code);
    expect(second?.code).toMatch(/color:\s*red/);
  });
});
