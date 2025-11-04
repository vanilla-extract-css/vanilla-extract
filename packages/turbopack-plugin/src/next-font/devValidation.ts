import * as path from 'node:path';

export function buildValidationPrelude(
  absolutePath: string,
  usedProviders: string[],
  detailsMap: Map<
    string,
    {
      exportName: string;
      stubbedFamily: string;
      stubbedWeight: number | undefined;
      stubbedStyle: string | undefined;
    }[]
  >,
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
  const stubbedWeight = ${fontInfo.stubbedWeight !== undefined ? fontInfo.stubbedWeight : 'undefined'};
  const stubbedStyle = ${fontInfo.stubbedStyle !== undefined ? JSON.stringify(fontInfo.stubbedStyle) : 'undefined'};
  if (realFont && realFont.style) {
    let mismatches = [];
    if (realFont.style.fontFamily !== stubbedFamily) {
      mismatches.push({
        property: 'fontFamily',
        expected: stubbedFamily,
        actual: realFont.style.fontFamily
      });
    }
    if (realFont.style.fontWeight !== stubbedWeight) {
      mismatches.push({
        property: 'fontWeight',
        expected: stubbedWeight,
        actual: realFont.style.fontWeight
      });
    }
    if (realFont.style.fontStyle !== stubbedStyle) {
      mismatches.push({
        property: 'fontStyle',
        expected: stubbedStyle,
        actual: realFont.style.fontStyle
      });
    }
    if (mismatches.length > 0) {
      console.error('\\n[vanilla-extract] next/font style mismatch detected');
      console.error('Location: ${path.basename(providerPath)} > ' + ${JSON.stringify(fontInfo.exportName)});
      mismatches.forEach(function(m) {
        console.error('  ' + m.property + ':');
        console.error('    Turbopack\\'s Value:       ' + JSON.stringify(m.actual));
        console.error('    Vanilla Extract\\'s Value: ' + JSON.stringify(m.expected));
      });
      console.error('This is a bug in vanilla-extract. Please report it at:');
      console.error('https://github.com/vanilla-extract-css/vanilla-extract/issues\\n');
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
