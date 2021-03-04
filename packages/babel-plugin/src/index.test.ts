import { transformSync } from '@babel/core';
import { Options } from './types';
import plugin from './';

const transform = (
  source: string,
  options: Options = {},
  filename = '/my/app/dir/mockFilename.treat.ts',
) => {
  const result = transformSync(source, {
    filename,
    plugins: [[plugin, options]],
    configFile: false,
  });

  if (!result) {
    throw new Error('No result');
  }

  return result.code;
};

describe('babel plugin', () => {
  it("should not add the header when lib isn't used", () => {
    const source = `
      import { foo } from 'bar';

      const one = foo({
        zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { foo } from 'bar';
      const one = foo({
        zIndex: 2
      });"
    `);
  });

  it('should add the header when using lib', () => {
    const source = `
      import { style } from '@mattsjones/css-core';

      const one = style({
        zIndex: 2,
      });
    `;

    expect(transform(source)).toMatchInlineSnapshot(`
      "import { setFileScope } from \\"@mattsjones/css-core\\";
      setFileScope('/my/app/dir/mockFilename.treat.ts');
      import { style } from '@mattsjones/css-core';
      const one = style({
        zIndex: 2
      });"
    `);
  });

  it('should add the header when using alised lib', () => {
    const source = `
      import { style } from 'my-alias/treat';

      const one = style({
        zIndex: 2,
      });
    `;

    expect(transform(source, { alias: 'my-alias/treat' }))
      .toMatchInlineSnapshot(`
      "import { setFileScope } from \\"my-alias/treat\\";
      setFileScope('/my/app/dir/mockFilename.treat.ts');
      import { style } from 'my-alias/treat';
      const one = style({
        zIndex: 2
      });"
    `);
  });
});
