import { cssCache } from './cssCache';

describe('cssCache', () => {
  it('Supports adding/retrieving style rule associated with a className to/from cache', () => {
    // throws if className string has more than one class embedded
    expect(() => cssCache.set('two classes', {})).toThrow(
      'Invalid className "two classes": found multiple classNames.',
    );
    // add to cache
    expect(cssCache.size).toBe(0);
    cssCache.set('test0', { content: 'test0' });
    expect(cssCache.size).toBe(1);
    cssCache.set('test1', { content: 'test1' });
    expect(cssCache.size).toBe(2);

    // throws if calling get with multiple classNames embedded in string
    expect(() => cssCache.get('test0 test1')).toThrow(
      'Invalid className "test0 test1": found multiple classNames, try CssCache.getAll() instead.',
    );

    // retrieve from cache
    expect(cssCache.get('test0')).toEqual({ content: 'test0' });
    // check exists in cache
    expect(cssCache.has('test1')).toBe(true);
  });

  it('Supports retrieving StyleRule objects for a list fo classNames in original definition order', () => {
    cssCache.set('test0', { content: 'test0' });
    cssCache.set('test1', { content: 'test1' });
    cssCache.set('test2', { content: 'test2' });

    // retrieves style rule object for classNames in original order, ignore uncached values
    expect(cssCache.getAll('test2 not-in-cache test0', 'test1')).toEqual([
      { content: 'test0' },
      { content: 'test1' },
      { content: 'test2' },
    ]);
  });
});
