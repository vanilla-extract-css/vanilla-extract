import { outdent } from 'outdent';
import { addFileScope } from './addFileScope';

test('should add missing fileScope', () => {
  const source = outdent`
  import {style} from '@vanilla-extract/css';

  export const myStyle = style({});
  `;

  expect(
    addFileScope({
      source,
      rootPath: '/the-root',
      filePath: '/the-root/app/app.css.ts',
      packageName: 'my-package',
    }),
  ).toMatchInlineSnapshot(`
    "
        import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
        setFileScope(\\"app/app.css.ts\\", \\"my-package\\");
        import {style} from '@vanilla-extract/css';

    export const myStyle = style({});
        endFileScope();
      "
  `);
});

test('should update existing fileScope', () => {
  const source = outdent`
    import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
    setFileScope("some-weird-file", "some-weird-package");
    import {style} from '@vanilla-extract/css';

    export const myStyle = style({});
    endFileScope();
    `;

  expect(
    addFileScope({
      source,
      rootPath: '/the-root',
      filePath: '/the-root/app/app.css.ts',
      packageName: 'my-package',
    }),
  ).toMatchInlineSnapshot(`
    "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
    setFileScope(\\"app/app.css.ts\\", \\"my-package\\");
    import {style} from '@vanilla-extract/css';

    export const myStyle = style({});
    endFileScope();"
  `);
});

test('should update existing fileScope with newlines', () => {
  const source = outdent`
      import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
      setFileScope(
        "some-weird-file", 
        "some-weird-package"
      );
      import {style} from '@vanilla-extract/css';
  
      export const myStyle = style({});
      endFileScope();
      `;

  expect(
    addFileScope({
      source,
      rootPath: '/the-root',
      filePath: '/the-root/app/app.css.ts',
      packageName: 'my-package',
    }),
  ).toMatchInlineSnapshot(`
    "import { setFileScope, endFileScope } from \\"@vanilla-extract/css/fileScope\\";
    setFileScope(\\"app/app.css.ts\\", \\"my-package\\");
    import {style} from '@vanilla-extract/css';

    export const myStyle = style({});
    endFileScope();"
  `);
});

test('should handle namespaced filescope calls', () => {
  const source = outdent`
    import * as vanillaFileScope from "@vanilla-extract/css/fileScope";
    vanillaFileScope.setFileScope("some-weird-file");
    import {style} from '@vanilla-extract/css';

    export const myStyle = style({});
    vanillaFileScope.endFileScope();
  `;

  expect(
    addFileScope({
      source,
      rootPath: '/the-root',
      filePath: '/the-root/app/app.css.ts',
      packageName: 'my-package',
    }),
  ).toMatchInlineSnapshot(`
    "import * as vanillaFileScope from \\"@vanilla-extract/css/fileScope\\";
    vanillaFileScope.setFileScope(\\"app/app.css.ts\\", \\"my-package\\");
    import {style} from '@vanilla-extract/css';

    export const myStyle = style({});
    vanillaFileScope.endFileScope();"
  `);
});
