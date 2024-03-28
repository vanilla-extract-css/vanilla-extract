import { describe, test, expect } from 'vitest';
import { walkObject } from '@vanilla-extract/private';
import * as tokens from './tokens';

describe('walkObject', () => {
  test('walkObject', () => {
    const obj = {
      a: {
        b: {
          c: 1,
        },
        d: 2,
      },
      e: 3,
    };

    const result = walkObject(obj, (value) => String(value));

    expect(result).toMatchInlineSnapshot(`
      {
        "a": {
          "b": {
            "c": "1",
          },
          "d": "2",
        },
        "e": "3",
      }
    `);
  });

  test('walkObject module namespace object', () => {
    const result = walkObject(tokens, (value) => `foo${value}`);

    expect(result).toMatchInlineSnapshot(`
      {
        "space": {
          "large": "foo16px",
          "small": "foo8px",
        },
      }
    `);
  });
});
