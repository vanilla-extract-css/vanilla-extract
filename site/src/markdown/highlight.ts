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

export interface Token {
  content: string;
  color?: string;
  /** Underlined, to show it as a type error */
  error?: boolean;
}

const newline: Token = { content: '\n' };

export async function highlight(
  language: string,
  code: string,
  { errors = [] }: { errors?: string[] } = {},
): Promise<Token[]> {
  const shiki = await (highlighter ??= createHighlighter({
    themes: [theme],
    langs: languages,
  }));

  const lines = shiki.codeToTokensBase(code, {
    lang: languages.find((lang) => lang === language) ?? 'text',
    theme,
  });

  const errorPattern =
    errors.length > 0 ? new RegExp(`\\b(${errors.join('|')})\\b`) : undefined;

  return lines.flatMap((line, index) => [
    ...(index > 0 ? [newline] : []),
    ...line.flatMap(({ content, color }) =>
      errorPattern
        ? content
            .split(errorPattern)
            .filter(Boolean)
            .map((part) => ({
              content: part,
              color,
              error: errors.includes(part) || undefined,
            }))
        : [{ content, color }],
    ),
  ]);
}

const titleComment = /^(?:\/\/\s?([^*/\n]*)|\/\*\s?([^*/\n]*)\*\/)\n/;

/** A leading `// styles.css.ts` style comment is shown as the code block's title */
export function extractTitle(code: string) {
  const match = code.match(titleComment);

  return match
    ? { title: match[1] ?? match[2], code: code.slice(match[0].length).trim() }
    : { title: undefined, code };
}
