import {
  createCssVariablesTheme,
  createHighlighter,
  type BundledLanguage,
} from 'shiki';
import { shikiVars } from '../Code/shikiVars.css';

const languages = [
  'ts',
  'tsx',
  'js',
  'jsx',
  'bash',
  'json',
  'css',
] satisfies BundledLanguage[];

const theme = createCssVariablesTheme({ name: 'docs' });

// Closer to the docs' original Prism colours
const scopeOverrides = {
  [shikiVars.token.punctuation]: [
    'keyword.operator',
    'punctuation.separator.key-value',
    'punctuation.definition.block',
    'punctuation.definition.parameters',
    'punctuation.definition.binding-pattern',
    'punctuation.terminator',
    'punctuation.section',
    'punctuation.definition.condition',
    'punctuation.definition.dictionary',
    'meta.brace',
  ],
  [shikiVars.token.keyword]: [
    'constant.numeric',
    'entity.other.attribute-name.class.css',
    'entity.other.attribute-name.pseudo-class.css',
    'entity.name.tag.css',
    'source.css support.function',
  ],
  [shikiVars.token.string]: [
    'meta.property-value.css',
    'support.constant.color',
    'support.constant.font-name',
    'support.constant.property-value.css',
    'support.constant.media.css',
    'constant.numeric.css',
    'keyword.other.unit',
    'constant.other.color.rgb-value.css',
    'punctuation.definition.constant.css',
    'variable.argument.css',
  ],
  [shikiVars.foreground]: [
    'support.type.property-name',
    'support.type.property-name.json',
    'variable.css',
  ],
};

theme.tokenColors = [
  ...(theme.tokenColors ?? []),
  ...Object.entries(scopeOverrides).map(([variable, scope]) => ({
    scope,
    settings: { foreground: variable },
  })),
];

let highlighter: ReturnType<typeof createHighlighter> | undefined;

interface HighlightOptions {
  /** Underlines these identifiers, to show them as type errors */
  errors?: { tokens: string[]; className: string };
}

const findDecorations = (
  code: string,
  { tokens, className }: NonNullable<HighlightOptions['errors']>,
) =>
  tokens.flatMap((token) =>
    Array.from(code.matchAll(new RegExp(`\\b${token}\\b`, 'g')), (match) => ({
      start: match.index,
      end: match.index + token.length,
      properties: { class: className },
    })),
  );

export async function highlight(
  language: string,
  code: string,
  { errors }: HighlightOptions = {},
) {
  const shiki = await (highlighter ??= createHighlighter({
    themes: [theme],
    langs: languages,
  }));

  return shiki.codeToHtml(code, {
    lang: languages.find((lang) => lang === language) ?? 'text',
    theme,
    structure: 'inline',
    decorations: errors ? findDecorations(code, errors) : undefined,
  });
}

const titleComment = /^(?:\/\/\s?([^*/\n]*)|\/\*\s?([^*/\n]*)\*\/)\n/;

/** A leading `// styles.css.ts` style comment is shown as the code block's title */
export function extractTitle(code: string) {
  const match = code.match(titleComment);

  return match
    ? { title: match[1] ?? match[2], code: code.slice(match[0].length).trim() }
    : { title: undefined, code };
}
