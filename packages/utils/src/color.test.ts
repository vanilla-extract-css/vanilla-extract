import { color } from './';

describe('utils', () => {
  describe('color', () => {
    describe('basic color space mixing', () => {
      it('srgb', () => {
        expect(
          color.srgb('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in srgb, red 50%, blue)"`);
        expect(color.srgb('red').mix('blue').toString()).toMatchInlineSnapshot(
          `"color-mix(in srgb, red, blue)"`,
        );
      });

      it('oklch', () => {
        expect(
          color.oklch('red').mix('blue', 30).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in oklch, red 30%, blue)"`);
        expect(
          color.oklch('#ff0000').mix('#0000ff').toString(),
        ).toMatchInlineSnapshot(`"color-mix(in oklch, #ff0000, #0000ff)"`);
      });

      it('lab', () => {
        expect(
          color.lab('red').mix('blue', 25).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in lab, red 25%, blue)"`);
      });

      it('oklab', () => {
        expect(
          color.oklab('red').mix('blue', 75).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in oklab, red 75%, blue)"`);
      });

      it('hsl', () => {
        expect(
          color.hsl('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in hsl, red 50%, blue)"`);
      });

      it('hwb', () => {
        expect(
          color.hwb('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in hwb, red 50%, blue)"`);
      });

      it('lch', () => {
        expect(
          color.lch('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in lch, red 50%, blue)"`);
      });

      it('srgbLinear', () => {
        expect(
          color.srgbLinear('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in srgb-linear, red 50%, blue)"`);
      });

      it('xyz', () => {
        expect(
          color.xyz('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in xyz, red 50%, blue)"`);
      });

      it('xyzD50', () => {
        expect(
          color.xyzD50('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in xyz-d50, red 50%, blue)"`);
      });

      it('xyzD65', () => {
        expect(
          color.xyzD65('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in xyz-d65, red 50%, blue)"`);
      });
    });

    describe('hue interpolation methods', () => {
      it('hsl with shorter hue', () => {
        expect(
          color.hslShorter('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in hsl shorter hue, red 50%, blue)"`,
        );
      });

      it('hsl with longer hue', () => {
        expect(
          color.hslLonger('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in hsl longer hue, red 50%, blue)"`,
        );
      });

      it('hsl with increasing hue', () => {
        expect(
          color.hslIncreasing('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in hsl increasing hue, red 50%, blue)"`,
        );
      });

      it('hsl with decreasing hue', () => {
        expect(
          color.hslDecreasing('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in hsl decreasing hue, red 50%, blue)"`,
        );
      });

      it('hwb with shorter hue', () => {
        expect(
          color.hwbShorter('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in hwb shorter hue, red 50%, blue)"`,
        );
      });

      it('hwb with longer hue', () => {
        expect(
          color.hwbLonger('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in hwb longer hue, red 50%, blue)"`,
        );
      });

      it('hwb with increasing hue', () => {
        expect(
          color.hwbIncreasing('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in hwb increasing hue, red 50%, blue)"`,
        );
      });

      it('hwb with decreasing hue', () => {
        expect(
          color.hwbDecreasing('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in hwb decreasing hue, red 50%, blue)"`,
        );
      });

      it('lch with shorter hue', () => {
        expect(
          color.lchShorter('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in lch shorter hue, red 50%, blue)"`,
        );
      });

      it('lch with longer hue', () => {
        expect(
          color.lchLonger('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in lch longer hue, red 50%, blue)"`,
        );
      });

      it('lch with increasing hue', () => {
        expect(
          color.lchIncreasing('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in lch increasing hue, red 50%, blue)"`,
        );
      });

      it('lch with decreasing hue', () => {
        expect(
          color.lchDecreasing('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in lch decreasing hue, red 50%, blue)"`,
        );
      });

      it('oklch with shorter hue', () => {
        expect(
          color.oklchShorter('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in oklch shorter hue, red 50%, blue)"`,
        );
      });

      it('oklch with longer hue', () => {
        expect(
          color.oklchLonger('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in oklch longer hue, red 50%, blue)"`,
        );
      });

      it('oklch with increasing hue', () => {
        expect(
          color.oklchIncreasing('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in oklch increasing hue, red 50%, blue)"`,
        );
      });

      it('oklch with decreasing hue', () => {
        expect(
          color.oklchDecreasing('red').mix('blue', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in oklch decreasing hue, red 50%, blue)"`,
        );
      });
    });

    describe('chaining', () => {
      it('same color space', () => {
        expect(
          color.srgb('red').mix('blue', 50).mix('green', 25).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in srgb, color-mix(in srgb, red 50%, blue) 25%, green)"`,
        );
      });

      it('different color spaces', () => {
        expect(
          color
            .srgb('red')
            .mix('blue', 50)
            .oklch('green', 25)
            .mix('yellow')
            .toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in oklch, color-mix(in oklch, color-mix(in srgb, red 50%, blue) 25%, green), yellow)"`,
        );
      });

      it('multiple chaining with hue interpolation', () => {
        expect(
          color
            .oklchShorter('red')
            .mix('blue', 50)
            .hslLonger('green', 30)
            .mix('yellow', 10)
            .toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in hsl longer hue, color-mix(in hsl longer hue, color-mix(in oklch shorter hue, red 50%, blue) 30%, green) 10%, yellow)"`,
        );
      });

      it('switching between methods', () => {
        expect(
          color
            .srgb('red')
            .mix('blue', 50)
            .oklch('green')
            .mix('yellow', 25)
            .srgb('purple')
            .mix('orange', 75)
            .toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in srgb, color-mix(in srgb, color-mix(in oklch, color-mix(in oklch, color-mix(in srgb, red 50%, blue), green) 25%, yellow), purple) 75%, orange)"`,
        );
      });
    });

    describe('string coercion', () => {
      it('basic toString', () => {
        expect(color.srgb('red').toString()).toMatchInlineSnapshot(`"red"`);
        expect(color.oklch('blue').toString()).toMatchInlineSnapshot(`"blue"`);
      });

      it('template literal', () => {
        expect(`${color.srgb('red').mix('blue', 50)}`).toMatchInlineSnapshot(
          `"color-mix(in srgb, red 50%, blue)"`,
        );
        expect(`${color.oklch('red').mix('blue')}`).toMatchInlineSnapshot(
          `"color-mix(in oklch, red, blue)"`,
        );
      });

      it('chained template literal', () => {
        expect(
          `${color
            .srgb('red')
            .mix('blue', 50)
            .oklch('green', 25)
            .mix('yellow')}`,
        ).toMatchInlineSnapshot(
          `"color-mix(in oklch, color-mix(in oklch, color-mix(in srgb, red 50%, blue) 25%, green), yellow)"`,
        );
      });
    });

    describe('nested mixing', () => {
      it('using mix result as operand', () => {
        const intermediate = color.srgb('red').mix('blue', 50);
        expect(
          color.oklch(intermediate).mix('green', 25).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in oklch, color-mix(in srgb, red 50%, blue) 25%, green)"`,
        );
      });

      it('multiple nested levels', () => {
        const level1 = color.srgb('red').mix('blue', 50);
        const level2 = color.oklch(level1).mix('green', 30);
        expect(
          color.hsl(level2).mix('yellow', 10).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in hsl, color-mix(in oklch, color-mix(in srgb, red 50%, blue) 30%, green) 10%, yellow)"`,
        );
      });
    });

    describe('edge cases', () => {
      it('0% percentage', () => {
        expect(
          color.srgb('red').mix('blue', 0).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in srgb, red 0%, blue)"`);
      });

      it('100% percentage', () => {
        expect(
          color.srgb('red').mix('blue', 100).toString(),
        ).toMatchInlineSnapshot(`"color-mix(in srgb, red 100%, blue)"`);
      });

      it('various color formats', () => {
        expect(
          color.srgb('#ff0000').mix('rgb(0, 0, 255)', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in srgb, #ff0000 50%, rgb(0, 0, 255))"`,
        );
        expect(
          color.oklch('hsl(0, 100%, 50%)').mix('hwb(240 0% 0%)', 50).toString(),
        ).toMatchInlineSnapshot(
          `"color-mix(in oklch, hsl(0, 100%, 50%) 50%, hwb(240 0% 0%))"`,
        );
      });
    });
  });
});
