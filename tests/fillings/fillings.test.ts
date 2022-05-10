import { basic, conditional, defaultCondition } from './index.css';

const expectCSSVars = <T extends object>({
  style,
  count,
  values = [],
}: {
  style: T;
  count: number;
  values?: string[];
}) => {
  expect(Object.keys(style).length).toBe(count);

  const computedValues = Object.values(style);

  values.forEach((value) => {
    expect(computedValues).toContain(value);
  });
};

describe('fillings', () => {
  it('should not crash if not passed with any object', () => {
    // @ts-expect-error
    expect(() => basic()).not.toThrow();
  });

  it('should not assign className', () => {
    const { className, assignVars } = basic({});
    const style = assignVars();

    expect(className).toEqual('');
    expectCSSVars({ style, count: 0 });
  });

  it('should assign className and CSS variable for single property', () => {
    const { className, assignVars } = basic({ padding: '10px' });
    const style = assignVars();

    expect(className).toContain('padding');
    expectCSSVars({ style, count: 1, values: ['10px'] });
  });

  it('should assign classNames and CSS variables for all properties', () => {
    const { className, assignVars } = basic({ padding: '1px', margin: '2px' });
    const style = assignVars();

    expect(className).toContain('padding');
    expect(className).toContain('margin');
    expectCSSVars({ style, count: 2, values: ['1px', '2px'] });
  });

  describe('conditional', () => {
    it('should not crash if not passed with any object', () => {
      // @ts-expect-error
      expect(() => conditional()).not.toThrow();
    });

    it('should not assign className', () => {
      const { className, assignVars } = conditional({});
      const style = assignVars();

      expect(className).toEqual('');
      expectCSSVars({ style, count: 0 });
    });

    it('should assign className and CSS variable for default condition', () => {
      const { className, assignVars } = conditional({ padding: '10px' });
      const style = assignVars();

      expect(className).toContain(defaultCondition);
      expect(className).toContain('padding');
      expectCSSVars({ style, count: 1, values: ['10px'] });
    });

    it('should assign className and CSS variable for all conditions', () => {
      const { className, assignVars } = conditional({
        padding: { base: '10px', lg: '20px' },
      });
      const style = assignVars();

      expect(className).toContain(defaultCondition);
      expect(className).toContain('lg');
      expect(className).toContain('padding');
      expectCSSVars({ style, count: 2, values: ['10px', '20px'] });
    });

    it('should assign className and CSS variable for all properties at default condition', () => {
      const { className, assignVars } = conditional({
        padding: '1px',
        margin: '2px',
      });
      const style = assignVars();

      expect(className).toContain(defaultCondition);
      expect(className).not.toContain('lg');
      expect(className).toContain('padding');
      expect(className).toContain('margin');
      expectCSSVars({ style, count: 2, values: ['1px', '2px'] });
    });

    it('should assign className and CSS variable for all properties at all conditions', () => {
      const { className, assignVars } = conditional({
        padding: {
          base: '1px',
          lg: '2px',
        },
        margin: {
          base: '3px',
          lg: '4px',
        },
      });
      const style = assignVars();

      expect(className).toContain(defaultCondition);
      expect(className).toContain('lg');
      expect(className).toContain('padding');
      expect(className).toContain('margin');
      expectCSSVars({ style, count: 4, values: ['1px', '2px', '3px', '4px'] });
    });
  });
});
