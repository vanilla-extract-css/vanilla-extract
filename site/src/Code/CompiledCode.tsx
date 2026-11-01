import { Fragment, useId } from 'react';
import clsx from 'clsx';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { Box, Stack } from '../system';
import Text from '../Typography/Text';
import type { Token } from '../markdown/highlight';
import * as styles from './CompiledCode.css';
import * as highlightingStyles from './highlighting.css';
import { vars } from '../themes.css';

export interface CodeFile {
  fileName?: string;
  tokens: Token[];
}

const HighlightedCode = ({ tokens }: { tokens: Token[] }) => (
  <Box className={highlightingStyles.root}>
    <Text size="code" component="div" baseline={false}>
      <pre>
        <code>
          {tokens.map(({ content, color, error }, index) => (
            <span
              key={index}
              style={{ color }}
              className={error ? highlightingStyles.error : undefined}
            >
              {content}
            </span>
          ))}
        </code>
      </pre>
    </Text>
  </Box>
);

const FileTab = ({
  fileName,
  inputId,
}: {
  fileName: string;
  inputId?: string;
}) => (
  <Box
    component={inputId ? 'label' : 'span'}
    htmlFor={inputId}
    cursor={inputId ? 'pointer' : undefined}
    marginRight="large"
    marginTop="-medium"
    borderRadius="small"
    className={clsx(styles.fileTab, !inputId && styles.onlyFileTab)}
  >
    <Box position="relative" display="flex" alignItems="center">
      <Box
        component="span"
        position="absolute"
        background={{
          lightMode: 'green300',
          darkMode: 'green400',
        }}
        borderRadius="full"
        paddingLeft="xsmall"
        paddingTop="large"
        marginLeft="xsmall"
        transition="slow"
        className={styles.fileIndicator}
      />
      <Box
        component="span"
        paddingLeft="large"
        position="relative"
        className={styles.boldLayoutShiftFix}
        data-text={fileName}
      >
        <Box position="absolute" left={0} paddingLeft="large">
          <Text size="small" baseline={false}>
            <Box component="span" className={styles.fileName}>
              {fileName}
            </Box>
          </Text>
        </Box>
      </Box>
    </Box>
  </Box>
);

const FilePanel = ({
  tokens,
  css,
  paddingTop,
}: {
  tokens: Token[];
  /** `null` when the file doesn't create any CSS */
  css?: Token[] | null;
  paddingTop?: 'large' | 'xlarge';
}) => {
  const outputId = `${useId()}-output`;
  const hasOutput = css !== undefined;

  return (
    <Box width="full" paddingTop={paddingTop} className={styles.filePanel}>
      <Box padding="large" margin="-large" overflow="hidden">
        <Box display="flex">
          <Box
            width="full"
            flexGrow={1}
            flexShrink={0}
            minWidth={0}
            transition="slow"
            className={styles.sourceContainer}
          >
            <HighlightedCode tokens={tokens} />
          </Box>
          {hasOutput ? (
            <Box
              id={outputId}
              width="full"
              flexShrink={0}
              minWidth={0}
              padding="large"
              transition="slow"
              className={styles.outputContainer}
            >
              <Stack space="large">
                <Text weight="strong" size="small" color="secondary">
                  CSS
                </Text>

                {css ? (
                  <Box className={styles.maxHeight}>
                    <HighlightedCode tokens={css} />
                  </Box>
                ) : (
                  <Text size="small" type="code">
                    No CSS created
                  </Text>
                )}
              </Stack>
            </Box>
          ) : null}
        </Box>
      </Box>

      {hasOutput ? (
        <Box
          display="flex"
          justifyContent="flex-end"
          paddingTop={{ mobile: 'medium' }}
          className={styles.buttonContainer}
        >
          <Box
            component="label"
            background="zinc600"
            borderRadius="medium"
            padding="medium"
            cursor="pointer"
            className={styles.button}
            position="relative"
            transition="fast"
          >
            <input
              type="checkbox"
              aria-controls={outputId}
              className={styles.showCssInput}
            />
            <Box
              component="span"
              display="block"
              background="pink600"
              position="absolute"
              inset={0}
              pointerEvents="none"
              borderRadius="medium"
              transition="slow"
              className={styles.buttonBackground}
            />
            <Box component="span" position="relative">
              <Text size="small" color="code" weight="strong">
                <span className={styles.showOutputText}>Show Output</span>
                <span className={styles.closeText}>Close</span>
              </Text>
            </Box>
          </Box>
        </Box>
      ) : null}
    </Box>
  );
};

export interface CompiledCodeProps {
  code: CodeFile[];
  /** Highlighted CSS, keyed by file name */
  css?: Record<string, Token[]>;
  background?: {
    lightMode: keyof typeof vars.palette;
    darkMode: keyof typeof vars.palette;
  };
}

/**
 * Switching files and showing the CSS are handled by form controls and CSS, so
 * this doesn't need to be hydrated
 */
export const CompiledCode = ({ code, css, background }: CompiledCodeProps) => {
  const id = useId();
  const multipleFiles = code.length > 1;
  const hasFileNames = code.some(({ fileName }) => fileName);

  return (
    <Box
      padding={{
        mobile: 'large',
        tablet: 'xlarge',
      }}
      paddingY="xlarge"
      paddingBottom={css ? 'xxlarge' : undefined}
      className={styles.root}
      style={
        background
          ? assignInlineVars({
              [styles.darkModeBg]: vars.palette[background.darkMode],
              [styles.lightModeBg]: vars.palette[background.lightMode],
            })
          : undefined
      }
    >
      <Box display="flex" flexWrap="wrap" alignItems="center">
        {code.map(({ fileName, tokens }, index) => {
          const inputId = multipleFiles ? `${id}-file-${index}` : undefined;

          return (
            <Fragment key={fileName ?? index}>
              {inputId ? (
                <input
                  type="radio"
                  name={id}
                  id={inputId}
                  defaultChecked={index === 0}
                  className={styles.fileInput}
                />
              ) : null}
              {fileName ? (
                <FileTab fileName={fileName} inputId={inputId} />
              ) : null}
              <FilePanel
                tokens={tokens}
                css={
                  css && fileName?.endsWith('.css.ts')
                    ? (css[fileName] ?? null)
                    : undefined
                }
                paddingTop={
                  hasFileNames
                    ? multipleFiles
                      ? 'xlarge'
                      : 'large'
                    : undefined
                }
              />
            </Fragment>
          );
        })}
      </Box>
    </Box>
  );
};
