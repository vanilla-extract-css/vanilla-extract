type Plugin = {
  name: string;
  enforce?: 'pre' | 'post';
  resolveId?: (
    source: string,
    importer: string | undefined,
  ) => { id: string } | null;
  load?: (id: string) => { code: string } | null;
};

const STUBBED_MODULES = [
  'next/headers',
  'next/cache',
  'next/navigation',
  'next/server',
  'next/draft-mode',
  'next/cookies',
] as const;

const STUB_CODE: Record<string, string> = {
  'next/headers': `
function throwNotAvailable(name) {
  throw new Error(
    \`"\${name}" is not available during vanilla-extract evaluation. \\n\` +
    \`This API accesses request-scoped data that isn't available at build time. \\n\` +
    \`Move dynamic data access to your component and pass values via CSS variables or data attributes.\`
  );
}

export function headers() {
  throwNotAvailable('headers()');
}

export function cookies() {
  throwNotAvailable('cookies()');
}

export function draftMode() {
  throwNotAvailable('draftMode()');
}
`,
  'next/cache': `
function throwNotAvailable(name) {
  throw new Error(
    \`"\${name}" is not available during vanilla-extract evaluation. \\n\` +
    \`This API accesses request-scoped data that isn't available at build time. \\n\` +
    \`Move dynamic data access to your component and pass values via CSS variables or data attributes.\`
  );
}

export function unstable_cache() {
  throwNotAvailable('unstable_cache()');
}

export function revalidateTag() {
  throwNotAvailable('revalidateTag()');
}

export function revalidatePath() {
  throwNotAvailable('revalidatePath()');
}

export function updateTag() {
  throwNotAvailable('updateTag()');
}

export function refresh() {
  throwNotAvailable('refresh()');
}
`,
  'next/navigation': `
function throwNotAvailable(name) {
  throw new Error(
    \`"\${name}" is not available during vanilla-extract evaluation. \\n\` +
    \`This API accesses request-scoped data that isn't available at build time. \\n\` +
    \`Move dynamic data access to your component and pass values via CSS variables or data attributes.\`
  );
}

export function redirect() {
  throwNotAvailable('redirect()');
}

export function permanentRedirect() {
  throwNotAvailable('permanentRedirect()');
}

export function notFound() {
  throwNotAvailable('notFound()');
}

export function forbidden() {
  throwNotAvailable('forbidden()');
}

export function unauthorized() {
  throwNotAvailable('unauthorized()');
}

export function unstable_rethrow() {
  throwNotAvailable('unstable_rethrow()');
}

export function useRouter() {
  throwNotAvailable('useRouter()');
}

export function useParams() {
  throwNotAvailable('useParams()');
}

export function usePathname() {
  throwNotAvailable('usePathname()');
}

export function useSearchParams() {
  throwNotAvailable('useSearchParams()');
}

export function useSelectedLayoutSegment() {
  throwNotAvailable('useSelectedLayoutSegment()');
}

export function useSelectedLayoutSegments() {
  throwNotAvailable('useSelectedLayoutSegments()');
}

export const ServerInsertedHTMLContext = {};

export function useServerInsertedHTML() {
  throwNotAvailable('useServerInsertedHTML()');
}

export class ReadonlyURLSearchParams {
  constructor() {
    throwNotAvailable('ReadonlyURLSearchParams');
  }
}
`,
  'next/server': `
function throwNotAvailable(name) {
  throw new Error(
    \`"\${name}" is not available during vanilla-extract evaluation. \\n\` +
    \`This API accesses request-scoped data that isn't available at build time. \\n\` +
    \`Move dynamic data access to your component and pass values via CSS variables or data attributes.\`
  );
}

export class ImageResponse {
  constructor() {
    throwNotAvailable('ImageResponse');
  }
}

export class NextRequest {
  constructor() {
    throwNotAvailable('NextRequest');
  }
}

export class NextResponse {
  constructor() {
    throwNotAvailable('NextResponse');
  }
}

export function after() {
  throwNotAvailable('after()');
}

export function connection() {
  throwNotAvailable('connection()');
}

export function userAgent() {
  throwNotAvailable('userAgent()');
}

export function userAgentFromString() {
  throwNotAvailable('userAgentFromString()');
}

export class URLPattern {
  constructor() {
    throwNotAvailable('URLPattern');
  }
}
`,
  'next/draft-mode': `
function throwNotAvailable(name) {
  throw new Error(
    \`"\${name}" is not available during vanilla-extract evaluation. \\n\` +
    \`This API accesses request-scoped data that isn't available at build time. \\n\` +
    \`Move dynamic data access to your component and pass values via CSS variables or data attributes.\`
  );
}

export function draftMode() {
  throwNotAvailable('draftMode()');
}
`,
  'next/cookies': `
function throwNotAvailable(name) {
  throw new Error(
    \`"\${name}" is not available during vanilla-extract evaluation. \\n\` +
    \`This API accesses request-scoped data that isn't available at build time. \\n\` +
    \`Move dynamic data access to your component and pass values via CSS variables or data attributes.\`
  );
}

export function cookies() {
  throwNotAvailable('cookies()');
}
`,
};

export function createNextStubsVePlugin(): Plugin {
  return {
    name: 've-next-stubs',
    enforce: 'pre',
    resolveId(source: string) {
      if (STUBBED_MODULES.includes(source as any)) {
        // return a filesystem-safe virtual id (no NUL prefix)
        return { id: `ve-stub:${source}` };
      }
      return null;
    },
    load(id: string) {
      if (id.startsWith('ve-stub:')) {
        const moduleName = id.slice('ve-stub:'.length);
        const code = STUB_CODE[moduleName];
        if (code) {
          return { code };
        }
      }
      return null;
    },
  };
}

