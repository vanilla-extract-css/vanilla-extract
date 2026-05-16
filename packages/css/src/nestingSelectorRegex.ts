/**
 * Matches an `&` that is not inside a quoted string. Used to substitute `&`
 * in `@scope` bounds with the enclosing rule's selector without touching
 * any `&` that appears inside an attribute-selector value such as `[title="a & b"]`.
 *
 * The lookbehind asserts that everything from the start of the string up to
 * the `&` is a sequence of either single non-quote characters or complete,
 * balanced single-/double-quoted strings (supporting backslash escapes).
 *
 * Each non-quote branch matches a single character (`[^"']`) rather than a run
 * (`[^"']*`). Nesting a quantifier inside the outer `*` would make the
 * lookbehind backtrack exponentially on input containing an unbalanced quote
 * (catastrophic backtracking / ReDoS).
 */
export const nestingSelectorRegex =
  /(?<=^(?:[^"']|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')*)&/g;
