import { transformNextFont } from './transform';

export type NextFontPluginState = {
  fontProviders: Set<string>;
  fontProviderDetails: Map<
    string,
    { exportName: string; stubbedFamily: string }[]
  >;
};

type Plugin = {
  name: string;
  enforce?: 'pre' | 'post';
  transform?: (
    code: string,
    id: string,
  ) =>
    | Promise<{ code: string; map: any } | null>
    | { code: string; map: any }
    | null;
};

export function createNextFontVePlugins(): {
  plugins: Plugin[];
  state: NextFontPluginState;
} {
  const state: NextFontPluginState = {
    fontProviders: new Set<string>(),
    fontProviderDetails: new Map<
      string,
      { exportName: string; stubbedFamily: string }[]
    >(),
  };

  const nextFontStubPlugin: Plugin = {
    name: 've-next-font-stub',
    enforce: 'pre',
    async transform(code: string, id: string) {
      if (!/\.(?:[cm]?[jt]s|[jt]sx)$/.test(id) || !code.includes('next/font')) {
        return null;
      }

      const result = await transformNextFont(code, id);
      if (result.usedNextFont) {
        state.fontProviders.add(id);
        if (result.details.length > 0) {
          state.fontProviderDetails.set(id, result.details);
        }
      }
      return result.changed ? { code: result.code, map: null } : null;
    },
  };

  return { plugins: [nextFontStubPlugin], state };
}
