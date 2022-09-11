import { relativePath } from './relativePath';

test('should handle paths within the from', () => {
  expect(
    relativePath(
      '/home/user/project/my-project',
      '/home/user/project/my-project/dir/file.ts',
    ),
  ).toBe('dir/file.ts');
});

test('should handle paths outside the from', () => {
  expect(
    relativePath(
      '/home/user/project/site',
      '/home/user/project/packages/my-package/dir/file.ts',
    ),
  ).toBe('../packages/my-package/dir/file.ts');
});

test('should handle paths well outside the from', () => {
  expect(
    relativePath(
      '/home/user/project/sites/my-site',
      '/home/user/project/packages/my-package/dir/file.ts',
    ),
  ).toBe('../../packages/my-package/dir/file.ts');
});
