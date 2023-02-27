import { outdent } from 'outdent';
import { addFileScope } from './addFileScope';

describe('ESM', () => {
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
            
            import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
            setFileScope("app/app.css.ts", "my-package");
            import {style} from '@vanilla-extract/css';

      export const myStyle = style({});
            endFileScope();
            
          "
    `);
  });

  test('should add global CSS adapter setup', () => {
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
        globalCssAdapterKey: '__myGlobalCssAdapter__',
      }),
    ).toMatchInlineSnapshot(`
      "
            
              import * as __vanilla_css_adapter__ from "@vanilla-extract/css/adapter";
              __vanilla_css_adapter__.setAdapter(__myGlobalCssAdapter__);
            
            import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
            setFileScope("app/app.css.ts", "my-package");
            import {style} from '@vanilla-extract/css';

      export const myStyle = style({});
            endFileScope();
            __vanilla_css_adapter__.removeAdapter();
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
      "import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
      setFileScope("app/app.css.ts", "my-package");
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
      "import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
      setFileScope("app/app.css.ts", "my-package");
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
          "import * as vanillaFileScope from "@vanilla-extract/css/fileScope";
          vanillaFileScope.setFileScope("app/app.css.ts", "my-package");
          import {style} from '@vanilla-extract/css';

          export const myStyle = style({});
          vanillaFileScope.endFileScope();"
      `);
  });
});

describe('CJS', () => {
  test('should add missing fileScope', () => {
    const source = outdent`
    const _css = require('@vanilla-extract/css');

    var myStyle = _css.style({});
    exports.myStyle = myStyle;
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
          
          const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
          __vanilla_filescope__.setFileScope("app/app.css.ts", "my-package");
          const _css = require('@vanilla-extract/css');

      var myStyle = _css.style({});
      exports.myStyle = myStyle;
          __vanilla_filescope__.endFileScope();
          ;
        "
    `);
  });

  test('should add global CSS adapter setup', () => {
    const source = outdent`
    const _css = require('@vanilla-extract/css');

    var myStyle = _css.style({});
    exports.myStyle = myStyle;
    `;

    expect(
      addFileScope({
        source,
        rootPath: '/the-root',
        filePath: '/the-root/app/app.css.ts',
        packageName: 'my-package',
        globalCssAdapterKey: 'MY_GLOBAL_CSS_ADAPTER',
      }),
    ).toMatchInlineSnapshot(`
      "
          
            const __vanilla_css_adapter__ = require("@vanilla-extract/css/adapter");
            __vanilla_css_adapter__.setAdapter(MY_GLOBAL_CSS_ADAPTER);
          
          const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
          __vanilla_filescope__.setFileScope("app/app.css.ts", "my-package");
          const _css = require('@vanilla-extract/css');

      var myStyle = _css.style({});
      exports.myStyle = myStyle;
          __vanilla_filescope__.endFileScope();
          __vanilla_css_adapter__.removeAdapter();;
        "
    `);
  });

  test('should update existing fileScope', () => {
    const source = outdent`
    const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
    __vanilla_filescope__.setFileScope("some-weird-file", "some-weird-package");
    const _css = require('@vanilla-extract/css');

    var myStyle = _css.style({});
    exports.myStyle = myStyle;
    __vanilla_filescope__.endFileScope();
    `;

    expect(
      addFileScope({
        source,
        rootPath: '/the-root',
        filePath: '/the-root/app/app.css.ts',
        packageName: 'my-package',
      }),
    ).toMatchInlineSnapshot(`
      "const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
      __vanilla_filescope__.setFileScope("app/app.css.ts", "my-package");
      const _css = require('@vanilla-extract/css');

      var myStyle = _css.style({});
      exports.myStyle = myStyle;
      __vanilla_filescope__.endFileScope();"
    `);
  });

  test('should update existing fileScope with newlines', () => {
    const source = outdent`
      const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
      __vanilla_filescope__.setFileScope(
        "some-weird-file",
        "some-weird-package"
      );
      const _css = require('@vanilla-extract/css');

      const myStyle = _css.style({});
      exports.myStyle = myStyle;
      __vanilla_filescope__.endFileScope();
      `;

    expect(
      addFileScope({
        source,
        rootPath: '/the-root',
        filePath: '/the-root/app/app.css.ts',
        packageName: 'my-package',
      }),
    ).toMatchInlineSnapshot(`
      "const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
      __vanilla_filescope__.setFileScope("app/app.css.ts", "my-package");
      const _css = require('@vanilla-extract/css');

      const myStyle = _css.style({});
      exports.myStyle = myStyle;
      __vanilla_filescope__.endFileScope();"
    `);
  });
});
