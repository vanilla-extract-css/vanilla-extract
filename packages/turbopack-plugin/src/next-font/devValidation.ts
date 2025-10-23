import * as path from 'node:path';

export function buildValidationPrelude(
  absolutePath: string,
  usedProviders: string[],
  detailsMap: Map<string, { exportName: string; stubbedFamily: string }[]>,
): string {
  if (process.env.NODE_ENV === 'production' || usedProviders.length === 0)
    return '';

  const imports: string[] = [];
  const validationLogic: string[] = [];

  usedProviders.forEach((providerPath, index) => {
    const importAlias = `__ve_font_prov_${index}`;
    let relativePath = path.posix.relative(
      path.dirname(absolutePath),
      providerPath,
    );
    relativePath = relativePath.replace(/\.(ts|tsx)$/, '');
    if (!relativePath.startsWith('.')) relativePath = `./${relativePath}`;
    imports.push(`import * as ${importAlias} from "${relativePath}";`);

    const details = detailsMap.get(providerPath);
    if (details) {
      details.forEach((fontInfo) => {
        const validationSnippet = `
try {
  const realFont = ${importAlias}[${JSON.stringify(fontInfo.exportName)}];
  const stubbedFamily = ${JSON.stringify(fontInfo.stubbedFamily)};
  if (realFont && realFont.style && realFont.style.fontFamily) {
    if (realFont.style.fontFamily !== stubbedFamily) {
      console.error('[VE Font Check] mismatch:', ${JSON.stringify(
        path.basename(providerPath),
      )}, ${JSON.stringify(fontInfo.exportName)});
    }
  }
} catch (e) { /* ignore */ }`;
        validationLogic.push(validationSnippet);
      });
    }
  });

  if (validationLogic.length === 0) return '';

  return `${imports.join('\n')}
if (process.env.NODE_ENV !== 'production') {
${validationLogic.join('\n')}
}
`;
}
