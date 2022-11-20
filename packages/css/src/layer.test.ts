import * as adapter from './adapter';
import { endFileScope, setFileScope } from './fileScope';
import { commitLayers, globalLayer, layer } from './layer';

jest.mock('./adapter', () => ({
  ...jest.requireActual<typeof adapter>('./adapter'),
  appendCss: jest.fn().mockName('appendCss'),
}));

const appendCss = jest.mocked(adapter.appendCss);

beforeEach(() => {
  setFileScope('path/to/file.css.ts', 'foo-package');
});

afterEach(() => {
  endFileScope();
  appendCss.mockClear();
});

describe('layer', () => {
  it('creates a hashed layer name', () => {
    expect(layer()).toMatchInlineSnapshot(`"file__7a74oh0"`);
    expect(layer('foo')).toMatchInlineSnapshot(`"file_foo__7a74oh1"`);
  });

  it('creates a hashed layer name with a parent', () => {
    expect(layer({ parent: 'papa' })).toMatchInlineSnapshot(
      `"papa.file__7a74oh0"`,
    );
    expect(layer({ parent: 'papa' }, 'foo')).toMatchInlineSnapshot(
      `"papa.file_foo__7a74oh1"`,
    );
  });

  it('commits layers by default', () => {
    const one = layer('one');
    layer({ parent: one }, 'two');

    expect(appendCss.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "name": "file_one__7a74oh0",
            "type": "layer",
          },
          {
            "filePath": "path/to/file.css.ts",
            "packageName": "foo-package",
          },
        ],
        [
          {
            "name": "file_one__7a74oh0.file_two__7a74oh1",
            "type": "layer",
          },
          {
            "filePath": "path/to/file.css.ts",
            "packageName": "foo-package",
          },
        ],
      ]
    `);
  });
});

describe('globalLayer', () => {
  it('commits layers by default', () => {
    globalLayer('one');
    globalLayer('two');

    expect(appendCss.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "name": "one",
            "type": "layer",
          },
          {
            "filePath": "path/to/file.css.ts",
            "packageName": "foo-package",
          },
        ],
        [
          {
            "name": "two",
            "type": "layer",
          },
          {
            "filePath": "path/to/file.css.ts",
            "packageName": "foo-package",
          },
        ],
      ]
    `);
  });
});

describe('commitLayers', () => {
  it('commits layers on demand', () => {
    const first = layer({ commit: false });
    const second = layer({ commit: false }, 'second');
    const third = globalLayer({ commit: false }, 'global_third');

    expect(appendCss).not.toHaveBeenCalled();

    // NOTE: layer order is reversed
    commitLayers([third, second, first]);

    expect(appendCss.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "name": "global_third, file_second__7a74oh1, file__7a74oh0",
            "type": "layer",
          },
          {
            "filePath": "path/to/file.css.ts",
            "packageName": "foo-package",
          },
        ],
      ]
    `);
  });
});
