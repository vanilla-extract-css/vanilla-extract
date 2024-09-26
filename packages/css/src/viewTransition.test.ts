import * as adapter from './adapter';
import { endFileScope, setFileScope } from './fileScope';
import { createViewTransition, viewTransition } from './viewTransition';

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

describe('viewTransition', () => {
  it('commits viewTransition by default', () => {
    viewTransition({ navigation: 'auto' });

    expect(appendCss.mock.calls).toMatchInlineSnapshot(`
      [
        [
          {
            "rule": {
              "navigation": "auto",
            },
            "type": "view-transition",
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

describe('createViewTransition', () => {
  it('creates a hashed view transtion name', () => {
    expect(createViewTransition()).toMatchInlineSnapshot(`"file__7a74oh0"`);
  });
});
