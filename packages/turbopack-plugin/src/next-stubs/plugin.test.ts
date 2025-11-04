import { createNextStubsVePlugin } from './plugin';

describe('next-stubs plugin', () => {
  const plugin = createNextStubsVePlugin();

  test('should resolve stubbed modules', () => {
    expect(plugin.resolveId?.('next/headers', undefined)).toEqual({
      id: 've-stub:next/headers',
    });
    expect(plugin.resolveId?.('next/cache', undefined)).toEqual({
      id: 've-stub:next/cache',
    });
    expect(plugin.resolveId?.('next/navigation', undefined)).toEqual({
      id: 've-stub:next/navigation',
    });
    expect(plugin.resolveId?.('next/server', undefined)).toEqual({
      id: 've-stub:next/server',
    });
    expect(plugin.resolveId?.('next/draft-mode', undefined)).toEqual({
      id: 've-stub:next/draft-mode',
    });
    expect(plugin.resolveId?.('next/cookies', undefined)).toEqual({
      id: 've-stub:next/cookies',
    });
  });

  test('should not resolve non-stubbed modules', () => {
    expect(plugin.resolveId?.('next/image', undefined)).toBe(null);
    expect(plugin.resolveId?.('react', undefined)).toBe(null);
    expect(plugin.resolveId?.('./myModule', undefined)).toBe(null);
  });

  test('should load stub code for resolved modules', () => {
    const headerStub = plugin.load?.('ve-stub:next/headers');
    expect(headerStub).toBeTruthy();
    expect(headerStub?.code).toContain('function headers()');
    expect(headerStub?.code).toContain('function cookies()');
    expect(headerStub?.code).toContain('function draftMode()');

    const cacheStub = plugin.load?.('ve-stub:next/cache');
    expect(cacheStub).toBeTruthy();
    expect(cacheStub?.code).toContain('function unstable_cache()');
    expect(cacheStub?.code).toContain('function revalidateTag()');

    const navigationStub = plugin.load?.('ve-stub:next/navigation');
    expect(navigationStub).toBeTruthy();
    expect(navigationStub?.code).toContain('function redirect()');
    expect(navigationStub?.code).toContain('function useRouter()');

    const serverStub = plugin.load?.('ve-stub:next/server');
    expect(serverStub).toBeTruthy();
    expect(serverStub?.code).toContain('class ImageResponse');
    expect(serverStub?.code).toContain('function after()');
    expect(serverStub?.code).toContain('function connection()');
  });

  test('should not load code for non-stub ids', () => {
    expect(plugin.load?.('next/image')).toBe(null);
    expect(plugin.load?.('./myModule.ts')).toBe(null);
  });

  test('stub functions should throw when called', () => {
    // eval the stub code and test that functions throw
    const headerStub = plugin.load?.('ve-stub:next/headers');
    expect(headerStub).toBeTruthy();

    // create a test environment
    const testEnv: Record<string, any> = {};
    const esmToCjs = (src: string) =>
      src
        .replace(/^export\s+function\s+(\w+)\s*\(/gm, 'exports.$1 = function $1(')
        .replace(/^export\s+class\s+(\w+)/gm, 'exports.$1 = class $1')
        .replace(/^export\s+\{[^}]*\};?$/gm, '');
    const fn = new Function('exports', esmToCjs(headerStub!.code));
    fn(testEnv);

    expect(() => testEnv.headers()).toThrow(/not available during vanilla-extract evaluation/);
    expect(() => testEnv.cookies()).toThrow(/not available during vanilla-extract evaluation/);
    expect(() => testEnv.draftMode()).toThrow(/not available during vanilla-extract evaluation/);
  });

  test('stub classes should throw when instantiated', () => {
    const serverStub = plugin.load?.('ve-stub:next/server');
    expect(serverStub).toBeTruthy();

    const testEnv: Record<string, any> = {};
    const esmToCjs = (src: string) =>
      src
        .replace(/^export\s+function\s+(\w+)\s*\(/gm, 'exports.$1 = function $1(')
        .replace(/^export\s+class\s+(\w+)/gm, 'exports.$1 = class $1')
        .replace(/^export\s+\{[^}]*\};?$/gm, '');
    const fn = new Function('exports', esmToCjs(serverStub!.code));
    fn(testEnv);

    expect(() => new testEnv.ImageResponse()).toThrow(/not available during vanilla-extract evaluation/);
    expect(() => new testEnv.NextRequest()).toThrow(/not available during vanilla-extract evaluation/);
    expect(() => new testEnv.NextResponse()).toThrow(/not available during vanilla-extract evaluation/);
  });
});

