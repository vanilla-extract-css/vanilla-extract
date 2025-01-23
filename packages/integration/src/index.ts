export {
  processVanillaFile,
  parseFileScope,
  stringifyFileScope,
  serializeVanillaModule,
} from './processVanillaFile';
export { getSourceFromVirtualCssFile } from './virtualFile';
export { getPackageInfo, type PackageInfo } from './packageInfo';
export {
  compile,
  vanillaExtractTransformPlugin,
  type CompileOptions,
} from './compile';
export { hash } from './hash';
export { addFileScope, normalizePath } from './addFileScope';
export { serializeCss, deserializeCss } from './serialize';
export { transformSync, transform } from './transform';
export { cssFileFilter, virtualCssFileFilter } from './filters';
export type { IdentifierOption } from './types';
