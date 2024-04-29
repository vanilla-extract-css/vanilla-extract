import dedent from 'dedent';
import { sep, posix, win32 } from 'path';

import { addFileScope, normalizePath } from './addFileScope';

const raw = String.raw;

// remove quotes around the snapshot
expect.addSnapshotSerializer({
  test: (val) => typeof val === 'string',
  print: (val) => (val as string).trim(),
});

describe('ESM', () => {
  test('should add missing fileScope', () => {
    const source = dedent`
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
      import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
      setFileScope("app/app.css.ts", "my-package");
      import {style} from '@vanilla-extract/css';

      export const myStyle = style({});
      endFileScope();
    `);
  });

  test('should add global adapter setup when "globalAdapterIdentifier" is provided', () => {
    const source = dedent`
    import {style} from '@vanilla-extract/css';

    export const myStyle = style({});
    `;

    expect(
      addFileScope({
        source,
        rootPath: '/the-root',
        filePath: '/the-root/app/app.css.ts',
        packageName: 'my-package',
        globalAdapterIdentifier: 'MY_GLOBAL_ADAPTER',
      }),
    ).toMatchInlineSnapshot(`
      import * as __vanilla_css_adapter__ from "@vanilla-extract/css/adapter";
      __vanilla_css_adapter__.setAdapter(MY_GLOBAL_ADAPTER);
      import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
      setFileScope("app/app.css.ts", "my-package");
      import {style} from '@vanilla-extract/css';

      export const myStyle = style({});
      endFileScope();
      __vanilla_css_adapter__.removeAdapter();
    `);
  });

  test('should update existing fileScope', () => {
    const source = dedent`
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
      import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
      setFileScope("app/app.css.ts", "my-package");
      import {style} from '@vanilla-extract/css';

      export const myStyle = style({});
      endFileScope();
    `);
  });

  test('should update existing fileScope with newlines', () => {
    const source = dedent`
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
      import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
      setFileScope("app/app.css.ts", "my-package");
      import {style} from '@vanilla-extract/css';

      export const myStyle = style({});
      endFileScope();
    `);
  });

  test('should handle namespaced filescope calls', () => {
    const source = dedent`
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
      import * as vanillaFileScope from "@vanilla-extract/css/fileScope";
      vanillaFileScope.setFileScope("app/app.css.ts", "my-package");
      import {style} from '@vanilla-extract/css';

      export const myStyle = style({});
      vanillaFileScope.endFileScope();
    `);
  });
});

describe('CJS', () => {
  test('should add missing fileScope', () => {
    const source = dedent`
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
      const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
      __vanilla_filescope__.setFileScope("app/app.css.ts", "my-package");
      const _css = require('@vanilla-extract/css');

      var myStyle = _css.style({});
      exports.myStyle = myStyle;
      __vanilla_filescope__.endFileScope();
    `);
  });

  test('should add global adapter setup when "globalAdapterIdentifier" is provided', () => {
    const source = dedent`
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
        globalAdapterIdentifier: 'MY_GLOBAL_ADAPTER',
      }),
    ).toMatchInlineSnapshot(`
      const __vanilla_css_adapter__ = require("@vanilla-extract/css/adapter");
      __vanilla_css_adapter__.setAdapter(MY_GLOBAL_ADAPTER);
      const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
      __vanilla_filescope__.setFileScope("app/app.css.ts", "my-package");
      const _css = require('@vanilla-extract/css');

      var myStyle = _css.style({});
      exports.myStyle = myStyle;
      __vanilla_filescope__.endFileScope();
      __vanilla_css_adapter__.removeAdapter();
    `);
  });

  test('should update existing fileScope', () => {
    const source = dedent`
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
      const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
      __vanilla_filescope__.setFileScope("app/app.css.ts", "my-package");
      const _css = require('@vanilla-extract/css');

      var myStyle = _css.style({});
      exports.myStyle = myStyle;
      __vanilla_filescope__.endFileScope();
    `);
  });

  test('should update existing fileScope with newlines', () => {
    const source = dedent`
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
      const __vanilla_filescope__ = require("@vanilla-extract/css/fileScope");
      __vanilla_filescope__.setFileScope("app/app.css.ts", "my-package");
      const _css = require('@vanilla-extract/css');

      const myStyle = _css.style({});
      exports.myStyle = myStyle;
      __vanilla_filescope__.endFileScope();
    `);
  });
});

test('platform-specific relative path', () => {
  const { rootPath, filePath } = {
    [posix.sep]: {
      rootPath: '/the-root',
      filePath: '/the-root/app/app.css.ts',
    },
    [win32.sep]: {
      rootPath: raw`D:\the-root`,
      filePath: raw`D:\the-root\app\app.css.ts`,
    },
  }[sep];

  const source = dedent`
    import { style } from '@vanilla-extract/css';

    export const myStyle = style({});
  `;

  // The snapshot should be the same for either platform
  expect(
    addFileScope({
      source,
      rootPath,
      filePath,
      packageName: 'my-package',
    }),
  ).toMatchInlineSnapshot(`
    import { setFileScope, endFileScope } from "@vanilla-extract/css/fileScope";
    setFileScope("app/app.css.ts", "my-package");
    import { style } from '@vanilla-extract/css';

    export const myStyle = style({});
    endFileScope();
  `);
});

test('normalizePath()', () => {
  expect(normalizePath(raw`foo\bar`)).toMatchInlineSnapshot(`foo/bar`);
  expect(normalizePath(raw`foo/bar`)).toMatchInlineSnapshot(`foo/bar`);
});
