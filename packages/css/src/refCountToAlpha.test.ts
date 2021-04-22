import { refCountToAlpha } from './refCountToAlpha';

describe('refCountToAlpha', () => {
  it('works', () => {
    expect(refCountToAlpha(0)).toMatchInlineSnapshot(`"a"`);
    expect(refCountToAlpha(1)).toMatchInlineSnapshot(`"b"`);
    expect(refCountToAlpha(2)).toMatchInlineSnapshot(`"c"`);
    expect(refCountToAlpha(3)).toMatchInlineSnapshot(`"d"`);
    expect(refCountToAlpha(24)).toMatchInlineSnapshot(`"y"`);
    expect(refCountToAlpha(25)).toMatchInlineSnapshot(`"z"`);
    expect(refCountToAlpha(26)).toMatchInlineSnapshot(`"aa"`);
    expect(refCountToAlpha(99)).toMatchInlineSnapshot(`"cv"`);
    expect(refCountToAlpha(100)).toMatchInlineSnapshot(`"cw"`);
    expect(refCountToAlpha(200)).toMatchInlineSnapshot(`"gs"`);
    expect(refCountToAlpha(300)).toMatchInlineSnapshot(`"ko"`);
    expect(refCountToAlpha(999)).toMatchInlineSnapshot(`"all"`);
    expect(refCountToAlpha(9999)).toMatchInlineSnapshot(`"ntp"`);
  });
});
